export const ROUTES = {
  ROOT: '/',
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_CODE: '/auth/verify-code',
  RESET_PASSWORD: '/auth/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE_SETTINGS: '/profile-settings',
  USERS_PROFILES: '/users-profiles',
  DISCOVERY_ENGAGEMENT: '/discovery-engagement',
  MESSAGING_NOTIFICATIONS: '/messaging-notifications',
  PREMIUM_NFC: '/premium-nfc',
  TAXONOMY: '/taxonomy',
};

export const ROUTE_KEYS = {
  DASHBOARD: 'dashboard',
  PROFILE_SETTINGS: 'profile_settings',
  USERS_PROFILES: 'users_profiles',
  DISCOVERY_ENGAGEMENT: 'discovery_engagement',
  MESSAGING_NOTIFICATIONS: 'messaging_notifications',
  PREMIUM_NFC: 'premium_nfc',
  TAXONOMY: 'taxonomy',
};

export const DEFAULT_AUTH_REDIRECT = ROUTES.DASHBOARD;
export const DEFAULT_LOGOUT_REDIRECT = ROUTES.LOGIN;

export const AUTH_ONLY_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.VERIFY_CODE,
  ROUTES.RESET_PASSWORD,
];

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE_SETTINGS,
  ROUTES.USERS_PROFILES,
  ROUTES.DISCOVERY_ENGAGEMENT,
  ROUTES.MESSAGING_NOTIFICATIONS,
  ROUTES.PREMIUM_NFC,
];

export default ROUTES;
