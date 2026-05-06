export const APP_NAME = 'ScoutMe Admin';

export const ADMIN_ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'user_ops_manager', label: 'User Operations Manager' },
  { value: 'community_manager', label: 'Community Manager' },
  { value: 'support_manager', label: 'Support Manager' },
  { value: 'analyst', label: 'Analyst' },
];

export const USER_STATUSES = ['active', 'pending', 'suspended', 'banned'];
export const VERIFICATION_STATUSES = ['pending', 'verified', 'needs_action', 'rejected'];
export const MESSAGE_STATUSES = ['active', 'flagged', 'reviewed', 'archived'];
export const NOTIFICATION_STATUSES = ['draft', 'scheduled', 'sent'];
export const SUBSCRIPTION_STATUSES = ['active', 'paused', 'cancelled', 'expired'];
export const BRACELET_STATUSES = ['available', 'assigned', 'inactive', 'replaced'];
export const SCAN_OUTCOMES = ['success', 'failed', 'duplicate'];
export const BILLING_PERIODS = ['monthly', 'quarterly', 'yearly'];
export const TABLE_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const TIME_RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '12m', label: 'Last 12 months' },
];

export const SPORTS_OPTIONS = [
  'Football',
  'Basketball',
  'Cricket',
  'Track & Field',
  'Volleyball',
  'Swimming',
];

export const POSITION_OPTIONS = {
  Football: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
  Basketball: ['Guard', 'Forward', 'Center'],
  Cricket: ['Batter', 'Bowler', 'All-rounder'],
  'Track & Field': ['Sprinter', 'Jumper', 'Thrower'],
  Volleyball: ['Setter', 'Outside Hitter', 'Libero'],
  Swimming: ['Freestyle', 'Backstroke', 'Butterfly'],
};

export const DEFAULT_DATE_FORMAT = 'en-US';

export default {
  APP_NAME,
  ADMIN_ROLES,
  USER_STATUSES,
  VERIFICATION_STATUSES,
  MESSAGE_STATUSES,
  NOTIFICATION_STATUSES,
  SUBSCRIPTION_STATUSES,
  BRACELET_STATUSES,
  SCAN_OUTCOMES,
  BILLING_PERIODS,
  TABLE_PAGE_SIZE_OPTIONS,
  TIME_RANGE_OPTIONS,
  SPORTS_OPTIONS,
  POSITION_OPTIONS,
  DEFAULT_DATE_FORMAT,
};
