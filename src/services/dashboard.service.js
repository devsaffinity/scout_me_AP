import endpoints from './endpoints';
import http from './http';
import { getDb, deepClone } from '../utils/mockData';

const sum = (values = []) => values.reduce((total, value) => total + Number(value || 0), 0);

const groupBy = (items, key) =>
  items.reduce((accumulator, item) => {
    const bucket = item[key] ?? 'Unknown';
    accumulator[bucket] = accumulator[bucket] ? accumulator[bucket] + 1 : 1;
    return accumulator;
  }, {});

export const getOverview = async () =>
  http.get(
    () => {
      const db = getDb();
      const athletes = db.athletes;
      const recruiters = db.recruiters;
      const notifications = db.notifications;
      const subscriptions = db.activeSubscriptions;
      const bracelets = db.bracelets;
      const scans = db.scans;
      const verificationQueue = db.verificationQueue;
      const messages = db.messages;

      const metrics = [
        {
          key: 'total_users',
          label: 'Total users',
          value: athletes.length + recruiters.length,
          trend: 12.4,
        },
        {
          key: 'verified_profiles',
          label: 'Verified profiles',
          value: athletes.filter((item) => item.verificationStatus === 'verified').length,
          trend: 8.7,
        },
        {
          key: 'premium_subscriptions',
          label: 'Premium subscriptions',
          value: subscriptions.filter((item) => item.status === 'active').length,
          trend: 5.2,
        },
        {
          key: 'nfc_scan_success_rate',
          label: 'NFC scan success rate',
          value: `${Math.round(
            (scans.filter((item) => item.outcome === 'success').length / scans.length) * 100,
          )}%`,
          trend: 3.1,
        },
      ];

      const roleDistribution = Object.entries({
        Athletes: athletes.length,
        Recruiters: recruiters.length,
        Admins: db.admins.length,
      }).map(([name, value]) => ({ name, value }));

      const growth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => ({
        month,
        athletes: 120 + index * 14,
        recruiters: 32 + index * 5,
        premium: 18 + index * 3,
      }));

      const discoveryActivity = ['Connections', 'Profile Views', 'Shortlists', 'Invites'].map(
        (label, index) => ({
          label,
          value: [842, 1288, 472, 214][index],
        }),
      );

      const premiumConversion = ['Starter', 'Growth', 'Elite'].map((name, index) => ({
        name,
        conversions: [34, 58, 21][index],
        retention: [74, 82, 91][index],
      }));

      const recentActivity = deepClone(
        [
          ...verificationQueue.slice(0, 3).map((item) => ({
            id: item.id,
            actor: item.fullName,
            action: `${item.roleLabel} submitted verification documents`,
            timestamp: item.createdAt,
            type: 'verification',
          })),
          ...notifications.slice(0, 2).map((item) => ({
            id: item.id,
            actor: item.createdBy,
            action: `Scheduled notification "${item.title}"`,
            timestamp: item.updatedAt || item.createdAt,
            type: 'notification',
          })),
          ...messages.slice(0, 2).map((item) => ({
            id: item.id,
            actor: item.lastSenderName,
            action: `Sent a message in ${item.threadTopic}`,
            timestamp: item.updatedAt || item.createdAt,
            type: 'message',
          })),
        ].sort((first, second) => new Date(second.timestamp) - new Date(first.timestamp)),
      );

      const health = {
        pendingVerifications: verificationQueue.filter((item) => item.status === 'pending').length,
        flaggedThreads: messages.filter((item) => item.isFlagged).length,
        notificationsScheduled: notifications.filter((item) => item.status === 'scheduled').length,
        braceletsAvailable: bracelets.filter((item) => item.status === 'available').length,
      };

      const revenue = {
        monthlyRevenue: sum(
          subscriptions.filter((item) => item.status === 'active').map((item) => item.amount),
        ),
        planBreakdown: Object.entries(groupBy(subscriptions, 'planName')).map(([name, value]) => ({
          name,
          value,
        })),
      };

      return {
        metrics,
        charts: {
          roleDistribution,
          growth,
          discoveryActivity,
          premiumConversion,
        },
        recentActivity,
        health,
        revenue,
      };
    },
    {
      message: `Dashboard overview loaded from ${endpoints.dashboard.overview}.`,
    },
  );

export const getDashboardMetrics = async () =>
  http.get(async () => (await getOverview()).data.metrics, {
    message: 'Dashboard metrics loaded successfully.',
  });

export const exportDashboardReport = async (payload = {}) =>
  http.post(
    () => ({
      exportedAt: new Date().toISOString(),
      format: payload.format || 'csv',
      scope: payload.scope || 'overview',
      status: 'ready',
      downloadName: `scoutme-dashboard-${new Date().toISOString().slice(0, 10)}.${
        payload.format || 'csv'
      }`,
    }),
    payload,
    {
      message: `Dashboard export queued via ${endpoints.dashboard.export}.`,
    },
  );

const dashboardService = {
  getOverview,
  getDashboardMetrics,
  exportDashboardReport,
};

export default dashboardService;
