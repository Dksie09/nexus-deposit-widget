"use client";

import { useState, useCallback } from "react";

export function useClipboard(duration: number = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), duration);
      return true;
    } catch (err) {
      return false;
    }
  }, [duration]);

  return { isCopied, copyToClipboard };
}