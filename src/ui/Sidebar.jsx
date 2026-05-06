import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { dashboardNavigationSections } from '../routes/navigation.config';
import { useSidebar } from '../context/SidebarContext';

// eslint-disable-next-line react-refresh/only-export-components
export const defaultNavigationSections = dashboardNavigationSections;

const joinClasses = (...classes) => classes.filter(Boolean).join(' ');

const SidebarBrand = ({ collapsed }) => (
  <div
    className={joinClasses(
      'mx-3 mt-3 flex items-center gap-3 rounded-[28px] border border-white/10 bg-white/[0.04] px-4 py-4 shadow-[0_28px_60px_-40px_rgba(34,211,238,0.9)]',
      collapsed && 'mx-0 mt-0 w-full justify-center px-0 py-3',
    )}
  >
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#8b5cf6_0%,#3b82f6_55%,#22d3ee_100%)] text-sm font-bold tracking-[0.2em] text-white shadow-[0_16px_40px_-18px_rgba(59,130,246,0.9)]">
      SM
    </div>

    {!collapsed ? (
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tracking-[0.18em] text-white">
          ScoutMe Admin
        </p>
        <p className="truncate text-xs text-slate-400">
          Operations workspace
        </p>
      </div>
    ) : null}
  </div>
);

const SidebarLink = ({ item, collapsed }) => {
  const Icon = item.icon;
  const location = useLocation();
  const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

  return (
    <NavLink
      to={item.path}
      className={({ isActive: navActive }) =>
        joinClasses(
          'group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-3 py-2.5 text-sm font-medium transition-all duration-200 2xl:py-3',
          collapsed ? 'justify-center' : 'justify-start',
          isActive || navActive
            ? 'border-cyan-400/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.2),rgba(59,130,246,0.12),transparent)] text-white shadow-[0_22px_45px_-30px_rgba(34,211,238,0.9)]'
            : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white',
        )
      }
      title={collapsed ? item.label : undefined}
    >
      <span
        className={joinClasses(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
          isActive
            ? 'bg-white/10 text-cyan-200 ring-1 ring-white/10'
            : 'bg-white/[0.06] text-slate-300 group-hover:bg-white/[0.08] group-hover:text-white',
        )}
      >
        <Icon size={18} />
      </span>

      {!collapsed ? <span className="truncate">{item.label}</span> : null}
    </NavLink>
  );
};

const SidebarSection = ({ section, collapsed }) => {
  if (!section?.items?.length) return null;

  return (
    <div className="space-y-2">
      {!collapsed ? (
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
          {section.title}
        </p>
      ) : null}

      <div className="space-y-1">
        {section.items.map((item) => (
          <SidebarLink key={item.key || item.path} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
};

const Sidebar = ({
  sections = defaultNavigationSections,
  brand,
  footer,
  className = '',
}) => {
  const { collapsed, toggleCollapsed } = useSidebar();

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

  return (
    <aside
      className={joinClasses(
        'sticky top-0 hidden h-screen shrink-0 border-r border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_20%),linear-gradient(180deg,rgba(8,18,37,0.98)_0%,rgba(8,15,31,0.98)_100%)] text-slate-100 shadow-[20px_0_60px_-42px_rgba(2,6,23,0.95)] backdrop-blur xl:flex',
        collapsed ? 'w-[88px] 2xl:w-[96px]' : 'w-[260px] 2xl:w-[288px]',
        className,
      )}
    >
      <div className="flex w-full flex-col">
        <div
          className={joinClasses(
            'pt-1',
            collapsed
              ? 'flex flex-col items-center gap-3 px-3 pt-3'
              : 'flex items-center justify-between px-2',
          )}
        >
          {brand || <SidebarBrand collapsed={collapsed} />}

          <button
            type="button"
            onClick={toggleCollapsed}
            className={joinClasses(
              'inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white',
              !collapsed && 'mr-2',
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 pt-4">
          <div className="space-y-5">
            {normalizedSections.map((section) => (
              <SidebarSection key={section.title} section={section} collapsed={collapsed} />
            ))}
          </div>
        </div>
        {footer ? <div className="border-t border-white/10 p-3">{footer}</div> : null}
      </div>
    </aside>
  );
};

export default Sidebar;
