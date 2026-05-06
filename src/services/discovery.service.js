import endpoints from './endpoints';
import http, { queryCollection, updateItemInCollection } from './http';
import { getDb, saveDb, deepClone } from '../utils/mockData';

const searchFields = ['fullName', 'sport', 'position', 'location'];

export const getDiscoveryOverview = async () =>
  http.get(
    () => {
      const db = getDb();
      const featuredAthletes = db.athletes.filter((item) => item.discoveryPriority >= 8);
      const boostedProfiles = db.athletes.filter((item) => item.boostActive);
      const topSportsMap = db.athletes.reduce((acc, athlete) => {
        acc[athlete.sport] = (acc[athlete.sport] || 0) + 1;
        return acc;
      }, {});

      return {
        featuredProfiles: featuredAthletes.length,
        boostedProfiles: boostedProfiles.length,
        swipeMatchRate: 67,
        profileViewGrowth: 14.8,
        topSports: Object.entries(topSportsMap)
          .map(([label, value]) => ({ label, value }))
          .sort((left, right) => right.value - left.value),
      };
    },
    { message: `Discovery overview loaded from ${endpoints.discovery.overview}.` },
  );

export const getFeaturedAthletes = async (params = {}) =>
  http.get(
    () => {
      const db = getDb();
      return deepClone(
        queryCollection({
          collection: db.athletes.filter((item) => item.discoveryPriority >= (params.minPriority || 1)),
          page: params.page,
          limit: params.limit,
          search: params.search,
          searchFields,
          filters: {
            sport: params.sport,
            boostActive: params.boostActive,
          },
          sortBy: params.sortBy || 'discoveryPriority',
          sortOrder: params.sortOrder || 'desc',
        }),
      );
    },
    { message: `Featured athletes loaded from ${endpoints.discovery.featuredAthletes}.` },
  );

export const getTopSports = async () =>
  http.get(
    async () => (await getDiscoveryOverview()).data.topSports,
    { message: `Top sports loaded from ${endpoints.discovery.sports}.` },
  );

export const updateDiscoveryPriority = async (id, payload) =>
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
    { message: 'Discovery priority updated successfully.' },
  );

const discoveryService = {
  getDiscoveryOverview,
  getFeaturedAthletes,
  getTopSports,
  updateDiscoveryPriority,
};

export default discoveryService;
