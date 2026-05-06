import endpoints from './endpoints';
import http from './http';
import { getDb, saveDb, deepClone } from '../utils/mockData';
import { isValidEmail, isStrongPassword } from '../utils/validators';

const AUTH_STORAGE_KEY = 'scoutme-admin-auth';

const persistSession = (payload) => {
  if (typeof window === 'undefined') return payload;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  return payload;
};

const clearSession = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

const readSession = () => {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const login = async ({ email, password }) =>
  http.post(
    () => {
      if (!isValidEmail(email)) {
        throw new Error('Enter a valid email address.');
      }

      const db = getDb();
      const admin = db.admins.find(
        (item) => item.email.toLowerCase() === String(email).toLowerCase().trim(),
      );

      if (!admin || admin.password !== password) {
        throw new Error('Invalid login credentials.');
      }

      if (admin.status !== 'active') {
        throw new Error('Your admin account is currently inactive.');
      }

      const session = {
        token: `mock-token-${admin.id}`,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          avatar: admin.avatar,
          status: admin.status,
        },
      };

      persistSession(session);
      return session;
    },
    { email, password },
    {
      message: `Authenticated via ${endpoints.auth.login}.`,
    },
  );

export const logout = async () =>
  http.post(
    () => {
      clearSession();
      return { loggedOut: true };
    },
    {},
    {
      message: `Logged out via ${endpoints.auth.logout}.`,
    },
  );

export const forgotPassword = async ({ email }) =>
  http.post(
    () => {
      if (!isValidEmail(email)) {
        throw new Error('Enter a valid email address.');
      }

      const db = getDb();
      const admin = db.admins.find(
        (item) => item.email.toLowerCase() === String(email).toLowerCase().trim(),
      );

      if (!admin) {
        throw new Error('No admin account found for this email.');
      }

      const code = '123456';
      admin.resetCode = code;
      admin.resetCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      saveDb(db);

      return {
        email,
        code,
        expiresAt: admin.resetCodeExpiresAt,
        maskedDestination: `${email.slice(0, 2)}***@${email.split('@')[1]}`,
      };
    },
    { email },
    {
      message: `Reset code generated via ${endpoints.auth.forgotPassword}.`,
    },
  );

export const verifyResetCode = async ({ email, code }) =>
  http.post(
    () => {
      const db = getDb();
      const admin = db.admins.find(
        (item) => item.email.toLowerCase() === String(email).toLowerCase().trim(),
      );

      if (!admin?.resetCode) {
        throw new Error('No active reset flow found for this account.');
      }

      if (admin.resetCode !== code) {
        throw new Error('Invalid verification code.');
      }

      if (new Date(admin.resetCodeExpiresAt).getTime() < Date.now()) {
        throw new Error('Verification code has expired.');
      }

      return {
        email,
        verified: true,
      };
    },
    { email, code },
    {
      message: `Verification checked via ${endpoints.auth.verifyCode}.`,
    },
  );

export const resetPassword = async ({ email, code, newPassword }) =>
  http.post(
    () => {
      if (!isStrongPassword(newPassword)) {
        throw new Error(
          'Password must be at least 8 characters and include upper, lower, number, and special character.',
        );
      }

      const db = getDb();
      const admin = db.admins.find(
        (item) => item.email.toLowerCase() === String(email).toLowerCase().trim(),
      );

      if (!admin?.resetCode || admin.resetCode !== code) {
        throw new Error('Reset code is invalid or missing.');
      }

      admin.password = newPassword;
      admin.resetCode = null;
      admin.resetCodeExpiresAt = null;
      saveDb(db);

      return {
        email,
        reset: true,
      };
    },
    { email, code, newPassword },
    {
      message: `Password updated via ${endpoints.auth.resetPassword}.`,
    },
  );

export const getCurrentUser = async () =>
  http.get(
    () => {
      const session = readSession();
      return session ? deepClone(session.user) : null;
    },
    {
      message: `Current user loaded from ${endpoints.auth.currentUser}.`,
    },
  );

export const updateCurrentUser = async (payload) =>
  http.patch(
    () => {
      const session = readSession();
      if (!session?.user?.id) {
        throw new Error('You are not logged in.');
      }

      const db = getDb();
      const admin = db.admins.find((item) => item.id === session.user.id);

      if (!admin) {
        throw new Error('Admin account no longer exists.');
      }

      Object.assign(admin, payload, {
        updatedAt: new Date().toISOString(),
      });

      const nextSession = {
        ...session,
        user: {
          ...session.user,
          ...payload,
        },
      };

      saveDb(db);
      persistSession(nextSession);
      return deepClone(nextSession.user);
    },
    payload,
    {
      message: 'Profile updated successfully.',
    },
  );

export const isAuthenticated = () => Boolean(readSession()?.token);

const authService = {
  login,
  logout,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  getCurrentUser,
  updateCurrentUser,
  isAuthenticated,
};

export default authService;
