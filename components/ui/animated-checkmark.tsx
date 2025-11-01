"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";

export function AnimatedCheckmark() {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
    >
      {/* Glitter effect particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-green-500 rounded-full"
          style={{
            left: "45%",
            top: "45%",
            x: Math.cos((i / 6) * Math.PI * 2) * 16,
            y: Math.sin((i / 6) * Math.PI * 2) * 16,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [1, 0], scale: [1, 0] }}
          transition={{
            duration: 0.8,
            delay: 0.1 + i * 0.05,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Checkmark icon */}
      <motion.div
        initial={{ rotate: -180, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.4, delay: 0.05 }}
      >
        <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
      </motion.div>
    </motion.div>
  );
}
