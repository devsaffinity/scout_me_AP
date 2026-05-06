import endpoints from './endpoints';
import http, { queryCollection, updateItemInCollection } from './http';
import { getDb, saveDb, deepClone } from '../utils/mockData';

const searchFields = [
  'fullName',
  'email',
  'sport',
  'position',
  'status',
  'verificationStatus',
  'location',
];

export const getAthletes = async (params = {}) =>
  http.get(
    () => {
      const db = getDb();
      const result = queryCollection({
        collection: db.athletes,
        page: params.page,
        limit: params.limit,
        search: params.search,
        searchFields,
        filters: {
          status: params.status,
          sport: params.sport,
          verificationStatus: params.verificationStatus,
        },
        sortBy: params.sortBy || 'updatedAt',
        sortOrder: params.sortOrder || 'desc',
      });

      return deepClone(result);
    },
    { message: `Athletes list loaded from ${endpoints.athletes.list}.` },
  );

export const getAthleteById = async (id) =>
  http.get(
    () => {
      const athlete = getDb().athletes.find((item) => item.id === id);
      if (!athlete) {
        throw new Error('Athlete not found.');
      }
      return deepClone(athlete);
    },
    { message: `Athlete details loaded from ${endpoints.athletes.details(id)}.` },
  );

export const updateAthlete = async (id, payload) =>
  http.patch(
    () => {
      const db = getDb();
      const athlete = db.athletes.find((item) => item.id === id);

      if (!athlete) {
        throw new Error('Athlete not found.');
      }

      db.athletes = updateItemInCollection(db.athletes, id, payload);
      saveDb(db);

      return deepClone(db.athletes.find((item) => item.id === id));
    },
    payload,
    { message: 'Athlete updated successfully.' },
  );

export const suspendAthlete = async (id, reason = 'Policy review') =>
  http.post(
    () => {
      const db = getDb();
      const athlete = db.athletes.find((item) => item.id === id);

      if (!athlete) {
        throw new Error('Athlete not found.');
      }

      db.athletes = updateItemInCollection(db.athletes, id, {
        status: 'suspended',
        suspensionReason: reason,
      });
      saveDb(db);

      return deepClone(db.athletes.find((item) => item.id === id));
    },
    { reason },
    { message: `Athlete suspended via ${endpoints.athletes.suspend(id)}.` },
  );

export const activateAthlete = async (id) =>
  http.post(
    () => {
      const db = getDb();
      const athlete = db.athletes.find((item) => item.id === id);

      if (!athlete) {
        throw new Error('Athlete not found.');
      }

      db.athletes = updateItemInCollection(db.athletes, id, {
        status: 'active',
        suspensionReason: null,
      });
      saveDb(db);

      return deepClone(db.athletes.find((item) => item.id === id));
    },
    {},
    { message: `Athlete activated via ${endpoints.athletes.activate(id)}.` },
  );

const athletesService = {
  getAthletes,
  getAthleteById,
  updateAthlete,
  suspendAthlete,
  activateAthlete,
};

export default athletesService;
