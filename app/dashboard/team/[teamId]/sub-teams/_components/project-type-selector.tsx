/**
 * Project Type Selector
 *
 * Component for selecting a project type for a sub-team.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/project-type-selector
 */

"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/cn";
import type { ProjectTypeOption } from "@/lib/types/project-type.types";

interface ProjectTypeSelectorProps {
  projectTypes: ProjectTypeOption[];
  selectedId: string | null;
  onChange: (projectTypeId: string) => void;
  error?: string;
}

export function ProjectTypeSelector({
  projectTypes,
  selectedId,
  onChange,
  error,
}: ProjectTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Tipo de proyecto</Label>
        <p className="text-sm text-muted-foreground">
          Selecciona el tipo de proyecto para optimizar la composición del
          equipo.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <RadioGroup
        value={selectedId || ""}
        onValueChange={onChange}
        className="grid gap-3 sm:grid-cols-2"
      >
        {projectTypes.map((projectType) => (
          <Card
            key={projectType.id}
            className={cn(
              "relative cursor-pointer p-4 transition-all",
              selectedId === projectType.id &&
                "ring-2 ring-primary bg-primary/5",
              selectedId !== projectType.id && "hover:bg-muted/50"
            )}
            onClick={() => onChange(projectType.id)}
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem
                value={projectType.id}
                id={projectType.id}
                className="mt-1"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{projectType.icon}</span>
                  <label
                    htmlFor={projectType.id}
                    className="font-medium cursor-pointer"
                  >
                    {projectType.nameEs || projectType.name}
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {projectType.descriptionEs || projectType.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
}
