"use client";

import React, { useRef } from "react";
import { Button } from "./ui/button";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { createPortal } from "react-dom";
import WalletContent from "./WalletContent";
import TransferQRContent from "./TransferQRContent";
import FiatContent from "./FiatContent";
import { XIcon } from "lucide-react";
import { DEPOSIT_TABS } from "@/constants";
import { useModal } from "@/hooks/useModal";
import { useDissolveAnimation } from "@/hooks/useDissolveAnimation";
import { useTabAnimation } from "@/hooks/useTabAnimation";
import { DissolveFilter } from "./shared/DissolveFilter";

function DepositButton() {
  const ref = useRef<HTMLDivElement>(null);
  
  const { isOpen, isClosing, allowMorphBack, open, close, setAllowMorphBack } = useModal();
  const { activeTab, direction, targetHeight, handleTabChange, variants } = useTabAnimation();
  const { cardRef, filterRef, noiseRef, animateDissolve } = useDissolveAnimation({
    onComplete: () => {
      close();
      setTimeout(() => {
        setAllowMorphBack(true);
      }, 100);
    },
  });

  const handleOpen = () => {
    // Reset filter before opening to ensure clean morph animation
    if (filterRef.current) {
      filterRef.current.setAttribute("scale", "0");
    }
    if (cardRef.current) {
      cardRef.current.style.transform = "scale(1)";
      cardRef.current.style.opacity = "1";
    }
    open();
  };

  const handleClose = () => {
    setAllowMorphBack(false);
    animateDissolve();
  };

  return (
    <>
      <DissolveFilter filterRef={filterRef} noiseRef={noiseRef} />

      <div ref={ref} className="flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key={allowMorphBack ? "morph" : "no-morph"}
              layoutId={allowMorphBack ? "deposit-wrapper" : undefined}
              initial={false}
              style={{ borderRadius: 6 }}
            >
              <Button variant="outline" onClick={handleOpen}>
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

            <MotionConfig
              transition={{ duration: 0.5, type: "spring", bounce: 0 }}
            >
              <motion.div
                layoutId={isClosing ? undefined : "deposit-wrapper"}
                className="w-96 border border-white/50 bg-background shadow-xs py-4 px-4 flex flex-col relative z-10"
                style={{
                  borderRadius: 12,
                  filter: "url(#card-dissolve-filter)",
                  WebkitFilter: "url(#card-dissolve-filter)",
                  willChange: "transform, opacity",
                }}
                onClick={(e) => e.stopPropagation()}
                ref={cardRef}
                animate={{
                  height: targetHeight,
                }}
                transition={{
                  height: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }, // ease-out-quad
                }}
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
                </div>

                <div className="relative w-full border-b border-white/10">
                  <div className="flex items-center justify-between">
                    {DEPOSIT_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
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

                <div className="mt-3 relative overflow-hidden">
                  <AnimatePresence
                    mode="popLayout"
                    initial={false}
                    custom={direction}
                  >
                    <motion.div
                      key={activeTab}
                      variants={variants}
                      initial="initial"
                      animate="active"
                      exit="exit"
                      custom={direction}
                    >
                      {activeTab === "wallet" && <WalletContent />}
                      {activeTab === "transfer" && <TransferQRContent />}
                      {activeTab === "fiat" && <FiatContent />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </MotionConfig>
          </div>,
          document.body
        )}
    </>
  );
}

export default DepositButton;
