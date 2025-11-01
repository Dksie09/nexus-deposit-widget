import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { InteractiveQRCode } from "./InteractiveQRCode";
import { SUPPORTED_CHAINS, SUPPORTED_ASSETS } from "@/constants";
import { useClipboard } from "@/hooks/useClipboard";
import { BrandFooter } from "./shared/BrandFooter";

function TransferQRContent() {
  const [chain, setChain] = useState("arbitrum");
  const [asset, setAsset] = useState("usdc");
  const [isQRChanging, setIsQRChanging] = useState(false);
  const { isCopied, copyToClipboard } = useClipboard();

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
    await copyToClipboard(depositAddress);
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
                  {SUPPORTED_CHAINS.map((chain) => (
                    <SelectItem key={chain.value} value={chain.value}>
                      {chain.label}
                    </SelectItem>
                  ))}
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
                  {SUPPORTED_ASSETS.map((asset) => (
                    <SelectItem key={asset.value} value={asset.value}>
                      {asset.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="h-4">
            <p className="text-xs text-white/70 transition-opacity duration-200 ease-out">
              {isCopied ? "URL copied!" : "Scan using camera or wallet app"}
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

      <BrandFooter />
    </div>
  );
}

export default TransferQRContent;
