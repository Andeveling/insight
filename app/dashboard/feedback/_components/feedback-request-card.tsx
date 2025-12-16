"use client";

/**
 * FeedbackRequestCard Component
 *
 * Displays feedback request with XP indicator
 * Part of Feature 008: Feedback Gamification Integration
 */

import Link from "next/link";
import { motion } from "motion/react";
import { Clock, Coins, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GamifiedBadge } from "@/components/gamification";
import { cn } from "@/lib/cn";

export interface FeedbackRequestCardProps {
  requestId: string;
  requesterName: string;
  expiresAt: Date;
  xpReward: number;
  streakMultiplier?: number;
  isUrgent?: boolean;
}

/**
 * Card showing feedback request with gamification indicators
 */
export function FeedbackRequestCard({
  requestId,
  requesterName,
  expiresAt,
  xpReward,
  streakMultiplier = 1,
  isUrgent = false,
}: FeedbackRequestCardProps) {
  const daysUntilExpiration = Math.ceil(
    (expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "transition-all hover:shadow-md",
          isUrgent && "border-orange-500/50 bg-orange-500/5"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            {/* Request Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">
                {requesterName}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {daysUntilExpiration > 0
                    ? `${daysUntilExpiration} día${
                        daysUntilExpiration !== 1 ? "s" : ""
                      } restante${daysUntilExpiration !== 1 ? "s" : ""}`
                    : "Expira hoy"}
                </span>
              </div>
            </div>

            {/* XP Badge */}
            <div className="flex flex-col items-end gap-2">
              <GamifiedBadge
                icon={Coins}
                value={xpReward}
                label="XP"
                variant="gold"
                iconFill
                size="md"
                className={cn(
                  "transition-transform hover:scale-110",
                  isUrgent && "ring-2 ring-orange-500/50"
                )}
              />

              {/* Streak Multiplier Indicator */}
              {streakMultiplier > 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300"
                >
                  <Flame className="h-3 w-3" aria-hidden="true" />
                  <span>x{streakMultiplier.toFixed(1)}</span>
                </motion.div>
              )}

              {/* Urgent Badge */}
              {isUrgent && (
                <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                  ¡Urgente!
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4">
            <Link href={`/dashboard/feedback/respond/${requestId}`}>
              <Button variant="outline" className="w-full" size="sm">
                Responder Feedback
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
