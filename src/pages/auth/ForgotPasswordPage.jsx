import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import { useAuth } from '../../context/AuthContext';
import { DEFAULT_AUTH_REDIRECT, ROUTES } from '../../routes/routes.constants';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate replace to={DEFAULT_AUTH_REDIRECT} />;
  }

  const handleSubmit = async ({ email }) => {
    setIsSubmitting(true);

    try {
      await forgotPassword({ email });
      navigate(ROUTES.VERIFY_CODE, {
        replace: true,
        state: { email },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Password recovery
        </span>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-[2.05rem]">
            Reset admin access
          </h1>
          <p className="text-sm leading-6 text-slate-600 sm:text-base">
            Enter your work email to receive a secure reset code for your ScoutMe admin account.
          </p>
        </div>
      </div>

      <ForgotPasswordForm onSubmit={handleSubmit} loading={isSubmitting} />
    </div>
  );
};

export default ForgotPasswordPage;
