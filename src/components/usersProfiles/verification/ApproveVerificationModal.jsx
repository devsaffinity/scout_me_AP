import { useState } from 'react';
import { FiCheckCircle, FiShield } from 'react-icons/fi';
import VerificationOverlay from './VerificationOverlay';

const ApproveVerificationModal = ({
  open,
  request,
  onClose,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit?.({ request });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VerificationOverlay open={open} onClose={onClose}>
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.5)] sm:p-7">
        <div className="flex items-start gap-4">
          <span className="inline-flex rounded-2xl bg-emerald-100 p-3 text-emerald-700">
            <FiCheckCircle size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Approve verification</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Confirm approval for {request?.applicantName || 'this request'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This removes the request from the verification queue and marks the applicant as cleared for the reviewed
              verification step.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <FiShield className="text-slate-500" />
            <span>{request?.type || 'Verification check'}</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Priority: <span className="font-semibold capitalize text-slate-700">{request?.priority || 'pending'}</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">Request ID: {request?.id || 'N/A'}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Approving...' : 'Approve request'}
          </button>
        </form>
      </div>
    </VerificationOverlay>
  );
};

export default ApproveVerificationModal;
