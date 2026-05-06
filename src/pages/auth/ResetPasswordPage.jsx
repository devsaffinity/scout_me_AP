import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';
import { useAuth } from '../../context/AuthContext';
import { DEFAULT_AUTH_REDIRECT, ROUTES } from '../../routes/routes.constants';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { resetPassword, loading, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate replace to={DEFAULT_AUTH_REDIRECT} />;
  }

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);

    try {
      await resetPassword(payload);
      navigate(ROUTES.LOGIN, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
          Account protection
        </span>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-[2.05rem]">
            Create a new password
          </h1>
          <p className="text-sm leading-6 text-slate-600 sm:text-base">
            Set a strong password to restore access to the admin workspace and keep platform operations secure.
          </p>
        </div>
      </div>

      <ResetPasswordForm loading={isSubmitting} onSubmit={handleSubmit} />
    </div>
  );
};

export default ResetPasswordPage;
