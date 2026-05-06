import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiCornerUpLeft } from 'react-icons/fi';
import {
  FormError,
  PasswordInput,
  SubmitButton,
} from './AuthFormPrimitives';
import { ROUTES } from '../../routes/routes.constants';

const initialState = {
  password: '',
  confirmPassword: '',
};

const ResetPasswordForm = ({ onSubmit, loading = false }) => {
  const [values, setValues] = useState(initialState);
  const [error, setError] = useState('');

  const handleChange = (field) => (event) => {
    setValues((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await onSubmit?.(values);
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to update your password.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormError message={error} />

      <PasswordInput
        label="New password"
        autoComplete="new-password"
        placeholder="Create a strong password"
        value={values.password}
        onChange={handleChange('password')}
        hint="Use at least 6 characters for this demo admin flow."
        required
      />

      <PasswordInput
        label="Confirm password"
        autoComplete="new-password"
        placeholder="Re-enter your password"
        value={values.confirmPassword}
        onChange={handleChange('confirmPassword')}
        required
      />

      <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-4">
        <div className="flex items-start gap-3">
          <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-700" />
          <p className="text-sm leading-6 text-emerald-800">
            A stronger password helps protect moderation actions, billing changes, and sensitive account workflows.
          </p>
        </div>
      </div>

      <SubmitButton loading={loading} loadingLabel="Updating password...">
        Update password
      </SubmitButton>

      <Link
        to={ROUTES.LOGIN}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
      >
        <FiCornerUpLeft size={16} />
        Back to login
      </Link>
    </form>
  );
};

export default ResetPasswordForm;
