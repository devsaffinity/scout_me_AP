const STORAGE_KEY = 'scoutme-admin-db';

let memoryStorage = null;

const hasWindow = () => typeof window !== 'undefined';
const hasStorage = () => hasWindow() && Boolean(window.localStorage);

export const deepClone = (value) => JSON.parse(JSON.stringify(value));

export const generateId = (prefix = 'id') => {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().split('-')[0]
      : Math.random().toString(36).slice(2, 10);

  return `${prefix}_${randomPart}`;
};

const daysAgo = (days, extraHours = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - extraHours);
  return date.toISOString();
};

const daysAhead = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const createInitialDb = () => {
  const athleteIds = {
    a1: generateId('ath'),
    a2: generateId('ath'),
    a3: generateId('ath'),
    a4: generateId('ath'),
    a5: generateId('ath'),
    a6: generateId('ath'),
  };

  const recruiterIds = {
    r1: generateId('rec'),
    r2: generateId('rec'),
    r3: generateId('rec'),
    r4: generateId('rec'),
  };

  const athletes = [
    {
      id: athleteIds.a1,
      fullName: 'Ava Morgan',
      email: 'ava.morgan@scoutme.app',
      sport: 'Football',
      position: 'Forward',
      location: 'Austin, USA',
      age: 19,
      status: 'active',
      verificationStatus: 'verified',
      boostActive: true,
      discoveryPriority: 9,
      profileViews: 1480,
      matchRate: 78,
      createdAt: daysAgo(120),
      updatedAt: daysAgo(1),
    },
    {
      id: athleteIds.a2,
      fullName: 'Liam Carter',
      email: 'liam.carter@scoutme.app',
      sport: 'Basketball',
      position: 'Guard',
      location: 'Chicago, USA',
      age: 20,
      status: 'active',
      verificationStatus: 'pending',
      boostActive: false,
      discoveryPriority: 8,
      profileViews: 1125,
      matchRate: 69,
      createdAt: daysAgo(98),
      updatedAt: daysAgo(3),
    },
    {
      id: athleteIds.a3,
      fullName: 'Noah Patel',
      email: 'noah.patel@scoutme.app',
      sport: 'Cricket',
      position: 'All-rounder',
      location: 'Lahore, Pakistan',
      age: 18,
      status: 'active',
      verificationStatus: 'verified',
      boostActive: true,
      discoveryPriority: 7,
      profileViews: 940,
      matchRate: 73,
      createdAt: daysAgo(74),
      updatedAt: daysAgo(2),
    },
    {
      id: athleteIds.a4,
      fullName: 'Sophia Reed',
      email: 'sophia.reed@scoutme.app',
      sport: 'Volleyball',
      position: 'Setter',
      location: 'Madrid, Spain',
      age: 21,
      status: 'suspended',
      verificationStatus: 'needs_action',
      boostActive: false,
      discoveryPriority: 5,
      profileViews: 620,
      matchRate: 52,
      createdAt: daysAgo(66),
      updatedAt: daysAgo(5),
      suspensionReason: 'Repeated profile policy violations',
    },
    {
      id: athleteIds.a5,
      fullName: 'Ethan Brooks',
      email: 'ethan.brooks@scoutme.app',
      sport: 'Track & Field',
      position: 'Sprinter',
      location: 'Nairobi, Kenya',
      age: 17,
      status: 'active',
      verificationStatus: 'verified',
      boostActive: false,
      discoveryPriority: 6,
      profileViews: 705,
      matchRate: 64,
      createdAt: daysAgo(41),
      updatedAt: daysAgo(1, 6),
    },
    {
      id: athleteIds.a6,
      fullName: 'Mia Torres',
      email: 'mia.torres@scoutme.app',
      sport: 'Swimming',
      position: 'Freestyle',
      location: 'Miami, USA',
      age: 18,
      status: 'pending',
      verificationStatus: 'pending',
      boostActive: false,
      discoveryPriority: 4,
      profileViews: 398,
      matchRate: 49,
      createdAt: daysAgo(12),
      updatedAt: daysAgo(1, 10),
    },
  ];

  const recruiters = [
    {
      id: recruiterIds.r1,
      fullName: 'Emma Watts',
      email: 'emma.watts@ravenrecruiting.com',
      organization: 'Raven Recruiting',
      league: 'NCAA',
      location: 'Boston, USA',
      status: 'active',
      verificationStatus: 'verified',
      createdAt: daysAgo(140),
      updatedAt: daysAgo(1),
    },
    {
      id: recruiterIds.r2,
      fullName: 'Oliver Chen',
      email: 'oliver.chen@northstaracademy.com',
      organization: 'North Star Academy',
      league: 'Youth Elite',
      location: 'Toronto, Canada',
      status: 'active',
      verificationStatus: 'verified',
      createdAt: daysAgo(110),
      updatedAt: daysAgo(4),
    },
    {
      id: recruiterIds.r3,
      fullName: 'Harper Smith',
      email: 'harper.smith@premiertalent.io',
      organization: 'Premier Talent',
      league: 'Pro Pathway',
      location: 'London, UK',
      status: 'suspended',
      verificationStatus: 'needs_action',
      createdAt: daysAgo(50),
      updatedAt: daysAgo(8),
      suspensionReason: 'Manual review pending',
    },
    {
      id: recruiterIds.r4,
      fullName: 'Zara Khan',
      email: 'zara.khan@fieldvision.pk',
      organization: 'Field Vision',
      league: 'Regional',
      location: 'Karachi, Pakistan',
      status: 'pending',
      verificationStatus: 'pending',
      createdAt: daysAgo(17),
      updatedAt: daysAgo(2),
    },
  ];

  return {
    admins: [
      {
        id: generateId('adm'),
        name: 'Hazaifa Admin',
        email: 'admin@scoutme.app',
        password: 'Admin@123',
        role: 'super_admin',
        status: 'active',
        avatar: '',
        createdAt: daysAgo(220),
        updatedAt: daysAgo(1),
      },
      {
        id: generateId('adm'),
        name: 'Ops Manager',
        email: 'ops@scoutme.app',
        password: 'Admin@123',
        role: 'user_ops_manager',
        status: 'active',
        avatar: '',
        createdAt: daysAgo(180),
        updatedAt: daysAgo(1),
      },
    ],
    athletes,
    recruiters,
    verificationQueue: [
      {
        id: generateId('ver'),
        profileId: athleteIds.a2,
        role: 'athlete',
        roleLabel: 'Athlete',
        fullName: 'Liam Carter',
        email: 'liam.carter@scoutme.app',
        sport: 'Basketball',
        status: 'pending',
        submittedDocuments: ['passport', 'highlight reel'],
        createdAt: daysAgo(2),
      },
      {
        id: generateId('ver'),
        profileId: athleteIds.a6,
        role: 'athlete',
        roleLabel: 'Athlete',
        fullName: 'Mia Torres',
        email: 'mia.torres@scoutme.app',
        sport: 'Swimming',
        status: 'pending',
        submittedDocuments: ['school id', 'performance certificate'],
        createdAt: daysAgo(1),
      },
      {
        id: generateId('ver'),
        profileId: recruiterIds.r4,
        role: 'recruiter',
        roleLabel: 'Recruiter',
        fullName: 'Zara Khan',
        email: 'zara.khan@fieldvision.pk',
        organization: 'Field Vision',
        status: 'pending',
        submittedDocuments: ['club authorization', 'national id'],
        createdAt: daysAgo(3),
      },
      {
        id: generateId('ver'),
        profileId: recruiterIds.r3,
        role: 'recruiter',
        roleLabel: 'Recruiter',
        fullName: 'Harper Smith',
        email: 'harper.smith@premiertalent.io',
        organization: 'Premier Talent',
        status: 'rejected',
        reviewNote: 'Document issue',
        createdAt: daysAgo(12),
        reviewedAt: daysAgo(9),
      },
    ],
    engagementCampaigns: [
      {
        id: generateId('eng'),
        name: 'Spring Showcase Recruiter Push',
        channel: 'email',
        status: 'active',
        audience: 'recruiters',
        impressions: 8200,
        clicks: 1280,
        conversions: 218,
        createdAt: daysAgo(14),
        updatedAt: daysAgo(1),
      },
      {
        id: generateId('eng'),
        name: 'Verified Athlete Retention',
        channel: 'push',
        status: 'scheduled',
        audience: 'verified_athletes',
        impressions: 5200,
        clicks: 910,
        conversions: 144,
        createdAt: daysAgo(9),
        updatedAt: daysAgo(2),
      },
      {
        id: generateId('eng'),
        name: 'Inactive Athlete Winback',
        channel: 'in_app',
        status: 'paused',
        audience: 'inactive_athletes',
        impressions: 2400,
        clicks: 320,
        conversions: 48,
        createdAt: daysAgo(21),
        updatedAt: daysAgo(6),
      },
    ],
    engagementLeaderboard: [
      { id: generateId('lead'), name: 'Ava Morgan', sport: 'Football', metric: 'profile_views', value: 1480 },
      { id: generateId('lead'), name: 'Noah Patel', sport: 'Cricket', metric: 'shortlists', value: 118 },
      { id: generateId('lead'), name: 'Liam Carter', sport: 'Basketball', metric: 'message_replies', value: 89 },
      { id: generateId('lead'), name: 'Ethan Brooks', sport: 'Track & Field', metric: 'profile_views', value: 705 },
    ],
    messages: [
      {
        id: generateId('msg'),
        threadTopic: 'Scholarship eligibility follow-up',
        lastSenderName: 'Emma Watts',
        participantsLabel: 'Emma Watts, Ava Morgan',
        channel: 'direct',
        messageCount: 14,
        status: 'active',
        isFlagged: false,
        createdAt: daysAgo(7),
        updatedAt: daysAgo(0, 4),
      },
      {
        id: generateId('msg'),
        threadTopic: 'Trial invitation details',
        lastSenderName: 'Oliver Chen',
        participantsLabel: 'Oliver Chen, Noah Patel',
        channel: 'direct',
        messageCount: 9,
        status: 'reviewed',
        isFlagged: false,
        createdAt: daysAgo(5),
        updatedAt: daysAgo(1, 3),
      },
      {
        id: generateId('msg'),
        threadTopic: 'Unverified media upload complaint',
        lastSenderName: 'System Monitor',
        participantsLabel: 'Sophia Reed, Support Team',
        channel: 'support',
        messageCount: 6,
        status: 'flagged',
        isFlagged: true,
        moderationNote: 'Needs moderation review',
        createdAt: daysAgo(3),
        updatedAt: daysAgo(0, 8),
      },
      {
        id: generateId('msg'),
        threadTopic: 'Bracelet pairing issue',
        lastSenderName: 'Mia Torres',
        participantsLabel: 'Mia Torres, Support Team',
        channel: 'support',
        messageCount: 4,
        status: 'active',
        isFlagged: false,
        createdAt: daysAgo(2),
        updatedAt: daysAgo(0, 10),
      },
    ],
    notifications: [
      {
        id: generateId('notify'),
        title: 'Complete your verification profile',
        body: 'Finish your verification steps to unlock recruiter visibility.',
        channel: 'push',
        status: 'scheduled',
        audience: 'pending_verification',
        scheduledFor: daysAhead(1),
        createdBy: 'Ops Manager',
        sentCount: 0,
        openRate: 0,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1),
      },
      {
        id: generateId('notify'),
        title: 'Elite plan includes NFC bracelet activation',
        body: 'Upgrade today to activate NFC-powered scouting events.',
        channel: 'email',
        status: 'sent',
        audience: 'free_users',
        scheduledFor: daysAgo(4),
        createdBy: 'Community Manager',
        sentCount: 2480,
        openRate: 38,
        createdAt: daysAgo(5),
        updatedAt: daysAgo(4),
      },
      {
        id: generateId('notify'),
        title: 'Live showcase this weekend',
        body: 'Recruiters are searching for new talent this weekend.',
        channel: 'in_app',
        status: 'draft',
        audience: 'athletes',
        scheduledFor: daysAhead(4),
        createdBy: 'Community Manager',
        sentCount: 0,
        openRate: 0,
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2),
      },
    ],
    subscriptionPlans: [
      {
        id: generateId('plan'),
        name: 'Starter',
        price: 19,
        billingPeriod: 'monthly',
        status: 'active',
        nfcIncluded: false,
        features: ['Profile boost', 'Advanced filters'],
        createdAt: daysAgo(120),
        updatedAt: daysAgo(10),
      },
      {
        id: generateId('plan'),
        name: 'Growth',
        price: 49,
        billingPeriod: 'monthly',
        status: 'active',
        nfcIncluded: true,
        features: ['Unlimited messages', 'Priority placement', 'NFC bracelet'],
        createdAt: daysAgo(110),
        updatedAt: daysAgo(8),
      },
      {
        id: generateId('plan'),
        name: 'Elite',
        price: 99,
        billingPeriod: 'monthly',
        status: 'active',
        nfcIncluded: true,
        features: ['Scout insights', 'Managed outreach', 'Premium NFC events'],
        createdAt: daysAgo(92),
        updatedAt: daysAgo(6),
      },
    ],
    activeSubscriptions: [
      {
        id: generateId('sub'),
        athleteId: athleteIds.a1,
        athleteName: 'Ava Morgan',
        planName: 'Elite',
        braceletSerial: 'NFC-44901',
        amount: 99,
        status: 'active',
        renewalDate: daysAhead(18),
        createdAt: daysAgo(44),
        updatedAt: daysAgo(1),
      },
      {
        id: generateId('sub'),
        athleteId: athleteIds.a3,
        athleteName: 'Noah Patel',
        planName: 'Growth',
        braceletSerial: 'NFC-44915',
        amount: 49,
        status: 'active',
        renewalDate: daysAhead(9),
        createdAt: daysAgo(60),
        updatedAt: daysAgo(3),
      },
      {
        id: generateId('sub'),
        athleteId: athleteIds.a5,
        athleteName: 'Ethan Brooks',
        planName: 'Starter',
        braceletSerial: '',
        amount: 19,
        status: 'paused',
        renewalDate: daysAhead(27),
        createdAt: daysAgo(18),
        updatedAt: daysAgo(2),
      },
      {
        id: generateId('sub'),
        athleteId: athleteIds.a2,
        athleteName: 'Liam Carter',
        planName: 'Growth',
        braceletSerial: 'NFC-44928',
        amount: 49,
        status: 'active',
        renewalDate: daysAhead(14),
        createdAt: daysAgo(22),
        updatedAt: daysAgo(2),
      },
    ],
    bracelets: [
      {
        id: generateId('brc'),
        serialNumber: 'NFC-44901',
        chipVersion: '2.1',
        status: 'assigned',
        assignedToId: athleteIds.a1,
        assignedToName: 'Ava Morgan',
        assignedAt: daysAgo(43),
        createdAt: daysAgo(100),
        updatedAt: daysAgo(2),
      },
      {
        id: generateId('brc'),
        serialNumber: 'NFC-44915',
        chipVersion: '2.1',
        status: 'assigned',
        assignedToId: athleteIds.a3,
        assignedToName: 'Noah Patel',
        assignedAt: daysAgo(58),
        createdAt: daysAgo(98),
        updatedAt: daysAgo(3),
      },
      {
        id: generateId('brc'),
        serialNumber: 'NFC-44928',
        chipVersion: '2.2',
        status: 'assigned',
        assignedToId: athleteIds.a2,
        assignedToName: 'Liam Carter',
        assignedAt: daysAgo(21),
        createdAt: daysAgo(82),
        updatedAt: daysAgo(2),
      },
      {
        id: generateId('brc'),
        serialNumber: 'NFC-45004',
        chipVersion: '2.2',
        status: 'available',
        assignedToId: null,
        assignedToName: '',
        createdAt: daysAgo(44),
        updatedAt: daysAgo(1),
      },
      {
        id: generateId('brc'),
        serialNumber: 'NFC-45018',
        chipVersion: '2.2',
        status: 'inactive',
        assignedToId: null,
        assignedToName: '',
        createdAt: daysAgo(35),
        updatedAt: daysAgo(7),
      },
    ],
    scans: [
      {
        id: generateId('scan'),
        serialNumber: 'NFC-44901',
        athleteName: 'Ava Morgan',
        venue: 'Austin Regional Showcase',
        outcome: 'success',
        reviewStatus: 'reviewed',
        scannedAt: daysAgo(1),
        createdAt: daysAgo(1),
      },
      {
        id: generateId('scan'),
        serialNumber: 'NFC-44915',
        athleteName: 'Noah Patel',
        venue: 'Lahore Talent Trials',
        outcome: 'success',
        reviewStatus: 'reviewed',
        scannedAt: daysAgo(2),
        createdAt: daysAgo(2),
      },
      {
        id: generateId('scan'),
        serialNumber: 'NFC-45018',
        athleteName: 'Unknown',
        venue: 'Test Gate',
        outcome: 'failed',
        reviewStatus: 'pending',
        scannedAt: daysAgo(3),
        createdAt: daysAgo(3),
      },
      {
        id: generateId('scan'),
        serialNumber: 'NFC-44928',
        athleteName: 'Liam Carter',
        venue: 'Chicago Preseason Camp',
        outcome: 'duplicate',
        reviewStatus: 'pending',
        scannedAt: daysAgo(1, 12),
        createdAt: daysAgo(1, 12),
      },
      {
        id: generateId('scan'),
        serialNumber: 'NFC-45004',
        athleteName: 'Unassigned',
        venue: 'Admin Desk',
        outcome: 'success',
        reviewStatus: 'pending',
        scannedAt: daysAgo(5),
        createdAt: daysAgo(5),
      },
    ],
    taxonomy: {
      sports: [
        { id: generateId('sport'), label: 'Football', slug: 'football', status: 'active', sortOrder: 1, createdAt: daysAgo(200), updatedAt: daysAgo(5) },
        { id: generateId('sport'), label: 'Basketball', slug: 'basketball', status: 'active', sortOrder: 2, createdAt: daysAgo(200), updatedAt: daysAgo(5) },
        { id: generateId('sport'), label: 'Cricket', slug: 'cricket', status: 'active', sortOrder: 3, createdAt: daysAgo(200), updatedAt: daysAgo(5) },
      ],
      positions: [
        { id: generateId('pos'), label: 'Forward', slug: 'forward', status: 'active', sortOrder: 1, createdAt: daysAgo(200), updatedAt: daysAgo(5) },
        { id: generateId('pos'), label: 'Guard', slug: 'guard', status: 'active', sortOrder: 2, createdAt: daysAgo(200), updatedAt: daysAgo(5) },
        { id: generateId('pos'), label: 'All-rounder', slug: 'all-rounder', status: 'active', sortOrder: 3, createdAt: daysAgo(200), updatedAt: daysAgo(5) },
      ],
      goals: [
        { id: generateId('goal'), label: 'College scholarship', slug: 'college-scholarship', status: 'active', sortOrder: 1, createdAt: daysAgo(200), updatedAt: daysAgo(5) },
        { id: generateId('goal'), label: 'Professional contract', slug: 'professional-contract', status: 'active', sortOrder: 2, createdAt: daysAgo(200), updatedAt: daysAgo(5) },
        { id: generateId('goal'), label: 'International exposure', slug: 'international-exposure', status: 'active', sortOrder: 3, createdAt: daysAgo(200), updatedAt: daysAgo(5) },
      ],
    },
  };
};

export const getDb = () => {
  const raw = hasStorage() ? window.localStorage.getItem(STORAGE_KEY) : memoryStorage;

  if (!raw) {
    const seed = createInitialDb();
    if (hasStorage()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    } else {
      memoryStorage = JSON.stringify(seed);
    }
    return deepClone(seed);
  }

  return JSON.parse(raw);
};

export const saveDb = (db) => {
  const serialized = JSON.stringify(db);

  if (hasStorage()) {
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } else {
    memoryStorage = serialized;
  }

  return db;
};

export const resetDb = () => {
  const nextDb = createInitialDb();
  saveDb(nextDb);
  return deepClone(nextDb);
};

export const getCollection = (key) => deepClone(getDb()[key] || []);
export const setCollection = (key, collection) => {
  const db = getDb();
  db[key] = collection;
  saveDb(db);
  return deepClone(collection);
};

export default {
  STORAGE_KEY,
  deepClone,
  generateId,
  getDb,
  saveDb,
  resetDb,
  getCollection,
  setCollection,
};
