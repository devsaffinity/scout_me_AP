import { useEffect, useMemo, useState } from 'react';
import { FiCreditCard, FiRadio, FiRepeat, FiTrendingUp } from 'react-icons/fi';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import Pagination from '../../components/shared/Pagination';
import { useNotifications } from '../../context/NotificationContext';
import usePersistentState from '../../hooks/usePersistentState';

const subscriptionTrend = [
  { month: 'Jan', active: 1280, renewals: 910, churn: 64 },
  { month: 'Feb', active: 1490, renewals: 1040, churn: 71 },
  { month: 'Mar', active: 1630, renewals: 1190, churn: 82 },
  { month: 'Apr', active: 1780, renewals: 1330, churn: 88 },
  { month: 'May', active: 1960, renewals: 1490, churn: 94 },
  { month: 'Jun', active: 2140, renewals: 1610, churn: 102 },
];

const subscriptionPlans = [
  { name: 'ScoutMe Premium', price: '$19/mo', benefits: 'Unlimited outreach + deeper discovery analytics', status: 'live' },
  { name: 'Recruiter Plus', price: '$79/mo', benefits: 'Advanced shortlist tools + campaign boosts', status: 'live' },
  { name: 'NFC Elite Bundle', price: '$129/yr', benefits: 'Premium access + NFC bracelet assignment', status: 'draft' },
];

const braceletInventory = [
  { sku: 'NFC-843', assignedTo: 'Ava Brooks', state: 'assigned', lastScan: '15 min ago' },
  { sku: 'NFC-844', assignedTo: 'Warehouse stock', state: 'available', lastScan: '—' },
  { sku: 'NFC-845', assignedTo: 'Jamal Hart', state: 'replaced', lastScan: '2 hrs ago' },
  { sku: 'NFC-846', assignedTo: 'Noah Rivera', state: 'assigned', lastScan: '39 min ago' },
];

const recentScans = [
  { id: 'SCAN-1102', bracelet: 'NFC-843', location: 'Texas showcase gate', action: 'Profile tap', time: '15 min ago' },
  { id: 'SCAN-1103', bracelet: 'NFC-846', location: 'Recruiter booth A', action: 'Connection request', time: '39 min ago' },
  { id: 'SCAN-1104', bracelet: 'NFC-845', location: 'Support desk', action: 'Replacement handoff', time: '2 hrs ago' },
  { id: 'SCAN-1105', bracelet: 'NFC-810', location: 'Tryout check-in', action: 'Premium access validation', time: '3 hrs ago' },
];

const cardClass =
  'rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]';

const defaultPlansPageSize = 2;
const defaultInventoryPageSize = 2;
const defaultScansPageSize = 2;
const pageSizeOptions = [2, 3, 4, 6];
const PLANS_STORAGE_KEY = 'scoutme_admin_premium_plans';
const INVENTORY_STORAGE_KEY = 'scoutme_admin_premium_inventory';
const SCANS_STORAGE_KEY = 'scoutme_admin_premium_scans';

const defaultPlanForm = {
  name: '',
  price: '',
  benefits: '',
  status: 'draft',
};

const defaultBraceletForm = {
  sku: '',
  assignedTo: '',
  state: 'assigned',
};

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

const MetricCard = ({ title, value, icon: Icon, accent, hint, suffix = '' }) => {
  const animatedValue = useCountUp(value);

  return (
    <div className={cardClass}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {animatedValue.toLocaleString()}
            {suffix}
          </h3>
          <p className="mt-2 text-sm text-slate-500">{hint}</p>
        </div>
        <div className={`rounded-2xl ${accent} p-3 text-xl text-white`}>
          <Icon />
        </div>
      </div>
    </div>
  );
};

const PageSizeControl = ({ value, onChange }) => (
  <label className="flex items-center gap-2 text-sm text-slate-500">
    <span>Rows per page</span>
    <select
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
    >
      {pageSizeOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

const statusStyles = {
  live: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-amber-100 text-amber-700',
  assigned: 'bg-blue-100 text-blue-700',
  available: 'bg-emerald-100 text-emerald-700',
  replaced: 'bg-violet-100 text-violet-700',
};

const PremiumNfcPage = () => {
  const { addNotification } = useNotifications();
  const [planItems, setPlanItems] = usePersistentState(PLANS_STORAGE_KEY, subscriptionPlans, Array.isArray);
  const [inventoryItems, setInventoryItems] = usePersistentState(
    INVENTORY_STORAGE_KEY,
    braceletInventory,
    Array.isArray,
  );
  const [scanItems] = usePersistentState(SCANS_STORAGE_KEY, recentScans, Array.isArray);
  const [planComposerOpen, setPlanComposerOpen] = useState(false);
  const [braceletComposerOpen, setBraceletComposerOpen] = useState(false);
  const [planForm, setPlanForm] = useState(defaultPlanForm);
  const [braceletForm, setBraceletForm] = useState(defaultBraceletForm);
  const [currentPlansPage, setCurrentPlansPage] = useState(1);
  const [currentInventoryPage, setCurrentInventoryPage] = useState(1);
  const [currentScansPage, setCurrentScansPage] = useState(1);
  const [plansPageSize, setPlansPageSize] = useState(defaultPlansPageSize);
  const [inventoryPageSize, setInventoryPageSize] = useState(defaultInventoryPageSize);
  const [scansPageSize, setScansPageSize] = useState(defaultScansPageSize);

  const totalPlansPages = Math.max(1, Math.ceil(planItems.length / plansPageSize));
  const paginatedPlans = useMemo(() => {
    const startIndex = (currentPlansPage - 1) * plansPageSize;
    return planItems.slice(startIndex, startIndex + plansPageSize);
  }, [currentPlansPage, planItems, plansPageSize]);

  const totalInventoryPages = Math.max(1, Math.ceil(inventoryItems.length / inventoryPageSize));
  const paginatedInventory = useMemo(() => {
    const startIndex = (currentInventoryPage - 1) * inventoryPageSize;
    return inventoryItems.slice(startIndex, startIndex + inventoryPageSize);
  }, [currentInventoryPage, inventoryItems, inventoryPageSize]);

  const totalScansPages = Math.max(1, Math.ceil(scanItems.length / scansPageSize));
  const paginatedScans = useMemo(() => {
    const startIndex = (currentScansPage - 1) * scansPageSize;
    return scanItems.slice(startIndex, startIndex + scansPageSize);
  }, [currentScansPage, scanItems, scansPageSize]);

  useEffect(() => {
    if (currentPlansPage > totalPlansPages) {
      setCurrentPlansPage(totalPlansPages);
    }
  }, [currentPlansPage, totalPlansPages]);

  useEffect(() => {
    if (currentInventoryPage > totalInventoryPages) {
      setCurrentInventoryPage(totalInventoryPages);
    }
  }, [currentInventoryPage, totalInventoryPages]);

  useEffect(() => {
    if (currentScansPage > totalScansPages) {
      setCurrentScansPage(totalScansPages);
    }
  }, [currentScansPage, totalScansPages]);

  const handleCreatePlan = (event) => {
    event.preventDefault();

    const nextPlan = {
      name: planForm.name.trim() || 'Custom premium plan',
      price: planForm.price.trim() || '$0/mo',
      benefits: planForm.benefits.trim() || 'Custom premium configuration',
      status: planForm.status,
    };

    setPlanItems((current) => [nextPlan, ...current]);
    setPlanComposerOpen(false);
    setPlanForm(defaultPlanForm);
    setCurrentPlansPage(1);
    addNotification({
      type: 'success',
      title: 'Plan added',
      message: `${nextPlan.name} is now available in subscription plans.`,
    });
  };

  const handleAssignBracelet = (event) => {
    event.preventDefault();

    const nextBracelet = {
      sku: braceletForm.sku.trim() || `NFC-${Date.now().toString().slice(-4)}`,
      assignedTo: braceletForm.assignedTo.trim() || 'Unassigned user',
      state: braceletForm.state,
      lastScan: 'Not scanned yet',
    };

    setInventoryItems((current) => [nextBracelet, ...current]);
    setBraceletComposerOpen(false);
    setBraceletForm(defaultBraceletForm);
    setCurrentInventoryPage(1);
    addNotification({
      type: 'success',
      title: 'Bracelet assigned',
      message: `${nextBracelet.sku} was added to bracelet inventory.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                <FiRadio />
                Premium & NFC
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Manage paid access and bracelet operations</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                Track subscriptions, control NFC inventory, monitor scan activity, and keep premium perks operating
                smoothly for athletes and recruiters.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setPlanComposerOpen((current) => !current);
                  setBraceletComposerOpen(false);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Add plan
              </button>
              <button
                type="button"
                onClick={() => {
                  setBraceletComposerOpen((current) => !current);
                  setPlanComposerOpen(false);
                }}
                className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg"
              >
                Assign bracelet
              </button>
            </div>
          </div>
        </div>

        {planComposerOpen ? (
          <section className={cardClass}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-950">Add subscription plan</h2>
              <p className="mt-1 text-sm text-slate-500">Create a new premium plan entry for the subscription list.</p>
            </div>
            <form onSubmit={handleCreatePlan} className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Plan name</span>
                <input
                  value={planForm.name}
                  onChange={(event) => setPlanForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="Elite Recruiter Access"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Price</span>
                <input
                  value={planForm.price}
                  onChange={(event) => setPlanForm((current) => ({ ...current, price: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="$49/mo"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Benefits</span>
                <textarea
                  rows={3}
                  value={planForm.benefits}
                  onChange={(event) => setPlanForm((current) => ({ ...current, benefits: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="Add bundled benefits and premium access notes..."
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Status</span>
                <select
                  value={planForm.status}
                  onChange={(event) => setPlanForm((current) => ({ ...current, status: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                >
                  <option value="draft">Draft</option>
                  <option value="live">Live</option>
                </select>
              </label>
              <div className="flex items-end justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setPlanComposerOpen(false);
                    setPlanForm(defaultPlanForm);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Save plan
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {braceletComposerOpen ? (
          <section className={cardClass}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-950">Assign bracelet</h2>
              <p className="mt-1 text-sm text-slate-500">Add a bracelet assignment record to the current inventory list.</p>
            </div>
            <form onSubmit={handleAssignBracelet} className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Bracelet code</span>
                <input
                  value={braceletForm.sku}
                  onChange={(event) => setBraceletForm((current) => ({ ...current, sku: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="NFC-901"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Assigned to</span>
                <input
                  value={braceletForm.assignedTo}
                  onChange={(event) => setBraceletForm((current) => ({ ...current, assignedTo: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="Jordan Lee"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">State</span>
                <select
                  value={braceletForm.state}
                  onChange={(event) => setBraceletForm((current) => ({ ...current, state: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                >
                  <option value="assigned">Assigned</option>
                  <option value="available">Available</option>
                  <option value="replaced">Replaced</option>
                </select>
              </label>
              <div className="flex items-end justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setBraceletComposerOpen(false);
                    setBraceletForm(defaultBraceletForm);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Save bracelet
                </button>
              </div>
            </form>
          </section>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Active premium users" value={2140} icon={FiCreditCard} accent="bg-slate-900" hint="Current paid accounts across all plans." />
          <MetricCard title="Renewal rate" value={78} icon={FiRepeat} accent="bg-blue-600" hint="Successful recurring renewals this cycle." suffix="%" />
          <MetricCard title="Bracelets in field" value={842} icon={FiRadio} accent="bg-emerald-600" hint="Assigned and currently active NFC tags." />
          <MetricCard title="Successful scans" value={18440} icon={FiTrendingUp} accent="bg-violet-600" hint="Tap events linked to discovery or access." />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
          <section className={cardClass}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-950">Subscription momentum</h2>
              <p className="mt-1 text-sm text-slate-500">Active users, renewals, and churn over the last six months.</p>
            </div>
            <div className="h-[320px] w-full">
              <AreaChart data={subscriptionTrend} responsive style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="premiumActiveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f172a" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="renewalsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={50} />
                <Tooltip />
                <Area type="monotone" dataKey="active" stroke="#0f172a" fill="url(#premiumActiveFill)" strokeWidth={3} />
                <Area type="monotone" dataKey="renewals" stroke="#2563eb" fill="url(#renewalsFill)" strokeWidth={3} />
              </AreaChart>
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-950">Subscription plans</h2>
              <p className="mt-1 text-sm text-slate-500">Plan configuration snapshot for premium access products.</p>
            </div>
            <div className="space-y-3">
              {paginatedPlans.map((plan) => (
                <article key={plan.name} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{plan.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{plan.price}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[plan.status]}`}>{plan.status}</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{plan.benefits}</p>
                </article>
              ))}
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm text-slate-500">
                    Showing {(currentPlansPage - 1) * plansPageSize + 1}
                    -
                    {Math.min(currentPlansPage * plansPageSize, planItems.length)} of {planItems.length} plans
                  </p>
                  <PageSizeControl
                    value={plansPageSize}
                    onChange={(value) => {
                      setPlansPageSize(value);
                      setCurrentPlansPage(1);
                    }}
                  />
                </div>
                <Pagination page={currentPlansPage} totalPages={totalPlansPages} onPageChange={setCurrentPlansPage} />
              </div>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.15fr]">
          <section className={cardClass}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-950">Bracelet inventory</h2>
              <p className="mt-1 text-sm text-slate-500">Assignment state and operational visibility for NFC stock.</p>
            </div>
            <div className="space-y-3">
              {paginatedInventory.map((item) => (
                <article key={item.sku} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{item.sku}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.assignedTo}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[item.state]}`}>{item.state}</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">Last scan: {item.lastScan}</p>
                </article>
              ))}
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm text-slate-500">
                    Showing {(currentInventoryPage - 1) * inventoryPageSize + 1}
                    -
                    {Math.min(currentInventoryPage * inventoryPageSize, inventoryItems.length)} of {inventoryItems.length} bracelets
                  </p>
                  <PageSizeControl
                    value={inventoryPageSize}
                    onChange={(value) => {
                      setInventoryPageSize(value);
                      setCurrentInventoryPage(1);
                    }}
                  />
                </div>
                <Pagination
                  page={currentInventoryPage}
                  totalPages={totalInventoryPages}
                  onPageChange={setCurrentInventoryPage}
                />
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-950">Recent scan activity</h2>
              <p className="mt-1 text-sm text-slate-500">Most recent NFC interactions that affected access or engagement flows.</p>
            </div>
            <div className="overflow-hidden rounded-[22px] border border-slate-200">
              <div className="overflow-x-auto">
                <div className="md:min-w-[940px]">
                  <div className="hidden grid-cols-[0.9fr_0.9fr_1.1fr_1.1fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:grid">
                    <span>ID</span>
                    <span>Bracelet</span>
                    <span>Location</span>
                    <span>Action</span>
                    <span>Time</span>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {paginatedScans.map((scan) => (
                      <div key={scan.id} className="grid gap-3 px-5 py-4 md:grid-cols-[0.9fr_0.9fr_1.1fr_1.1fr_0.8fr] md:items-center">
                        <p className="font-semibold text-slate-900">{scan.id}</p>
                        <p className="text-sm text-slate-700">{scan.bracelet}</p>
                        <p className="text-sm text-slate-700">{scan.location}</p>
                        <p className="text-sm text-slate-700">{scan.action}</p>
                        <p className="text-sm text-slate-500">{scan.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm text-slate-500">
                    Showing {(currentScansPage - 1) * scansPageSize + 1}
                    -
                    {Math.min(currentScansPage * scansPageSize, scanItems.length)} of {scanItems.length} scans
                  </p>
                  <PageSizeControl
                    value={scansPageSize}
                    onChange={(value) => {
                      setScansPageSize(value);
                      setCurrentScansPage(1);
                    }}
                  />
                </div>
                <Pagination page={currentScansPage} totalPages={totalScansPages} onPageChange={setCurrentScansPage} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PremiumNfcPage;
