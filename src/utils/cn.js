const normalizeClassName = (value) => {
  if (!value) return [];
  if (typeof value === 'string') return value.split(' ').filter(Boolean);
  if (Array.isArray(value)) return value.flatMap((item) => normalizeClassName(item));
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, isActive]) => Boolean(isActive))
      .map(([className]) => className);
  }

  return [];
};

export const cn = (...inputs) => [...new Set(inputs.flatMap((input) => normalizeClassName(input)))].join(' ');

export default cn;
