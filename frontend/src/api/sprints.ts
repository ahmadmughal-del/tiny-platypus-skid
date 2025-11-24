import api from "./axios";

export interface Sprint {
  id: string;
  user_id: string;
  title: string;
  canvas_content: { notes: string[] };
  ai_coach_response: string;
  created_at: string;
  updated_at: string;
}

export const createSprint = async (
  canvasContent: { notes: string[] }
): Promise<{ sprint_id: string }> => {
  const initialDump = canvasContent.notes.join("\n");
  const response = await api.post("/sprints", {
    initial_dump: initialDump,
  });
  return response.data;
};

export const updateSprint = async (
  sprintId: string,
  canvasContent: { notes: string[] },
  aiCoachResponse?: string
): Promise<Sprint> => {
  // Combine notes and AI response into a single content string
  const notesContent = canvasContent.notes.join("\n");
  const fullContent = aiCoachResponse
    ? `${notesContent}\n\nAI Coach Response:\n${aiCoachResponse}`
    : notesContent;

  const payload = {
    content: fullContent,
    status: "in_progress",
  };
  const response = await api.put(`/sprints/${sprintId}`, payload);
  return response.data;
};

import { CoachPersona } from "@/components/CoachSelection";

export const getAICoachChallenge = async (variables: {
  sprintId: string;
  persona: CoachPersona;
}): Promise<{ challenge: string }> => {
  const { sprintId, persona } = variables;
  const response = await api.post(`/sprints/${sprintId}/coach`, { persona });
  return response.data;
};

export const finalizeSprint = async (
  sprintId: string
): Promise<{ report_id: string }> => {
  const response = await api.post(`/sprints/${sprintId}/finalize`);
  return response.data;
};