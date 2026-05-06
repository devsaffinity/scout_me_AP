import {
  getDb,
  saveDb,
  deepClone,
  getCollection,
  setCollection,
} from '../utils/mockData';

const DEFAULT_DELAY = 300;

export const wait = (ms = DEFAULT_DELAY) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const createSuccessResponse = (data, message = 'Request completed.', meta = {}) => ({
  success: true,
  message,
  data,
  meta,
});

export const createErrorResponse = (message = 'Something went wrong.', details = {}) => ({
  success: false,
  message,
  details,
});

export const applySearch = (collection, search = '', fields = []) => {
  if (!search) return collection;

  const keyword = String(search).trim().toLowerCase();
  if (!keyword) return collection;

  return collection.filter((item) =>
    fields.some((field) => {
      const value = field
        .split('.')
        .reduce((acc, part) => (acc !== null && acc !== undefined ? acc[part] : undefined), item);

      return String(value ?? '').toLowerCase().includes(keyword);
    }),
  );
};

export const applyFilters = (collection, filters = {}) => {
  return collection.filter((item) =>
    Object.entries(filters).every(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return true;
      }

      const fieldValue = key
        .split('.')
        .reduce((acc, part) => (acc !== null && acc !== undefined ? acc[part] : undefined), item);

      if (Array.isArray(value)) {
        return value.includes(fieldValue);
      }

      if (typeof value === 'object' && value !== null) {
        const from = value.from ?? value.start;
        const to = value.to ?? value.end;
        const time = new Date(fieldValue).getTime();

        if (from && time < new Date(from).getTime()) return false;
        if (to && time > new Date(to).getTime()) return false;
        return true;
      }

      return String(fieldValue) === String(value);
    }),
  );
};

export const sortCollection = (collection, sortBy = 'createdAt', sortOrder = 'desc') => {
  return [...collection].sort((first, second) => {
    const left = first?.[sortBy];
    const right = second?.[sortBy];

    const leftValue = left instanceof Date ? left.getTime() : new Date(left).getTime() || left;
    const rightValue = right instanceof Date ? right.getTime() : new Date(right).getTime() || right;

    if (leftValue < rightValue) return sortOrder === 'asc' ? -1 : 1;
    if (leftValue > rightValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

export const paginateCollection = (collection, page = 1, limit = 10) => {
  const currentPage = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  return {
    rows: collection.slice(start, end),
    pagination: {
      page: currentPage,
      limit: pageSize,
      total: collection.length,
      totalPages: Math.max(1, Math.ceil(collection.length / pageSize)),
      hasNextPage: end < collection.length,
      hasPreviousPage: currentPage > 1,
    },
  };
};

export const queryCollection = ({
  collection,
  page = 1,
  limit = 10,
  search = '',
  searchFields = [],
  filters = {},
  sortBy = 'createdAt',
  sortOrder = 'desc',
}) => {
  const searched = applySearch(collection, search, searchFields);
  const filtered = applyFilters(searched, filters);
  const sorted = sortCollection(filtered, sortBy, sortOrder);

  return paginateCollection(sorted, page, limit);
};

export const updateItemInCollection = (collection, id, updater) =>
  collection.map((item) => {
    if (item.id !== id) return item;

    const updated = typeof updater === 'function' ? updater(item) : { ...item, ...updater };
    return { ...updated, updatedAt: new Date().toISOString() };
  });

export const removeItemFromCollection = (collection, id) =>
  collection.filter((item) => item.id !== id);

export const appendItemToCollection = (collection, payload) => [
  { ...payload, createdAt: payload.createdAt || new Date().toISOString() },
  ...collection,
];

export const makeEntityApi = (key) => ({
  getAll: async () => {
    await wait();
    return createSuccessResponse(deepClone(getCollection(key)));
  },

  saveAll: async (collection) => {
    await wait();
    setCollection(key, collection);
    return createSuccessResponse(deepClone(collection), `${key} saved successfully.`);
  },

  mutate: async (mutator, successMessage = 'Changes saved successfully.') => {
    await wait();
    const db = getDb();
    const result = mutator(deepClone(db));
    const nextDb = result?.db ?? db;
    saveDb(nextDb);

    return createSuccessResponse(result?.data ?? null, successMessage, result?.meta ?? {});
  },
});

export const http = {
  get: async (handler, options = {}) => {
    await wait(options.delay);
    const data = await handler();
    return createSuccessResponse(data, options.message, options.meta);
  },

  post: async (handler, body, options = {}) => {
    await wait(options.delay);
    const data = await handler(body);
    return createSuccessResponse(data, options.message, options.meta);
  },

  put: async (handler, body, options = {}) => {
    await wait(options.delay);
    const data = await handler(body);
    return createSuccessResponse(data, options.message, options.meta);
  },

  patch: async (handler, body, options = {}) => {
    await wait(options.delay);
    const data = await handler(body);
    return createSuccessResponse(data, options.message, options.meta);
  },

  delete: async (handler, options = {}) => {
    await wait(options.delay);
    const data = await handler();
    return createSuccessResponse(data, options.message, options.meta);
  },
};

export default http;
