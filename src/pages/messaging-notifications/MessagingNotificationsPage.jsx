import { useEffect, useMemo, useRef, useState } from 'react';
import { FiBell, FiMessageSquare, FiSend, FiShield, FiTarget } from 'react-icons/fi';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import Pagination from '../../components/shared/Pagination';
import { useNotifications } from '../../context/NotificationContext';
import usePersistentState from '../../hooks/usePersistentState';

const deliveryData = [
  { label: 'In-app', delivered: 18240, opened: 12110 },
  { label: 'Push', delivered: 14820, opened: 8640 },
  { label: 'Email', delivered: 8620, opened: 4310 },
  { label: 'SMS', delivered: 3120, opened: 2640 },
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
  'rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]';

const defaultQueuePageSize = 3;
const defaultCampaignPageSize = 2;
const defaultTemplatePageSize = 2;
const pageSizeOptions = [2, 3, 4, 6];
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

const MetricCard = ({ title, value, icon: Icon, accent, hint }) => {
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
  const [queuePageSize, setQueuePageSize] = useState(defaultQueuePageSize);
  const [campaignPageSize, setCampaignPageSize] = useState(defaultCampaignPageSize);
  const [templatePageSize, setTemplatePageSize] = useState(defaultTemplatePageSize);
  const queueSectionRef = useRef(null);
  const campaignComposerRef = useRef(null);

  useEffect(() => {
    if (!queueHighlighted) return undefined;

    const timeout = window.setTimeout(() => setQueueHighlighted(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [queueHighlighted]);

  const totalQueuePages = Math.max(1, Math.ceil(queueItems.length / queuePageSize));
  const paginatedQueueItems = useMemo(() => {
    const startIndex = (currentQueuePage - 1) * queuePageSize;
    return queueItems.slice(startIndex, startIndex + queuePageSize);
  }, [currentQueuePage, queueItems]);
  const sortedCampaignItems = useMemo(
    () =>
      [...campaignItems].sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      ),
    [campaignItems],
  );
  const totalCampaignPages = Math.max(1, Math.ceil(sortedCampaignItems.length / campaignPageSize));
  const paginatedCampaignItems = useMemo(() => {
    const startIndex = (currentCampaignPage - 1) * campaignPageSize;
    return sortedCampaignItems.slice(startIndex, startIndex + campaignPageSize);
  }, [currentCampaignPage, sortedCampaignItems]);
  const sortedTemplates = useMemo(
    () =>
      [...templateItems].sort(
        (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
      ),
    [templateItems],
  );
  const totalTemplatePages = Math.max(1, Math.ceil(sortedTemplates.length / templatePageSize));
  const paginatedTemplates = useMemo(() => {
    const startIndex = (currentTemplatePage - 1) * templatePageSize;
    return sortedTemplates.slice(startIndex, startIndex + templatePageSize);
  }, [currentTemplatePage, sortedTemplates]);

  useEffect(() => {
    if (currentQueuePage > totalQueuePages) {
      setCurrentQueuePage(totalQueuePages);
    }
  }, [currentQueuePage, totalQueuePages]);

  useEffect(() => {
    if (currentCampaignPage > totalCampaignPages) {
      setCurrentCampaignPage(totalCampaignPages);
    }
  }, [currentCampaignPage, totalCampaignPages]);

  useEffect(() => {
    if (currentTemplatePage > totalTemplatePages) {
      setCurrentTemplatePage(totalTemplatePages);
    }
  }, [currentTemplatePage, totalTemplatePages]);

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

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                  <FiBell />
                  Messaging & notifications
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Control communication quality and delivery health</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  Review message safety, monitor campaign performance, and keep in-app, push, email, and SMS delivery
                  reliable across the ScoutMe platform.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleReviewQueue}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Review queue
                </button>
                <button
                  type="button"
                  onClick={openCampaignComposer}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
                >
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Messages delivered" value={44780} icon={FiMessageSquare} accent="bg-slate-900" hint="Across all communication channels." />
            <MetricCard title="Push opens" value={8640} icon={FiSend} accent="bg-blue-600" hint="Push notification open events." />
            <MetricCard title="Moderation cases" value={118} icon={FiShield} accent="bg-amber-500" hint="Open reports and escalations." />
            <MetricCard title="Audience segments" value={36} icon={FiTarget} accent="bg-emerald-600" hint="Saved campaigns and automation cohorts." />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_1fr]">
            <section className={cardClass}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-950">Delivery vs open rate</h2>
                <p className="mt-1 text-sm text-slate-500">Measure channel efficiency before planning the next campaign.</p>
              </div>
              <div className="h-[320px] w-full">
                <BarChart data={deliveryData} responsive style={{ width: '100%', height: '100%' }}>
                  <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={50} />
                  <Tooltip />
                  <Bar dataKey="delivered" fill="#0f172a" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="opened" fill="#2563eb" radius={[10, 10, 0, 0]} />
                </BarChart>
              </div>
            </section>

            <section
              ref={queueSectionRef}
              className={`${cardClass} transition ${queueHighlighted ? 'ring-2 ring-rose-200 ring-offset-4 ring-offset-slate-50' : ''}`}
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-950">Message moderation queue</h2>
                <p className="mt-1 text-sm text-slate-500">Cases requiring review to protect trust and keep communication safe.</p>
              </div>
              {selectedCase ? (
                <div className="mb-4 rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{selectedCase.conversation}</p>
                      <p className="mt-1 text-sm text-slate-500">{selectedCase.participants.join(' / ')}</p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
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

                  <div className="mt-4 grid gap-3">
                    {selectedCase.messages.map((message) => (
                      <div key={message.id} className={`flex ${message.side === 'right' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[90%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
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
              <div className="space-y-3">
                {queueItems.length ? (
                  paginatedQueueItems.map((item) => (
                    <article key={item.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950">{item.conversation}</p>
                          <p className="mt-1 text-sm text-slate-500">{item.id}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            item.priority === 'high'
                              ? 'bg-rose-100 text-rose-700'
                              : item.priority === 'medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-sky-100 text-sky-700'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <p>{item.reportReason}</p>
                        <p>Escalated by {item.escalatedBy}</p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenCase(item)}
                          className="flex-1 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Open case
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSnoozeCase(item)}
                          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
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
                <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm text-slate-500">
                      Showing {(currentQueuePage - 1) * queuePageSize + 1}
                      -
                      {Math.min(currentQueuePage * queuePageSize, queueItems.length)} of {queueItems.length} cases
                    </p>
                    <PageSizeControl
                      value={queuePageSize}
                      onChange={(value) => {
                        setQueuePageSize(value);
                        setCurrentQueuePage(1);
                      }}
                    />
                  </div>
                  <Pagination page={currentQueuePage} totalPages={totalQueuePages} onPageChange={setCurrentQueuePage} />
                </div>
              ) : null}
            </section>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_1.2fr]">
            <section className={cardClass}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-950">Recent campaigns</h2>
                <p className="mt-1 text-sm text-slate-500">Track audience targeting and delivery results.</p>
              </div>
              <div className="space-y-3">
                {paginatedCampaignItems.map((item) => (
                  <article key={item.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{item.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.channel}</p>
                      </div>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        Sent
                      </span>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>{item.audience}</p>
                      <p>{item.sent}</p>
                      <p className="font-semibold text-slate-900">{item.performance}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm text-slate-500">
                      Showing {(currentCampaignPage - 1) * campaignPageSize + 1}
                      -
                      {Math.min(currentCampaignPage * campaignPageSize, sortedCampaignItems.length)} of {sortedCampaignItems.length} campaigns
                    </p>
                    <PageSizeControl
                      value={campaignPageSize}
                      onChange={(value) => {
                        setCampaignPageSize(value);
                        setCurrentCampaignPage(1);
                      }}
                    />
                  </div>
                  <Pagination
                    page={currentCampaignPage}
                    totalPages={totalCampaignPages}
                    onPageChange={setCurrentCampaignPage}
                  />
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-950">Templates & automation assets</h2>
                <p className="mt-1 text-sm text-slate-500">Keep transactional and promotional templates organized and up to date.</p>
              </div>
              <div className="overflow-hidden rounded-[22px] border border-slate-200">
                <div className="overflow-x-auto">
                  <div className="md:min-w-[860px]">
                    <div className="hidden grid-cols-[1.3fr_0.8fr_0.7fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:grid">
                      <span>Template</span>
                      <span>Channel</span>
                      <span>Status</span>
                      <span>Updated</span>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {paginatedTemplates.map((template) => (
                        <div key={template.title} className="grid gap-3 px-5 py-4 md:grid-cols-[1.3fr_0.8fr_0.7fr_0.8fr] md:items-center">
                          <p className="font-semibold text-slate-900">{template.title}</p>
                          <p className="text-sm text-slate-700">{template.channel}</p>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${template.status === 'live' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {template.status}
                          </span>
                          <p className="text-sm text-slate-500">{template.updated}</p>
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
                      Showing {(currentTemplatePage - 1) * templatePageSize + 1}
                      -
                      {Math.min(currentTemplatePage * templatePageSize, sortedTemplates.length)} of {sortedTemplates.length} templates
                    </p>
                    <PageSizeControl
                      value={templatePageSize}
                      onChange={(value) => {
                        setTemplatePageSize(value);
                        setCurrentTemplatePage(1);
                      }}
                    />
                  </div>
                  <Pagination
                    page={currentTemplatePage}
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
