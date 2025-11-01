"use client";

import { useState, useCallback } from "react";

export function useAmountInput(initialAmount: string = "") {
  const [amount, setAmount] = useState(initialAmount);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  }, []);

  const setAmountValue = useCallback((value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  }, []);

  return {
    amount,
    handleAmountChange,
    setAmountValue
  };
}