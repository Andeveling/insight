"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Save, LogOut } from "lucide-react";

interface SaveExitButtonProps {
  /**
   * Current session ID for saving
   */
  sessionId: string;
  /**
   * Current question progress (e.g., "15 of 60")
   */
  progress?: string;
  /**
   * Callback to force save any pending changes
   */
  onSaveNow?: () => Promise<void>;
  /**
   * Optional custom class name
   */
  className?: string;
}

/**
 * Button component for explicitly saving progress and exiting the assessment
 * Shows confirmation dialog with progress summary
 */
export function SaveExitButton({
  sessionId,
  progress,
  onSaveNow,
  className,
}: SaveExitButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAndExit = async () => {
    setIsSaving(true);

    try {
      // Force save any pending changes
      if (onSaveNow) {
        await onSaveNow();
      }

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("[SaveExit] Error saving:", error);
      // Still navigate even if save fails (auto-save should have saved)
      router.push("/dashboard");
    } finally {
      setIsSaving(false);
      setIsOpen(false);
    }
  };

  const handleContinue = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={className}
          aria-label="Save and exit assessment"
        >
          <Save className="h-4 w-4 mr-2" />
          Save & Exit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save & Exit Assessment</DialogTitle>
          <DialogDescription>
            Your progress will be saved automatically. You can continue this
            assessment anytime from your dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm">
              <Save className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Current progress:</span>
              <span className="font-medium">{progress || "Saved"}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Session ID: {sessionId.slice(0, 8)}...
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleContinue}
            disabled={isSaving}
          >
            Continue Assessment
          </Button>
          <Button onClick={handleSaveAndExit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Spinner className="h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Save & Exit
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
