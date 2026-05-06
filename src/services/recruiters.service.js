import endpoints from './endpoints';
import http, { queryCollection, updateItemInCollection } from './http';
import { getDb, saveDb, deepClone } from '../utils/mockData';

const searchFields = [
  'fullName',
  'email',
  'organization',
  'league',
  'location',
  'status',
  'verificationStatus',
];

export const getRecruiters = async (params = {}) =>
  http.get(
    () => {
      const db = getDb();
      return deepClone(
        queryCollection({
          collection: db.recruiters,
          page: params.page,
          limit: params.limit,
          search: params.search,
          searchFields,
          filters: {
            status: params.status,
            league: params.league,
            verificationStatus: params.verificationStatus,
          },
          sortBy: params.sortBy || 'updatedAt',
          sortOrder: params.sortOrder || 'desc',
        }),
      );
    },
    { message: `Recruiters list loaded from ${endpoints.recruiters.list}.` },
  );

export const getRecruiterById = async (id) =>
  http.get(
    () => {
      const recruiter = getDb().recruiters.find((item) => item.id === id);
      if (!recruiter) {
        throw new Error('Recruiter not found.');
      }
      return deepClone(recruiter);
    },
    { message: `Recruiter details loaded from ${endpoints.recruiters.details(id)}.` },
  );

export const updateRecruiter = async (id, payload) =>
  http.patch(
    () => {
      const db = getDb();
      const recruiter = db.recruiters.find((item) => item.id === id);

      if (!recruiter) {
        throw new Error('Recruiter not found.');
      }

      db.recruiters = updateItemInCollection(db.recruiters, id, payload);
      saveDb(db);

      return deepClone(db.recruiters.find((item) => item.id === id));
    },
    payload,
    { message: 'Recruiter updated successfully.' },
  );

export const suspendRecruiter = async (id, reason = 'Admin review') =>
  http.post(
    () => {
      const db = getDb();
      const recruiter = db.recruiters.find((item) => item.id === id);

      if (!recruiter) {
        throw new Error('Recruiter not found.');
      }

      db.recruiters = updateItemInCollection(db.recruiters, id, {
        status: 'suspended',
        suspensionReason: reason,
      });
      saveDb(db);

      return deepClone(db.recruiters.find((item) => item.id === id));
    },
    { reason },
    { message: `Recruiter suspended via ${endpoints.recruiters.suspend(id)}.` },
  );

export const activateRecruiter = async (id) =>
  http.post(
    () => {
      const db = getDb();
      const recruiter = db.recruiters.find((item) => item.id === id);

      if (!recruiter) {
        throw new Error('Recruiter not found.');
      }

      db.recruiters = updateItemInCollection(db.recruiters, id, {
        status: 'active',
        suspensionReason: null,
      });
      saveDb(db);

      return deepClone(db.recruiters.find((item) => item.id === id));
    },
    {},
    { message: `Recruiter activated via ${endpoints.recruiters.activate(id)}.` },
  );

const recruitersService = {
  getRecruiters,
  getRecruiterById,
  updateRecruiter,
  suspendRecruiter,
  activateRecruiter,
};

export default recruitersService;
