"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Edit, Bot, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import PaywallModal from "./PaywallModal";
import { SourcePopover } from "./SourcePopover";
import { CoachSelection, CoachPersona } from "./CoachSelection";
import {
  createSprint,
  updateSprint,
  getAICoachChallenge,
  finalizeSprint,
} from "../api/sprints";

type SprintPhase = "unpack" | "stress-test" | "finalize";

const StrategicSprint = () => {
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState<SprintPhase>("unpack");
  const [rawThoughts, setRawThoughts] = useState<string>("");
  const [notes, setNotes] = useState<string[]>([]);
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [aiCoachResponse, setAiCoachResponse] = useState<string>("");
  const [isReportGenerated, setIsReportGenerated] = useState<boolean>(false);
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);
  const [hasPremiumAccess, setHasPremiumAccess] = useState<boolean>(false);
  const [sprintId, setSprintId] = useState<string | null>(null);
  const [selectedCoachPersona, setSelectedCoachPersona] =
    useState<CoachPersona>("challenger");

  const createSprintMutation = useMutation({
    mutationFn: createSprint,
    onSuccess: (data) => {
      setSprintId(data.sprint_id);
      toast.success("New sprint created!");
    },
    onError: () => {
      toast.error("Failed to create a new sprint.");
    },
  });

  const updateSprintMutation = useMutation({
    mutationFn: (variables: {
      sprintId: string;
      canvasContent: { notes: string[] };
      aiCoachResponse?: string;
    }) =>
      updateSprint(
        variables.sprintId,
        variables.canvasContent,
        variables.aiCoachResponse
      ),
    onSuccess: () => {
      toast.info("Sprint progress saved.");
    },
    onError: () => {
      toast.error("Failed to save sprint progress.");
    },
  });

  const aiCoachMutation = useMutation({
    mutationFn: getAICoachChallenge,
    onSuccess: (data) => {
      setAiCoachResponse(data.challenge);
      toast.success("AI Coach has provided a challenge.");
    },
    onError: () => {
      toast.error("Failed to get a challenge from the AI Coach.");
    },
  });

  const finalizeSprintMutation = useMutation({
    mutationFn: finalizeSprint,
    onSuccess: () => {
      toast.success("Sprint finalized! Redirecting to My Forge...");
      navigate("/my-forge");
    },
    onError: () => {
      toast.error("Failed to finalize the sprint.");
    },
  });

  useEffect(() => {
    if (!sprintId) return; // Do not run the effect if there is no sprintId

    const timer = setTimeout(() => {
      updateSprintMutation.mutate({
        sprintId,
        canvasContent: { notes },
        aiCoachResponse,
      });
    }, 1500); // Debounce time
    return () => clearTimeout(timer);
  }, [notes, aiCoachResponse, sprintId]);

  const handleOrganizeThoughts = () => {
    if (rawThoughts.trim()) {
      const organizedNotes = rawThoughts
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      setNotes(organizedNotes);
      setRawThoughts("");
      if (!sprintId) {
        createSprintMutation.mutate({ notes: organizedNotes });
      }
      toast.success("Thoughts organized into notes!");
    } else {
      toast.error("Please enter some thoughts to organize.");
    }
  };

  const handleAddNote = () => {
    setNotes([...notes, ""]);
    setEditingNoteIndex(notes.length);
  };

  const handleDeleteNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
    if (editingNoteIndex === index) {
      setEditingNoteIndex(null);
    } else if (editingNoteIndex !== null && editingNoteIndex > index) {
      setEditingNoteIndex(editingNoteIndex - 1);
    }
    toast.info("Note deleted.");
  };

  const handleNoteChange = (index: number, value: string) => {
    const newNotes = [...notes];
    newNotes[index] = value;
    setNotes(newNotes);
  };

  const handleEditNote = (index: number) => {
    setEditingNoteIndex(index);
  };

  const handleSaveNote = () => {
    setEditingNoteIndex(null);
    toast.success("Note saved.");
  };

  const handleGetAIChallenge = () => {
    if (sprintId) {
      aiCoachMutation.mutate({ sprintId, persona: selectedCoachPersona });
    } else {
      toast.error("Sprint ID is not available.");
    }
  };

  const handleGenerateReport = () => {
    if (!hasPremiumAccess) {
      setShowPaywallModal(true);
      return;
    }
    if (sprintId) {
      finalizeSprintMutation.mutate(sprintId);
    } else {
      toast.error("Sprint ID is not available to finalize.");
    }
  };

  const handleDownloadReport = () => {

    // Simulate downloading the report
    const reportContent = `
      Strategic Sprint Report

      ---
      Your Core Ideas (Canvas):
      ${notes.map((note, index) => `${index + 1}. ${note}`).join("\n")}

      ---
      Response to AI Coach Challenge:
      ${aiCoachResponse}

      ---
      Generated on: ${new Date().toLocaleDateString()}
    `;
    console.log("Simulating report download:", reportContent);
    toast.info("Report download simulated (check console).");
    // In a real app, you might create a Blob and trigger a download:
    // const blob = new Blob([reportContent], { type: 'text/plain' });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'strategic_sprint_report.txt';
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);
  };

  const handleUnlockPremium = () => {
    setHasPremiumAccess(true);
    setShowPaywallModal(false);
    toast.success("Free trial activated! You can now download your report.");
    // Immediately attempt to download the report after unlocking
    handleDownloadReport();
  };

  const handleStartNewSprint = () => {
    setCurrentPhase("unpack");
    setRawThoughts("");
    setNotes([]);
    setEditingNoteIndex(null);
    setAiCoachResponse("");
    setIsReportGenerated(false);
    setShowPaywallModal(false); // Reset paywall state
    setHasPremiumAccess(false); // Reset premium access for new sprint
    toast.info("New sprint started!");
  };

  // Helper to render the editable notes section, used in both Unpack and Stress-Test
  const renderEditableNotes = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Your Digital Notes (Canvas)
          <Button variant="outline" size="sm" onClick={handleAddNote}>
            <Plus className="h-4 w-4 mr-2" /> Add New Note
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notes.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 italic">No notes yet. Start by unpacking your thoughts!</p>
        )}
        {notes.map((note, index) => (
          <div key={index} className="flex items-center space-x-2">
            {editingNoteIndex === index ? (
              <Input
                value={note}
                onChange={(e) => handleNoteChange(index, e.target.value)}
                onBlur={handleSaveNote}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSaveNote();
                  }
                }}
                className="flex-grow"
                autoFocus
              />
            ) : (
              <p className="flex-grow p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {note || "(Empty Note)"}
              </p>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditNote(index)}
              title="Edit Note"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteNote(index)}
              title="Delete Note"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderUnpackPhase = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>1. Unpack Your Thoughts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="thought-dump">Thought Dump (Enter your chaotic ideas here)</Label>
          <Textarea
            id="thought-dump"
            placeholder="Start typing your ideas, concerns, questions, or anything that comes to mind..."
            value={rawThoughts}
            onChange={(e) => setRawThoughts(e.target.value)}
            rows={8}
            className="w-full"
          />
          <Button onClick={handleOrganizeThoughts} disabled={!rawThoughts.trim()}>
            Organize Thoughts (Simulated AI)
          </Button>
        </CardContent>
      </Card>

      {notes.length > 0 && renderEditableNotes()}

      <div className="flex justify-end">
        <Button onClick={() => setCurrentPhase("stress-test")} disabled={notes.length === 0}>
          Next: Stress-Test Your Ideas
        </Button>
      </div>
    </div>
  );

  const renderStressTestPhase = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>2. Stress-Test Your Ideas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <CoachSelection
            selectedPersona={selectedCoachPersona}
            onPersonaChange={setSelectedCoachPersona}
          />

          <div className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="AI Coach" />
              <AvatarFallback className="bg-blue-500 text-white">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-blue-600 dark:text-blue-400">
                  AI Coach (The Challenger)
                </p>
                <SourcePopover
                  sources={[
                    {
                      url: "https://en.wikipedia.org/wiki/The_Art_of_War",
                      title: "The Art of War - Wikipedia",
                    },
                  ]}
                />
              </div>
              <p className="text-gray-800 dark:text-gray-200 mt-2">
                "You've laid out your initial thoughts. Now, let's challenge them. Consider your core assumption: 'X'. What if 'X' is fundamentally flawed, or if an unexpected external factor completely negates its premise? How would your strategy adapt?"
              </p>
            </div>
          </div>

          <Button onClick={handleGetAIChallenge}>Get AI Challenge</Button>
          <Label htmlFor="ai-coach-response">Your Response to the AI Coach</Label>
          <Textarea
            id="ai-coach-response"
            placeholder="Refine your thinking based on the challenge. How do you address this potential flaw or adapt your strategy?"
            value={aiCoachResponse}
            onChange={(e) => setAiCoachResponse(e.target.value)}
            rows={6}
            className="w-full"
          />

          {notes.length > 0 && renderEditableNotes()}

          <div className="mt-4 flex justify-between">
            <Button onClick={() => setCurrentPhase("unpack")} variant="outline">
              Back to Unpack
            </Button>
            <Button onClick={() => setCurrentPhase("finalize")} disabled={!aiCoachResponse.trim()}>
              Next: Finalize Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFinalizePhase = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>3. Finalize Your Report</CardTitle>
        </CardHeader>
        <CardContent>
          {!isReportGenerated ? (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Click below to transform your refined ideas into a polished, executive-level report.
              </p>
              <div className="mt-4 flex justify-between">
                <Button onClick={() => setCurrentPhase("stress-test")} variant="outline">
                  Back to Stress-Test
                </Button>
                <Button onClick={handleGenerateReport} disabled={notes.length === 0 || !aiCoachResponse.trim()}>
                  Generate Report
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Report Preview</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-inner space-y-4">
                <div>
                  <h4 className="text-lg font-medium mb-2">Your Core Ideas (Canvas)</h4>
                  {notes.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {notes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="italic text-gray-500 dark:text-gray-400">No core ideas captured.</p>
                  )}
                </div>
                <Separator />
                <div>
                  <h4 className="text-lg font-medium mb-2">Response to AI Coach Challenge</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {aiCoachResponse || <span className="italic text-gray-500 dark:text-gray-400">No response provided.</span>}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button onClick={handleDownloadReport}>
                  <Download className="h-4 w-4 mr-2" /> Download Report
                </Button>
                <Button onClick={handleStartNewSprint} variant="secondary">
                  Start New Sprint
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Strategic Sprint</h1>
      <Separator className="mb-6" />

      {currentPhase === "unpack" && renderUnpackPhase()}
      {currentPhase === "stress-test" && renderStressTestPhase()}
      {currentPhase === "finalize" && renderFinalizePhase()}

      <PaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        onUnlock={handleUnlockPremium}
      />
    </div>
  );
};

export default StrategicSprint;