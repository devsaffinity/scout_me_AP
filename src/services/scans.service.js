import endpoints from './endpoints';
import http, { queryCollection, updateItemInCollection } from './http';
import { getDb, saveDb, deepClone } from '../utils/mockData';

const searchFields = ['serialNumber', 'athleteName', 'venue', 'outcome', 'reviewStatus'];

export const getScans = async (params = {}) =>
  http.get(
    () =>
      deepClone(
        queryCollection({
          collection: getDb().scans,
          page: params.page,
          limit: params.limit,
          search: params.search,
          searchFields,
          filters: {
            outcome: params.outcome,
            reviewStatus: params.reviewStatus,
          },
          sortBy: params.sortBy || 'scannedAt',
          sortOrder: params.sortOrder || 'desc',
        }),
      ),
    { message: `NFC scans loaded from ${endpoints.scans.list}.` },
  );

export const getScanById = async (id) =>
  http.get(
    () => {
      const scan = getDb().scans.find((item) => item.id === id);
      if (!scan) {
        throw new Error('Scan record not found.');
      }
      return deepClone(scan);
    },
    { message: `Scan details loaded from ${endpoints.scans.details(id)}.` },
  );

export const getScanStats = async () =>
  http.get(
    () => {
      const scans = getDb().scans;
      const total = scans.length;
      const success = scans.filter((item) => item.outcome === 'success').length;
      const failed = scans.filter((item) => item.outcome === 'failed').length;
      const duplicate = scans.filter((item) => item.outcome === 'duplicate').length;

      return {
        total,
        success,
        failed,
        duplicate,
        successRate: total ? Math.round((success / total) * 100) : 0,
      };
    },
    { message: `Scan stats loaded from ${endpoints.scans.stats}.` },
  );

export const markScanReviewed = async (id) =>
  http.patch(
    () => {
      const db = getDb();
      const scan = db.scans.find((item) => item.id === id);

      if (!scan) {
        throw new Error('Scan record not found.');
      }

      db.scans = updateItemInCollection(db.scans, id, {
        reviewStatus: 'reviewed',
      });
      saveDb(db);

      return deepClone(db.scans.find((item) => item.id === id));
    },
    {},
    { message: 'Scan marked as reviewed.' },
  );

const scansService = {
  getScans,
  getScanById,
  getScanStats,
  markScanReviewed,
};

export default scansService;
