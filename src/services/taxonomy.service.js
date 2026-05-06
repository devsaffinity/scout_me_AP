import endpoints from './endpoints';
import http from './http';
import { generateId, getDb, saveDb, deepClone } from '../utils/mockData';

export const getTaxonomies = async () =>
  http.get(
    () => deepClone(getDb().taxonomy),
    { message: `Taxonomy records loaded from ${endpoints.taxonomy.root}.` },
  );

export const getTaxonomyByKey = async (key) =>
  http.get(
    () => {
      const taxonomy = getDb().taxonomy?.[key];
      if (!taxonomy) {
        throw new Error(`Taxonomy "${key}" not found.`);
      }
      return deepClone(taxonomy);
    },
    { message: `Taxonomy collection loaded from ${endpoints.taxonomy.byKey(key)}.` },
  );

export const createTaxonomyItem = async (key, payload) =>
  http.post(
    () => {
      const db = getDb();
      const collection = db.taxonomy?.[key];

      if (!collection) {
        throw new Error(`Taxonomy "${key}" not found.`);
      }

      const nextItem = {
        id: generateId(key),
        label: payload.label,
        slug: payload.slug || String(payload.label).toLowerCase().replace(/\s+/g, '-'),
        status: payload.status || 'active',
        sortOrder: payload.sortOrder ?? collection.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      collection.push(nextItem);
      saveDb(db);

      return deepClone(nextItem);
    },
    payload,
    { message: 'Taxonomy item created successfully.' },
  );

export const updateTaxonomyItem = async (key, id, payload) =>
  http.patch(
    () => {
      const db = getDb();
      const collection = db.taxonomy?.[key];

      if (!collection) {
        throw new Error(`Taxonomy "${key}" not found.`);
      }

      const item = collection.find((entry) => entry.id === id);
      if (!item) {
        throw new Error('Taxonomy item not found.');
      }

      Object.assign(item, payload, {
        updatedAt: new Date().toISOString(),
      });

      saveDb(db);
      return deepClone(item);
    },
    payload,
    { message: `Taxonomy item updated via ${endpoints.taxonomy.details(key, id)}.` },
  );

export const deleteTaxonomyItem = async (key, id) =>
  http.delete(
    () => {
      const db = getDb();
      const collection = db.taxonomy?.[key];

      if (!collection) {
        throw new Error(`Taxonomy "${key}" not found.`);
      }

      db.taxonomy[key] = collection.filter((item) => item.id !== id);
      saveDb(db);

      return { id, deleted: true };
    },
    { message: 'Taxonomy item deleted successfully.' },
  );

export const reorderTaxonomyItems = async (key, orderedIds = []) =>
  http.post(
    () => {
      const db = getDb();
      const collection = db.taxonomy?.[key];

      if (!collection) {
        throw new Error(`Taxonomy "${key}" not found.`);
      }

      const orderMap = new Map(orderedIds.map((id, index) => [id, index + 1]));
      db.taxonomy[key] = [...collection]
        .sort((first, second) => (orderMap.get(first.id) || 999) - (orderMap.get(second.id) || 999))
        .map((item, index) => ({
          ...item,
          sortOrder: index + 1,
          updatedAt: new Date().toISOString(),
        }));

      saveDb(db);
      return deepClone(db.taxonomy[key]);
    },
    { orderedIds },
    { message: `Taxonomy reordered via ${endpoints.taxonomy.reorder(key)}.` },
  );

const taxonomyService = {
  getTaxonomies,
  getTaxonomyByKey,
  createTaxonomyItem,
  updateTaxonomyItem,
  deleteTaxonomyItem,
  reorderTaxonomyItems,
};

export default taxonomyService;
