import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedCheckmark } from "./ui/animated-checkmark";
import { SUPPORTED_FIAT_CURRENCIES } from "@/constants";
import { useAmountInput } from "@/hooks/useAmountInput";
import { useAsyncButton, type ButtonState } from "@/hooks/useAsyncButton";
import { TransactionSummary } from "./shared/TransactionSummary";
import { BrandFooter } from "./shared/BrandFooter";

const getButtonContent = (state: ButtonState) => {
  switch (state) {
    case "idle":
      return (
        <span className="inline-grid place-items-center">
          <span className="col-start-1 row-start-1 transition-transform duration-200 ease-in-out group-hover:translate-x-full group-hover:opacity-0">
            Proceed
          </span>
          <ArrowRight className="w-4 h-4 col-start-1 row-start-1 -translate-x-full opacity-0 transition-all duration-200 ease-in-out group-hover:translate-x-0 group-hover:opacity-100" />
        </span>
      );
    case "loading":
      return <Spinner className="w-4 h-4" />;
    case "success":
      return <AnimatedCheckmark />;
  }
};

function FiatContent() {
  const [asset, setAsset] = useState("USD");
  const { amount, handleAmountChange } = useAmountInput("2.50");
  const { buttonState, executeAsync } = useAsyncButton();

  const handleAssetChange = (value: string) => {
    setAsset(value);
  };

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <p className="text-sm text-white/50 mt-1">Amount</p>

          <Select value={asset} onValueChange={handleAssetChange}>
            <SelectTrigger className="">
              <SelectValue placeholder="USD" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SUPPORTED_FIAT_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-center items-center text-center pb-3 border-b border-white/10 w-full overflow-hidden">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="text-4xl font-medium bg-transparent border-none outline-none focus:ring-0 p-0 text-white text-center max-w-full min-w-0"
            placeholder="0.00"
            autoFocus
          />
        </div>
        <TransactionSummary
          spendAmount="$10.15"
          receiveAmount="10 USDC"
          feeAmount="$0.15"
          showViewSources={false}
          showViewBreakdown={false}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          className="w-full relative overflow-hidden group"
          disabled={buttonState === "loading"}
          onClick={() => executeAsync()}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              initial={
                buttonState === "loading"
                  ? { filter: "blur(4px)", opacity: 0 }
                  : { opacity: 0, y: -25 }
              }
              animate={{
                filter: "blur(0px)",
                opacity: 1,
                y: 0,
              }}
              exit={
                buttonState === "idle"
                  ? { filter: "blur(4px)", opacity: 0 }
                  : { opacity: 0, y: 25 }
              }
              key={buttonState}
              className="flex items-center justify-center"
            >
              {getButtonContent(buttonState)}
            </motion.div>
          </AnimatePresence>
        </Button>
        <BrandFooter />
      </div>
    </div>
  );
}

export default FiatContent;
