import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type CoachPersona = "challenger" | "collaborator" | "visionary";

interface CoachSelectionProps {
  selectedPersona: CoachPersona;
  onPersonaChange: (persona: CoachPersona) => void;
}

const coachPersonas = [
  {
    value: "challenger",
    label: "The Challenger",
    description: "Challenges your assumptions and pushes you to think critically.",
  },
  {
    value: "collaborator",
    label: "The Collaborator",
    description: "Works with you to build on your ideas and find new connections.",
  },
  {
    value: "visionary",
    label: "The Visionary",
    description: "Helps you think bigger and explore the long-term potential of your ideas.",
  },
];

export function CoachSelection({ selectedPersona, onPersonaChange }: CoachSelectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="coach-persona">Select AI Coach Persona</Label>
      <Select onValueChange={(value: CoachPersona) => onPersonaChange(value)} defaultValue={selectedPersona}>
        <SelectTrigger id="coach-persona" className="w-full">
          <SelectValue placeholder="Select a persona" />
        </SelectTrigger>
        <SelectContent>
          {coachPersonas.map((persona) => (
            <SelectItem key={persona.value} value={persona.value}>
              <div className="flex flex-col">
                <span className="font-medium">{persona.label}</span>
                <span className="text-sm text-muted-foreground">{persona.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}