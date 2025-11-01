"use client";

import { useState, useCallback, useRef } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [allowMorphBack, setAllowMorphBack] = useState(true);

  const open = useCallback(() => {
    setIsClosing(false);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const closeWithAnimation = useCallback((animationCallback?: () => void) => {
    setIsClosing(true);
    setAllowMorphBack(false);
    
    if (animationCallback) {
      animationCallback();
    } else {
      setIsOpen(false);
      setTimeout(() => {
        setAllowMorphBack(true);
      }, 100);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  return {
    isOpen,
    isClosing,
    allowMorphBack,
    open,
    close,
    closeWithAnimation,
    toggle,
    setAllowMorphBack
  };
}