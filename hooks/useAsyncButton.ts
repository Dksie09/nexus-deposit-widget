"use client";

import { useState, useCallback } from "react";

export type ButtonState = "idle" | "loading" | "success";

interface UseAsyncButtonOptions {
  loadingDuration?: number;
  successDuration?: number;
}

export function useAsyncButton(options: UseAsyncButtonOptions = {}) {
  const { loadingDuration = 1750, successDuration = 3500 } = options;
  const [buttonState, setButtonState] = useState<ButtonState>("idle");

  const executeAsync = useCallback(async (asyncFunction?: () => Promise<void> | void) => {
    if (buttonState === "success") return;

    setButtonState("loading");

    try {
      if (asyncFunction) {
        await asyncFunction();
      }
      
      setTimeout(() => {
        setButtonState("success");
      }, loadingDuration);

      setTimeout(() => {
        setButtonState("idle");
      }, successDuration);
    } catch (error) {
      setButtonState("idle");
    }
  }, [buttonState, loadingDuration, successDuration]);

  const reset = useCallback(() => {
    setButtonState("idle");
  }, []);

  return {
    buttonState,
    executeAsync,
    reset,
    isLoading: buttonState === "loading",
    isSuccess: buttonState === "success",
    isIdle: buttonState === "idle"
  };
}