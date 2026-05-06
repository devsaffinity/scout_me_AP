import endpoints from './endpoints';
import http, {
  appendItemToCollection,
  queryCollection,
  removeItemFromCollection,
  updateItemInCollection,
} from './http';
import { generateId, getDb, saveDb, deepClone } from '../utils/mockData';

const planSearchFields = ['name', 'billingPeriod', 'status'];
const subscriptionSearchFields = ['athleteName', 'planName', 'status', 'braceletSerial'];

export const getPlans = async (params = {}) =>
  http.get(
    () =>
      deepClone(
        queryCollection({
          collection: getDb().subscriptionPlans,
          page: params.page,
          limit: params.limit,
          search: params.search,
          searchFields: planSearchFields,
          filters: {
            status: params.status,
            billingPeriod: params.billingPeriod,
          },
          sortBy: params.sortBy || 'price',
          sortOrder: params.sortOrder || 'asc',
        }),
      ),
    { message: `Subscription plans loaded from ${endpoints.subscriptions.plans}.` },
  );

export const createPlan = async (payload) =>
  http.post(
    () => {
      const db = getDb();
      const plan = {
        id: generateId('plan'),
        name: payload.name,
        price: Number(payload.price || 0),
        billingPeriod: payload.billingPeriod || 'monthly',
        status: payload.status || 'active',
        features: payload.features || [],
        nfcIncluded: Boolean(payload.nfcIncluded),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.subscriptionPlans = appendItemToCollection(db.subscriptionPlans, plan);
      saveDb(db);

      return deepClone(plan);
    },
    payload,
    { message: 'Subscription plan created successfully.' },
  );

export const updatePlan = async (id, payload) =>
  http.patch(
    () => {
      const db = getDb();
      const plan = db.subscriptionPlans.find((item) => item.id === id);

      if (!plan) {
        throw new Error('Subscription plan not found.');
      }

      db.subscriptionPlans = updateItemInCollection(db.subscriptionPlans, id, payload);
      saveDb(db);

      return deepClone(db.subscriptionPlans.find((item) => item.id === id));
    },
    payload,
    { message: `Subscription plan updated via ${endpoints.subscriptions.details(id)}.` },
  );

export const deletePlan = async (id) =>
  http.delete(
    () => {
      const db = getDb();
      db.subscriptionPlans = removeItemFromCollection(db.subscriptionPlans, id);
      saveDb(db);
      return { id, deleted: true };
    },
    { message: 'Subscription plan deleted successfully.' },
  );

export const getActiveSubscriptions = async (params = {}) =>
  http.get(
    () =>
      deepClone(
        queryCollection({
          collection: getDb().activeSubscriptions,
          page: params.page,
          limit: params.limit,
          search: params.search,
          searchFields: subscriptionSearchFields,
          filters: {
            status: params.status,
            planName: params.planName,
          },
          sortBy: params.sortBy || 'renewalDate',
          sortOrder: params.sortOrder || 'asc',
        }),
      ),
    { message: `Active subscriptions loaded from ${endpoints.subscriptions.active}.` },
  );

export const updateSubscriptionStatus = async (id, status) =>
  http.patch(
    () => {
      const db = getDb();
      const subscription = db.activeSubscriptions.find((item) => item.id === id);

      if (!subscription) {
        throw new Error('Subscription not found.');
      }

      db.activeSubscriptions = updateItemInCollection(db.activeSubscriptions, id, { status });
      saveDb(db);

      return deepClone(db.activeSubscriptions.find((item) => item.id === id));
    },
    { status },
    { message: 'Subscription status updated successfully.' },
  );

const subscriptionsService = {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getActiveSubscriptions,
  updateSubscriptionStatus,
};

export default subscriptionsService;
