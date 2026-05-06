import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { dashboardNavigationItems } from './navigation.config';
import { ROUTES } from './routes.constants';

const AuthLayout = lazy(() => import('../layouts/AuthLayout'));
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const VerifyCodePage = lazy(() => import('../pages/auth/VerifyCodePage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const ProfileSettingsPage = lazy(() => import('../pages/profile-settings/ProfileSettingsPage'));
const UsersProfilesPage = lazy(() => import('../pages/users-profiles/UsersProfilesPage'));
const DiscoveryEngagementPage = lazy(() => import('../pages/discovery-engagement/DiscoveryEngagementPage'));
const MessagingNotificationsPage = lazy(() => import('../pages/messaging-notifications/MessagingNotificationsPage'));
const PremiumNfcPage = lazy(() => import('../pages/premium-nfc/PremiumNfcPage'));

export const sidebarNavigation = dashboardNavigationItems;

export const authRoutes = [
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
  { path: ROUTES.VERIFY_CODE, element: <VerifyCodePage /> },
  { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
];

export const protectedChildren = [
  {
    index: true,
    element: <Navigate replace to={ROUTES.DASHBOARD} />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardPage />,
    meta: { title: 'Dashboard', module: 'dashboard' },
  },
  {
    path: ROUTES.PROFILE_SETTINGS,
    element: <ProfileSettingsPage />,
    meta: { title: 'Profile Settings', module: 'profile_settings' },
  },
  {
    path: ROUTES.USERS_PROFILES,
    element: <UsersProfilesPage />,
    meta: { title: 'Users & Profiles', module: 'users_profiles' },
  },
  {
    path: ROUTES.DISCOVERY_ENGAGEMENT,
    element: <DiscoveryEngagementPage />,
    meta: { title: 'Discovery & Engagement', module: 'discovery_engagement' },
  },
  {
    path: ROUTES.MESSAGING_NOTIFICATIONS,
    element: <MessagingNotificationsPage />,
    meta: { title: 'Messaging & Notifications', module: 'messaging_notifications' },
  },
  {
    path: ROUTES.PREMIUM_NFC,
    element: <PremiumNfcPage />,
    meta: { title: 'Premium & NFC', module: 'premium_nfc' },
  },
];

export const routeConfig = [
  {
    element: <AuthLayout />,
    children: authRoutes,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: protectedChildren,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate replace to={ROUTES.DASHBOARD} />,
  },
];

export default routeConfig;
