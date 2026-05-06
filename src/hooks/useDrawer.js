import { useCallback, useState } from 'react';

export const useDrawer = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [payload, setPayload] = useState(null);

  const openDrawer = useCallback((nextPayload = null) => {
    setPayload(nextPayload);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDrawer = useCallback((nextPayload = null) => {
    setPayload(nextPayload);
    setIsOpen((previous) => !previous);
  }, []);

  return {
    isOpen,
    payload,
    setPayload,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
};

export default useDrawer;
