import endpoints from './endpoints';
import http, { queryCollection, updateItemInCollection } from './http';
import { getDb, saveDb, deepClone } from '../utils/mockData';

const campaignSearchFields = ['name', 'channel', 'status', 'audience'];
const leaderboardFields = ['name', 'sport', 'metric'];

export const getEngagementOverview = async () =>
  http.get(
    () => {
      const db = getDb();
      return {
        directMessages: db.messages.reduce((total, item) => total + item.messageCount, 0),
        weeklyInvites: 214,
        shortlistAdds: 382,
        responseRate: 71,
        activeCampaigns: db.engagementCampaigns.filter((item) => item.status === 'active').length,
      };
    },
    { message: `Engagement overview loaded from ${endpoints.engagement.overview}.` },
  );

export const getEngagementLeaderboard = async (params = {}) =>
  http.get(
    () => {
      const db = getDb();
      return deepClone(
        queryCollection({
          collection: db.engagementLeaderboard,
          page: params.page,
          limit: params.limit,
          search: params.search,
          searchFields: leaderboardFields,
          filters: {
            metric: params.metric,
            sport: params.sport,
          },
          sortBy: params.sortBy || 'value',
          sortOrder: params.sortOrder || 'desc',
        }),
      );
    },
    { message: `Engagement leaderboard loaded from ${endpoints.engagement.leaderboard}.` },
  );

export const getEngagementCampaigns = async (params = {}) =>
  http.get(
    () =>
      deepClone(
        queryCollection({
          collection: getDb().engagementCampaigns,
          page: params.page,
          limit: params.limit,
          search: params.search,
          searchFields: campaignSearchFields,
          filters: {
            status: params.status,
            channel: params.channel,
          },
          sortBy: params.sortBy || 'updatedAt',
          sortOrder: params.sortOrder || 'desc',
        }),
      ),
    { message: `Engagement campaigns loaded from ${endpoints.engagement.campaigns}.` },
  );

export const updateCampaignStatus = async (id, status) =>
  http.patch(
    () => {
      const db = getDb();
      const campaign = db.engagementCampaigns.find((item) => item.id === id);

      if (!campaign) {
        throw new Error('Engagement campaign not found.');
      }

      db.engagementCampaigns = updateItemInCollection(db.engagementCampaigns, id, { status });
      saveDb(db);

      return deepClone(db.engagementCampaigns.find((item) => item.id === id));
    },
    { status },
    { message: 'Campaign status updated successfully.' },
  );

const engagementService = {
  getEngagementOverview,
  getEngagementLeaderboard,
  getEngagementCampaigns,
  updateCampaignStatus,
};

export default engagementService;
