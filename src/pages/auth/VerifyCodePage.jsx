import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import VerifyCodeForm from '../../components/auth/VerifyCodeForm';
import { useAuth } from '../../context/AuthContext';
import { DEFAULT_AUTH_REDIRECT, ROUTES } from '../../routes/routes.constants';

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { forgotPassword, verifyCode, loading, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = location.state?.email || 'admin@scoutme.com';

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate replace to={DEFAULT_AUTH_REDIRECT} />;
  }

  const handleSubmit = async ({ code }) => {
    setIsSubmitting(true);

    try {
      await verifyCode({ code, email });
      navigate(ROUTES.RESET_PASSWORD, {
        replace: true,
        state: { email },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    await forgotPassword({ email });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Secure verification
        </span>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-[2.05rem]">
            Verify your reset code
          </h1>
          <p className="text-sm leading-6 text-slate-600 sm:text-base">
            Enter the verification code sent to your inbox to continue the password reset flow.
          </p>
        </div>
      </div>

      <VerifyCodeForm
        email={email}
        loading={isSubmitting}
        onSubmit={handleSubmit}
        onResend={handleResend}
      />
    </div>
  );
};

export default VerifyCodePage;
