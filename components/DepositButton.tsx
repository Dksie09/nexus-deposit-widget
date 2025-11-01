"use client";

import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import WalletContent from "./WalletContent";
import TransferQRContent from "./TransferQRContent";
import FiatContent from "./FiatContent";

function DepositButton() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("wallet");
  const [isClosing, setIsClosing] = useState(false);
  const [allowMorphBack, setAllowMorphBack] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<SVGFEDisplacementMapElement>(null);
  const noiseRef = useRef<SVGFETurbulenceElement>(null);

  const tabs = [
    { id: "wallet", label: "Wallet" },
    { id: "transfer", label: "Transfer QR" },
    { id: "fiat", label: "Fiat" },
  ];

  const animateDissolve = () => {
    console.log("🔥 DISSOLVE START", { isClosing, allowMorphBack, open });

    if (!cardRef.current || !filterRef.current || !noiseRef.current) {
      setOpen(false);
      return;
    }

    setIsClosing(true);
    setAllowMorphBack(false); // Disable morph-back animation
    console.log("🔥 Set isClosing=true, allowMorphBack=false");

    const start = performance.now();
    const duration = 800;
    const maxScale = 2000;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out-cubic

    // Randomize noise pattern for variation
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
        console.log("🔥 DISSOLVE COMPLETE - about to close");
        // Animation complete, close the modal
        if (cardRef.current && filterRef.current) {
          cardRef.current.style.transform = "scale(1)";
          cardRef.current.style.opacity = "1";
          filterRef.current.setAttribute("scale", "0");
        }
        // Close with allowMorphBack=false so button appears without layoutId
        setOpen(false);
        console.log("🔥 Set open=false (allowMorphBack still false)");

        // Re-enable morphing after button has rendered
        setTimeout(() => {
          setAllowMorphBack(true);
          console.log("🔥 Set allowMorphBack=true (ready for next open)");
        }, 100);
      }
    };

    requestAnimationFrame(step);
  };

  const handleClose = () => {
    console.log("🔴 CLOSE CLICKED");
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
          {!open ? (
            <motion.div
              key={allowMorphBack ? "morph" : "no-morph"}
              layoutId={allowMorphBack ? "deposit-wrapper" : undefined}
              initial={false}
              style={{ borderRadius: 6 }}
              ref={(el) => {
                if (el) {
                  console.log("🟢 BUTTON RENDER", {
                    key: allowMorphBack ? "morph" : "no-morph",
                    layoutId: allowMorphBack ? "deposit-wrapper" : "none",
                    allowMorphBack,
                  });
                }
              }}
            >
              <Button
                variant="outline"
                onClick={() => {
                  console.log("🟢 BUTTON CLICKED - opening");
                  setIsClosing(false); // Reset for next morph animation
                  setOpen(true);
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

      {/* Portal the opened card to document.body */}
      {open &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
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

            {/* Card */}
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
              ref={(el) => {
                cardRef.current = el;
                if (el) {
                  console.log("🔵 CARD RENDER", {
                    layoutId: isClosing ? "none" : "deposit-wrapper",
                    isClosing,
                  });
                }
              }}
            >
              <div className="flex items-center gap-1 mb-2">
                <motion.span
                  layoutId={isClosing ? undefined : "deposit-title"}
                  className="text-sm font-medium"
                >
                  Deposit
                </motion.span>
                <span className="text-xs text-white/50">(USDC)</span>
              </div>

              {/* Animated Tab Bar */}
              <div className="relative w-full border-b border-white/10">
                <div className="flex items-center justify-between">
                  {tabs.map((tab) => (
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

              {/* Tab Content */}
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
