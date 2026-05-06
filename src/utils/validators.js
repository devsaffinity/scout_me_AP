export const isRequired = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'boolean') return true;
  return String(value ?? '').trim().length > 0;
};

export const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim());

export const isStrongPassword = (value) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(String(value ?? ''));

export const isValidOtp = (value, length = 6) =>
  new RegExp(`^\\d{${length}}$`).test(String(value ?? '').trim());

export const isValidPhone = (value) =>
  /^\+?[0-9()\-\s]{7,20}$/.test(String(value ?? '').trim());

export const isValidUrl = (value) => {
  try {
    const url = new URL(String(value ?? '').trim());
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

export const hasMinLength = (value, min = 1) => String(value ?? '').trim().length >= min;
export const hasMaxLength = (value, max = Infinity) => String(value ?? '').trim().length <= max;
export const isNumeric = (value) => !Number.isNaN(Number(value));
export const isInRange = (value, min, max) => Number(value) >= min && Number(value) <= max;

export const validateFields = (rules = {}, payload = {}) => {
  const errors = {};

  Object.entries(rules).forEach(([field, validators]) => {
    const checks = Array.isArray(validators) ? validators : [validators];

    for (const validator of checks) {
      if (!validator) continue;

      const result = typeof validator === 'function' ? validator(payload[field], payload) : true;

      if (result !== true) {
        errors[field] = typeof result === 'string' ? result : 'Invalid value.';
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  isRequired,
  isValidEmail,
  isStrongPassword,
  isValidOtp,
  isValidPhone,
  isValidUrl,
  hasMinLength,
  hasMaxLength,
  isNumeric,
  isInRange,
  validateFields,
};
