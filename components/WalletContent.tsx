"use client";
import { ChevronDownIcon } from "lucide-react";
import React from "react";
import AmountSelector from "./AmountSelector";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedCheckmark } from "./ui/animated-checkmark";
import { useAsyncButton, type ButtonState } from "@/hooks/useAsyncButton";
import { TransactionSummary } from "./shared/TransactionSummary";
import { BrandFooter } from "./shared/BrandFooter";

const buttonCopy: Record<ButtonState, React.ReactNode> = {
  idle: "Confirm",
  loading: <Spinner className="w-4 h-4" />,
  success: <AnimatedCheckmark />,
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
          className="w-full"
          disabled={buttonState === "loading"}
          onClick={() => executeAsync()}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25 }}
              key={buttonState}
            >
              {buttonCopy[buttonState]}
            </motion.span>
          </AnimatePresence>
        </Button>
        <BrandFooter />
      </div>
    </div>
  );
}

export default WalletContent;
