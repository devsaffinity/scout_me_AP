import { useEffect, useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import VerificationOverlay from './VerificationOverlay';

const initialForm = {
  channel: 'Email',
  deadline: '48 hours',
  message: '',
};

const RequestVerificationInfoModal = ({
  open,
  request,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialForm);
    }
  }, [open]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit?.({
        request,
        channel: form.channel,
        deadline: form.deadline,
        message: form.message.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VerificationOverlay open={open} onClose={onClose}>
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.5)] sm:p-7">
        <div className="flex items-start gap-4">
          <span className="inline-flex rounded-2xl bg-sky-100 p-3 text-sky-700">
            <FiMessageSquare size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Request more information</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Ask {request?.applicantName || 'this applicant'} for follow-up details
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose how the applicant should respond and when the follow-up is expected.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800">Response channel</span>
            <select
              value={form.channel}
              onChange={handleChange('channel')}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
            >
              <option>Email</option>
              <option>In-app message</option>
              <option>Support ticket</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800">Response deadline</span>
            <select
              value={form.deadline}
              onChange={handleChange('deadline')}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
            >
              <option>24 hours</option>
              <option>48 hours</option>
              <option>72 hours</option>
              <option>5 business days</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800">Optional message</span>
            <textarea
              rows={4}
              value={form.message}
              onChange={handleChange('message')}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              placeholder="Explain what document, credential, or clarification is still needed."
            />
          </label>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
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
              {isSubmitting ? 'Sending request...' : 'Send request'}
            </button>
          </div>
        </form>
      </div>
    </VerificationOverlay>
  );
};

export default RequestVerificationInfoModal;
