import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiInfo,
  FiRefreshCcw,
  FiX,
} from 'react-icons/fi';
import { useNotifications } from '../context/NotificationContext';
import { ROUTES } from '../routes/routes.constants';

const typeIconMap = {
  success: FiCheckCircle,
  warning: FiClock,
  error: FiX,
  info: FiInfo,
};

const typeStylesMap = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  warning: 'bg-amber-50 text-amber-700 ring-amber-100',
  error: 'bg-rose-50 text-rose-700 ring-rose-100',
  info: 'bg-sky-50 text-sky-700 ring-sky-100',
};

const formatRelativeTime = (dateValue) => {
  const date = new Date(dateValue);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return 'Just now';
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  if (diffMs < day * 7) return `${Math.floor(diffMs / day)}d ago`;

  return date.toLocaleDateString();
};

const joinClasses = (...classes) => classes.filter(Boolean).join(' ');

const resolveNotificationRoute = (notification) => {
  if (notification.route) return notification.route;

  const text = `${notification.title || ''} ${notification.message || ''}`.toLowerCase();

  if (/(profile|password|account details)/.test(text)) return ROUTES.PROFILE_SETTINGS;
  if (/(athlete|recruiter|verification|applicant|user)/.test(text)) return ROUTES.USERS_PROFILES;
  if (/(discovery|engagement|surface|profile views|recommendation)/.test(text)) return ROUTES.DISCOVERY_ENGAGEMENT;
  if (/(message|messaging|notification|campaign|conversation|moderation|template|delivery|filter|case)/.test(text)) {
    return ROUTES.MESSAGING_NOTIFICATIONS;
  }
  if (/(premium|nfc|bracelet|subscription|billing|scan|plan)/.test(text)) return ROUTES.PREMIUM_NFC;

  return ROUTES.DASHBOARD;
};

const NotificationRow = ({
  notification,
  onMarkRead,
  onRemove,
  onOpen,
}) => {
  const Icon = typeIconMap[notification.type] || FiBell;
  const iconClass = typeStylesMap[notification.type] || typeStylesMap.info;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(notification)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(notification);
        }
      }}
      className={joinClasses(
        'cursor-pointer rounded-2xl border p-3 text-left transition hover:border-slate-300 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300',
        notification.read
          ? 'border-slate-200 bg-white'
          : 'border-violet-200 bg-violet-50/50',
      )}
    >
      <div className="flex items-start gap-3">
        <div className={joinClasses('mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1', iconClass)}>
          <Icon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {notification.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {notification.message}
              </p>
            </div>

            {!notification.read ? (
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-violet-500" />
            ) : null}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
              {formatRelativeTime(notification.createdAt)}
            </span>

            <div className="flex items-center gap-1">
              {!notification.read ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onMarkRead(notification.id);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-900"
                  aria-label="Mark notification as read"
                  title="Mark as read"
                >
                  <FiCheck size={16} />
                </button>
              ) : null}

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onRemove(notification.id);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-rose-600"
                aria-label="Remove notification"
                title="Remove"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationDropdown = ({
  open,
  onClose,
  anchorRef,
}) => {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [mobileLayout, setMobileLayout] = useState(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    seedNotifications,
  } = useNotifications();

  const visibleNotifications = useMemo(
    () => notifications.slice(0, 8),
    [notifications],
  );

  const handleOpenNotification = (notification) => {
    markAsRead(notification.id);
    navigate(resolveNotificationRoute(notification));
    onClose?.();
  };

  useEffect(() => {
    if (!open) return undefined;

    const updateLayout = () => {
      const anchorRect = anchorRef?.current?.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      if (!anchorRect || viewportWidth >= 640) {
        setMobileLayout(null);
        return;
      }

      const width = Math.min(viewportWidth - 32, 384);
      const left = Math.max(16, Math.min(viewportWidth - width - 16, anchorRect.right - width));

      setMobileLayout({
        left,
        top: anchorRect.bottom + 12,
        width,
      });
    };

    updateLayout();

    const handlePointerDown = (event) => {
      const target = event.target;

      if (
        panelRef.current?.contains(target) ||
        anchorRef?.current?.contains(target)
      ) {
        return;
      }

      onClose?.();
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('resize', updateLayout);
    window.addEventListener('scroll', updateLayout, true);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('scroll', updateLayout, true);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className={joinClasses(
        'z-50 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-950/10',
        mobileLayout
          ? 'fixed max-h-[min(70vh,32rem)] overflow-hidden'
          : 'absolute right-0 top-[calc(100%+12px)] w-[min(92vw,24rem)]',
      )}
      style={mobileLayout || undefined}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
          <p className="mt-1 text-xs text-slate-500">
            {unreadCount > 0 ? `${unreadCount} unread alerts` : 'You are all caught up'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={seedNotifications}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:text-slate-900"
            aria-label="Refresh notifications"
            title="Refresh notifications"
          >
            <FiRefreshCcw size={16} />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:text-slate-900"
            aria-label="Close notifications"
          >
            <FiX size={16} />
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
        <span className="text-xs font-medium text-slate-500">Inbox</span>
        <button
          type="button"
          onClick={markAllAsRead}
          className="text-xs font-semibold text-violet-600 transition hover:text-violet-700"
        >
          Mark all as read
        </button>
      </div>

      {visibleNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <FiBell size={18} />
          </div>
          <p className="text-sm font-semibold text-slate-900">No notifications</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            New approvals, alerts, and system messages will appear here.
          </p>
        </div>
      ) : (
        <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
          {visibleNotifications.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onMarkRead={markAsRead}
              onRemove={removeNotification}
              onOpen={handleOpenNotification}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
