"use client";

import { useState } from "react";
import { DEPOSIT_TABS } from "@/constants";

// Height for each tab content (measured from actual content)
const TAB_HEIGHTS = {
  wallet: 480,
  transfer: 490,
  fiat: 440,
} as const;

export type TabId = keyof typeof TAB_HEIGHTS;

export function useTabAnimation(initialTab: TabId = "wallet") {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [direction, setDirection] = useState(0);

  const handleTabChange = (newTabId: string) => {
    const currentIndex = DEPOSIT_TABS.findIndex((tab) => tab.id === activeTab);
    const newIndex = DEPOSIT_TABS.findIndex((tab) => tab.id === newTabId);
    
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(newTabId as TabId);
  };

  const variants = {
    initial: (direction: number) => ({
      x: `${110 * direction}%`,
      opacity: 0,
    }),
    active: {
      x: "0%",
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: `${-110 * direction}%`,
      opacity: 0,
    }),
  };

  return {
    activeTab,
    direction,
    targetHeight: TAB_HEIGHTS[activeTab],
    handleTabChange,
    variants,
  };
}