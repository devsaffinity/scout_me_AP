const joinClasses = (...classes) => classes.filter(Boolean).join(' ');

const getVisiblePages = (page, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1]);

  if (page <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (page >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  return [...pages]
    .filter((value) => value > 0 && value <= totalPages)
    .sort((left, right) => left - right);
};

const Pagination = ({ page = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) {
    return (
      <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
        Page 1 of 1
      </div>
    );
  }

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange?.(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5">
        {visiblePages.map((item, index) => {
          const previous = visiblePages[index - 1];
          const showGap = index > 0 && item - previous > 1;

          return (
            <div key={item} className="flex items-center gap-2">
              {showGap ? <span className="px-1 text-slate-400">...</span> : null}
              <button
                type="button"
                onClick={() => onPageChange?.(item)}
                className={joinClasses(
                  'min-w-10 rounded-xl px-3 py-2 text-sm font-semibold transition',
                  item === page
                    ? 'bg-slate-950 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100',
                )}
                aria-current={item === page ? 'page' : undefined}
              >
                {item}
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
