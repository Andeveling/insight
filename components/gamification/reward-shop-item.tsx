"use client";

import type React from "react";

import { Card } from "@/components/ui/card";
import { Gem } from "lucide-react";

interface RewardShopItemProps {
  icon: React.ReactNode;
  title: string;
  price: number;
  onClick?: () => void;
}

export function RewardShopItem({
  icon,
  title,
  price,
  onClick,
}: RewardShopItemProps) {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-blue-400/30 bg-linear-to-b from-slate-800/90 to-slate-900/90 p-4 transition-all hover:scale-105 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-400/20"
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
