"use client";

import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import WalletContent from "./WalletContent";
import TransferQRContent from "./TransferQRContent";
import FiatContent from "./FiatContent";
import { XIcon } from "lucide-react";
import { DEPOSIT_TABS } from "@/constants";
import { useModal } from "@/hooks/useModal";
import { useDissolveAnimation } from "@/hooks/useDissolveAnimation";

function DepositButton() {
  const [activeTab, setActiveTab] = useState("wallet");
  const ref = useRef<HTMLDivElement>(null);
  
  const { isOpen, isClosing, allowMorphBack, open, close, setAllowMorphBack } = useModal();
  const { cardRef, filterRef, noiseRef, animateDissolve } = useDissolveAnimation({
    onComplete: () => {
      close();
      setTimeout(() => {
        setAllowMorphBack(true);
      }, 100);
    }
  });

  const handleClose = () => {
    setAllowMorphBack(false);
    animateDissolve();
  };

  return (
    <>
      {/* SVG Filter for Dissolve Effect */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <defs>
          <filter
            id="card-dissolve-filter"
            x="-200%"
            y="-200%"
            width="500%"
            height="500%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.004"
              numOctaves={1}
              result="bigNoise"
              ref={noiseRef}
            />
            <feComponentTransfer in="bigNoise" result="bigNoiseAdjusted">
              <feFuncR type="linear" slope="5" intercept="-2" />
              <feFuncG type="linear" slope="5" intercept="-2" />
            </feComponentTransfer>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1"
              numOctaves={1}
              result="fineNoise"
            />
            <feMerge result="mergedNoise">
              <feMergeNode in="bigNoiseAdjusted" />
              <feMergeNode in="fineNoise" />
            </feMerge>
            <feDisplacementMap
              in="SourceGraphic"
              in2="mergedNoise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              ref={filterRef}
            />
          </filter>
        </defs>
      </svg>

      <div ref={ref} className="flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key={allowMorphBack ? "morph" : "no-morph"}
              layoutId={allowMorphBack ? "deposit-wrapper" : undefined}
              initial={false}
              style={{ borderRadius: 6 }}
            >
              <Button
                variant="outline"
                onClick={() => {
                  open();
                }}
              >
                <motion.span
                  layoutId={allowMorphBack ? "deposit-title" : undefined}
                >
                  Deposit
                </motion.span>
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/30"
              style={{
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
              onClick={handleClose}
            />

            <motion.div
              layoutId={isClosing ? undefined : "deposit-wrapper"}
              className="w-96 h-[490px] border border-white/50 bg-background shadow-xs py-4 px-4 flex flex-col relative z-10"
              style={{
                borderRadius: 12,
                filter: "url(#card-dissolve-filter)",
                WebkitFilter: "url(#card-dissolve-filter)",
                willChange: "transform, opacity",
              }}
              onClick={(e) => e.stopPropagation()}
              ref={cardRef}
            >
              <div className="flex items-start justify-between ">
                <div className="flex items-center gap-1 mb-2">
                  <motion.span
                    layoutId={isClosing ? undefined : "deposit-title"}
                    className="text-sm font-medium"
                  >
                    Deposit
                  </motion.span>
                  <span className="text-xs text-white/50">(USDC)</span>
                </div>
                <div
                  className="absolute top-3 right-4 text-white/50 hover:text-white/80 cursor-pointer"
                  onClick={handleClose}
                >
                  <XIcon className="w-4 h-4" />
                </div>

                {/* <span className="text-xs text-white/50">0x32..6789</span> */}
              </div>

              <div className="relative w-full border-b border-white/10">
                <div className="flex items-center justify-between">
                  {DEPOSIT_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex-1 text-center py-2 text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? "text-white"
                          : "text-white/40 hover:text-white/60"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="active-tab"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {activeTab === "wallet" && <WalletContent />}
                    {activeTab === "transfer" && <TransferQRContent />}
                    {activeTab === "fiat" && <FiatContent />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </>
  );
}

export default DepositButton;
