import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCompass } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.08),_transparent_35%),linear-gradient(180deg,_#f8fafc,_#eef2ff)] px-4 py-8">
      <div className="w-full max-w-[680px] rounded-[32px] border border-slate-200/70 bg-white px-6 py-10 text-center shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:px-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-slate-950 text-3xl text-white shadow-xl">
          <FiCompass />
        </div>
        <div className="mt-8 space-y-3">
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Error 404
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Page not found</h1>
          <p className="mx-auto max-w-[520px] text-sm leading-7 text-slate-600 sm:text-base">
            The page you are trying to open does not exist, may have moved, or is not available for your role.
            Return to the dashboard and continue managing the ScoutMe admin workspace.
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px]"
          >
            <FiArrowLeft />
            Back to dashboard
          </Link>
          <Link
            to="/auth/login"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
