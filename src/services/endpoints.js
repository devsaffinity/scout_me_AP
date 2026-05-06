export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    verifyCode: '/auth/verify-code',
    resetPassword: '/auth/reset-password',
    currentUser: '/auth/me',
  },
  dashboard: {
    overview: '/dashboard/overview',
    export: '/dashboard/export',
  },
  athletes: {
    list: '/athletes',
    details: (id) => `/athletes/${id}`,
    suspend: (id) => `/athletes/${id}/suspend`,
    activate: (id) => `/athletes/${id}/activate`,
  },
  recruiters: {
    list: '/recruiters',
    details: (id) => `/recruiters/${id}`,
    suspend: (id) => `/recruiters/${id}/suspend`,
    activate: (id) => `/recruiters/${id}/activate`,
  },
  verification: {
    queue: '/verification/queue',
    approve: (id) => `/verification/${id}/approve`,
    reject: (id) => `/verification/${id}/reject`,
    summary: '/verification/summary',
  },
  discovery: {
    overview: '/discovery/overview',
    featuredAthletes: '/discovery/featured-athletes',
    sports: '/discovery/sports',
  },
  engagement: {
    overview: '/engagement/overview',
    leaderboard: '/engagement/leaderboard',
    campaigns: '/engagement/campaigns',
  },
  messages: {
    list: '/messages',
    details: (id) => `/messages/${id}`,
    flag: (id) => `/messages/${id}/flag`,
    review: (id) => `/messages/${id}/review`,
  },
  notifications: {
    list: '/notifications',
    create: '/notifications',
    details: (id) => `/notifications/${id}`,
    send: (id) => `/notifications/${id}/send`,
  },
  subscriptions: {
    plans: '/subscriptions/plans',
    active: '/subscriptions/active',
    details: (id) => `/subscriptions/${id}`,
  },
  bracelets: {
    inventory: '/bracelets',
    details: (id) => `/bracelets/${id}`,
    assign: (id) => `/bracelets/${id}/assign`,
    replace: (id) => `/bracelets/${id}/replace`,
  },
  scans: {
    list: '/scans',
    details: (id) => `/scans/${id}`,
    stats: '/scans/stats',
  },
  taxonomy: {
    root: '/taxonomy',
    byKey: (key) => `/taxonomy/${key}`,
    details: (key, id) => `/taxonomy/${key}/${id}`,
    reorder: (key) => `/taxonomy/${key}/reorder`,
  },
};

export default endpoints;
