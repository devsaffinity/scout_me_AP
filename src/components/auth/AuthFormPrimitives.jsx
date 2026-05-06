import { useState } from 'react';
import { FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

export const inputClassName =
  'h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/60';

export const labelClassName =
  'mb-2 block text-sm font-semibold tracking-[-0.01em] text-slate-800';

export const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      <FiAlertCircle className="mt-0.5 shrink-0" />
      <p className="text-sm text-rose-700">{message}</p>
    </div>
  );
};

export const AuthField = ({ label, children, hint }) => (
  <label className="block">
    <span className={labelClassName}>{label}</span>
    {children}
    {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
  </label>
);

export const TextInput = ({ label, hint, ...props }) => (
  <AuthField label={label} hint={hint}>
    <input {...props} className={inputClassName} />
  </AuthField>
);

export const PasswordInput = ({ label, hint, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField label={label} hint={hint}>
      <div className="relative">
        <input {...props} type={visible ? 'text' : 'password'} className={`${inputClassName} pr-12`} />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </AuthField>
  );
};

export const SubmitButton = ({
  children,
  loading = false,
  loadingLabel = 'Working...',
  className = '',
}) => (
  <button
    type="submit"
    disabled={loading}
    className={`inline-flex h-12 w-full items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
  >
    {loading ? loadingLabel : children}
  </button>
);
