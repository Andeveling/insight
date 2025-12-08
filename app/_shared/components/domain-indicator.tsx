"use client";

import { cn } from "@/lib/cn";
import { getDomainColor, getDomainMetadata } from "@/lib/constants/domain-colors";
import type { DomainType } from "@/app/_shared/types/strength.types";
import { Badge } from "@/components/ui/badge";

interface DomainIndicatorProps {
  domain: DomainType;
  showIcon?: boolean;
  showName?: boolean;
  showMetaphor?: boolean;
  variant?: "default" | "outline" | "dot";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function DomainIndicator({
  domain,
  showIcon = false,
  showName = true,
  showMetaphor = false,
  variant = "default",
  size = "md",
  className,
}: DomainIndicatorProps) {
  const metadata = getDomainMetadata(domain);
  const color = getDomainColor(domain);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  if (variant === "dot") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        {showName && (
          <span className="text-sm font-medium text-foreground">
            {metadata.nameEs}
          </span>
        )}
      </div>
    );
  }

  return (
    <Badge
      variant={variant === "outline" ? "outline" : "default"}
      className={cn(
        sizeClasses[size],
        "font-medium transition-colors",
        className
      )}
      style={{
        backgroundColor: variant === "default" ? color : "transparent",
        borderColor: color,
        color: variant === "default" ? "white" : color,
      }}
    >
      {showIcon && <span className="mr-1">{metadata.icon}</span>}
      {showName && metadata.nameEs}
      {showMetaphor && showName && " - "}
      {showMetaphor && (
        <span className="italic opacity-90">{metadata.metaphor}</span>
      )}
    </Badge>
  );
}
