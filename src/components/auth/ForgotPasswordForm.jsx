import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCornerUpLeft } from 'react-icons/fi';
import { FormError, SubmitButton, TextInput } from './AuthFormPrimitives';
import { ROUTES } from '../../routes/routes.constants';

const ForgotPasswordForm = ({ onSubmit, loading = false }) => {
  const [email, setEmail] = useState('admin@scoutme.io');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await onSubmit?.({ email: email.trim() });
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to start password recovery.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormError message={error} />

      <TextInput
        label="Work email"
        type="email"
        autoComplete="email"
        placeholder="admin@scoutme.io"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <SubmitButton loading={loading} loadingLabel="Sending code...">
        <span className="inline-flex items-center gap-2">
          Send reset code
          <FiArrowRight size={16} />
        </span>
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

export default ForgotPasswordForm;
