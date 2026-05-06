import { useCallback, useEffect, useMemo, useState } from 'react';
import useDebounce from './useDebounce';
import usePagination from './usePagination';

export const useTableData = (
  fetcher,
  {
    initialFilters = {},
    initialPageSize = 10,
    immediate = true,
    debounceDelay = 300,
    normalize = (response) => response?.data ?? response,
  } = {},
) => {
  const {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    setPage,
    setPageSize,
    setTotal,
    goToPage,
    nextPage,
    previousPage,
    resetPagination,
  } = usePagination({ initialPageSize });

  const [filters, setFilters] = useState(initialFilters);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(Boolean(immediate));
  const [error, setError] = useState(null);

  const debouncedFilters = useDebounce(filters, debounceDelay);

  const load = useCallback(
    async (overrides = {}) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetcher({
          page,
          limit: pageSize,
          ...debouncedFilters,
          ...overrides,
        });

        const normalized = normalize(response);
        const nextRows = normalized.rows || normalized.items || normalized.results || [];
        const nextPagination = normalized.pagination || response?.meta?.pagination || {};
        const nextTotal = nextPagination.total ?? normalized.total ?? nextRows.length;

        setRows(nextRows);
        setMeta(response?.meta || {});
        setTotal(nextTotal);
      } catch (requestError) {
        setError(requestError);
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [debouncedFilters, fetcher, normalize, page, pageSize, setTotal],
  );

  useEffect(() => {
    if (!immediate) return;
    load();
  }, [immediate, load, page, pageSize]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setPage(1);
  }, [initialFilters, setPage]);

  return useMemo(
    () => ({
      rows,
      loading,
      error,
      filters,
      setFilters,
      resetFilters,
      refetch: load,
      meta,
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      setPage,
      setPageSize,
      goToPage,
      nextPage,
      previousPage,
      resetPagination,
    }),
    [
      error,
      filters,
      goToPage,
      hasNextPage,
      hasPreviousPage,
      load,
      loading,
      meta,
      nextPage,
      page,
      pageSize,
      previousPage,
      resetFilters,
      resetPagination,
      rows,
      setPage,
      setPageSize,
      total,
      totalPages,
    ],
  );
};

export default useTableData;
