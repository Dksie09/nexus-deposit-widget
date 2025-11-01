"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Playground from "@/components/Playground";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasConnectedWallet");
    if (hasVisitedBefore === "true") {
      setIsWalletConnected(true);
    }
    setIsLoading(false);
  }, []);

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
    localStorage.setItem("hasConnectedWallet", "true");
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen px-10 py-5 font-sans max-w-3xl mx-auto">
      <div className=" w-full mx-auto px-4 pt-12 pb-6">
        <h1 className="font-instrument text-5xl font-medium leading">
          Deposit
        </h1>
        <p className="text-base text-white/50 mt-5 max-w-lg">
          The Deposit component provides a simple, intuitive interface for users
          to deposit tokens cross-chain using Avail Nexus. It allows users to
          select their preferred chain, choose a supported token, enter an
          amount, and confirm the transaction.
        </p>
        <AnimatePresence mode="popLayout">
          {!isWalletConnected && (
            <motion.div
              className="relative"
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              layout
            >
              <Button className="mt-6" onClick={handleConnectWallet}>
                Connect Wallet
              </Button>
              <img
                src="/begin.svg"
                alt="Deposit"
                className="absolute -bottom-26 left-28 scale-70"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {isWalletConnected && (
        <motion.div
          layout
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        >
          <Playground isWalletConnected={isWalletConnected} />
        </motion.div>
      )}
      {isWalletConnected && (
        <div className="my-10 ml-4">
          <p className="text-sm text-white/50">
            Designed by{" "}
            <a
              href="https://www.x.com/duckwhocodes"
              target="_blank"
              className="text-white/80 hover:text-white"
            >
              duckwhocodes
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
