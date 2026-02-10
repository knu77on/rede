// ============================================================
// REDE - Dictation History Store
// ============================================================

import { create } from "zustand";
import { useSettingsStore } from "./settingsStore";

// --- Types ---

export interface DictationEntry {
  id: string;
  text: string;
  originalText: string | null;
  wasCorrected: boolean;
  wordCount: number;
  duration: number;
  createdAt: number; // timestamp ms
}

interface HistoryState {
  entries: DictationEntry[];
}

interface HistoryActions {
  addEntry: (entry: Omit<DictationEntry, "id">) => void;
  clearAll: () => void;
  purgeExpired: () => void;
}

export type HistoryStore = HistoryState & HistoryActions;

// --- Constants ---

const MAX_RETENTION_MS = 12 * 60 * 60 * 1000; // 12 hours

// --- Helpers ---

function generateId(): string {
  const random = Math.random().toString(36).substring(2, 8);
  return `${Date.now()}-${random}`;
}

function removeExpired(entries: DictationEntry[]): DictationEntry[] {
  const cutoff = Date.now() - MAX_RETENTION_MS;
  return entries.filter((entry) => entry.createdAt > cutoff);
}

// --- Initial State ---

const initialState: HistoryState = {
  entries: [],
};

// --- Store ---

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  ...initialState,

  addEntry: (entry: Omit<DictationEntry, "id">) => {
    const { settings } = useSettingsStore.getState();
    if (settings.private_mode) return;

    const { entries } = get();
    const newEntry: DictationEntry = { id: generateId(), ...entry };
    const updated = removeExpired([newEntry, ...entries]);
    set({ entries: updated });
  },

  clearAll: () => {
    set({ entries: [] });
  },

  purgeExpired: () => {
    const { entries } = get();
    set({ entries: removeExpired(entries) });
  },
}));
