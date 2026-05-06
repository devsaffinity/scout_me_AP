import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AdminLoginForm from '../../components/auth/AdminLoginForm';
import { useAuth } from '../../context/AuthContext';
import { AUTH_ONLY_ROUTES, DEFAULT_AUTH_REDIRECT } from '../../routes/routes.constants';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestedPath = location.state?.from || location.state?.next || DEFAULT_AUTH_REDIRECT;
  const redirectPath = AUTH_ONLY_ROUTES.includes(requestedPath) ? DEFAULT_AUTH_REDIRECT : requestedPath;

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate replace to={redirectPath} />;
  }

  const handleSubmit = async (credentials) => {
    setIsSubmitting(true);

    try {
      await login(credentials);
      navigate(redirectPath, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLoginForm onSubmit={handleSubmit} loading={isSubmitting} />
  );
};

export default LoginPage;
