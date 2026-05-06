import {
  FiActivity,
  FiRadio,
  FiShield,
  FiTrendingUp,
  FiUserCheck,
} from 'react-icons/fi';
import { APP_NAME } from '../../utils/constants';

const highlights = [
  {
    label: 'Active trust checks',
    value: '184',
    note: 'Identity and recruiter credential reviews currently in motion.',
    icon: FiShield,
    accent: 'bg-amber-500/15 text-amber-200 ring-amber-300/20',
  },
  {
    label: 'Premium scan events',
    value: '18.4K',
    note: 'Bracelet-driven taps and access validations tracked this cycle.',
    icon: FiRadio,
    accent: 'bg-cyan-500/15 text-cyan-200 ring-cyan-300/20',
  },
  {
    label: 'Discovery conversion',
    value: '+31%',
    note: 'Higher free-to-premium progression from curated discovery surfaces.',
    icon: FiTrendingUp,
    accent: 'bg-emerald-500/15 text-emerald-200 ring-emerald-300/20',
  },
];

const priorities = [
  'Resolve high-priority verification requests before they block onboarding.',
  'Watch premium conversion changes after campaign launches and scan events.',
  'Keep moderator response time under SLA across recruiter and athlete messages.',
];

const AuthHeroPanel = () => {
  return (
    <div className="relative h-full overflow-hidden px-10 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_34%)]" />

      <div className="relative flex h-full flex-col justify-between gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
            <FiUserCheck />
            Admin operations
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0ea5e9_0%,#2563eb_55%,#06b6d4_100%)] text-sm font-bold tracking-[0.24em] text-white shadow-[0_20px_40px_-18px_rgba(34,211,238,0.8)]">
                SM
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
                  {APP_NAME}
                </p>
                <p className="text-sm text-slate-400">Operational command center</p>
              </div>
            </div>

            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-white">
              Keep growth, trust, messaging, and premium operations moving from one workspace.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              Review verification flows, monitor discovery performance, manage premium access, and respond to safety
              signals without leaving the admin console.
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-4 xl:grid-cols-3">
            {highlights.map(({ label, value, note, icon: Icon, accent }) => (
              <article
                key={label}
                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_30px_60px_-36px_rgba(2,6,23,0.95)] backdrop-blur"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-300">{label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
                  </div>
                  <span className={`inline-flex rounded-2xl p-3 ring-1 ${accent}`}>
                    <Icon size={18} />
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">{note}</p>
              </article>
            ))}
          </div>

          <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.72),rgba(2,6,23,0.86))] p-6 shadow-[0_35px_80px_-42px_rgba(2,6,23,0.95)]">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex rounded-2xl bg-white/10 p-3 text-sky-200 ring-1 ring-white/10">
                <FiActivity size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Current focus</p>
                <p className="text-sm text-slate-400">High-signal workstreams across the platform.</p>
              </div>
            </div>

            <div className="grid gap-3">
              {priorities.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sm font-semibold text-sky-200 ring-1 ring-sky-300/15">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AuthHeroPanel;
