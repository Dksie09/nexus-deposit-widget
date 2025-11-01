"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, ChevronRight } from "lucide-react";
import AmountSelector from "./AmountSelector";
import WalletContent from "./WalletContent";
import TransferQRContent from "./TransferQRContent";

function DepositButton() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("wallet");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Use elementFromPoint to get the actual element at click coordinates
      // This works around Radix Select's event manipulation
      const actualElement = document.elementFromPoint(event.clientX, event.clientY);
      const elementToCheck = actualElement || target;
      
      // Check if click is outside the deposit card
      if (ref.current && !ref.current.contains(elementToCheck)) {
        // Check if the actual element is select-related
        const isSelectContent = elementToCheck.closest('[data-slot="select-content"]');
        const isSelectItem = elementToCheck.closest('[data-slot="select-item"]');
        const isSelectTrigger = elementToCheck.closest('[data-slot="select-trigger"]');
        
        // Don't close if clicking on select-related elements
        if (!isSelectContent && !isSelectItem && !isSelectTrigger) {
          setOpen(false);
        }
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const tabs = [
    { id: "wallet", label: "Wallet" },
    { id: "transfer", label: "Transfer QR" },
    { id: "fiat", label: "Fiat" },
  ];

  return (
    <div ref={ref} className="flex items-center justify-center">
      <AnimatePresence>
        {!open ? (
          <motion.div layoutId="deposit-wrapper" style={{ borderRadius: 6 }}>
            <Button variant="outline" onClick={() => setOpen(true)}>
              <motion.span layoutId="deposit-title">Deposit</motion.span>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            layoutId="deposit-wrapper"
            className="w-96 h-[500px] border border-white/50 bg-background shadow-xs z-50 py-4 px-4 flex flex-col"
            style={{ borderRadius: 12 }}
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <motion.span
                layoutId="deposit-title"
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
            <div className="mt-6 flex-1 overflow-y-auto">
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
                  {activeTab === "fiat" && (
                    <p className="text-sm text-white/50">Fiat content here</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DepositButton;
