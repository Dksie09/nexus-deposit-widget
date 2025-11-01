"use client";

import { useRef, useCallback } from "react";

interface UseDissolveAnimationOptions {
  duration?: number;
  maxScale?: number;
  onComplete?: () => void;
}

export function useDissolveAnimation(
  options: UseDissolveAnimationOptions = {}
) {
  const { duration = 800, maxScale = 2000, onComplete } = options;

  const cardRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<SVGFEDisplacementMapElement>(null);
  const noiseRef = useRef<SVGFETurbulenceElement>(null);

  const ease = useCallback((t: number) => 1 - Math.pow(1 - t, 3), []);

  const animateDissolve = useCallback(() => {
    if (!cardRef.current || !filterRef.current || !noiseRef.current) {
      onComplete?.();
      return;
    }

    const start = performance.now();

    // Set random seed for noise
    noiseRef.current.setAttribute(
      "seed",
      String(Math.floor(Math.random() * 1000))
    );

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const e = ease(t);

      if (filterRef.current && cardRef.current) {
        filterRef.current.setAttribute("scale", String(e * maxScale));
        cardRef.current.style.transform = `scale(${1 + 0.05 * e})`;
        cardRef.current.style.opacity =
          t < 0.5 ? "1" : String(1 - (t - 0.5) / 0.5);
      }

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        // Call onComplete first to close the modal
        onComplete?.();

        // Reset styles after a brief delay (after modal is unmounted)
        setTimeout(() => {
          if (cardRef.current && filterRef.current) {
            cardRef.current.style.transform = "scale(1)";
            cardRef.current.style.opacity = "1";
            filterRef.current.setAttribute("scale", "0");
          }
        }, 50);
      }
    };

    requestAnimationFrame(step);
  }, [duration, maxScale, ease, onComplete]);

  return {
    cardRef,
    filterRef,
    noiseRef,
    animateDissolve,
  };
}
