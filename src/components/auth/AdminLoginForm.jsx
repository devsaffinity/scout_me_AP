import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield } from 'react-icons/fi';
import {
  FormError,
  PasswordInput,
  SubmitButton,
  TextInput,
} from './AuthFormPrimitives';
import { ROUTES } from '../../routes/routes.constants';

const initialCredentials = {
  email: 'admin@scoutme.io',
  password: '',
};

const AdminLoginForm = ({ onSubmit, loading = false }) => {
  const [credentials, setCredentials] = useState(initialCredentials);
  const [error, setError] = useState('');

  const handleChange = (field) => (event) => {
    setCredentials((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await onSubmit?.({
        email: credentials.email.trim(),
        password: credentials.password,
      });
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to sign in with those credentials.');
    }
  };

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.96] p-6 shadow-[0_35px_90px_-38px_rgba(15,23,42,0.8)] backdrop-blur md:p-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
            <FiShield />
            Secure admin sign-in
          </span>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-[2.15rem]">
              Access the ScoutMe console
            </h1>
            <p className="text-sm leading-6 text-slate-600 sm:text-base">
              Sign in to manage platform operations, moderation workflows, premium access, and growth activity.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormError message={error} />

          <TextInput
            label="Work email"
            type="email"
            autoComplete="email"
            placeholder="admin@scoutme.io"
            value={credentials.email}
            onChange={handleChange('email')}
            required
          />

          <PasswordInput
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleChange('password')}
            required
          />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
            >
              Forgot your password?
            </Link>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Protected session</p>
          </div>

          <SubmitButton loading={loading} loadingLabel="Signing in...">
            <span className="inline-flex items-center gap-2">
              Continue
              <FiArrowRight size={16} />
            </span>
          </SubmitButton>
        </form>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-sm font-semibold text-slate-800">Admin access note</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Use your assigned operations credentials. Password recovery and verification steps remain available from
            this sign-in flow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;
