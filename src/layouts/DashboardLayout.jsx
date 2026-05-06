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
              "min-h-[calc(100vh-132px)] flex-1 px-4 pb-10 pt-4 md:px-6 md:pb-12 lg:px-8 lg:pt-6 xl:pb-8",
              collapsed
                ? "xl:max-w-[calc(100vw-96px)]"
                : "xl:max-w-[calc(100vw-288px)]",
              contentClassName,
            )}
          >
            <div className="mx-auto w-full max-w-400">
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
