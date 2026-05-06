import { useCallback, useState } from 'react';

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [payload, setPayload] = useState(null);

  const openModal = useCallback((nextPayload = null) => {
    setPayload(nextPayload);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback((nextPayload = null) => {
    setPayload(nextPayload);
    setIsOpen((previous) => !previous);
  }, []);

  return {
    isOpen,
    payload,
    setPayload,
    openModal,
    closeModal,
    toggleModal,
  };
};

export default useModal;
