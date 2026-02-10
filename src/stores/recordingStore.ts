// ============================================================
// REDE - Recording Store
// ============================================================

import { create } from "zustand";
import type { RecordingState } from "../types/index";

// --- Types ---

export interface Correction {
  original: string;
  corrected: string;
}

interface RecordingStoreState {
  state: RecordingState;
  duration: number;
  transcription: string;
  audioLevels: number[];
  error: string | null;
  wordCount: number;
  correction: Correction | null;
}

interface RecordingActions {
  startRecording: () => void;
  stopRecording: () => void;
  cancelRecording: () => void;
  setAudioLevels: (levels: number[]) => void;
  setTranscription: (text: string) => void;
  setCorrection: (correction: Correction | null) => void;
  setError: (msg: string) => void;
  reset: () => void;
}

export type RecordingStore = RecordingStoreState & RecordingActions;

// --- Initial State ---

const initialState: RecordingStoreState = {
  state: "idle",
  duration: 0,
  transcription: "",
  audioLevels: [],
  error: null,
  wordCount: 0,
  correction: null,
};

// --- Helpers ---

function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
}

// --- Store ---

export const useRecordingStore = create<RecordingStore>((set, get) => ({
  ...initialState,

  startRecording: () => {
    const { state } = get();
    if (state === "recording") return;

    set({
      state: "recording",
      duration: 0,
      transcription: "",
      audioLevels: [],
      error: null,
      wordCount: 0,
      correction: null,
    });
  },

  stopRecording: () => {
    const { state } = get();
    if (state !== "recording") return;

    set({ state: "processing" });
  },

  cancelRecording: () => {
    set({
      state: "idle",
      duration: 0,
      audioLevels: [],
      error: null,
      correction: null,
    });
  },

  setAudioLevels: (levels: number[]) => {
    if (get().state !== "recording") return;
    set({ audioLevels: levels });
  },

  setTranscription: (text: string) => {
    set({
      state: "idle",
      transcription: text,
      wordCount: countWords(text),
      audioLevels: [],
    });
  },

  setCorrection: (correction: Correction | null) => {
    set({ correction });
  },

  setError: (msg: string) => {
    set({
      state: "error",
      error: msg,
      audioLevels: [],
    });
  },

  reset: () => {
    set({ ...initialState });
  },
}));
