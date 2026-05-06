import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import { FiCheck, FiCheckCircle, FiChevronDown, FiFilter, FiSearch, FiShield, FiUserCheck, FiUsers } from 'react-icons/fi';
import Pagination from '../../components/shared/Pagination';
import ApproveVerificationModal from '../../components/usersProfiles/verification/ApproveVerificationModal';
import RequestVerificationInfoModal from '../../components/usersProfiles/verification/RequestVerificationInfoModal';
import VerificationDetailsDrawer from '../../components/usersProfiles/verification/VerificationDetailsDrawer';
import { useNotifications } from '../../context/NotificationContext';
import usePersistentState from '../../hooks/usePersistentState';

const athletes = [
  {
    id: 'ATH-1045',
    name: 'Ava Brooks',
    sport: 'Basketball',
    location: 'Dallas, TX',
    completeness: 96,
    status: 'active',
    verified: true,
  },
  {
    id: 'ATH-1072',
    name: 'Noah Rivera',
    sport: 'Football',
    location: 'Miami, FL',
    completeness: 88,
    status: 'review',
    verified: false,
  },
  {
    id: 'ATH-1108',
    name: 'Sophia Bennett',
    sport: 'Track & Field',
    location: 'Austin, TX',
    completeness: 92,
    status: 'active',
    verified: true,
  },
  {
    id: 'ATH-1150',
    name: 'Mason Patel',
    sport: 'Soccer',
    location: 'Chicago, IL',
    completeness: 79,
    status: 'flagged',
    verified: true,
  },
];

const recruiters = [
  {
    id: 'REC-410',
    name: 'Jordan Lee',
    organization: 'North Point University',
    tier: 'Division I',
    status: 'active',
    pipeline: 48,
    verified: true,
  },
  {
    id: 'REC-411',
    name: 'Emma Carter',
    organization: 'Metro College',
    tier: 'Division II',
    status: 'review',
    pipeline: 21,
    verified: false,
  },
  {
    id: 'REC-412',
    name: 'Carter Hayes',
    organization: 'Valley State',
    tier: 'Division I',
    status: 'suspended',
    pipeline: 12,
    verified: true,
  },
];

const verificationQueue = [
  {
    id: 'VER-9901',
    applicantName: 'Nina Morris',
    applicantType: 'athlete',
    status: 'pending',
    type: 'Identity check',
    submittedAt: '2026-04-08T09:14:00Z',
    submittedLabel: '14 min ago',
    priority: 'high',
    documents: [
      { name: 'Government ID', status: 'uploaded' },
      { name: 'Academic transcript', status: 'uploaded' },
    ],
    notes: 'Government-issued ID upload needs manual review because the image was recently updated.',
  },
  {
    id: 'VER-9902',
    applicantName: 'Marcus Allen',
    applicantType: 'athlete',
    status: 'pending',
    type: 'Highlight reel review',
    submittedAt: '2026-04-08T08:47:00Z',
    submittedLabel: '41 min ago',
    priority: 'medium',
    documents: [
      { name: 'Highlight reel', status: 'uploaded' },
      { name: 'Transcript summary', status: 'uploaded' },
    ],
    notes: 'The highlight reel includes two broken timestamps that need validation before approval.',
  },
  {
    id: 'VER-9903',
    applicantName: 'Rachel Kim',
    applicantType: 'recruiter',
    status: 'pending',
    type: 'Recruiter credentials',
    submittedAt: '2026-04-08T08:28:00Z',
    submittedLabel: '1 hr ago',
    priority: 'high',
    documents: [
      { name: 'Institution letter', status: 'uploaded' },
      { name: 'Recruiter badge', status: 'uploaded' },
      { name: 'Work email proof', status: 'uploaded' },
    ],
    notes: 'Institution letter is present, but the committee asked for a manual domain check before approval.',
  },
  {
    id: 'VER-9904',
    applicantName: 'Jayden Lewis',
    applicantType: 'athlete',
    status: 'pending',
    type: 'Parent consent',
    submittedAt: '2026-04-08T07:33:00Z',
    submittedLabel: '2 hrs ago',
    priority: 'low',
    documents: [
      { name: 'Parent consent form', status: 'uploaded' },
      { name: 'Guardian signature page', status: 'uploaded' },
    ],
    notes: 'Consent packet is complete, but the guardian signature needs one more confirmation field.',
  },
];

const cardClass =
  'rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]';

const tabs = [
  { key: 'athletes', label: 'Athletes' },
  { key: 'recruiters', label: 'Recruiters' },
  { key: 'verification', label: 'Verification queue' },
];

const statusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'review', label: 'Review' },
  { value: 'flagged', label: 'Flagged' },
  { value: 'suspended', label: 'Suspended' },
];

const defaultAthletesPageSize = 2;
const defaultRecruitersPageSize = 2;
const defaultVerificationPageSize = 2;
const ATHLETES_STORAGE_KEY = 'scoutme_admin_users_profiles_athletes';
const RECRUITERS_STORAGE_KEY = 'scoutme_admin_users_profiles_recruiters';
const VERIFICATION_STORAGE_KEY = 'scoutme_admin_users_profiles_verification_queue';

const useCountUp = (target) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    const duration = 900;
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

const MetricCard = ({ title, value, icon, accent, hint }) => {
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

const StatusPill = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
      status === 'active'
        ? 'bg-emerald-100 text-emerald-700'
        : status === 'review'
          ? 'bg-amber-100 text-amber-700'
          : status === 'flagged' || status === 'suspended'
            ? 'bg-rose-100 text-rose-700'
            : 'bg-slate-100 text-slate-700'
    }`}
  >
    {status}
  </span>
);

const VerificationPriority = ({ priority }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
      priority === 'high'
        ? 'bg-rose-100 text-rose-700'
        : priority === 'medium'
          ? 'bg-amber-100 text-amber-700'
          : 'bg-sky-100 text-sky-700'
    }`}
  >
    {priority}
  </span>
);

const UsersProfilesPage = () => {
  const { addNotification } = useNotifications();
  const [athleteItems] = usePersistentState(ATHLETES_STORAGE_KEY, athletes, Array.isArray);
  const [recruiterItems] = usePersistentState(RECRUITERS_STORAGE_KEY, recruiters, Array.isArray);
  const [verificationRequests, setVerificationRequests] = usePersistentState(
    VERIFICATION_STORAGE_KEY,
    verificationQueue,
    Array.isArray,
  );
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('athletes');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [approveTarget, setApproveTarget] = useState(null);
  const [requestInfoTarget, setRequestInfoTarget] = useState(null);
  const [currentAthletesPage, setCurrentAthletesPage] = useState(1);
  const [currentRecruitersPage, setCurrentRecruitersPage] = useState(1);
  const [currentVerificationPage, setCurrentVerificationPage] = useState(1);
  const athletesPageSize = defaultAthletesPageSize;
  const recruitersPageSize = defaultRecruitersPageSize;
  const verificationPageSize = defaultVerificationPageSize;
  const statusMenuRef = useRef(null);

  useEffect(() => {
    if (!statusMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!statusMenuRef.current?.contains(event.target)) {
        setStatusMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setStatusMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [statusMenuOpen]);

  const selectedStatusOption = useMemo(
    () => statusOptions.find((option) => option.value === statusFilter) || statusOptions[0],
    [statusFilter],
  );

  const filteredAthletes = useMemo(() => {
    return athleteItems.filter((item) => {
      const matchesQuery = [item.name, item.sport, item.location, item.id].join(' ').toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [athleteItems, query, statusFilter]);

  const filteredRecruiters = useMemo(() => {
    return recruiterItems.filter((item) => {
      const matchesQuery = [item.name, item.organization, item.tier, item.id]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, recruiterItems, statusFilter]);

  const filteredVerificationRequests = useMemo(() => {
    return verificationRequests.filter((item) =>
      [item.applicantName, item.id, item.type, item.priority].join(' ').toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, verificationRequests]);

  const totalAthletesPages = Math.max(1, Math.ceil(filteredAthletes.length / athletesPageSize));
  const paginatedAthletes = useMemo(() => {
    const startIndex = (currentAthletesPage - 1) * athletesPageSize;
    return filteredAthletes.slice(startIndex, startIndex + athletesPageSize);
  }, [athletesPageSize, currentAthletesPage, filteredAthletes]);

  const totalRecruitersPages = Math.max(1, Math.ceil(filteredRecruiters.length / recruitersPageSize));
  const paginatedRecruiters = useMemo(() => {
    const startIndex = (currentRecruitersPage - 1) * recruitersPageSize;
    return filteredRecruiters.slice(startIndex, startIndex + recruitersPageSize);
  }, [currentRecruitersPage, filteredRecruiters, recruitersPageSize]);

  const totalVerificationPages = Math.max(1, Math.ceil(filteredVerificationRequests.length / verificationPageSize));
  const paginatedVerificationRequests = useMemo(() => {
    const startIndex = (currentVerificationPage - 1) * verificationPageSize;
    return filteredVerificationRequests.slice(startIndex, startIndex + verificationPageSize);
  }, [currentVerificationPage, filteredVerificationRequests, verificationPageSize]);

  useEffect(() => {
    setCurrentAthletesPage(1);
    setCurrentRecruitersPage(1);
    setCurrentVerificationPage(1);
  }, [query, statusFilter]);

  useEffect(() => {
    if (currentAthletesPage > totalAthletesPages) {
      setCurrentAthletesPage(totalAthletesPages);
    }
  }, [currentAthletesPage, totalAthletesPages]);

  useEffect(() => {
    if (currentRecruitersPage > totalRecruitersPages) {
      setCurrentRecruitersPage(totalRecruitersPages);
    }
  }, [currentRecruitersPage, totalRecruitersPages]);

  useEffect(() => {
    if (currentVerificationPage > totalVerificationPages) {
      setCurrentVerificationPage(totalVerificationPages);
    }
  }, [currentVerificationPage, totalVerificationPages]);

  const handleApproveVerification = ({ request }) => {
    setVerificationRequests((current) => current.filter((item) => item.id !== request?.id));
    setApproveTarget(null);
    setSelectedVerification(null);
    addNotification({
      type: 'success',
      title: 'Verification approved',
      message: `${request?.applicantName || 'The applicant'} has been approved and removed from the queue.`,
    });
  };

  const handleRequestInfo = ({ request, channel, deadline, message }) => {
    setVerificationRequests((current) => current.filter((item) => item.id !== request?.id));
    setRequestInfoTarget(null);
    setSelectedVerification(null);
    addNotification({
      type: 'info',
      title: 'More information requested',
      message: `${request?.applicantName || 'The applicant'} was asked to respond via ${channel.toLowerCase()} within ${deadline.toLowerCase()}. ${message ? 'Details were included.' : ''}`,
    });
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-full space-y-5 2xl:space-y-6">
        <div className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                <FiUsers />
                Users & profiles
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Manage people, trust, and profile quality</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                Review athlete and recruiter accounts, monitor verification backlogs, and keep profile data quality high
                across the ScoutMe ecosystem.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-[280px]">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="text"
                  placeholder="Search users or orgs"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
                />
              </div>
              <div className="relative" ref={statusMenuRef}>
                <button
                  type="button"
                  onClick={() => setStatusMenuOpen((current) => !current)}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-white"
                  aria-haspopup="menu"
                  aria-expanded={statusMenuOpen}
                >
                  <FiFilter />
                  <span>{selectedStatusOption.label}</span>
                  <FiChevronDown
                    className={`transition ${statusMenuOpen ? 'rotate-180' : ''}`}
                    size={16}
                  />
                </button>

                {statusMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+10px)] z-20 min-w-[220px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                    {statusOptions.map((option) => {
                      const isSelected = option.value === statusFilter;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setStatusFilter(option.value);
                            setStatusMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                            isSelected
                              ? 'bg-slate-950 text-white'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{option.label}</span>
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Athlete accounts" value={12840} icon={FiUsers} accent="bg-slate-900" hint="Profiles live in discovery." />
          <MetricCard title="Verified recruiters" value={3218} icon={FiUserCheck} accent="bg-blue-600" hint="Trusted outreach accounts." />
          <MetricCard title="Pending reviews" value={184} icon={FiShield} accent="bg-amber-500" hint="Identity, consent, and credentials." />
          <MetricCard title="Completion rate" value={91} icon={FiCheckCircle} accent="bg-emerald-600" hint="Average profile completion score." />
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_18px_60px_rgba(15,23,42,0.04)]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === tab.key ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'athletes' && (
          <section className={cardClass}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-950">Athlete profiles</h2>
              <p className="mt-1 text-sm text-slate-500">Track profile quality, location coverage, and verification health.</p>
            </div>
            <div className="overflow-hidden rounded-[22px] border border-slate-200">
              <div className="overflow-x-auto">
                <div className="md:min-w-[1060px]">
                  <div className="hidden grid-cols-[1.2fr_1fr_1fr_0.9fr_0.8fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:grid">
                    <span>Name</span>
                    <span>Sport</span>
                    <span>Location</span>
                    <span>Profile</span>
                    <span>Status</span>
                    <span>Verified</span>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {paginatedAthletes.map((athlete) => (
                      <div key={athlete.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1.2fr_1fr_1fr_0.9fr_0.8fr_0.8fr] md:items-center">
                        <div>
                          <p className="font-semibold text-slate-900">{athlete.name}</p>
                          <p className="text-sm text-slate-500">{athlete.id}</p>
                        </div>
                        <p className="text-sm text-slate-700">{athlete.sport}</p>
                        <p className="text-sm text-slate-700">{athlete.location}</p>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{athlete.completeness}%</p>
                          <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                            <div className="h-2 rounded-full bg-slate-900" style={{ width: `${athlete.completeness}%` }} />
                          </div>
                        </div>
                        <StatusPill status={athlete.status} />
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${athlete.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {athlete.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex justify-end">
                <Pagination page={currentAthletesPage} totalPages={totalAthletesPages} onPageChange={setCurrentAthletesPage} />
              </div>
            </div>
          </section>
        )}

        {activeTab === 'recruiters' && (
          <section className={cardClass}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-950">Recruiter accounts</h2>
              <p className="mt-1 text-sm text-slate-500">Keep recruiter access compliant and monitor outreach capacity.</p>
            </div>
            <div className="overflow-hidden rounded-[22px] border border-slate-200">
              <div className="overflow-x-auto">
                <div className="md:min-w-[980px]">
                  <div className="hidden grid-cols-[1.1fr_1.4fr_1fr_0.9fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:grid">
                    <span>Name</span>
                    <span>Organization</span>
                    <span>Tier</span>
                    <span>Pipeline</span>
                    <span>Status</span>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {paginatedRecruiters.map((recruiter) => (
                      <div key={recruiter.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1.1fr_1.4fr_1fr_0.9fr_0.8fr] md:items-center">
                        <div>
                          <p className="font-semibold text-slate-900">{recruiter.name}</p>
                          <p className="text-sm text-slate-500">{recruiter.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-700">{recruiter.organization}</p>
                          <p className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${recruiter.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {recruiter.verified ? 'Credential verified' : 'Credential pending'}
                          </p>
                        </div>
                        <p className="text-sm text-slate-700">{recruiter.tier}</p>
                        <p className="text-sm font-semibold text-slate-900">{recruiter.pipeline} active athletes</p>
                        <StatusPill status={recruiter.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex justify-end">
                <Pagination page={currentRecruitersPage} totalPages={totalRecruitersPages} onPageChange={setCurrentRecruitersPage} />
              </div>
            </div>
          </section>
        )}

          {activeTab === 'verification' && (
            <section className={cardClass}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-950">Verification queue</h2>
                <p className="mt-1 text-sm text-slate-500">Resolve high-priority trust checks quickly and keep onboarding flowing.</p>
              </div>
              {filteredVerificationRequests.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
                  {paginatedVerificationRequests.map((item) => (
                    <article key={item.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{item.applicantName}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{item.id}</p>
                        </div>
                        <VerificationPriority priority={item.priority} />
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <p>{item.type}</p>
                        <p>Submitted {item.submittedLabel}</p>
                      </div>
                      <div className="mt-5 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedVerification(item)}
                          className="flex-1 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Review
                        </button>
                        <button
                          type="button"
                          onClick={() => setRequestInfoTarget(item)}
                          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Request info
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                  <p className="text-base font-semibold text-slate-900">
                    {verificationRequests.length ? 'No verification requests matched' : 'Verification queue is clear'}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {verificationRequests.length
                      ? 'Try a broader search term to see the full review queue again.'
                      : 'All requests have been reviewed or sent back for more information.'}
                  </p>
                </div>
              )}
              {filteredVerificationRequests.length ? (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <div className="flex justify-end">
                    <Pagination
                      page={currentVerificationPage}
                      totalPages={totalVerificationPages}
                      onPageChange={setCurrentVerificationPage}
                    />
                  </div>
                </div>
              ) : null}
            </section>
          )}
        </div>
      </div>

      <VerificationDetailsDrawer
        open={Boolean(selectedVerification)}
        request={selectedVerification}
        onClose={() => setSelectedVerification(null)}
        onApprove={(request) => {
          setSelectedVerification(null);
          setApproveTarget(request);
        }}
        onRequestInfo={(request) => {
          setSelectedVerification(null);
          setRequestInfoTarget(request);
        }}
      />
      <ApproveVerificationModal
        open={Boolean(approveTarget)}
        request={approveTarget}
        onClose={() => setApproveTarget(null)}
        onSubmit={handleApproveVerification}
      />
      <RequestVerificationInfoModal
        open={Boolean(requestInfoTarget)}
        request={requestInfoTarget}
        onClose={() => setRequestInfoTarget(null)}
        onSubmit={handleRequestInfo}
      />
    </>
  );
};

export default UsersProfilesPage;
