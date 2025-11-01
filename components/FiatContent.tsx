import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

function FiatContent() {
  const [asset, setAsset] = useState("USD");
  const [amount, setAmount] = useState("2.50");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string, numbers, and decimal points
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleAssetChange = (value: string) => {
    setAsset(value);
  };

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <p className="text-sm text-white/50 mt-1">Amount</p>

          <Select value={asset} onValueChange={handleAssetChange}>
            <SelectTrigger className="">
              <SelectValue placeholder="USD" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="inr">INR</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-center items-center text-center  pb-3 border-b border-white/10">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="text-4xl font-medium bg-transparent border-none outline-none focus:ring-0 p-0 text-white text-center "
            placeholder="0.00"
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col w-40">
              <h3 className="text-sm font-medium">You spend</h3>
              {/* <p className="text-xs text-white/50">1 asset on 3 chains</p> */}
            </div>
            <div className="flex flex-col items-end">
              <h3 className="text-sm font-medium">$10.15</h3>
              {/* <button
                className="text-xs text-white/50 flex items-center gap-1 transition-colors duration-200 ease hover:text-white/80 group"
                onClick={() => console.log("View sources clicked")}
              >
                View Sources
                <ChevronRight className="w-2 h-2 text-white/50 transition-all duration-200 ease group-hover:text-white/80 group-hover:translate-x-0.5 relative" />
              </button> */}
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex flex-col w-40">
              <h3 className="text-sm font-medium">You receive</h3>
            </div>
            <div className="flex flex-col items-end">
              <h3 className="text-sm font-medium">10 USDC</h3>
              {/* <p className="text-xs text-white/50 flex items-center gap-1">
                On hyperliquid perps
              </p> */}
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex flex-col w-40">
              <h3 className="text-sm font-medium">Total Fees</h3>
            </div>
            <div className="flex flex-col items-end">
              <h3 className="text-sm font-medium">$0.15</h3>
              {/* <button
                className="text-xs text-white/50 flex items-center gap-1 transition-colors duration-200 ease hover:text-white/80 group"
                onClick={() => console.log("View breakdown clicked")}
              >
                View breakdown
                <ChevronRight className="w-2 h-2 text-white/50 transition-all duration-200 ease group-hover:text-white/80 group-hover:translate-x-0.5 relative" />
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button className="w-full relative overflow-hidden group">
          <span className="inline-grid place-items-center">
            <span className="col-start-1 row-start-1 transition-transform duration-200 ease-in-out group-hover:translate-x-full group-hover:opacity-0">
              Proceed
            </span>
            <ArrowRight className="w-4 h-4 col-start-1 row-start-1 -translate-x-full opacity-0 transition-all duration-200 ease-in-out group-hover:translate-x-0 group-hover:opacity-100" />
          </span>
        </Button>
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-white/40 text-center">powered by avail</p>
        </div>
      </div>
    </div>
  );
}

export default FiatContent;
