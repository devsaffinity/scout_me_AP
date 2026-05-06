import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessModule } from '../utils/permissions';
import { DEFAULT_AUTH_REDIRECT, ROUTES } from './routes.constants';

const FullScreenLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
      <p className="text-sm font-medium text-slate-700">Loading workspace...</p>
    </div>
  </div>
);

const ProtectedRoute = ({
  children,
  redirectPath = ROUTES.LOGIN,
  requiredModule,
  allowedRoles = [],
}) => {
  const location = useLocation();
  const { loading, isAuthenticated, adminUser } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        to={redirectPath}
        state={{ from: location.pathname, next: DEFAULT_AUTH_REDIRECT }}
      />
    );
  }

  const normalizedRole = adminUser?.role || 'viewer';

  if (allowedRoles.length > 0 && !allowedRoles.includes(normalizedRole)) {
    return <Navigate replace to={ROUTES.DASHBOARD} state={{ deniedFrom: location.pathname }} />;
  }

  if (requiredModule && !canAccessModule(normalizedRole, requiredModule)) {
    return <Navigate replace to={ROUTES.DASHBOARD} state={{ deniedFrom: location.pathname }} />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;
