import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import { FiCheck, FiChevronDown, FiCompass, FiEye, FiFilter, FiSearch, FiStar, FiTrendingUp } from 'react-icons/fi';
import DiscoveryTrendChart from '../../components/discoveryEngagement/discovery/DiscoveryTrendChart';
import SurfacePerformanceChart from '../../components/discoveryEngagement/discovery/SurfacePerformanceChart';
import Pagination from '../../components/shared/Pagination';

const engagementTrendByRange = {
  '7 days': [
    { label: 'Mon', profileViews: 2480, saves: 560, follows: 180 },
    { label: 'Tue', profileViews: 2860, saves: 620, follows: 210 },
    { label: 'Wed', profileViews: 3040, saves: 700, follows: 240 },
    { label: 'Thu', profileViews: 3180, saves: 760, follows: 250 },
    { label: 'Fri', profileViews: 3380, saves: 820, follows: 290 },
    { label: 'Sat', profileViews: 3710, saves: 930, follows: 340 },
    { label: 'Sun', profileViews: 4190, saves: 1030, follows: 380 },
  ],
  '30 days': [
    { label: 'Week 1', profileViews: 16480, saves: 3720, follows: 1280 },
    { label: 'Week 2', profileViews: 18240, saves: 4280, follows: 1490 },
    { label: 'Week 3', profileViews: 19360, saves: 4520, follows: 1620 },
    { label: 'Week 4', profileViews: 21040, saves: 4960, follows: 1830 },
    { label: 'Week 5', profileViews: 23300, saves: 5660, follows: 2200 },
  ],
  '90 days': [
    { label: 'W1-2', profileViews: 37240, saves: 8420, follows: 3020 },
    { label: 'W3-4', profileViews: 41120, saves: 9360, follows: 3340 },
    { label: 'W5-6', profileViews: 44360, saves: 10140, follows: 3650 },
    { label: 'W7-8', profileViews: 47080, saves: 11180, follows: 3910 },
    { label: 'W9-10', profileViews: 50610, saves: 12120, follows: 4490 },
    { label: 'W11-12', profileViews: 54170, saves: 13300, follows: 5070 },
  ],
  '12 months': [
    { label: 'Jan', profileViews: 64820, saves: 15420, follows: 5240 },
    { label: 'Feb', profileViews: 69240, saves: 16380, follows: 5480 },
    { label: 'Mar', profileViews: 73610, saves: 17140, follows: 5860 },
    { label: 'Apr', profileViews: 76980, saves: 18360, follows: 6230 },
    { label: 'May', profileViews: 81440, saves: 19420, follows: 6640 },
    { label: 'Jun', profileViews: 85820, saves: 20180, follows: 7010 },
    { label: 'Jul', profileViews: 89260, saves: 20860, follows: 7380 },
    { label: 'Aug', profileViews: 92540, saves: 21490, follows: 7680 },
    { label: 'Sep', profileViews: 94710, saves: 21980, follows: 8020 },
    { label: 'Oct', profileViews: 97280, saves: 22520, follows: 8360 },
    { label: 'Nov', profileViews: 100560, saves: 23650, follows: 9240 },
    { label: 'Dec', profileViews: 116550, saves: 25060, follows: 11980 },
  ],
};

const channelPerformance = [
  { label: 'Recommended', total: 12840 },
  { label: 'Search', total: 8640 },
  { label: 'Shortlists', total: 5120 },
  { label: 'Campus feed', total: 3760 },
  { label: 'Direct links', total: 1920 },
];

const hotspotProfiles = [
  { name: 'Ava Brooks', role: 'Athlete', signal: 'Search visibility spike', score: 94, trend: '+18%' },
  { name: 'Emma Carter', role: 'Recruiter', signal: 'High outbound profile opens', score: 89, trend: '+11%' },
  { name: 'Mason Patel', role: 'Athlete', signal: 'Saved by recruiters', score: 83, trend: '+8%' },
  { name: 'Valley State', role: 'Program', signal: 'Shortlist conversion growth', score: 78, trend: '+6%' },
];

const engagementEvents = [
  {
    id: 'ENG-301',
    actor: 'Recruiter search',
    detail: 'Filters applied: Position = WR, GPA > 3.2, Region = South',
    result: '42 athlete profiles opened',
    status: 'high intent',
  },
  {
    id: 'ENG-302',
    actor: 'Featured athlete card',
    detail: 'Homepage recommendation slot #2',
    result: '18 profile saves',
    status: 'top performer',
  },
  {
    id: 'ENG-303',
    actor: 'Campus showcase',
    detail: 'Spring college weekend collection',
    result: '9 new follow actions',
    status: 'growing',
  },
  {
    id: 'ENG-304',
    actor: 'Search drop-off',
    detail: 'Profile completion under 65% on filtered results',
    result: 'Conversion below baseline',
    status: 'needs attention',
  },
];

const cardClass =
  'rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]';

const rangeOptions = ['7 days', '30 days', '90 days', '12 months'];

const surfaceRangeScales = {
  '7 days': 0.35,
  '30 days': 1,
  '90 days': 2.8,
  '12 months': 10.6,
};

const rangeDiscoveryScores = {
  '7 days': 84,
  '30 days': 87,
  '90 days': 89,
  '12 months': 92,
};

const defaultEngagementEventsPageSize = 2;

const summaryCards = [
  {
    key: 'profileViews',
    title: 'Profile views',
    icon: FiEye,
    accent: 'bg-slate-900',
    hint: 'All discovery surfaces combined.',
  },
  {
    key: 'savedProfiles',
    title: 'Saved profiles',
    icon: FiStar,
    accent: 'bg-blue-600',
    hint: 'Strong intent from recruiters and athletes.',
  },
  {
    key: 'connectionActions',
    title: 'Connection actions',
    icon: FiTrendingUp,
    accent: 'bg-emerald-600',
    hint: 'Connect, shortlist, and follow events.',
  },
  {
    key: 'discoveryScore',
    title: 'Discovery score',
    icon: FiCompass,
    accent: 'bg-violet-600',
    hint: 'Weighted conversion quality index.',
  },
];

const useCountUp = (target) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    const duration = 850;
    const start = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      setValue(Math.floor(target * progress));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
};

const SummaryCard = ({ title, value, icon, accent, hint }) => {
  const animatedValue = useCountUp(value);

  return (
    <div className={cardClass}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{animatedValue.toLocaleString()}</h3>
          <p className="mt-2 text-sm text-slate-500">{hint}</p>
        </div>
        <div className={`rounded-2xl ${accent} p-3 text-xl text-white`}>
          {createElement(icon)}
        </div>
      </div>
    </div>
  );
};

const DiscoveryEngagementPage = () => {
  const [query, setQuery] = useState('');
  const [range, setRange] = useState('30 days');
  const [rangeMenuOpen, setRangeMenuOpen] = useState(false);
  const [currentEventsPage, setCurrentEventsPage] = useState(1);
  const eventsPageSize = defaultEngagementEventsPageSize;
  const rangeMenuRef = useRef(null);

  useEffect(() => {
    if (!rangeMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!rangeMenuRef.current?.contains(event.target)) {
        setRangeMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setRangeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [rangeMenuOpen]);

  const normalizedQuery = query.trim().toLowerCase();
  const selectedTrendData = engagementTrendByRange[range] || engagementTrendByRange['30 days'];
  const selectedMetrics = useMemo(() => {
    const totals = selectedTrendData.reduce(
      (summary, point) => ({
        profileViews: summary.profileViews + point.profileViews,
        savedProfiles: summary.savedProfiles + point.saves,
        connectionActions: summary.connectionActions + point.follows,
      }),
      { profileViews: 0, savedProfiles: 0, connectionActions: 0 },
    );

    return {
      ...totals,
      discoveryScore: rangeDiscoveryScores[range] || rangeDiscoveryScores['30 days'],
    };
  }, [range, selectedTrendData]);
  const rangeScale = surfaceRangeScales[range] || 1;

  const filteredChannelPerformance = useMemo(
    () =>
      channelPerformance
        .map((item) => ({
          ...item,
          total: Math.round(item.total * rangeScale),
        }))
        .filter((item) => !normalizedQuery || item.label.toLowerCase().includes(normalizedQuery)),
    [normalizedQuery, rangeScale],
  );

  const filteredHotspotProfiles = useMemo(
    () =>
      hotspotProfiles.filter((item) =>
        [item.name, item.role, item.signal, item.trend].join(' ').toLowerCase().includes(normalizedQuery),
      ),
    [normalizedQuery],
  );

  const filteredEngagementEvents = useMemo(
    () =>
      engagementEvents.filter((event) =>
        [event.id, event.actor, event.detail, event.result, event.status].join(' ').toLowerCase().includes(normalizedQuery),
      ),
    [normalizedQuery],
  );
  const totalEventsPages = Math.max(1, Math.ceil(filteredEngagementEvents.length / eventsPageSize));
  const paginatedEngagementEvents = useMemo(() => {
    const startIndex = (currentEventsPage - 1) * eventsPageSize;
    return filteredEngagementEvents.slice(startIndex, startIndex + eventsPageSize);
  }, [currentEventsPage, eventsPageSize, filteredEngagementEvents]);

  const totalMatches =
    filteredChannelPerformance.length + filteredHotspotProfiles.length + filteredEngagementEvents.length;

  useEffect(() => {
    if (currentEventsPage > totalEventsPages) {
      setCurrentEventsPage(totalEventsPages);
    }
  }, [currentEventsPage, totalEventsPages]);

  useEffect(() => {
    setCurrentEventsPage(1);
  }, [normalizedQuery]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-full space-y-5 2xl:space-y-6">
        <div className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                <FiCompass />
                Discovery & engagement
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Monitor discovery quality and conversion signals</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                Follow how recruiters and athletes find each other, which surfaces drive meaningful actions, and where
                discovery performance needs tuning.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-[300px]">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="text"
                  placeholder="Search surfaces,profiles"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
                />
              </div>
              <div className="relative" ref={rangeMenuRef}>
                <button
                  type="button"
                  onClick={() => setRangeMenuOpen((current) => !current)}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-white"
                  aria-haspopup="menu"
                  aria-expanded={rangeMenuOpen}
                >
                  <FiFilter />
                  <span>{range}</span>
                  <FiChevronDown className={`transition ${rangeMenuOpen ? 'rotate-180' : ''}`} size={16} />
                </button>

                {rangeMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+10px)] z-20 min-w-[180px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                    {rangeOptions.map((option) => {
                      const isSelected = option === range;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setRange(option);
                            setRangeMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                            isSelected ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{option}</span>
                          <span className={isSelected ? 'text-white' : 'text-transparent'}>
                            <FiCheck size={16} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {normalizedQuery ? (
          <div className="rounded-[20px] border border-violet-200 bg-violet-50/70 px-4 py-3 text-sm text-violet-700">
            Showing {totalMatches} matching discovery signals for "{query.trim()}" in the selected {range.toLowerCase()} window.
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard
              key={card.key}
              title={card.title}
              value={selectedMetrics[card.key]}
              icon={card.icon}
              accent={card.accent}
              hint={card.hint}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-2 2xl:gap-6">
          <DiscoveryTrendChart
            data={selectedTrendData}
            subtitle={`Profile views, saves, and follow behavior over the selected ${range.toLowerCase()} window.`}
          />

          {filteredChannelPerformance.length ? (
            <SurfacePerformanceChart
              data={filteredChannelPerformance}
              subtitle={`Which channels generate the most discovery traffic in the selected ${range.toLowerCase()} range.`}
            />
          ) : (
            <section className={cardClass}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-950">Surface performance</h2>
                <p className="mt-1 text-sm text-slate-500">Which channels generate the most discovery traffic in the selected range.</p>
              </div>
              <div className="grid h-[280px] place-items-center rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-6 text-center 2xl:h-[320px]">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">No surfaces matched this search</p>
                    <p className="mt-1 text-sm text-slate-500">Try a broader term to see channel performance again.</p>
                  </div>
              </div>
            </section>
          )}
        </div>

        <div className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-[1fr_1.15fr] 2xl:gap-6">
          <section className={cardClass}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-950">Hotspot profiles</h2>
              <p className="mt-1 text-sm text-slate-500">Accounts showing unusually strong discovery momentum.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-2">
              {filteredHotspotProfiles.length ? (
                filteredHotspotProfiles.map((item) => (
                  <article key={item.name} className="flex h-full flex-col rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-950">{item.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.role}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {item.trend}
                      </span>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-600">{item.signal}</p>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Opportunity score {item.score}%
                        </p>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-white">
                        <div className="h-2.5 rounded-full bg-slate-900" style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center md:col-span-2">
                  <p className="text-base font-semibold text-slate-900">No hotspot profiles matched</p>
                  <p className="mt-2 text-sm text-slate-500">Clear the search to review the full momentum list again.</p>
                </div>
              )}
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-950">Recent engagement events</h2>
              <p className="mt-1 text-sm text-slate-500">Signals to review when tuning search, ranking, and recommendation logic.</p>
            </div>
            <div className="overflow-hidden rounded-[22px] border border-slate-200">
              <div className="overflow-x-auto">
                <div className="md:min-w-[920px]">
                  <div className="hidden grid-cols-[1fr_1.4fr_1.1fr_0.9fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:grid">
                    <span>Source</span>
                    <span>Detail</span>
                    <span>Outcome</span>
                    <span>Status</span>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {filteredEngagementEvents.length ? (
                      paginatedEngagementEvents.map((event) => (
                        <div key={event.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_1.4fr_1.1fr_0.9fr] md:items-center">
                          <div>
                            <p className="font-semibold text-slate-900">{event.actor}</p>
                            <p className="text-sm text-slate-500">{event.id}</p>
                          </div>
                          <p className="text-sm text-slate-700">{event.detail}</p>
                          <p className="text-sm text-slate-700">{event.result}</p>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                              event.status === 'high intent'
                                ? 'bg-emerald-100 text-emerald-700'
                                : event.status === 'top performer'
                                  ? 'bg-blue-100 text-blue-700'
                                  : event.status === 'growing'
                                    ? 'bg-violet-100 text-violet-700'
                                    : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-10 text-center text-sm text-slate-500">
                        No engagement events matched the current search.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {filteredEngagementEvents.length ? (
              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="flex justify-end">
                  <Pagination page={currentEventsPage} totalPages={totalEventsPages} onPageChange={setCurrentEventsPage} />
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryEngagementPage;
