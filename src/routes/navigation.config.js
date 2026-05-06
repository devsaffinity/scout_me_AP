import {
  FiCompass,
  FiCreditCard,
  FiGrid,
  FiMessageSquare,
  FiUsers,
} from 'react-icons/fi';
import { ROUTE_KEYS, ROUTES } from './routes.constants';

export const dashboardNavigationSections = [
  {
    title: 'Overview',
    items: [
      {
        key: ROUTE_KEYS.DASHBOARD,
        label: 'Dashboard',
        path: ROUTES.DASHBOARD,
        icon: FiGrid,
        module: 'dashboard',
      },
    ],
  },
  {
    title: 'Modules',
    items: [
      {
        key: ROUTE_KEYS.USERS_PROFILES,
        label: 'Users & Profiles',
        path: ROUTES.USERS_PROFILES,
        icon: FiUsers,
        module: 'users_profiles',
      },
      {
        key: ROUTE_KEYS.DISCOVERY_ENGAGEMENT,
        label: 'Discovery & Engagement',
        path: ROUTES.DISCOVERY_ENGAGEMENT,
        icon: FiCompass,
        module: 'discovery_engagement',
      },
      {
        key: ROUTE_KEYS.MESSAGING_NOTIFICATIONS,
        label: 'Messaging & Notifications',
        path: ROUTES.MESSAGING_NOTIFICATIONS,
        icon: FiMessageSquare,
        module: 'messaging_notifications',
      },
      {
        key: ROUTE_KEYS.PREMIUM_NFC,
        label: 'Premium & NFC',
        path: ROUTES.PREMIUM_NFC,
        icon: FiCreditCard,
        module: 'premium_nfc',
      },
    ],
  },
];

export const dashboardNavigationItems = dashboardNavigationSections.flatMap((section) => section.items);

export const pageTitleMap = {
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    subtitle: 'Track performance, user growth, and platform health.',
  },
  [ROUTES.PROFILE_SETTINGS]: {
    title: 'Profile Settings',
    subtitle: 'Manage your account details, admin profile, and password.',
  },
  [ROUTES.USERS_PROFILES]: {
    title: 'Users & Profiles',
    subtitle: 'Review accounts, verification, and profile activity.',
  },
  [ROUTES.DISCOVERY_ENGAGEMENT]: {
    title: 'Discovery & Engagement',
    subtitle: 'Monitor discovery demand, search activity, and saved engagement.',
  },
  [ROUTES.MESSAGING_NOTIFICATIONS]: {
    title: 'Messaging & Notifications',
    subtitle: 'Oversee conversations, delivery status, and platform alerts.',
  },
  [ROUTES.PREMIUM_NFC]: {
    title: 'Premium & NFC',
    subtitle: 'Manage subscriptions, bracelets, access, and scan activity.',
  },
};

export const resolvePageMeta = (pathname) => {
  const exactMatch = pageTitleMap[pathname];
  if (exactMatch) return exactMatch;

  const prefixEntry = Object.entries(pageTitleMap).find(([key]) => pathname.startsWith(`${key}/`));
  if (prefixEntry) return prefixEntry[1];

  return {
    title: 'Admin Console',
    subtitle: 'Manage operations, users, discovery, messaging, and premium services.',
  };
};

export default {
  dashboardNavigationSections,
  dashboardNavigationItems,
  pageTitleMap,
  resolvePageMeta,
};
