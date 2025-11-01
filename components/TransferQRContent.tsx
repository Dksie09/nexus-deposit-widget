import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { InteractiveQRCode } from "./InteractiveQRCode";

function TransferQRContent() {
  const [chain, setChain] = useState("arbitrum");
  const [asset, setAsset] = useState("usdc");
  const [copied, setCopied] = useState(false);
  const [isQRChanging, setIsQRChanging] = useState(false);

  const depositAddress = "0x8370fcF840a3914765f24Be38f9763A30603b711";

  const handleChainChange = (value: string) => {
    setChain(value);
  };

  const handleAssetChange = (value: string) => {
    setAsset(value);
  };

  // Trigger blur morph effect when chain, asset, or address changes
  useEffect(() => {
    setIsQRChanging(true);
    const timer = setTimeout(() => setIsQRChanging(false), 300);
    return () => clearTimeout(timer);
  }, [chain, asset, depositAddress]);

  const handleQRClick = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 min-w-0 flex-col items-start">
            <p className="text-xs text-white/50">Select Chain</p>
            <Select value={chain} onValueChange={handleChainChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Arbitrum" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-1 min-w-0 flex-col items-start">
            <p className="text-xs text-white/50">Select Asset</p>
            <Select value={asset} onValueChange={handleAssetChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="USDC" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="usdc">USDC</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                  <SelectItem value="eth">ETH</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="h-4">
            <p className="text-xs text-white/70 transition-opacity duration-200 ease-out">
              {copied ? "URL copied!" : "Scan using camera or wallet app"}
            </p>
          </div>
          <motion.button
            onClick={handleQRClick}
            className="cursor-pointer outline-none transition-transform duration-150 ease-out active:scale-[0.98] rounded-lg"
            aria-label="Copy deposit address"
          >
            <motion.div
              animate={{
                filter: isQRChanging
                  ? ["blur(0px)", "blur(4px)", "blur(0px)"]
                  : "blur(0px)",
              }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <InteractiveQRCode />
            </motion.div>
          </motion.button>
        </div>

        <div className="flex flex-1 min-w-0 flex-col items-start">
          <p className="text-xs text-white/50">Deposit Address</p>
          <Input
            showCopy
            defaultValue={depositAddress}
            placeholder="0x00...0000"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-white/40 text-center">powered by avail</p>
      </div>
    </div>
  );
}

export default TransferQRContent;
