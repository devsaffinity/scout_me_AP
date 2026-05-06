import React, { useEffect, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  FiBell,
  FiChevronRight,
  FiLogOut,
  FiShield,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { dashboardNavigationSections } from '../routes/navigation.config';
import { ROUTES } from '../routes/routes.constants';

const joinClasses = (...classes) => classes.filter(Boolean).join(' ');

const MobileSidebar = ({
  open,
  onClose,
  sections = dashboardNavigationSections,
}) => {
  const { adminUser, logout } = useAuth();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    if (!open) {
      document.body.style.removeProperty('overflow');
      return undefined;
    }

    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.removeProperty('overflow');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  const normalizedSections = useMemo(
    () =>
      sections
        .filter(Boolean)
        .map((section) => ({
          ...section,
          items: (section.items || []).filter(Boolean),
        }))
        .filter((section) => section.items.length > 0),
    [sections],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-[3px]"
        onClick={onClose}
        aria-label="Close sidebar overlay"
      />

      <div className="absolute left-0 top-0 flex h-full w-[88vw] max-w-sm flex-col border-r border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_24%),linear-gradient(180deg,rgba(8,18,37,0.99)_0%,rgba(8,15,31,0.99)_100%)] text-white shadow-2xl shadow-slate-950/40">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 text-sm font-bold tracking-[0.2em] text-white">
              SM
            </div>
            <div>
              <p className="text-sm font-semibold text-white">ScoutMe Admin</p>
              <p className="text-xs text-slate-400">Operations workspace</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Close sidebar"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="border-b border-white/10 px-4 py-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-white">
            <p className="text-sm font-semibold">{adminUser?.name || 'Admin User'}</p>
            <p className="mt-1 text-xs text-slate-400">{adminUser?.email || 'admin@scoutme.io'}</p>
            <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2">
              <span className="text-xs text-slate-300">Unread alerts</span>
              <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-cyan-300 px-2 py-1 text-xs font-semibold text-slate-950">
                {unreadCount}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-5">
            {normalizedSections.map((section) => (
              <div key={section.title} className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {section.title}
                </p>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.key || item.path}
                        to={item.path}
                        onClick={onClose}
                        className="block"
                      >
                        {({ isActive }) => (
                          <div
                            className={joinClasses(
                              'flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition',
                              isActive
                                ? 'border-cyan-400/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.22),rgba(59,130,246,0.12),transparent)] text-white'
                                : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white',
                            )}
                          >
                            <span
                              className={joinClasses(
                                'flex h-10 w-10 items-center justify-center rounded-xl transition',
                                isActive
                                  ? 'bg-white/10 text-cyan-200'
                                  : 'bg-white/[0.06] text-slate-300',
                              )}
                            >
                              <Icon size={18} />
                            </span>
                            <span className="min-w-0 flex-1 truncate">{item.label}</span>
                            <FiChevronRight size={16} className={isActive ? 'text-cyan-200' : 'text-slate-500'} />
                          </div>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200">
                  <FiShield size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Protection status</p>
                  <p className="text-xs text-slate-400">All guardrails active</p>
                </div>
              </div>

              <Link
                to={ROUTES.MESSAGING_NOTIFICATIONS}
                onClick={onClose}
                className="mt-2 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/[0.06] hover:text-white"
              >
                <span>Open alerts workspace</span>
                <FiChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] px-3 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
                <FiBell size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Notifications</p>
                <p className="text-xs text-slate-400">Stay on top of alerts</p>
              </div>
            </div>
            <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-cyan-300 px-2 py-1 text-xs font-semibold text-slate-950">
              {unreadCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              onClose?.();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/15"
          >
            <FiLogOut size={16} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
