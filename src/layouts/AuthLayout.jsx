import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AuthHeroPanel from "../components/auth/AuthHeroPanel";
import { ROUTES } from "../routes/routes.constants";

const AuthLayout = ({ hero = null }) => {
  const { pathname } = useLocation();
  const isLoginPage = pathname === ROUTES.LOGIN;

  if (isLoginPage) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_30%)]" />
        <div className="relative z-10 w-full max-w-md">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen xl:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden overflow-hidden border-r border-white/10 xl:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.28),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.22),transparent_28%)]" />
          <div className="relative h-full">{hero || <AuthHeroPanel />}</div>
        </div>

        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_30%)]" />

          <div className="relative z-10 w-full max-w-xl">
            <div className="mb-6 xl:hidden">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-600 via-blue-600 to-cyan-500 text-sm font-bold tracking-[0.2em] text-white shadow-lg shadow-blue-500/25">
                SM
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                ScoutMe Admin
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Sign in to manage users, platform controls, subscriptions, and
                safety operations.
              </p>
            </div>

            <div className="rounded-4xl border border-white/10 bg-white/95 p-5 shadow-2xl shadow-black/20 backdrop-blur md:p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
