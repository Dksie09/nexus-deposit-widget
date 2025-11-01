import React, { useState, useRef, useEffect } from "react";
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

function TransferQRContent() {
  const [copied, setCopied] = useState(false);
  const [chain, setChain] = useState("arbitrum");
  const [asset, setAsset] = useState("usdc");
  const [isAnimating, setIsAnimating] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const filterRef = useRef<SVGFEDisplacementMapElement>(null);
  const noiseRef = useRef<SVGFETurbulenceElement>(null);

  const depositAddress = "0x8370fcF840a3914765f24Be38f9763A30603b711";

  const animateDissolve = (callback: () => void) => {
    if (!imgRef.current || !filterRef.current || !noiseRef.current) return;

    setIsAnimating(true);
    const start = performance.now();
    const duration = 800; // Slightly faster for UX
    const maxScale = 2000;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    // Randomize noise pattern
    noiseRef.current.setAttribute(
      "seed",
      String(Math.floor(Math.random() * 1000))
    );

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const e = ease(t);

      if (filterRef.current && imgRef.current) {
        filterRef.current.setAttribute("scale", String(e * maxScale));
        imgRef.current.style.transform = `scale(${1 + 0.1 * e})`;
        imgRef.current.style.opacity =
          t < 0.5 ? "1" : String(1 - (t - 0.5) / 0.5);
      }

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        // Reset and callback
        if (imgRef.current && filterRef.current) {
          imgRef.current.style.transform = "scale(1)";
          imgRef.current.style.opacity = "1";
          filterRef.current.setAttribute("scale", "0");
        }
        setIsAnimating(false);
        callback();
      }
    };

    requestAnimationFrame(step);
  };

  const handleChainChange = (value: string) => {
    animateDissolve(() => {
      setChain(value);
    });
  };

  const handleAssetChange = (value: string) => {
    animateDissolve(() => {
      setAsset(value);
    });
  };

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
    <>
      {/* SVG Filter Definition */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <defs>
          <filter
            id="qr-dissolve-filter"
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

          <div className="flex flex-1 min-w-0 flex-col items-start">
            <p className="text-xs text-white/50">Deposit Address</p>
            <Input
              showCopy
              defaultValue={depositAddress}
              placeholder="0x00...0000"
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleQRClick}
              disabled={isAnimating}
              className="transition-transform duration-150 ease-out active:scale-98 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded overflow-visible"
            >
              <img
                ref={imgRef}
                src="/qr-code.svg"
                alt="Transfer QR"
                className="w-42 pointer-events-none transition-none"
                style={{
                  filter: "url(#qr-dissolve-filter)",
                  WebkitFilter: "url(#qr-dissolve-filter)",
                  willChange: "transform, opacity",
                }}
              />
            </button>
            <p
              className={`text-xs text-white/50 transition-opacity duration-200 ${
                copied ? "opacity-100" : "opacity-0"
              }`}
            >
              copied url!
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-white/40 text-center">powered by avail</p>
        </div>
      </div>
    </>
  );
}

export default TransferQRContent;
