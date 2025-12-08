"use client";

import {
  CheckCircleIcon,
  FileTextIcon,
  RefreshCwIcon,
  SparklesIcon,
  XCircleIcon,
} from "lucide-react";
import { useState, useTransition } from "react";
import { Loader } from "@/components/ai-elements/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ModelProvider } from "@/lib/ai";

export interface ReportGeneratorProps {
  type: "individual" | "team";
  entityId: string;
  entityName: string;
  hasExistingReport: boolean;
  lastGeneratedAt?: Date;
  onGenerate: (
    entityId: string,
    forceRegenerate: boolean,
    provider: ModelProvider
  ) => Promise<{ success: boolean; error?: string }>;
  onViewReport?: () => void;
}

export function ReportGenerator({
  type,
  entityId,
  entityName,
  hasExistingReport,
  lastGeneratedAt,
  onGenerate,
  onViewReport,
}: ReportGeneratorProps) {
  const [isPending, startTransition] = useTransition();
  const [provider, setProvider] = useState<ModelProvider>("openai");
  const [result, setResult] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  const handleGenerate = (forceRegenerate: boolean) => {
    setResult(null);
    startTransition(async () => {
      const res = await onGenerate(entityId, forceRegenerate, provider);
      setResult(res);
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
            <SparklesIcon className="size-6 text-primary" />
          </div>
          <div>
            <CardTitle>
              {type === "individual" ? "Personal Report" : "Team Report"}
            </CardTitle>
            <CardDescription>
              AI-powered {type === "individual" ? "strength" : "team"} analysis
              for {entityName}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Provider Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">AI Provider</Label>
          <Select
            value={provider}
            onValueChange={(v) => setProvider(v as ModelProvider)}
            disabled={isPending}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
              <SelectItem value="google">Google (Gemini 2.5 Pro)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {type === "team"
              ? "Team reports analyze complex multi-member dynamics"
              : "Individual reports provide personal strength insights"}
          </p>
        </div>

        {/* Status */}
        {hasExistingReport && (
          <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-600">
            <CheckCircleIcon className="size-4" />
            <span>
              Report available
              {lastGeneratedAt && (
                <> · Generated {lastGeneratedAt.toLocaleDateString()}</>
              )}
            </span>
          </div>
        )}

        {/* Result */}
        {result && (
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              result.success
                ? "bg-green-500/10 text-green-600"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {result.success ? (
              <>
                <CheckCircleIcon className="size-4" />
                <span>Report generated successfully!</span>
              </>
            ) : (
              <>
                <XCircleIcon className="size-4" />
                <span>{result.error || "Failed to generate report"}</span>
              </>
            )}
          </div>
        )}

        {/* Loading State */}
        {isPending && (
          <div className="flex items-center gap-3 rounded-lg bg-primary/5 px-4 py-3">
            <Loader size={20} />
            <div>
              <p className="font-medium text-sm">Generating report...</p>
              <p className="text-xs text-muted-foreground">
                This may take 30-60 seconds
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {hasExistingReport ? (
          <>
            <Button
              variant="outline"
              onClick={() => handleGenerate(true)}
              disabled={isPending}
            >
              <RefreshCwIcon className="mr-2 size-4" />
              Regenerate
            </Button>
            {onViewReport && (
              <Button onClick={onViewReport} disabled={isPending}>
                <FileTextIcon className="mr-2 size-4" />
                View Report
              </Button>
            )}
          </>
        ) : (
          <Button
            onClick={() => handleGenerate(false)}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader size={16} className="mr-2" />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="mr-2 size-4" />
                Generate Report
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
