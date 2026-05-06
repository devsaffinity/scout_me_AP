import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiBell, FiChevronDown, FiMenu } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { resolvePageMeta } from "../routes/navigation.config";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

const formatWelcome = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Topbar = ({ onOpenMobileSidebar, extraActions = null }) => {
  const location = useLocation();
  const { adminUser } = useAuth();
  const { unreadCount } = useNotifications();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notificationButtonRef = useRef(null);
  const profileButtonRef = useRef(null);

  const pageMeta = useMemo(
    () => resolvePageMeta(location.pathname),
    [location.pathname],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsNotificationOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const initials =
    adminUser?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AD";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-slate-50/92 backdrop-blur xl:ml-0">
      <div className="mx-auto w-full max-w-full px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 lg:px-6 2xl:px-8">
        <div
          className={joinClasses(
            "flex flex-wrap items-start gap-2 md:gap-4 xl:grid",
            "xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center xl:gap-6",
          )}
        >
          <div className="flex min-w-0 flex-1 basis-0 items-start gap-2 xl:items-center">
            <button
              type="button"
              onClick={onOpenMobileSidebar}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:text-slate-900 sm:h-10 sm:w-10 sm:rounded-2xl xl:hidden"
              aria-label="Open mobile sidebar"
            >
              <FiMenu size={16} />
            </button>

            <div className="min-w-0 space-y-0.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-600 sm:text-[11px] md:text-xs">
                {formatWelcome()}, {adminUser?.name?.split(" ")?.[0] || "Admin"}
              </p>
              <h1 className="truncate text-[1.15rem] font-semibold leading-tight tracking-tight text-slate-950 sm:text-xl md:text-2xl">
                {pageMeta.title}
              </h1>
              <p className="hidden max-w-2xl text-sm leading-5 text-slate-500 sm:block xl:max-w-3xl">
                {pageMeta.subtitle}
              </p>
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
            {extraActions ? (
              <div className="hidden flex-wrap items-center gap-2 sm:flex xl:justify-end">
                {extraActions}
              </div>
            ) : null}

            <div className="relative">
              <button
                ref={notificationButtonRef}
                type="button"
                onClick={() => {
                  setIsNotificationOpen((current) => !current);
                  setIsProfileOpen(false);
                }}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:text-slate-900 sm:h-11 sm:w-11 sm:rounded-2xl md:h-12 md:w-12"
                aria-label="Open notifications"
              >
                <FiBell size={16} />
                {unreadCount > 0 ? (
                  <span className="absolute right-1 top-1 inline-flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-semibold text-white sm:right-2 sm:top-2 sm:min-h-5 sm:min-w-5 sm:px-1.5 sm:text-[10px]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </button>

              <NotificationDropdown
                open={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                anchorRef={notificationButtonRef}
              />
            </div>

            <div className="relative">
              <button
                ref={profileButtonRef}
                type="button"
                onClick={() => {
                  setIsProfileOpen((current) => !current);
                  setIsNotificationOpen(false);
                }}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 py-1.5 transition hover:border-slate-300 sm:gap-2 sm:rounded-2xl sm:px-2.5 sm:py-2"
                aria-label="Open profile menu"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-semibold text-white sm:h-8 sm:w-8 sm:rounded-xl sm:text-xs">
                  {initials}
                </div>

                <div className="hidden text-left md:block">
                  <p className="max-w-48 truncate text-sm font-semibold text-slate-900">
                    {adminUser?.name || "Admin User"}
                  </p>
                  <p className="max-w-48 truncate text-xs text-slate-500">
                    {adminUser?.role || "Super Admin"}
                  </p>
                </div>

                <FiChevronDown className="hidden text-slate-400 sm:block" />
              </button>

              <ProfileDropdown
                open={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                anchorRef={profileButtonRef}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
