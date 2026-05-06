import { useEffect, useState } from 'react';

const resolveInitialValue = (initialValue) =>
  typeof initialValue === 'function' ? initialValue() : initialValue;

export default function usePersistentState(storageKey, initialValue, isValid = () => true) {
  const [value, setValue] = useState(() => {
    const fallbackValue = resolveInitialValue(initialValue);

    if (typeof window === 'undefined') {
      return fallbackValue;
    }

    try {
      const storedValue = window.localStorage.getItem(storageKey);

      if (storedValue === null) {
        return fallbackValue;
      }

      const parsedValue = JSON.parse(storedValue);
      return isValid(parsedValue) ? parsedValue : fallbackValue;
    } catch (error) {
      console.error(`Unable to read persisted state for ${storageKey}.`, error);
      return fallbackValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Unable to persist state for ${storageKey}.`, error);
    }
  }, [storageKey, value]);

  return [value, setValue];
}
