"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Copy, Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "default" | "lg";
  showCopy?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", size = "default", showCopy = false, ...props },
    ref
  ) => {
    const [isCopied, setIsCopied] = React.useState(false);
    const internalRef = React.useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    const handleCopy = async () => {
      const input = inputRef.current;
      if (!input?.value) return;

      try {
        await navigator.clipboard.writeText(input.value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    };

    if (!showCopy) {
      return (
        <input
          type={type}
          data-slot="input"
          data-size={size}
          className={cn(
            "flex w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white transition-[border-color] duration-200 ease outline-none placeholder:text-white/50 disabled:cursor-not-allowed disabled:opacity-50 hover:border-white/50 focus:border-white/50 data-[size=sm]:h-8 data-[size=default]:h-9 data-[size=lg]:h-10",
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <div className="relative w-full">
        <input
          type={type}
          data-slot="input"
          data-size={size}
          className={cn(
            "flex w-full rounded-md border border-white/20 bg-transparent px-3 py-2 pr-10 text-sm text-white transition-[border-color] duration-200 ease outline-none placeholder:text-white/50 disabled:cursor-not-allowed disabled:opacity-50 hover:border-white/50 focus:border-white/50 data-[size=sm]:h-8 data-[size=default]:h-9 data-[size=lg]:h-10",
            className
          )}
          ref={inputRef as React.RefObject<HTMLInputElement>}
          {...props}
        />
        <motion.button
          type="button"
          onClick={handleCopy}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded transition-colors duration-200 ease focus:outline-none"
          aria-label="Copy to clipboard"
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            animate={{
              filter: isCopied
                ? ["blur(0px)", "blur(4px)", "blur(0px)"]
                : "blur(0px)",
            }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-500" strokeWidth={2.5} />
            ) : (
              <Copy className="w-4 h-4 text-white/50" strokeWidth={2} />
            )}
          </motion.div>
        </motion.button>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
