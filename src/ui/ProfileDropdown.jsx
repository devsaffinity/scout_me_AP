import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiChevronRight,
  FiLogOut,
  FiSettings,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/routes.constants';

const joinClasses = (...classes) => classes.filter(Boolean).join(' ');

const menuItems = [
  {
    key: 'profile-settings',
    label: 'Profile settings',
    description: 'View account details and change your password',
    icon: FiSettings,
    to: ROUTES.PROFILE_SETTINGS,
  },
];

const ProfileDropdown = ({
  open,
  onClose,
  anchorRef,
}) => {
  const panelRef = useRef(null);
  const [mobileLayout, setMobileLayout] = useState(null);
  const { adminUser, logout } = useAuth();

  useEffect(() => {
    if (!open) return undefined;

    const updateLayout = () => {
      const anchorRect = anchorRef?.current?.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      if (!anchorRect || viewportWidth >= 640) {
        setMobileLayout(null);
        return;
      }

      const width = Math.min(viewportWidth - 32, 352);
      const left = Math.max(16, viewportWidth - width - 16);

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

  const initials = adminUser?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'AD';

  return (
    <div
      ref={panelRef}
      className={joinClasses(
        'z-50 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-950/10',
        mobileLayout
          ? 'fixed max-h-[min(70vh,32rem)] overflow-auto'
          : 'absolute right-0 top-[calc(100%+12px)] w-[min(92vw,22rem)]',
      )}
      style={mobileLayout || undefined}
    >
      <div className="mb-4 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-violet-900 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{adminUser?.name || 'Admin User'}</p>
            <p className="truncate text-xs text-white/70">{adminUser?.email || 'admin@scoutme.io'}</p>
            <div className="mt-2 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85">
              {adminUser?.role || 'Super Admin'}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              to={item.to}
              onClick={onClose}
              className={joinClasses(
                'group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 transition',
                'hover:border-slate-200 hover:bg-slate-50',
              )}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-white">
                <Icon size={17} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="truncate text-xs text-slate-500">{item.description}</p>
              </div>

              <FiChevronRight className="text-slate-400 transition group-hover:text-slate-700" />
            </Link>
          );
        })}
      </div>

      <div className="mt-4 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={() => {
            logout();
            onClose?.();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
        >
          <FiLogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
