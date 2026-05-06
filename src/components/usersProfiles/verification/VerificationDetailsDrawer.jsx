import { FiCheckCircle, FiFileText, FiMessageSquare, FiX } from 'react-icons/fi';
import VerificationOverlay from './VerificationOverlay';

const priorityClasses = {
  high: 'bg-rose-100 text-rose-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-sky-100 text-sky-700',
};

const VerificationDetailsDrawer = ({
  open,
  request,
  onClose,
  onApprove,
  onRequestInfo,
}) => {
  const documents = request?.documents || [];

  return (
    <VerificationOverlay
      open={open}
      onClose={onClose}
      position="right"
      panelClassName="h-full"
    >
      <div className="flex h-full flex-col border-l border-slate-200 bg-white shadow-[-24px_0_80px_-36px_rgba(15,23,42,0.45)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Verification details</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {request?.applicantName || 'Request details'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review documents, request metadata, and moderation notes before taking action.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Close drawer"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${priorityClasses[request?.priority] || 'bg-slate-100 text-slate-700'}`}
                >
                  {request?.priority || 'Pending'} priority
                </span>
                <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {request?.applicantType || 'Applicant'}
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Request ID</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">{request?.id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Verification type</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">{request?.type || 'Verification check'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Submitted</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">{request?.submittedLabel || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Status</p>
                  <p className="mt-2 text-sm font-medium capitalize text-slate-900">{request?.status || 'Pending'}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <FiFileText size={18} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Documents</h3>
                  <p className="mt-1 text-sm text-slate-500">Uploaded items attached to this request.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {documents.length ? (
                  documents.map((document) => (
                    <div
                      key={document.name}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{document.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">Verification asset</p>
                      </div>
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {document.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    No documents were attached to this verification request.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <FiMessageSquare size={18} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Reviewer notes</h3>
                  <p className="mt-1 text-sm text-slate-500">Context carried with the original submission.</p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {request?.notes || 'No additional notes were submitted with this request.'}
              </p>
            </section>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => onRequestInfo?.(request)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Request info
            </button>
            <button
              type="button"
              onClick={() => onApprove?.(request)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <FiCheckCircle size={16} />
              Approve request
            </button>
          </div>
        </div>
      </div>
    </VerificationOverlay>
  );
};

export default VerificationDetailsDrawer;
