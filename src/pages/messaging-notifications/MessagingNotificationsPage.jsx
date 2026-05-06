import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiBell,
  FiDownload,
  FiFileText,
  FiFilter,
  FiMessageSquare,
  FiPlus,
  FiSend,
  FiShield,
  FiTarget,
} from 'react-icons/fi';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import Pagination from '../../components/shared/Pagination';
import { useNotifications } from '../../context/NotificationContext';
import usePersistentState from '../../hooks/usePersistentState';

const deliveryData = [
  { label: 'In-app', deliveryRate: 96, openRate: 64 },
  { label: 'Push', deliveryRate: 92, openRate: 54 },
  { label: 'Email', deliveryRate: 88, openRate: 44 },
  { label: 'SMS', deliveryRate: 84, openRate: 71 },
];

const moderationQueue = [
  {
    id: 'MSG-1201',
    conversation: 'Recruiter outreach thread',
    reportReason: 'Spam pattern',
    escalatedBy: 'Trust automation',
    priority: 'high',
    status: 'flagged',
    updatedAt: '2026-04-08T08:54:00Z',
    participants: ['Jordan Lee', 'Ava Brooks'],
    messages: [
      {
        id: 1,
        sender: 'Jordan Lee',
        text: 'Join my recruiting list today for guaranteed exposure.',
        time: '2026-04-08T08:42:00Z',
        side: 'left',
      },
      {
        id: 2,
        sender: 'Ava Brooks',
        text: 'Please stop sending this link. It does not look legitimate.',
        time: '2026-04-08T08:49:00Z',
        side: 'right',
      },
      {
        id: 3,
        sender: 'Trust automation',
        text: 'This thread was escalated after repeated unsolicited link sends.',
        time: '2026-04-08T08:54:00Z',
        side: 'left',
      },
    ],
  },
  {
    id: 'MSG-1202',
    conversation: 'Athlete support chat',
    reportReason: 'Harassment language',
    escalatedBy: 'Manual report',
    priority: 'high',
    status: 'flagged',
    updatedAt: '2026-04-08T08:18:00Z',
    participants: ['Support agent', 'Nina Morris'],
    messages: [
      {
        id: 1,
        sender: 'Support agent',
        text: 'I need the full ticket number before I can help.',
        time: '2026-04-08T08:06:00Z',
        side: 'left',
      },
      {
        id: 2,
        sender: 'Nina Morris',
        text: 'I already shared it twice. Please stop using that language.',
        time: '2026-04-08T08:12:00Z',
        side: 'right',
      },
      {
        id: 3,
        sender: 'Manual report',
        text: 'Conversation was escalated after a direct user complaint.',
        time: '2026-04-08T08:18:00Z',
        side: 'left',
      },
    ],
  },
  {
    id: 'MSG-1203',
    conversation: 'Event reminder broadcast',
    reportReason: 'Duplicate message complaint',
    escalatedBy: 'Campaign QA',
    priority: 'medium',
    status: 'active',
    updatedAt: '2026-04-08T07:41:00Z',
    participants: ['Campaign QA', 'Broadcast audience'],
    messages: [
      {
        id: 1,
        sender: 'Campaign QA',
        text: 'Reminder: showcase registration closes tonight at 7 PM.',
        time: '2026-04-08T07:25:00Z',
        side: 'left',
      },
      {
        id: 2,
        sender: 'Audience report',
        text: 'This reminder was sent twice within 10 minutes.',
        time: '2026-04-08T07:33:00Z',
        side: 'right',
      },
      {
        id: 3,
        sender: 'Campaign QA',
        text: 'A retry job may have duplicated the delivery. Please review.',
        time: '2026-04-08T07:41:00Z',
        side: 'left',
      },
    ],
  },
  {
    id: 'MSG-1204',
    conversation: 'Coach onboarding flow',
    reportReason: 'Link formatting issue',
    escalatedBy: 'Support',
    priority: 'low',
    status: 'active',
    updatedAt: '2026-04-08T06:55:00Z',
    participants: ['Coach onboarding bot', 'Emma Carter'],
    messages: [
      {
        id: 1,
        sender: 'Coach onboarding bot',
        text: 'Finish setup here: scoutme.app/setup?step=verification',
        time: '2026-04-08T06:44:00Z',
        side: 'left',
      },
      {
        id: 2,
        sender: 'Emma Carter',
        text: 'The link opens a blank page after the final step.',
        time: '2026-04-08T06:48:00Z',
        side: 'right',
      },
      {
        id: 3,
        sender: 'Support',
        text: 'Escalated so the onboarding flow can be corrected before the next send.',
        time: '2026-04-08T06:55:00Z',
        side: 'left',
      },
    ],
  },
];

const campaigns = [
  {
    id: 'CMP-901',
    name: 'Spring combine reminder',
    channel: 'Push + In-app',
    audience: 'Athletes in shortlist pipeline',
    createdAt: '2026-04-08T08:30:00Z',
    sent: 'Today, 08:30',
    performance: '62% open rate',
  },
  {
    id: 'CMP-902',
    name: 'Premium NFC upsell',
    channel: 'Push',
    audience: 'Bracelet-ready free users',
    createdAt: '2026-04-07T16:00:00Z',
    sent: 'Yesterday, 16:00',
    performance: '18% conversion click-through',
  },
  {
    id: 'CMP-903',
    name: 'Recruiter re-engagement',
    channel: 'Email',
    audience: 'Dormant verified recruiters',
    createdAt: '2026-04-07T10:00:00Z',
    sent: 'Yesterday, 10:00',
    performance: '34% open rate',
  },
];

const templates = [
  {
    title: 'Verification approved',
    channel: 'In-app',
    status: 'live',
    updated: '4 days ago',
    updatedAt: '2026-04-04T09:15:00Z',
  },
  {
    title: 'Password reset code',
    channel: 'Email',
    status: 'live',
    updated: '7 days ago',
    updatedAt: '2026-04-01T11:40:00Z',
  },
  {
    title: 'Recruiter connection accepted',
    channel: 'Push',
    status: 'draft',
    updated: '1 day ago',
    updatedAt: '2026-04-07T15:10:00Z',
  },
  {
    title: 'Bracelet assigned',
    channel: 'SMS',
    status: 'live',
    updated: '9 days ago',
    updatedAt: '2026-03-30T14:05:00Z',
  },
];

const cardClass =
  'rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-6';

const sectionHeaderClass =
  'mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between';

const defaultQueuePageSize = 3;
const defaultCampaignPageSize = 2;
const defaultTemplatePageSize = 2;
const QUEUE_STORAGE_KEY = 'scoutme_admin_messaging_queue';
const CAMPAIGNS_STORAGE_KEY = 'scoutme_admin_messaging_campaigns';
const TEMPLATES_STORAGE_KEY = 'scoutme_admin_messaging_templates';

const defaultCampaignForm = {
  title: '',
  body: '',
  audience: 'All athletes',
  schedule: 'Send now',
  deepLink: '/dashboard',
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

const MetricCard = ({ title, value, icon, accent, hint, trend }) => {
  const animatedValue = useCountUp(value);

  return (
    <div className={`${cardClass} h-full transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.09)]`}>
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">{title}</p>
            <h3 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">{animatedValue.toLocaleString()}</h3>
          </div>
          <div className={`rounded-2xl ${accent} p-3 text-xl text-white shadow-lg`}>
            {createElement(icon)}
          </div>
        </div>
        <div className="flex items-end justify-between gap-3">
          <p className="text-sm leading-5 text-slate-500">{hint}</p>
          {trend ? (
            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              {trend}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const chartTooltipStyle = {
  borderRadius: 16,
  border: '1px solid #e2e8f0',
  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
};

const formatRate = (value) => `${value}%`;

const averageRate = (key) =>
  Math.round(deliveryData.reduce((total, item) => total + item[key], 0) / deliveryData.length);

const topChannel = deliveryData.reduce((best, item) => (item.openRate > best.openRate ? item : best), deliveryData[0]);

const DeliveryPerformanceChart = () => (
  <section className={`${cardClass} overflow-hidden`}>
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Performance analytics</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Delivery vs open rate</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Compare channel delivery quality with audience engagement across core notification surfaces.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-950" />
          Delivery rate
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
          Open rate
        </span>
      </div>
    </div>

    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Delivery avg</p>
        <p className="mt-1 text-2xl font-bold text-slate-950">{averageRate('deliveryRate')}%</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Open avg</p>
        <p className="mt-1 text-2xl font-bold text-slate-950">{averageRate('openRate')}%</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Top channel</p>
        <p className="mt-1 text-2xl font-bold text-slate-950">{topChannel.label}</p>
      </div>
    </div>

    <div className="h-[300px] w-full rounded-[22px] border border-slate-100 bg-white pt-2 xl:h-[320px] 2xl:h-[370px]">
      <BarChart
        data={deliveryData}
        responsive
        style={{ width: '100%', height: '100%' }}
        margin={{ top: 18, right: 22, left: 12, bottom: 8 }}
        barGap={10}
        barCategoryGap="30%"
      >
        <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={12}
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={56}
          tickMargin={10}
          domain={[0, 100]}
          tickFormatter={formatRate}
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <Tooltip formatter={formatRate} contentStyle={chartTooltipStyle} cursor={{ fill: '#f8fafc' }} />
        <Bar
          dataKey="deliveryRate"
          name="Delivery rate"
          fill="#0f172a"
          radius={[12, 12, 0, 0]}
          maxBarSize={46}
        />
        <Bar
          dataKey="openRate"
          name="Open rate"
          fill="#2563eb"
          radius={[12, 12, 0, 0]}
          maxBarSize={46}
        />
      </BarChart>
    </div>
  </section>
);

const priorityStyles = {
  high: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
  medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  low: 'bg-sky-50 text-sky-700 ring-1 ring-sky-100',
};

const statusStyles = {
  live: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  draft: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  sent: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
  scheduled: 'bg-violet-50 text-violet-700 ring-1 ring-violet-100',
};

const CampaignMetric = ({ value }) => {
  const [metric, ...labelParts] = value.split(' ');

  return (
    <div className="rounded-2xl bg-white px-3 py-2 text-right ring-1 ring-slate-200">
      <p className="text-base font-bold text-slate-950">{metric}</p>
      <p className="text-xs font-medium capitalize text-slate-500">{labelParts.join(' ') || 'metric'}</p>
    </div>
  );
};

const MessagingNotificationsPage = () => {
  const { addNotification } = useNotifications();
  const [queueItems, setQueueItems] = usePersistentState(QUEUE_STORAGE_KEY, moderationQueue, Array.isArray);
  const [campaignItems, setCampaignItems] = usePersistentState(CAMPAIGNS_STORAGE_KEY, campaigns, Array.isArray);
  const [templateItems] = usePersistentState(TEMPLATES_STORAGE_KEY, templates, Array.isArray);
  const [selectedCase, setSelectedCase] = useState(null);
  const [campaignComposerOpen, setCampaignComposerOpen] = useState(false);
  const [campaignForm, setCampaignForm] = useState(defaultCampaignForm);
  const [queueHighlighted, setQueueHighlighted] = useState(false);
  const [currentQueuePage, setCurrentQueuePage] = useState(1);
  const [currentCampaignPage, setCurrentCampaignPage] = useState(1);
  const [currentTemplatePage, setCurrentTemplatePage] = useState(1);
  const queuePageSize = defaultQueuePageSize;
  const campaignPageSize = defaultCampaignPageSize;
  const templatePageSize = defaultTemplatePageSize;
  const queueSectionRef = useRef(null);
  const campaignComposerRef = useRef(null);

  useEffect(() => {
    if (!queueHighlighted) return undefined;

    const timeout = window.setTimeout(() => setQueueHighlighted(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [queueHighlighted]);

  const totalQueuePages = Math.max(1, Math.ceil(queueItems.length / queuePageSize));
  const safeQueuePage = Math.min(currentQueuePage, totalQueuePages);
  const paginatedQueueItems = useMemo(() => {
    const startIndex = (safeQueuePage - 1) * queuePageSize;
    return queueItems.slice(startIndex, startIndex + queuePageSize);
  }, [queueItems, queuePageSize, safeQueuePage]);
  const sortedCampaignItems = useMemo(
    () =>
      [...campaignItems].sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      ),
    [campaignItems],
  );
  const totalCampaignPages = Math.max(1, Math.ceil(sortedCampaignItems.length / campaignPageSize));
  const safeCampaignPage = Math.min(currentCampaignPage, totalCampaignPages);
  const paginatedCampaignItems = useMemo(() => {
    const startIndex = (safeCampaignPage - 1) * campaignPageSize;
    return sortedCampaignItems.slice(startIndex, startIndex + campaignPageSize);
  }, [campaignPageSize, safeCampaignPage, sortedCampaignItems]);
  const sortedTemplates = useMemo(
    () =>
      [...templateItems].sort(
        (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
      ),
    [templateItems],
  );
  const totalTemplatePages = Math.max(1, Math.ceil(sortedTemplates.length / templatePageSize));
  const safeTemplatePage = Math.min(currentTemplatePage, totalTemplatePages);
  const paginatedTemplates = useMemo(() => {
    const startIndex = (safeTemplatePage - 1) * templatePageSize;
    return sortedTemplates.slice(startIndex, startIndex + templatePageSize);
  }, [safeTemplatePage, sortedTemplates, templatePageSize]);

  const handleReviewQueue = () => {
    if (!queueItems.length) {
      addNotification({
        type: 'success',
        title: 'Moderation queue is clear',
        message: 'There are no open messaging cases to review right now.',
      });
      return;
    }

    queueSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setQueueHighlighted(true);
    setCurrentQueuePage(1);
    setSelectedCase(queueItems[0]);
  };

  const openCampaignComposer = () => {
    setCampaignComposerOpen(true);
    requestAnimationFrame(() => {
      campaignComposerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleCreateCampaign = (event) => {
    event.preventDefault();

    const title = campaignForm.title.trim() || 'Untitled campaign';
    const channel = campaignForm.body.trim() ? 'Push + In-app' : 'Push';
    const sent =
      campaignForm.schedule === 'Send now'
        ? 'Just now'
        : campaignForm.schedule === 'Schedule later'
          ? 'Scheduled'
          : 'Draft saved';
    const performance =
      campaignForm.schedule === 'Save as draft' ? 'Draft ready for review' : 'Queued for delivery';

    setCampaignItems((current) => [
      {
        id: `CMP-${Date.now()}`,
        name: title,
        channel,
        audience: campaignForm.audience,
        createdAt: new Date().toISOString(),
        sent,
        performance,
      },
      ...current,
    ]);
    setCurrentCampaignPage(1);
    setCampaignComposerOpen(false);
    setCampaignForm(defaultCampaignForm);
    addNotification({
      type: 'success',
      title: 'Campaign created',
      message: `${title} was added to the messaging queue.`,
    });
  };

  const handleOpenCase = (item) => {
    setSelectedCase(item);
    queueSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setQueueHighlighted(true);
  };

  const handleSnoozeCase = (item) => {
    const nextQueue = queueItems.filter((entry) => entry.id !== item.id);
    setQueueItems(nextQueue);
    setSelectedCase((current) => (current?.id === item.id ? nextQueue[0] || null : current));
    addNotification({
      type: 'info',
      title: 'Case snoozed',
      message: `${item.conversation} was removed from the active moderation queue.`,
    });
  };

  const handleFlagSelectedCase = () => {
    if (!selectedCase) return;

    addNotification({
      type: 'warning',
      title: 'Conversation flagged',
      message: `${selectedCase.conversation} was escalated for further moderation review.`,
    });
  };

  const handleExportReport = () => {
    addNotification({
      type: 'success',
      title: 'Messaging report exported',
      message: 'A delivery and moderation report was prepared for this workspace.',
    });
  };

  const handleTemplateAction = () => {
    addNotification({
      type: 'info',
      title: 'Template action queued',
      message: 'Template creation will open when the template builder is connected.',
    });
  };

  const handleFilterAction = () => {
    addNotification({
      type: 'info',
      title: 'Filters ready',
      message: 'Channel and date filters can be connected to live reporting data.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-full space-y-5 2xl:space-y-6">
          <div className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                  <FiBell />
                  Messaging & notifications
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Control communication quality and delivery health
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  Review message safety, monitor campaign performance, and keep in-app, push, email, and SMS delivery
                  reliable across the ScoutMe platform.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <button
                  type="button"
                  onClick={handleFilterAction}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <FiFilter />
                  Filter
                </button>
                <button
                  type="button"
                  onClick={handleReviewQueue}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <FiShield />
                  Review queue
                </button>
                <button
                  type="button"
                  onClick={handleTemplateAction}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <FiFileText />
                  New template
                </button>
                <button
                  type="button"
                  onClick={handleExportReport}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <FiDownload />
                  Export
                </button>
                <button
                  type="button"
                  onClick={openCampaignComposer}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
                >
                  <FiPlus />
                  Create campaign
                </button>
              </div>
            </div>
          </div>

          {campaignComposerOpen ? (
            <section ref={campaignComposerRef} className={cardClass}>
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Create campaign</h2>
                  <p className="mt-1 text-sm text-slate-500">Draft a new outreach campaign and push it into the recent campaigns list.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCampaignComposerOpen(false);
                    setCampaignForm(defaultCampaignForm);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleCreateCampaign} className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Title</span>
                  <input
                    value={campaignForm.title}
                    onChange={(event) => setCampaignForm((current) => ({ ...current, title: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Verified athlete recommendations"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Body</span>
                  <textarea
                    rows={4}
                    value={campaignForm.body}
                    onChange={(event) => setCampaignForm((current) => ({ ...current, body: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Add the message content for this campaign..."
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Audience</span>
                  <select
                    value={campaignForm.audience}
                    onChange={(event) => setCampaignForm((current) => ({ ...current, audience: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  >
                    <option>All athletes</option>
                    <option>All recruiters</option>
                    <option>Verified athletes</option>
                    <option>North America recruiters</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Schedule</span>
                  <select
                    value={campaignForm.schedule}
                    onChange={(event) => setCampaignForm((current) => ({ ...current, schedule: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  >
                    <option>Send now</option>
                    <option>Schedule later</option>
                    <option>Save as draft</option>
                  </select>
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Deep link</span>
                  <input
                    value={campaignForm.deepLink}
                    onChange={(event) => setCampaignForm((current) => ({ ...current, deepLink: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                    placeholder="/messaging-notifications"
                  />
                </label>

                <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setCampaignComposerOpen(false);
                      setCampaignForm(defaultCampaignForm);
                    }}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Save campaign
                  </button>
                </div>
              </form>
            </section>
          ) : null}

          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Messages delivered" value={44780} icon={FiMessageSquare} accent="bg-slate-900" hint="Across all channels." trend="+12%" />
            <MetricCard title="Push opens" value={8640} icon={FiSend} accent="bg-blue-600" hint="Push notification open events." trend="+8%" />
            <MetricCard title="Moderation cases" value={118} icon={FiShield} accent="bg-amber-500" hint="Open reports and escalations." trend="-4%" />
            <MetricCard title="Audience segments" value={36} icon={FiTarget} accent="bg-emerald-600" hint="Saved automation cohorts." trend="+3" />
          </div>

          <div className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-[1.15fr_1fr] 2xl:gap-6">
            <DeliveryPerformanceChart />

            <section
              ref={queueSectionRef}
              className={`${cardClass} transition ${queueHighlighted ? 'ring-2 ring-rose-200 ring-offset-4 ring-offset-slate-50' : ''}`}
            >
              <div className={sectionHeaderClass}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">Moderation workflow</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Message moderation queue</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Review communication cases and keep platform messaging trustworthy.
                  </p>
                </div>
                <span className="inline-flex self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {queueItems.length} active
                </span>
              </div>

              {selectedCase ? (
                <div className="mb-4 rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Active review</p>
                      <p className="mt-1 font-semibold text-slate-950">{selectedCase.conversation}</p>
                      <p className="mt-1 text-sm text-slate-500">{selectedCase.participants.join(' / ')}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Last updated {new Date(selectedCase.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleFlagSelectedCase}
                        className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        Flag conversation
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCase(null)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid max-h-[260px] gap-3 overflow-y-auto pr-1">
                    {selectedCase.messages.map((message) => (
                      <div key={message.id} className={`flex ${message.side === 'right' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
                            message.side === 'right'
                              ? 'bg-slate-950 text-white'
                              : 'border border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          <p className={`mb-1 text-xs font-semibold ${message.side === 'right' ? 'text-slate-300' : 'text-slate-500'}`}>
                            {message.sender}
                          </p>
                          <p>{message.text}</p>
                          <p className={`mt-2 text-[11px] ${message.side === 'right' ? 'text-slate-300' : 'text-slate-500'}`}>
                            {new Date(message.time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid gap-3">
                {queueItems.length ? (
                  paginatedQueueItems.map((item) => (
                    <article key={item.id} className="rounded-[20px] border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-950">{item.conversation}</p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{item.id}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${priorityStyles[item.priority] || priorityStyles.low}`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                        <p>
                          <span className="font-semibold text-slate-800">Reason:</span> {item.reportReason}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-800">Escalated:</span> {item.escalatedBy}
                        </p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenCase(item)}
                          className="flex-1 rounded-xl bg-slate-950 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Open case
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSnoozeCase(item)}
                          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Snooze
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                    <p className="text-base font-semibold text-slate-900">Moderation queue is clear</p>
                    <p className="mt-2 text-sm text-slate-500">Open cases have been reviewed or snoozed for later follow-up.</p>
                  </div>
                )}
              </div>
              {queueItems.length ? (
                <div className="mt-5 flex justify-end border-t border-slate-200 pt-4">
                  <Pagination page={safeQueuePage} totalPages={totalQueuePages} onPageChange={setCurrentQueuePage} />
                </div>
              ) : null}
            </section>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-[1.05fr_1.2fr] 2xl:gap-6">
            <section className={cardClass}>
              <div className={sectionHeaderClass}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Campaign history</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Recent campaigns</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">Track audience targeting and delivery results.</p>
                </div>
                <button
                  type="button"
                  onClick={openCampaignComposer}
                  className="inline-flex items-center gap-2 self-start rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <FiPlus />
                  Create
                </button>
              </div>

              <div className="grid gap-3">
                {paginatedCampaignItems.map((item) => (
                  <article key={item.id} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white hover:shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-950">{item.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.channel}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles.sent}`}>
                        Sent
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                      <div className="grid gap-2 text-sm text-slate-600">
                        <p>
                          <span className="font-semibold text-slate-800">Audience:</span> {item.audience}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-800">Sent:</span> {item.sent}
                        </p>
                      </div>
                      <CampaignMetric value={item.performance} />
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="flex justify-end">
                  <Pagination
                    page={safeCampaignPage}
                    totalPages={totalCampaignPages}
                    onPageChange={setCurrentCampaignPage}
                  />
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <div className={sectionHeaderClass}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Automation assets</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Templates & automation assets</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">Keep transactional and promotional templates organized and up to date.</p>
                </div>
                <button
                  type="button"
                  onClick={handleTemplateAction}
                  className="inline-flex items-center gap-2 self-start rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <FiFileText />
                  New template
                </button>
              </div>
              <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                  <div className="md:min-w-[860px]">
                    <div className="hidden grid-cols-[1.35fr_0.7fr_0.7fr_0.75fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:grid">
                      <span>Template</span>
                      <span>Channel</span>
                      <span>Status</span>
                      <span>Updated</span>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {paginatedTemplates.map((template) => (
                        <div key={template.title} className="grid gap-3 px-5 py-4 transition hover:bg-slate-50 md:grid-cols-[1.35fr_0.7fr_0.7fr_0.75fr] md:items-center">
                          <div>
                            <p className="font-semibold text-slate-900">{template.title}</p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 md:hidden">
                              Template
                            </p>
                          </div>
                          <p className="text-sm font-medium text-slate-700">{template.channel}</p>
                          <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[template.status] || statusStyles.draft}`}>
                            {template.status}
                          </span>
                          <p className="text-sm font-medium text-slate-500">{template.updated}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="flex justify-end">
                  <Pagination
                    page={safeTemplatePage}
                    totalPages={totalTemplatePages}
                    onPageChange={setCurrentTemplatePage}
                  />
                </div>
              </div>
            </section>
          </div>
      </div>
    </div>
  );
};

export default MessagingNotificationsPage;
