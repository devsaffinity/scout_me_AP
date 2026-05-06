import endpoints from './endpoints';
import http, { queryCollection, updateItemInCollection } from './http';
import { getDb, saveDb, deepClone } from '../utils/mockData';

const searchFields = ['threadTopic', 'lastSenderName', 'status', 'participantsLabel', 'channel'];

export const getMessageThreads = async (params = {}) =>
  http.get(
    () =>
      deepClone(
        queryCollection({
          collection: getDb().messages,
          page: params.page,
          limit: params.limit,
          search: params.search,
          searchFields,
          filters: {
            status: params.status,
            channel: params.channel,
            isFlagged: params.isFlagged,
          },
          sortBy: params.sortBy || 'updatedAt',
          sortOrder: params.sortOrder || 'desc',
        }),
      ),
    { message: `Message threads loaded from ${endpoints.messages.list}.` },
  );

export const getMessageById = async (id) =>
  http.get(
    () => {
      const thread = getDb().messages.find((item) => item.id === id);
      if (!thread) {
        throw new Error('Message thread not found.');
      }
      return deepClone(thread);
    },
    { message: `Message details loaded from ${endpoints.messages.details(id)}.` },
  );

export const flagMessageThread = async (id, note = 'Flagged for moderation review') =>
  http.post(
    () => {
      const db = getDb();
      const thread = db.messages.find((item) => item.id === id);

      if (!thread) {
        throw new Error('Message thread not found.');
      }

      db.messages = updateItemInCollection(db.messages, id, {
        isFlagged: true,
        moderationNote: note,
        status: 'flagged',
      });
      saveDb(db);

      return deepClone(db.messages.find((item) => item.id === id));
    },
    { note },
    { message: `Thread flagged via ${endpoints.messages.flag(id)}.` },
  );

export const markThreadReviewed = async (id) =>
  http.post(
    () => {
      const db = getDb();
      const thread = db.messages.find((item) => item.id === id);

      if (!thread) {
        throw new Error('Message thread not found.');
      }

      db.messages = updateItemInCollection(db.messages, id, {
        status: 'reviewed',
        isFlagged: false,
        moderationNote: 'Reviewed by admin',
      });
      saveDb(db);

      return deepClone(db.messages.find((item) => item.id === id));
    },
    {},
    { message: `Thread reviewed via ${endpoints.messages.review(id)}.` },
  );

const messagesService = {
  getMessageThreads,
  getMessageById,
  flagMessageThread,
  markThreadReviewed,
};

export default messagesService;
