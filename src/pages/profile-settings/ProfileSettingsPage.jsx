import React, { useEffect, useMemo, useState } from 'react';
import {
  FiClock,
  FiLock,
  FiMail,
  FiPhone,
  FiSave,
  FiShield,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const cardClass =
  'rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]';

const buildProfileForm = (adminUser) => ({
  name: adminUser?.name || '',
  email: adminUser?.email || '',
  phone: adminUser?.phone || '',
  department: adminUser?.department || 'Operations',
  timezone:
    adminUser?.timezone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    'UTC',
});

const defaultPasswordForm = {
  currentPassword: '',
  password: '',
  confirmPassword: '',
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
    <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600">
      <Icon size={18} />
    </span>
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-900">{value}</p>
    </div>
  </div>
);

export default function ProfileSettingsPage() {
  const { adminUser, updateAdminUser, changePassword } = useAuth();
  const { addNotification } = useNotifications();
  const [profileForm, setProfileForm] = useState(() => buildProfileForm(adminUser));
  const [passwordForm, setPasswordForm] = useState(defaultPasswordForm);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setProfileForm(buildProfileForm(adminUser));
  }, [adminUser]);

  const initials = useMemo(
    () =>
      adminUser?.name
        ?.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'AD',
    [adminUser],
  );

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileError('');

    const nextProfile = {
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
      department: profileForm.department.trim(),
      timezone: profileForm.timezone.trim(),
    };

    if (!nextProfile.name || !nextProfile.email) {
      setProfileError('Name and email are required.');
      return;
    }

    try {
      setProfileSaving(true);
      updateAdminUser(nextProfile);
      addNotification({
        type: 'success',
        title: 'Profile updated',
        message: 'Your admin profile details were saved successfully.',
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError('');

    try {
      setPasswordSaving(true);
      await changePassword(passwordForm);
      setPasswordForm(defaultPasswordForm);
      addNotification({
        type: 'success',
        title: 'Password changed',
        message: 'Your account password was updated successfully.',
      });
    } catch (error) {
      setPasswordError(error?.message || 'Unable to change password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <section className={cardClass}>
            <div className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-violet-900 p-5 text-white">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-xl font-semibold">
                {initials}
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">{adminUser?.name || 'Admin User'}</h2>
              <p className="mt-1 text-sm text-white/75">{adminUser?.role || 'Super Admin'}</p>
              <div className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
                {adminUser?.permissions?.includes('*') ? 'Full workspace access' : 'Scoped access'}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <DetailRow icon={FiMail} label="Email" value={adminUser?.email || 'admin@scoutme.io'} />
              <DetailRow icon={FiPhone} label="Phone" value={adminUser?.phone || 'Not set'} />
              <DetailRow icon={FiClock} label="Timezone" value={adminUser?.timezone || 'UTC'} />
              <DetailRow icon={FiShield} label="Department" value={adminUser?.department || 'Operations'} />
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-950">Profile details</h2>
              <p className="mt-1 text-sm text-slate-500">Update the basic account details shown across the admin workspace.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Full name</span>
                <input
                  value={profileForm.name}
                  onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="ScoutMe Admin"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Email</span>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="admin@scoutme.io"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Phone</span>
                <input
                  value={profileForm.phone}
                  onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="+1 (555) 014-8899"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Role</span>
                <input
                  value={adminUser?.role || 'Super Admin'}
                  readOnly
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Department</span>
                <input
                  value={profileForm.department}
                  onChange={(event) => setProfileForm((current) => ({ ...current, department: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="Operations"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Timezone</span>
                <input
                  value={profileForm.timezone}
                  onChange={(event) => setProfileForm((current) => ({ ...current, timezone: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="America/Chicago"
                />
              </label>

              {profileError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 md:col-span-2">
                  {profileError}
                </div>
              ) : null}

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiSave size={16} />
                  {profileSaving ? 'Saving...' : 'Save profile'}
                </button>
              </div>
            </form>
          </section>
        </div>

        <section className={cardClass}>
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-950">Change password</h2>
            <p className="mt-1 text-sm text-slate-500">Use a strong password with a mix of letters and numbers to protect admin access.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">Current password</span>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) =>
                  setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                placeholder="Enter current password"
                autoComplete="current-password"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">New password</span>
              <input
                type="password"
                value={passwordForm.password}
                onChange={(event) => setPasswordForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                placeholder="Enter new password"
                autoComplete="new-password"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">Confirm password</span>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(event) =>
                  setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
            </label>

            {passwordError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 md:col-span-3">
                {passwordError}
              </div>
            ) : null}

            <div className="md:col-span-3 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600">
                  <FiLock size={18} />
                </span>
                <p className="max-w-2xl">
                  Passwords must be at least 6 characters long and should not reuse the current one.
                </p>
              </div>
              <button
                type="submit"
                disabled={passwordSaving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiLock size={16} />
                {passwordSaving ? 'Updating...' : 'Update password'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
