import { useEffect, useMemo, useState } from 'react';
import {
  FiActivity,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';
import DiscoveryActivityChart from '../../components/dashboard/DiscoveryActivityChart';
import PlatformGrowthChart from '../../components/dashboard/PlatformGrowthChart';
import PremiumConversionChart from '../../components/dashboard/PremiumConversionChart';
import UserRoleDistributionChart from '../../components/dashboard/UserRoleDistributionChart';

const ranges = ['7 days', '30 days', '90 days', '12 months'];

const dashboardDataByRange = {
  '7 days': {
    stats: {
      activeAthletes: 12364,
      recruiterSignIns: 916,
      discoveryInteractions: 42108,
      platformHealthScore: 97,
    },
    growthData: [
      { label: 'Mon', athletes: 118, recruiters: 24, matches: 62 },
      { label: 'Tue', athletes: 126, recruiters: 28, matches: 71 },
      { label: 'Wed', athletes: 134, recruiters: 31, matches: 78 },
      { label: 'Thu', athletes: 141, recruiters: 33, matches: 84 },
      { label: 'Fri', athletes: 149, recruiters: 35, matches: 93 },
      { label: 'Sat', athletes: 158, recruiters: 38, matches: 104 },
      { label: 'Sun', athletes: 166, recruiters: 41, matches: 111 },
    ],
    roleDistribution: [
      { name: 'Athletes', value: 63, color: '#0f172a' },
      { name: 'Recruiters', value: 22, color: '#2563eb' },
      { name: 'Coaches', value: 9, color: '#10b981' },
      { name: 'Parents', value: 6, color: '#f59e0b' },
    ],
    discoveryActivity: [
      { label: 'Views', total: 1480 },
      { label: 'Saves', total: 880 },
      { label: 'Shares', total: 462 },
      { label: 'Connects', total: 314 },
      { label: 'Shortlists', total: 204 },
    ],
    premiumConversion: [
      { label: 'Mon', free: 88, premium: 12 },
      { label: 'Tue', free: 83, premium: 17 },
      { label: 'Wed', free: 81, premium: 19 },
      { label: 'Thu', free: 79, premium: 21 },
      { label: 'Fri', free: 76, premium: 24 },
    ],
    recentActivity: [
      {
        actor: 'Olivia Chen',
        action: 'Athlete verification approved',
        target: 'Profile #ATH-1142',
        timestamp: '14 minutes ago',
        status: 'completed',
      },
      {
        actor: 'System',
        action: 'Premium reminder campaign queued',
        target: 'Segment #PRM-07D',
        timestamp: '31 minutes ago',
        status: 'sent',
      },
      {
        actor: 'Support Queue',
        action: 'Chat report escalated',
        target: 'Conversation #MSG-902',
        timestamp: '44 minutes ago',
        status: 'attention',
      },
      {
        actor: 'Billing',
        action: 'Subscription payment recovered',
        target: 'Subscription #SUB-903',
        timestamp: '58 minutes ago',
        status: 'updated',
      },
    ],
  },
  '30 days': {
    stats: {
      activeAthletes: 12486,
      recruiterSignIns: 3487,
      discoveryInteractions: 182203,
      platformHealthScore: 96,
    },
    growthData: [
      { label: 'Jan', athletes: 1200, recruiters: 180, matches: 640 },
      { label: 'Feb', athletes: 1490, recruiters: 220, matches: 730 },
      { label: 'Mar', athletes: 1730, recruiters: 265, matches: 845 },
      { label: 'Apr', athletes: 2010, recruiters: 304, matches: 930 },
      { label: 'May', athletes: 2280, recruiters: 346, matches: 1085 },
      { label: 'Jun', athletes: 2490, recruiters: 382, matches: 1204 },
    ],
    roleDistribution: [
      { name: 'Athletes', value: 64, color: '#0f172a' },
      { name: 'Recruiters', value: 21, color: '#2563eb' },
      { name: 'Coaches', value: 9, color: '#10b981' },
      { name: 'Parents', value: 6, color: '#f59e0b' },
    ],
    discoveryActivity: [
      { label: 'Views', total: 4820 },
      { label: 'Saves', total: 2860 },
      { label: 'Shares', total: 1430 },
      { label: 'Connects', total: 920 },
      { label: 'Shortlists', total: 610 },
    ],
    premiumConversion: [
      { label: 'Week 1', free: 84, premium: 16 },
      { label: 'Week 2', free: 76, premium: 24 },
      { label: 'Week 3', free: 71, premium: 29 },
      { label: 'Week 4', free: 68, premium: 32 },
      { label: 'Week 5', free: 65, premium: 35 },
    ],
    recentActivity: [
      {
        actor: 'Olivia Chen',
        action: 'Athlete verification approved',
        target: 'Profile #ATH-1142',
        timestamp: '2 minutes ago',
        status: 'completed',
      },
      {
        actor: 'System',
        action: 'Bulk push campaign sent',
        target: 'Spring recruiters outreach',
        timestamp: '11 minutes ago',
        status: 'sent',
      },
      {
        actor: 'Jamal Hart',
        action: 'NFC bracelet replaced',
        target: 'Bracelet #NFC-843',
        timestamp: '36 minutes ago',
        status: 'updated',
      },
      {
        actor: 'Support Queue',
        action: 'Chat report escalated',
        target: 'Conversation #MSG-902',
        timestamp: '52 minutes ago',
        status: 'attention',
      },
      {
        actor: 'Billing',
        action: 'Premium renewal failed',
        target: 'Subscription #SUB-213',
        timestamp: '1 hour ago',
        status: 'failed',
      },
    ],
  },
  '90 days': {
    stats: {
      activeAthletes: 12798,
      recruiterSignIns: 9324,
      discoveryInteractions: 506840,
      platformHealthScore: 95,
    },
    growthData: [
      { label: 'Jan', athletes: 3200, recruiters: 480, matches: 1640 },
      { label: 'Feb', athletes: 3660, recruiters: 540, matches: 1870 },
      { label: 'Mar', athletes: 4080, recruiters: 612, matches: 2115 },
      { label: 'Apr', athletes: 4520, recruiters: 684, matches: 2360 },
      { label: 'May', athletes: 5010, recruiters: 752, matches: 2610 },
      { label: 'Jun', athletes: 5520, recruiters: 824, matches: 2938 },
    ],
    roleDistribution: [
      { name: 'Athletes', value: 65, color: '#0f172a' },
      { name: 'Recruiters', value: 20, color: '#2563eb' },
      { name: 'Coaches', value: 9, color: '#10b981' },
      { name: 'Parents', value: 6, color: '#f59e0b' },
    ],
    discoveryActivity: [
      { label: 'Views', total: 13940 },
      { label: 'Saves', total: 8210 },
      { label: 'Shares', total: 4010 },
      { label: 'Connects', total: 2720 },
      { label: 'Shortlists', total: 1930 },
    ],
    premiumConversion: [
      { label: 'Month 1', free: 82, premium: 18 },
      { label: 'Month 2', free: 75, premium: 25 },
      { label: 'Month 3', free: 69, premium: 31 },
      { label: 'Month 4', free: 63, premium: 37 },
      { label: 'Month 5', free: 59, premium: 41 },
    ],
    recentActivity: [
      {
        actor: 'Growth Ops',
        action: 'Campaign segment refreshed',
        target: 'Segment #DISC-884',
        timestamp: 'Today',
        status: 'updated',
      },
      {
        actor: 'System',
        action: 'Discovery scoring re-run completed',
        target: 'Pipeline quality model',
        timestamp: 'Today',
        status: 'completed',
      },
      {
        actor: 'Support Queue',
        action: 'Harassment case escalated',
        target: 'Conversation #MSG-1190',
        timestamp: 'Yesterday',
        status: 'attention',
      },
      {
        actor: 'Billing',
        action: 'Renewal recovery failed',
        target: 'Subscription #SUB-778',
        timestamp: '2 days ago',
        status: 'failed',
      },
    ],
  },
  '12 months': {
    stats: {
      activeAthletes: 13842,
      recruiterSignIns: 38126,
      discoveryInteractions: 2136020,
      platformHealthScore: 94,
    },
    growthData: [
      { label: 'Q1', athletes: 9200, recruiters: 1380, matches: 4420 },
      { label: 'Q2', athletes: 10840, recruiters: 1640, matches: 5280 },
      { label: 'Q3', athletes: 12410, recruiters: 1930, matches: 6160 },
      { label: 'Q4', athletes: 14180, recruiters: 2280, matches: 7340 },
    ],
    roleDistribution: [
      { name: 'Athletes', value: 66, color: '#0f172a' },
      { name: 'Recruiters', value: 19, color: '#2563eb' },
      { name: 'Coaches', value: 9, color: '#10b981' },
      { name: 'Parents', value: 6, color: '#f59e0b' },
    ],
    discoveryActivity: [
      { label: 'Views', total: 58120 },
      { label: 'Saves', total: 34180 },
      { label: 'Shares', total: 16440 },
      { label: 'Connects', total: 10910 },
      { label: 'Shortlists', total: 7760 },
    ],
    premiumConversion: [
      { label: 'Q1', free: 86, premium: 14 },
      { label: 'Q2', free: 78, premium: 22 },
      { label: 'Q3', free: 69, premium: 31 },
      { label: 'Q4', free: 58, premium: 42 },
    ],
    recentActivity: [
      {
        actor: 'System',
        action: 'Yearly reporting archive generated',
        target: 'Operations workbook FY-26',
        timestamp: 'Today',
        status: 'completed',
      },
      {
        actor: 'Growth Ops',
        action: 'Benchmark cohort refreshed',
        target: 'Conversion baseline set',
        timestamp: 'This week',
        status: 'updated',
      },
      {
        actor: 'Trust Team',
        action: 'Moderation SLA breached',
        target: 'Queue #MOD-411',
        timestamp: 'This week',
        status: 'attention',
      },
      {
        actor: 'Billing',
        action: 'Annual plan downgrade spike detected',
        target: 'Cohort #BILL-77',
        timestamp: 'Last week',
        status: 'failed',
      },
    ],
  },
};

const cardClass =
  'rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]';

const formatTime = (value) =>
  value.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

const AnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame;
    const duration = 800;
    const start = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      setDisplay(Math.floor(value * progress));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
};

const MetricCard = ({ title, value, hint, icon: Icon, accent }) => {
  return (
    <div className={`${cardClass} overflow-hidden`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight text-slate-950">
            <AnimatedNumber value={value} />
          </h3>
          <p className="text-sm text-slate-500">{hint}</p>
        </div>
        <div className={`rounded-2xl ${accent} p-3 text-xl text-white shadow-lg`}>
          <Icon />
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, actions }) => (
  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
    <div className="space-y-1">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
    {actions}
  </div>
);

const DashboardPage = () => {
  const [activeRange, setActiveRange] = useState('30 days');
  const [refreshTick, setRefreshTick] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [flashMessage, setFlashMessage] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState(() => new Date());
  const [activityQuery, setActivityQuery] = useState('');

  useEffect(() => {
    if (!flashMessage) return undefined;

    const timeout = window.setTimeout(() => setFlashMessage(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [flashMessage]);

  const refreshMultiplier = useMemo(() => {
    const cycle = refreshTick % 4;
    return [1, 1.008, 0.996, 1.014][cycle];
  }, [refreshTick]);

  const currentData = useMemo(() => {
    const base = dashboardDataByRange[activeRange] || dashboardDataByRange['30 days'];

    return {
      stats: {
        activeAthletes: Math.round(base.stats.activeAthletes * refreshMultiplier),
        recruiterSignIns: Math.round(base.stats.recruiterSignIns * refreshMultiplier),
        discoveryInteractions: Math.round(base.stats.discoveryInteractions * refreshMultiplier),
        platformHealthScore: Math.max(90, Math.round(base.stats.platformHealthScore * refreshMultiplier)),
      },
      growthData: base.growthData.map((item) => ({
        ...item,
        athletes: Math.round(item.athletes * refreshMultiplier),
        recruiters: Math.round(item.recruiters * refreshMultiplier),
        matches: Math.round(item.matches * refreshMultiplier),
      })),
      roleDistribution: base.roleDistribution,
      discoveryActivity: base.discoveryActivity.map((item) => ({
        ...item,
        total: Math.round(item.total * refreshMultiplier),
      })),
      premiumConversion: base.premiumConversion,
      recentActivity: base.recentActivity,
    };
  }, [activeRange, refreshMultiplier]);

  const stats = useMemo(
    () => [
      {
        title: 'Active athletes',
        value: currentData.stats.activeAthletes,
        hint: '+8.4% vs previous period',
        icon: FiUsers,
        accent: 'bg-slate-900',
      },
      {
        title: 'Recruiter sign-ins',
        value: currentData.stats.recruiterSignIns,
        hint: 'Verified recruiter activity in the selected range',
        icon: FiShield,
        accent: 'bg-blue-600',
      },
      {
        title: 'Discovery interactions',
        value: currentData.stats.discoveryInteractions,
        hint: 'Views, saves, follows, and connection actions',
        icon: FiTrendingUp,
        accent: 'bg-emerald-600',
      },
      {
        title: 'Platform health score',
        value: currentData.stats.platformHealthScore,
        hint: 'Delivery, uptime, moderation, and billing health',
        icon: FiActivity,
        accent: 'bg-amber-500',
      },
    ],
    [currentData.stats],
  );

  const filteredActivity = useMemo(() => {
    const normalizedQuery = activityQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return currentData.recentActivity;
    }

    return currentData.recentActivity.filter((item) =>
      [item.actor, item.action, item.target, item.timestamp, item.status].join(' ').toLowerCase().includes(normalizedQuery),
    );
  }, [activityQuery, currentData.recentActivity]);

  const handleRefresh = () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    window.setTimeout(() => {
      setRefreshTick((current) => current + 1);
      setLastSyncedAt(new Date());
      setFlashMessage(`Dashboard refreshed for ${activeRange.toLowerCase()}.`);
      setIsRefreshing(false);
    }, 500);
  };

  const handleExportReport = () => {
    const lines = [
      ['Dashboard Report'],
      [`Range,${activeRange}`],
      [`Exported At,${new Date().toISOString()}`],
      [''],
      ['Metric,Value'],
      ...stats.map((item) => [`${item.title},${item.value}`]),
      [''],
      ['Recent Activity'],
      ['Actor,Action,Target,Time,Status'],
      ...currentData.recentActivity.map((item) => [
        `${item.actor},${item.action},${item.target},${item.timestamp},${item.status}`,
      ]),
    ]
      .map((row) => row.join(''))
      .join('\n');

    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `dashboard-report-${activeRange.replace(/\s+/g, '-').toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setFlashMessage(`Report exported for ${activeRange.toLowerCase()}.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="grid gap-5 rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.06)] xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <div className="min-w-0 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              <FiCalendar />
              {activeRange}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">Dashboard overview</h1>
              <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600 sm:text-base">
                Monitor recruitment activity, athlete engagement, premium conversion, and operational health from a
                single responsive command center.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span>Last synced at {formatTime(lastSyncedAt)}</span>
              {flashMessage ? (
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                  {flashMessage}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:items-end">
            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
                {ranges.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setActiveRange(range)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                      activeRange === range ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isRefreshing}
              >
                <FiRefreshCw className={isRefreshing ? 'animate-spin' : ''} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleExportReport}
              className="inline-flex items-center gap-2 self-start rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] xl:self-end"
            >
              <FiDownload />
              Export report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <MetricCard key={item.title} {...item} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_1fr]">
          <PlatformGrowthChart
            data={currentData.growthData}
            subtitle={`Athlete and recruiter acquisition with total match acceleration for the last ${activeRange.toLowerCase()}.`}
          />

          <UserRoleDistributionChart data={currentData.roleDistribution} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <DiscoveryActivityChart
            data={currentData.discoveryActivity}
            subtitle={`High-intent engagement signals across profile browsing surfaces in the last ${activeRange.toLowerCase()}.`}
          />

          <PremiumConversionChart
            data={currentData.premiumConversion}
            subtitle={`Free-to-premium progression for the selected ${activeRange.toLowerCase()} window.`}
          />
        </div>

        <section className={cardClass}>
          <SectionHeader
            title="Recent activity"
            subtitle="Operational events that need visibility across growth, support, moderation, and billing."
            actions={
              <div className="relative w-full sm:w-[280px]">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={activityQuery}
                  onChange={(event) => setActivityQuery(event.target.value)}
                  placeholder="Search activity"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
                />
              </div>
            }
          />

          <div className="overflow-hidden rounded-[22px] border border-slate-200">
            <div className="overflow-x-auto">
              <div className="md:min-w-[980px]">
                <div className="hidden grid-cols-[1.1fr_1.5fr_1.1fr_0.9fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:grid">
                  <span>Actor</span>
                  <span>Action</span>
                  <span>Target</span>
                  <span>Time</span>
                  <span>Status</span>
                </div>

                <div className="divide-y divide-slate-200">
                  {filteredActivity.length ? (
                    filteredActivity.map((item) => (
                      <div key={`${item.actor}-${item.target}`} className="grid gap-3 px-5 py-4 md:grid-cols-[1.1fr_1.5fr_1.1fr_0.9fr_0.8fr] md:items-center">
                        <div>
                          <p className="font-semibold text-slate-900">{item.actor}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400 md:hidden">Actor</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-700">{item.action}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400 md:hidden">Action</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-700">{item.target}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400 md:hidden">Target</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">{item.timestamp}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400 md:hidden">Time</p>
                        </div>
                        <div>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                              item.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-700'
                                : item.status === 'sent'
                                  ? 'bg-blue-100 text-blue-700'
                                  : item.status === 'updated'
                                    ? 'bg-violet-100 text-violet-700'
                                    : item.status === 'attention'
                                      ? 'bg-amber-100 text-amber-700'
                                      : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-10 text-center text-sm text-slate-500">
                      No activity items matched the current search.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
