import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiRefreshCw } from 'react-icons/fi';
import {
  FormError,
  SubmitButton,
  TextInput,
} from './AuthFormPrimitives';
import { ROUTES } from '../../routes/routes.constants';

const VerifyCodeForm = ({
  email,
  loading = false,
  onSubmit,
  onResend,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [resending, setResending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');

    try {
      await onSubmit?.({ code: code.trim() });
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to verify this code.');
    }
  };

  const handleResend = async () => {
    setError('');
    setInfo('');
    setResending(true);

    try {
      await onResend?.();
      setInfo(`A new verification code was sent to ${email}.`);
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to resend the code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-start gap-3 rounded-[22px] border border-sky-200 bg-sky-50 px-4 py-4">
        <FiMail className="mt-0.5 shrink-0 text-sky-700" />
        <div>
          <p className="text-sm font-semibold text-sky-900">Delivery destination</p>
          <p className="mt-1 text-sm leading-6 text-sky-800">{email}</p>
        </div>
      </div>

      <FormError message={error} />

      {info ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {info}
        </div>
      ) : null}

      <TextInput
        label="Verification code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="Enter the reset code"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        hint="For this demo flow, any code with at least 4 characters will pass validation."
        required
      />

      <SubmitButton loading={loading} loadingLabel="Verifying code...">
        Continue to password reset
      </SubmitButton>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw className={resending ? 'animate-spin' : ''} size={16} />
          {resending ? 'Resending...' : 'Resend code'}
        </button>

        <Link to={ROUTES.LOGIN} className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">
          Return to login
        </Link>
      </div>
    </form>
  );
};

export default VerifyCodeForm;
