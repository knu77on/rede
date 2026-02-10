// ============================================================
// REDE - Settings Store
// ============================================================

import { create } from "zustand";
import type { Settings } from "../types/index";

// --- Types ---

interface SettingsState {
  settings: Settings;
  hasUnsavedChanges: boolean;
}

interface SettingsActions {
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  saveSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
  resetSettings: () => void;
}

export type SettingsStore = SettingsState & SettingsActions;

// --- Default Settings ---

const DEFAULT_SETTINGS: Settings = {
  user_id: "",
  private_mode: true,
  analytics: false,
  activation_mode: "push",
  input_device: "default",
  noise_suppression: true,
  whisper_mode: false,
  auto_silence: true,
  smart_correction: true,
  remove_fillers: true,
  auto_punctuation: true,
  auto_capitalize: true,
  auto_detect_language: true,
  language: "en",
  theme: "dark",
  hud_size: "balanced",
  show_glow: true,
  show_stats: true,
  play_sounds: true,
  launch_at_login: false,
  updated_at: new Date().toISOString(),
};

// --- Initial State ---

const initialState: SettingsState = {
  settings: { ...DEFAULT_SETTINGS },
  hasUnsavedChanges: false,
};

// --- Store ---

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...initialState,

  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const { settings } = get();
    set({
      settings: {
        ...settings,
        [key]: value,
        updated_at: new Date().toISOString(),
      },
      hasUnsavedChanges: true,
    });
  },

  saveSettings: async () => {
    const { settings } = get();
    try {
      const { supabase } = await import("../services/supabase");
      const { error } = await supabase
        .from("settings")
        .upsert(settings, { onConflict: "user_id" });
      if (error) throw error;

      set({ hasUnsavedChanges: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save settings";
      throw new Error(message);
    }
  },

  loadSettings: async () => {
    try {
      const { supabase } = await import("../services/supabase");
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        set({
          settings: data as Settings,
          hasUnsavedChanges: false,
        });
      } else {
        // No settings row yet -- use defaults with the user's ID
        set({
          settings: { ...DEFAULT_SETTINGS, user_id: userId },
          hasUnsavedChanges: false,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load settings";
      throw new Error(message);
    }
  },

  resetSettings: () => {
    const { settings } = get();
    set({
      settings: {
        ...DEFAULT_SETTINGS,
        user_id: settings.user_id,
        updated_at: new Date().toISOString(),
      },
      hasUnsavedChanges: true,
    });
  },
}));

export { DEFAULT_SETTINGS };
