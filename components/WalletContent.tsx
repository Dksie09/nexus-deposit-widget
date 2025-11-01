"use client";
import { ChevronDownIcon, Check } from "lucide-react";
import React from "react";
import AmountSelector from "./AmountSelector";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedCheckmark } from "./ui/animated-checkmark";
import { useAsyncButton, type ButtonState } from "@/hooks/useAsyncButton";
import { TransactionSummary } from "./shared/TransactionSummary";
import { BrandFooter } from "./shared/BrandFooter";

const getButtonContent = (state: ButtonState) => {
  switch (state) {
    case "idle":
      return (
        <span className="inline-grid place-items-center">
          <span className="col-start-1 row-start-1 transition-transform duration-200 ease-in-out group-hover:translate-x-full group-hover:opacity-0">
            Confirm
          </span>
          <Check className="w-4 h-4 col-start-1 row-start-1 -translate-x-full opacity-0 transition-all duration-200 ease-in-out group-hover:translate-x-0 group-hover:opacity-100" />
        </span>
      );
    case "loading":
      return <Spinner className="w-4 h-4" />;
    case "success":
      return <AnimatedCheckmark />;
  }
};

function WalletContent() {
  const { buttonState, executeAsync } = useAsyncButton();

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <p className="text-sm text-white/50 ml-2">
            Customize source asset (use any)
          </p>
          <ChevronDownIcon className="w-4 h-4 text-white/50 mr-2" />
        </div>
        <div className=" pb-3 border-b border-white/10 flex items-center justify-between">
          <AmountSelector />
          <span className="text-base text-white/50 mr-2">USDC</span>
        </div>
        <TransactionSummary
          spendAmount="$10.15"
          receiveAmount="10 USDC"
          feeAmount="$0.15"
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

export default WalletContent;
