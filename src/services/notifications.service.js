import endpoints from './endpoints';
import http, {
  appendItemToCollection,
  queryCollection,
  removeItemFromCollection,
  updateItemInCollection,
} from './http';
import { generateId, getDb, saveDb, deepClone } from '../utils/mockData';

const searchFields = ['title', 'channel', 'status', 'audience', 'createdBy'];

export const getNotifications = async (params = {}) =>
  http.get(
    () =>
      deepClone(
        queryCollection({
          collection: getDb().notifications,
          page: params.page,
          limit: params.limit,
          search: params.search,
          searchFields,
          filters: {
            status: params.status,
            channel: params.channel,
          },
          sortBy: params.sortBy || 'scheduledFor',
          sortOrder: params.sortOrder || 'desc',
        }),
      ),
    { message: `Notifications loaded from ${endpoints.notifications.list}.` },
  );

export const createNotification = async (payload) =>
  http.post(
    () => {
      const db = getDb();
      const record = {
        id: generateId('notify'),
        title: payload.title,
        body: payload.body,
        channel: payload.channel || 'push',
        status: payload.status || 'draft',
        audience: payload.audience || 'all_users',
        scheduledFor: payload.scheduledFor || new Date().toISOString(),
        createdBy: payload.createdBy || 'System Admin',
        sentCount: payload.sentCount || 0,
        openRate: payload.openRate || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.notifications = appendItemToCollection(db.notifications, record);
      saveDb(db);

      return deepClone(record);
    },
    payload,
    { message: `Notification created via ${endpoints.notifications.create}.` },
  );

export const updateNotification = async (id, payload) =>
  http.patch(
    () => {
      const db = getDb();
      const notification = db.notifications.find((item) => item.id === id);

      if (!notification) {
        throw new Error('Notification campaign not found.');
      }

      db.notifications = updateItemInCollection(db.notifications, id, payload);
      saveDb(db);

      return deepClone(db.notifications.find((item) => item.id === id));
    },
    payload,
    { message: `Notification updated via ${endpoints.notifications.details(id)}.` },
  );

export const deleteNotification = async (id) =>
  http.delete(
    () => {
      const db = getDb();
      db.notifications = removeItemFromCollection(db.notifications, id);
      saveDb(db);

      return { id, deleted: true };
    },
    { message: 'Notification deleted successfully.' },
  );

export const sendNotification = async (id) =>
  http.post(
    () => {
      const db = getDb();
      const notification = db.notifications.find((item) => item.id === id);

      if (!notification) {
        throw new Error('Notification campaign not found.');
      }

      db.notifications = updateItemInCollection(db.notifications, id, {
        status: 'sent',
        sentCount: Math.max(notification.sentCount || 0, 2480),
        sentAt: new Date().toISOString(),
      });
      saveDb(db);

      return deepClone(db.notifications.find((item) => item.id === id));
    },
    {},
    { message: `Notification sent via ${endpoints.notifications.send(id)}.` },
  );

export const getNotificationStats = async () =>
  http.get(
    () => {
      const notifications = getDb().notifications;
      return {
        total: notifications.length,
        draft: notifications.filter((item) => item.status === 'draft').length,
        scheduled: notifications.filter((item) => item.status === 'scheduled').length,
        sent: notifications.filter((item) => item.status === 'sent').length,
      };
    },
    { message: 'Notification stats loaded successfully.' },
  );

const notificationsService = {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  sendNotification,
  getNotificationStats,
};

export default notificationsService;
