// ============================================================
// REDE - History Store
// ============================================================

import { create } from "zustand";
import type { HistoryItem } from "../types/index";

// --- Types ---

interface HistoryState {
  items: HistoryItem[];
  isLoading: boolean;
}

interface HistoryActions {
  addItem: (item: HistoryItem) => void;
  removeItem: (id: string) => void;
  clearHistory: () => Promise<void>;
  loadHistory: () => Promise<void>;
  searchHistory: (query: string) => HistoryItem[];
}

export type HistoryStore = HistoryState & HistoryActions;

// --- Initial State ---

const initialState: HistoryState = {
  items: [],
  isLoading: false,
};

// --- Store ---

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  ...initialState,

  addItem: (item: HistoryItem) => {
    const { items } = get();
    // Prepend new item and sort by created_at descending
    const updated = [item, ...items].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    set({ items: updated });
  },

  removeItem: (id: string) => {
    const { items } = get();
    set({ items: items.filter((item) => item.id !== id) });
  },

  clearHistory: async () => {
    set({ isLoading: true });
    try {
      const { supabase } = await import("../services/supabase");
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      if (userId) {
        const { error } = await supabase
          .from("history")
          .delete()
          .eq("user_id", userId);
        if (error) throw error;
      }

      set({ items: [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  loadHistory: async () => {
    set({ isLoading: true });
    try {
      const { supabase } = await import("../services/supabase");
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) {
        set({ isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from("history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({
        items: (data ?? []) as HistoryItem[],
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  searchHistory: (query: string): HistoryItem[] => {
    const { items } = get();
    if (!query.trim()) return items;

    const lower = query.toLowerCase();
    return items.filter(
      (item) =>
        item.text.toLowerCase().includes(lower) ||
        (item.original_text &&
          item.original_text.toLowerCase().includes(lower)) ||
        (item.target_app &&
          item.target_app.toLowerCase().includes(lower)),
    );
  },
}));
