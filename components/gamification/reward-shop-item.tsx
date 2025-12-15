"use client";

import type React from "react";

import { Card } from "@/components/ui/card";
import { Gem } from "lucide-react";
import { cn } from "@/lib/cn";

interface RewardShopItemProps {
  icon: React.ReactNode;
  title: string;
  price: number;
  onClick?: () => void;
  rarity?: "common" | "rare" | "epic" | "legendary" | "platinum" | "diamond" | "mythic";
}

const rarityStyles = {
  common: "border-slate-400/30 hover:border-slate-400/60 hover:shadow-slate-400/20",
  rare: "border-blue-400/30 hover:border-blue-400/60 hover:shadow-blue-400/20",
  epic: "border-purple-400/30 hover:border-purple-400/60 hover:shadow-purple-400/20",
  legendary: "border-yellow-400/30 hover:border-yellow-400/60 hover:shadow-yellow-400/20",
  platinum: "border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-cyan-400/20",
  diamond: "border-indigo-400/30 hover:border-indigo-400/60 hover:shadow-indigo-400/20",
  mythic: "border-rose-400/30 hover:border-rose-400/60 hover:shadow-rose-400/20",
};

export function RewardShopItem({
  icon,
  title,
  price,
  onClick,
  rarity = "rare",
}: RewardShopItemProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-2xl border bg-linear-to-b from-slate-800/90 to-slate-900/90 p-4 transition-all hover:scale-105 hover:shadow-lg",
        rarityStyles[rarity]
      )}
    >
      <div className="mb-3 flex justify-center">{icon}</div>
      <p className="mb-3 text-center text-sm font-semibold text-white">
        {title}
      </p>
      <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-900/80 px-4 py-2">
        <span className="text-lg font-bold text-white">{price}</span>
        <Gem className="h-5 w-5 fill-cyan-400 text-cyan-400" />
      </div>
    </Card>
  );
}
