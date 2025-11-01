"use client";

import React from "react";
import { Button } from "@/components/ui/button"; // adjust import if needed
import { TextAnimate } from "./animatedText";
import DepositButton from "./DepositButton";
import { AnimatePresence, motion } from "motion/react";

interface PlaygroundProps {
  isWalletConnected: boolean;
}

function Playground({ isWalletConnected }: PlaygroundProps) {
  return (
    <div className="relative w-full h-96 mx-auto border mt-5 border-white/10 flex items-center justify-center">
      <div className="absolute inset-0 grid grid-cols-30 grid-rows-12 p-5">
        {Array.from({ length: 390 }).map((_, index) => (
          <div key={index} className="flex items-center justify-center">
            <p className="text-2xl text-neutral-400/10 transition-all duration-0 hover:text-white/20 cursor-default hover:delay-0 [transition-delay:0.5s] ease-in-out hover:scale-120">
              +
            </p>
          </div>
        ))}
      </div>

      {/* Button and text stacked vertically */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <AnimatePresence mode="wait">
          {isWalletConnected ? (
            <motion.div
              key="deposit-button"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            >
              <DepositButton />
            </motion.div>
          ) : (
            <motion.div
              key="connect-text"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            >
              <TextAnimate
                animation="blurInUp"
                by="character"
                className="text-base text-foreground/40 max-w-md bg-background"
                delay={0.1}
              >
                connect your wallet to preview
              </TextAnimate>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Playground;
