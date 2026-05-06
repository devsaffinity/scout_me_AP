import endpoints from './endpoints';
import http, { queryCollection, updateItemInCollection } from './http';
import { getDb, saveDb, deepClone } from '../utils/mockData';

const searchFields = ['serialNumber', 'status', 'assignedToName', 'chipVersion'];

export const getBracelets = async (params = {}) =>
  http.get(
    () =>
      deepClone(
        queryCollection({
          collection: getDb().bracelets,
          page: params.page,
          limit: params.limit,
          search: params.search,
          searchFields,
          filters: {
            status: params.status,
            chipVersion: params.chipVersion,
          },
          sortBy: params.sortBy || 'updatedAt',
          sortOrder: params.sortOrder || 'desc',
        }),
      ),
    { message: `Bracelet inventory loaded from ${endpoints.bracelets.inventory}.` },
  );

export const getBraceletById = async (id) =>
  http.get(
    () => {
      const bracelet = getDb().bracelets.find((item) => item.id === id);
      if (!bracelet) {
        throw new Error('Bracelet not found.');
      }
      return deepClone(bracelet);
    },
    { message: `Bracelet details loaded from ${endpoints.bracelets.details(id)}.` },
  );

export const assignBracelet = async (id, payload) =>
  http.post(
    () => {
      const db = getDb();
      const bracelet = db.bracelets.find((item) => item.id === id);

      if (!bracelet) {
        throw new Error('Bracelet not found.');
      }

      db.bracelets = updateItemInCollection(db.bracelets, id, {
        status: 'assigned',
        assignedToId: payload.assignedToId,
        assignedToName: payload.assignedToName,
        assignedAt: new Date().toISOString(),
      });
      saveDb(db);

      return deepClone(db.bracelets.find((item) => item.id === id));
    },
    payload,
    { message: `Bracelet assigned via ${endpoints.bracelets.assign(id)}.` },
  );

export const replaceBracelet = async (id, payload) =>
  http.post(
    () => {
      const db = getDb();
      const bracelet = db.bracelets.find((item) => item.id === id);

      if (!bracelet) {
        throw new Error('Bracelet not found.');
      }

      db.bracelets = updateItemInCollection(db.bracelets, id, {
        status: 'replaced',
        replacementFor: payload.replacementFor,
        replacementReason: payload.reason || 'Hardware refresh',
      });
      saveDb(db);

      return deepClone(db.bracelets.find((item) => item.id === id));
    },
    payload,
    { message: `Bracelet replaced via ${endpoints.bracelets.replace(id)}.` },
  );

export const updateBraceletStatus = async (id, status) =>
  http.patch(
    () => {
      const db = getDb();
      const bracelet = db.bracelets.find((item) => item.id === id);

      if (!bracelet) {
        throw new Error('Bracelet not found.');
      }

      db.bracelets = updateItemInCollection(db.bracelets, id, { status });
      saveDb(db);

      return deepClone(db.bracelets.find((item) => item.id === id));
    },
    { status },
    { message: 'Bracelet status updated successfully.' },
  );

const braceletsService = {
  getBracelets,
  getBraceletById,
  assignBracelet,
  replaceBracelet,
  updateBraceletStatus,
};

export default braceletsService;
