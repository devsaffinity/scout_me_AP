import { useCallback, useMemo, useState } from 'react';

export const usePagination = ({ initialPage = 1, initialPageSize = 10 } = {}) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((Number(total) || 0) / (Number(pageSize) || 1))),
    [pageSize, total],
  );

  const goToPage = useCallback(
    (nextPage) => {
      const pageNumber = Number(nextPage) || 1;
      setPage(Math.max(1, Math.min(pageNumber, totalPages)));
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    setPage((previous) => Math.min(previous + 1, totalPages));
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setPage((previous) => Math.max(previous - 1, 1));
  }, []);

  const resetPagination = useCallback(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
    setTotal(0);
  }, [initialPage, initialPageSize]);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    setPage,
    setPageSize,
    setTotal,
    goToPage,
    nextPage,
    previousPage,
    resetPagination,
  };
};

export default usePagination;
