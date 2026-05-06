import endpoints from './endpoints';
import http, { queryCollection, updateItemInCollection } from './http';
import { getDb, saveDb, deepClone } from '../utils/mockData';

const searchFields = ['fullName', 'email', 'sport', 'organization', 'roleLabel', 'status'];

export const getVerificationQueue = async (params = {}) =>
  http.get(
    () => {
      const db = getDb();
      return deepClone(
        queryCollection({
          collection: db.verificationQueue,
          page: params.page,
          limit: params.limit,
          search: params.search,
          searchFields,
          filters: {
            status: params.status,
            role: params.role,
          },
          sortBy: params.sortBy || 'createdAt',
          sortOrder: params.sortOrder || 'desc',
        }),
      );
    },
    { message: `Verification queue loaded from ${endpoints.verification.queue}.` },
  );

export const approveVerification = async (id, review = {}) =>
  http.post(
    () => {
      const db = getDb();
      const item = db.verificationQueue.find((entry) => entry.id === id);

      if (!item) {
        throw new Error('Verification request not found.');
      }

      db.verificationQueue = updateItemInCollection(db.verificationQueue, id, {
        status: 'approved',
        reviewNote: review.note || 'Approved by admin',
        reviewedBy: review.reviewer || 'System Admin',
        reviewedAt: new Date().toISOString(),
      });

      if (item.role === 'athlete') {
        db.athletes = updateItemInCollection(db.athletes, item.profileId, {
          verificationStatus: 'verified',
        });
      }

      if (item.role === 'recruiter') {
        db.recruiters = updateItemInCollection(db.recruiters, item.profileId, {
          verificationStatus: 'verified',
        });
      }

      saveDb(db);
      return deepClone(db.verificationQueue.find((entry) => entry.id === id));
    },
    review,
    { message: `Verification approved via ${endpoints.verification.approve(id)}.` },
  );

export const rejectVerification = async (id, review = {}) =>
  http.post(
    () => {
      const db = getDb();
      const item = db.verificationQueue.find((entry) => entry.id === id);

      if (!item) {
        throw new Error('Verification request not found.');
      }

      db.verificationQueue = updateItemInCollection(db.verificationQueue, id, {
        status: 'rejected',
        reviewNote: review.note || 'Document mismatch',
        reviewedBy: review.reviewer || 'System Admin',
        reviewedAt: new Date().toISOString(),
      });

      if (item.role === 'athlete') {
        db.athletes = updateItemInCollection(db.athletes, item.profileId, {
          verificationStatus: 'needs_action',
        });
      }

      if (item.role === 'recruiter') {
        db.recruiters = updateItemInCollection(db.recruiters, item.profileId, {
          verificationStatus: 'needs_action',
        });
      }

      saveDb(db);
      return deepClone(db.verificationQueue.find((entry) => entry.id === id));
    },
    review,
    { message: `Verification rejected via ${endpoints.verification.reject(id)}.` },
  );

export const getVerificationSummary = async () =>
  http.get(
    () => {
      const queue = getDb().verificationQueue;
      const summary = {
        total: queue.length,
        pending: queue.filter((item) => item.status === 'pending').length,
        approved: queue.filter((item) => item.status === 'approved').length,
        rejected: queue.filter((item) => item.status === 'rejected').length,
      };

      return deepClone(summary);
    },
    { message: `Verification summary loaded from ${endpoints.verification.summary}.` },
  );

const verificationService = {
  getVerificationQueue,
  approveVerification,
  rejectVerification,
  getVerificationSummary,
};

export default verificationService;
