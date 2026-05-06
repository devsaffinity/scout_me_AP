import { FiAlertCircle, FiCheckCircle, FiInfo, FiX, FiXCircle } from 'react-icons/fi';
import useToast from '../../hooks/useToast';

const toastStyles = {
  success: {
    icon: FiCheckCircle,
    accent: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  error: {
    icon: FiXCircle,
    accent: 'text-rose-600',
    border: 'border-rose-100',
  },
  warning: {
    icon: FiAlertCircle,
    accent: 'text-amber-600',
    border: 'border-amber-100',
  },
  info: {
    icon: FiInfo,
    accent: 'text-blue-600',
    border: 'border-blue-100',
  },
};

const ToastViewport = () => {
  const { toasts, dismiss } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type] || toastStyles.info;
        const Icon = style.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-[20px] border ${style.border} bg-white p-4 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.55)]`}
            role="status"
          >
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-50 ${style.accent}`}>
                <Icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                {toast.title ? <p className="text-sm font-semibold text-slate-950">{toast.title}</p> : null}
                {toast.message ? <p className="mt-1 text-sm leading-5 text-slate-500">{toast.message}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Dismiss notification"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastViewport;
