import { useEffect } from 'react';

const VerificationOverlay = ({
  open,
  onClose,
  children,
  position = 'center',
  panelClassName = '',
}) => {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const isDrawer = position === 'right';

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-slate-950/50 backdrop-blur-sm"
        aria-label="Close overlay"
      />

      <div
        className={`relative flex h-full ${isDrawer ? 'items-stretch justify-end' : 'items-center justify-center p-4 sm:p-6'}`}
      >
        <div
          className={`relative w-full ${isDrawer ? 'max-w-xl' : 'max-w-lg'} ${panelClassName}`}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default VerificationOverlay;
