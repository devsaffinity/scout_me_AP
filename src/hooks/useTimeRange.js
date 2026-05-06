import { useMemo, useState } from 'react';
import { TIME_RANGE_OPTIONS } from '../utils/constants';

const rangeToDates = (range) => {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);

  switch (range) {
    case '7d':
      start.setDate(now.getDate() - 6);
      break;
    case '30d':
      start.setDate(now.getDate() - 29);
      break;
    case '90d':
      start.setDate(now.getDate() - 89);
      break;
    case '12m':
      start.setMonth(now.getMonth() - 11);
      break;
    default:
      start.setDate(now.getDate() - 6);
  }

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
};

export const useTimeRange = (initialRange = '30d') => {
  const [selectedRange, setSelectedRange] = useState(initialRange);

  const resolvedRange = useMemo(
    () => ({
      key: selectedRange,
      ...rangeToDates(selectedRange),
      label: TIME_RANGE_OPTIONS.find((item) => item.value === selectedRange)?.label || 'Last 30 days',
    }),
    [selectedRange],
  );

  return {
    selectedRange,
    setSelectedRange,
    rangeOptions: TIME_RANGE_OPTIONS,
    ...resolvedRange,
  };
};

export default useTimeRange;
