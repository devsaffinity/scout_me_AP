import React from "react";
import { Outlet } from "react-router-dom";
import { dashboardNavigationSections } from "../routes/navigation.config";
import Sidebar from "../ui/Sidebar";
import Topbar from "../ui/Topbar";
import MobileSidebar from "../ui/MobileSidebar";
import { useSidebar } from "../context/SidebarContext";

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

const DashboardLayout = ({
  navigation = dashboardNavigationSections,
  contentClassName = "",
  topbarActions = null,
  topbarSearch = true,
  children = null,
}) => {
  const { collapsed, mobileOpen, openMobile, closeMobile } = useSidebar();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar sections={navigation} />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar
            onOpenMobileSidebar={openMobile}
            extraActions={topbarActions}
            showSearch={topbarSearch}
          />

          <main
            className={joinClasses(
              "min-h-[calc(100vh-132px)] flex-1 px-3 pb-8 pt-3 sm:px-4 md:px-5 md:pb-10 lg:px-6 lg:pt-5 2xl:px-8 2xl:pb-8",
              collapsed
                ? "xl:max-w-[calc(100vw-88px)] 2xl:max-w-[calc(100vw-96px)]"
                : "xl:max-w-[calc(100vw-260px)] 2xl:max-w-[calc(100vw-288px)]",
              contentClassName,
            )}
          >
            <div className="mx-auto w-full max-w-full">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>

      <MobileSidebar
        open={mobileOpen}
        onClose={closeMobile}
        sections={navigation}
      />
    </div>
  );
};

export default DashboardLayout;
