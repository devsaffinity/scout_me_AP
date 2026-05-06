import { DEFAULT_DATE_FORMAT } from './constants';

export const formatNumber = (value, options = {}) =>
  new Intl.NumberFormat(DEFAULT_DATE_FORMAT, options).format(Number(value || 0));

export const formatCurrency = (value, currency = 'USD', options = {}) =>
  new Intl.NumberFormat(DEFAULT_DATE_FORMAT, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    ...options,
  }).format(Number(value || 0));

export const formatPercent = (value, options = {}) =>
  new Intl.NumberFormat(DEFAULT_DATE_FORMAT, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    ...options,
  }).format(Number(value || 0) / 100);

export const formatDate = (value, options = {}) =>
  new Intl.DateTimeFormat(DEFAULT_DATE_FORMAT, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(new Date(value));

export const formatDateTime = (value, options = {}) =>
  new Intl.DateTimeFormat(DEFAULT_DATE_FORMAT, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    ...options,
  }).format(new Date(value));

export const formatRelativeTime = (value) => {
  const date = new Date(value);
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  const ranges = [
    { limit: 60, unit: 'minute' },
    { limit: 60 * 24, unit: 'hour' },
    { limit: 60 * 24 * 7, unit: 'day' },
    { limit: 60 * 24 * 30, unit: 'week' },
  ];

  const formatter = new Intl.RelativeTimeFormat(DEFAULT_DATE_FORMAT, { numeric: 'auto' });

  if (Math.abs(diffMinutes) < ranges[0].limit) {
    return formatter.format(diffMinutes, 'minute');
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffMinutes) < ranges[1].limit) {
    return formatter.format(diffHours, 'hour');
  }

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffMinutes) < ranges[2].limit) {
    return formatter.format(diffDays, 'day');
  }

  const diffWeeks = Math.round(diffDays / 7);
  return formatter.format(diffWeeks, 'week');
};

export const formatCompactNumber = (value) =>
  new Intl.NumberFormat(DEFAULT_DATE_FORMAT, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

export const toTitleCase = (value = '') =>
  String(value)
    .replace(/[_-]+/g, ' ')
    .replace(/\w\S*/g, (segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase());

export const getInitials = (value = '') =>
  String(value)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

export const truncateText = (value = '', maxLength = 80) =>
  value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;

export default {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatCompactNumber,
  toTitleCase,
  getInitials,
  truncateText,
};
