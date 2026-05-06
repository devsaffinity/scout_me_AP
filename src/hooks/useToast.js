import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const TOAST_EVENT = 'scoutme:toast';
const DEFAULT_DURATION = 3500;

const createToastRecord = (payload) => ({
  id: payload.id || `toast_${Math.random().toString(36).slice(2, 10)}`,
  type: payload.type || 'info',
  title: payload.title || '',
  message: payload.message || '',
  duration: payload.duration ?? DEFAULT_DURATION,
});

export const emitToast = (payload) => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: createToastRecord(payload),
    }),
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleToast = (event) => {
      const record = createToastRecord(event.detail || {});
      setToasts((previous) => [record, ...previous].slice(0, 5));

      const timeoutId = window.setTimeout(() => {
        setToasts((previous) => previous.filter((item) => item.id !== record.id));
        timers.current.delete(record.id);
      }, record.duration);

      timers.current.set(record.id, timeoutId);
    };

    window.addEventListener(TOAST_EVENT, handleToast);

    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
      timers.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timers.current.clear();
    };
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((previous) => previous.filter((item) => item.id !== id));

    const timeoutId = timers.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timers.current.delete(id);
    }
  }, []);

  const api = useMemo(
    () => ({
      toasts,
      toast: (payload) => emitToast(payload),
      success: (message, title = 'Success') => emitToast({ type: 'success', title, message }),
      error: (message, title = 'Error') => emitToast({ type: 'error', title, message }),
      info: (message, title = 'Info') => emitToast({ type: 'info', title, message }),
      warning: (message, title = 'Warning') => emitToast({ type: 'warning', title, message }),
      dismiss,
      clearAll: () => setToasts([]),
    }),
    [dismiss, toasts],
  );

  return api;
};

export default useToast;
