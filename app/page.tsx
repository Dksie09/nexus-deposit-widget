"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Playground from "@/components/Playground";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
  };

  return (
    <div className="flex flex-col min-h-screen p-10 font-sans max-w-3xl mx-auto">
      <div className=" w-full mx-auto px-4 pt-12 pb-6">
        <h1 className="font-instrument text-5xl font-medium leading">
          Deposit
        </h1>
        <p className="text-base text-white/50 mt-5 max-w-lg">
          The Deposit component provides a simple, intuitive interface for users
          to deposit tokens into the Avail Nexus network. It allows users to
          select their preferred blockchain, choose a supported token, enter an
          amount, and confirm the transaction.
        </p>
        <AnimatePresence mode="popLayout">
          {!isWalletConnected && (
            <motion.div
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              layout
            >
              <Button className="mt-6" onClick={handleConnectWallet}>
                Connect Wallet
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        {/* <img
          src="/begin.svg"
          alt="Deposit"
          className="absolute -bottom-26 left-28 scale-70"
        /> */}
      </div>
      <motion.div
        layout
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      >
        <Playground isWalletConnected={isWalletConnected} />
      </motion.div>
    </div>
  );
}
