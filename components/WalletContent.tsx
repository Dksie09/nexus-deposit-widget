"use client";
import { ChevronDownIcon, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import AmountSelector from "./AmountSelector";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedCheckmark } from "./ui/animated-checkmark";

type ButtonState = "idle" | "loading" | "success";

const buttonCopy: Record<ButtonState, React.ReactNode> = {
  idle: "Confirm",
  loading: <Spinner className="w-4 h-4" />,
  success: <AnimatedCheckmark />,
};

function WalletContent() {
  const [buttonState, setButtonState] = useState<ButtonState>("idle");

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
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col w-40">
              <h3 className="text-sm font-medium">You spend</h3>
              <p className="text-xs text-white/50">1 asset on 3 chains</p>
            </div>
            <div className="flex flex-col items-end">
              <h3 className="text-sm font-medium">$10.15</h3>
              <button
                className="text-xs text-white/50 flex items-center gap-1 transition-colors duration-200 ease hover:text-white/80 group"
                onClick={() => console.log("View sources clicked")}
              >
                View Sources
                <ChevronRight className="w-2 h-2 text-white/50 transition-all duration-200 ease group-hover:text-white/80 group-hover:translate-x-0.5 relative" />
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex flex-col w-40">
              <h3 className="text-sm font-medium">You receive</h3>
            </div>
            <div className="flex flex-col items-end">
              <h3 className="text-sm font-medium">10 USDC</h3>
              <p className="text-xs text-white/50 flex items-center gap-1">
                On hyperliquid perps
              </p>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex flex-col w-40">
              <h3 className="text-sm font-medium">Total Fees</h3>
            </div>
            <div className="flex flex-col items-end">
              <h3 className="text-sm font-medium">$0.15</h3>
              <button
                className="text-xs text-white/50 flex items-center gap-1 transition-colors duration-200 ease hover:text-white/80 group"
                onClick={() => console.log("View breakdown clicked")}
              >
                View breakdown
                <ChevronRight className="w-2 h-2 text-white/50 transition-all duration-200 ease group-hover:text-white/80 group-hover:translate-x-0.5 relative" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          className="w-full"
          disabled={buttonState === "loading"}
          onClick={() => {
            if (buttonState === "success") return;

            setButtonState("loading");

            console.log("Deposit confirmed");

            setTimeout(() => {
              setButtonState("success");
            }, 1750);

            setTimeout(() => {
              setButtonState("idle");
            }, 3500);
          }}
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
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-white/40 text-center">powered by avail</p>
        </div>
      </div>
    </div>
  );
}

export default WalletContent;
