"use client";

import { cn } from "@/lib/cn";
import { getDomainColor } from "@/lib/constants/domain-colors";
import type { DomainType } from "@/app/_shared/types/strength.types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StrengthBadgeProps {
  name: string;
  nameEs: string;
  domain: DomainType;
  briefDefinition?: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  variant?: "default" | "outline" | "minimal";
  className?: string;
}

export function StrengthBadge({
  name,
  nameEs,
  domain,
  briefDefinition,
  size = "md",
  showTooltip = true,
  variant = "default",
  className,
}: StrengthBadgeProps) {
  const color = getDomainColor(domain);
  const bgColor = getDomainColor(domain, "bg");
  const borderColor = getDomainColor(domain, "border");

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const badgeContent = (
    <Badge
      variant={variant === "outline" ? "outline" : "default"}
      className={cn(
        sizeClasses[size],
        "font-medium transition-all hover:scale-105 cursor-default",
        className
      )}
      style={{
        backgroundColor:
          variant === "default"
            ? color
            : variant === "minimal"
              ? bgColor
              : "transparent",
        borderColor: variant === "minimal" ? "transparent" : borderColor,
        color:
          variant === "default" ? "white" : variant === "minimal" ? color : color,
      }}
    >
      {nameEs}
    </Badge>
  );

  if (showTooltip && briefDefinition) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold">{nameEs}</p>
              <p className="text-xs text-muted-foreground">{name}</p>
              <p className="text-sm">{briefDefinition}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badgeContent;
}
