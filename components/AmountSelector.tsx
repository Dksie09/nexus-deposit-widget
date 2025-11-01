"use client";

import { useEffect, useRef, useState } from "react";
import { PERCENTAGES } from "@/constants";
import { useAmountInput } from "@/hooks/useAmountInput";
import { calculatePercentageAmount } from "@/utils/calculations";

export default function AmountSelector() {
  const [activePercentage, setActivePercentage] = useState(
    PERCENTAGES[0].label
  );
  const { amount, handleAmountChange, setAmountValue } = useAmountInput("2.50");
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabElementRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (activePercentage && container) {
      const activeTabElement = activeTabElementRef.current;

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;

        const clipLeft = offsetLeft;
        const clipRight = offsetLeft + offsetWidth;
        container.style.clipPath = `inset(0 ${Number(
          100 - (clipRight / container.offsetWidth) * 100
        ).toFixed()}% 0 ${Number(
          (clipLeft / container.offsetWidth) * 100
        ).toFixed()}% round 8px)`;
      }
    }
  }, [activePercentage, activeTabElementRef, containerRef]);

  const handlePercentageClick = (percentage: {
    label: string;
    value: number;
  }) => {
    setActivePercentage(percentage.label);
    const baseAmount = 10.0;
    const newAmount = calculatePercentageAmount(baseAmount, percentage.value);
    setAmountValue(newAmount);
  };

  return (
    <div className="flex flex-col gap-1 relative ml-2">
      <input
        type="text"
        value={amount}
        onChange={handleAmountChange}
        className="text-4xl font-medium bg-transparent border-none outline-none w-32 focus:ring-0 p-0 text-white"
        placeholder="0.00"
        autoFocus
      />

      <div className="relative w-fit">
        <p className="text-xs flex gap-3 text-white/50 ">
          {PERCENTAGES.map((percentage) => (
            <button
              key={percentage.label}
              ref={
                activePercentage === percentage.label
                  ? activeTabElementRef
                  : null
              }
              onClick={() => handlePercentageClick(percentage)}
              className="cursor-pointer hover:text-white/70 transition-colors"
            >
              {percentage.label}
            </button>
          ))}
        </p>

        <div
          aria-hidden
          className="absolute top-0 left-0 w-full overflow-hidden transition-all duration-250 ease-in-out"
          ref={containerRef}
          style={{ clipPath: "inset(0 75% 0 0% round 8px)" }}
        >
          <p className="text-xs flex gap-3 text-blue-500">
            {PERCENTAGES.map((percentage) => (
              <button
                key={percentage.label}
                onClick={() => handlePercentageClick(percentage)}
                className="cursor-pointer"
                tabIndex={-1}
              >
                {percentage.label}
              </button>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
