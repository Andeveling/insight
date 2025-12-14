"use client";

import { useState, useCallback } from "react";
import { Trophy } from "lucide-react";
import { ChallengeCard } from "./challenge-card";
import { LevelUpNotification } from "./level-up-notification";
import { useModuleProgress } from "../_hooks";
import type { ChallengeCard as ChallengeCardType } from "../_schemas";

interface InteractiveChallengeListProps {
  challenges: ChallengeCardType[];
  moduleId: string;
  onModuleComplete?: () => void;
}

/**
 * Interactive Challenge List Component
 *
 * Renders a list of challenge cards with completion functionality.
 * Tracks progress and shows level-up notifications.
 */
export function InteractiveChallengeList({
  challenges,
  moduleId,
  onModuleComplete,
}: InteractiveChallengeListProps) {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);

  const { completedCount, totalCount, progressPercent, markChallengeComplete } =
    useModuleProgress(
      moduleId,
      challenges.map((c) => ({
        id: c.id,
        isCompleted: c.isCompleted,
        completedAt: c.completedAt ?? undefined,
      }))
    );

  const handleChallengeComplete = useCallback(
    (
      challengeId: string,
      result: {
        xpGained: number;
        leveledUp: boolean;
        newLevel?: number;
        moduleCompleted: boolean;
      }
    ) => {
      markChallengeComplete(challengeId, result.xpGained);

      if (result.leveledUp && result.newLevel) {
        setNewLevel(result.newLevel);
        setShowLevelUp(true);
      }

      if (result.moduleCompleted) {
        onModuleComplete?.();
      }
    },
    [markChallengeComplete, onModuleComplete]
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Desafíos
        </h2>
        <span className="text-sm text-muted-foreground">
          {completedCount} / {totalCount} completados ({progressPercent}%)
        </span>
      </div>
      <p className="text-muted-foreground">
        Completa estos desafíos para ganar XP y avanzar en tu desarrollo.
      </p>

      <div className="space-y-3">
        {challenges.map((challenge, index) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            index={index}
            onComplete={(result) =>
              handleChallengeComplete(challenge.id, result)
            }
          />
        ))}
      </div>

      {/* Level Up Notification */}
      {showLevelUp && (
        <LevelUpNotification
          previousLevel={newLevel - 1}
          newLevel={newLevel}
          onClose={() => setShowLevelUp(false)}
        />
      )}
    </section>
  );
}
