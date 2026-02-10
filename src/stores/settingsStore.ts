// ============================================================
// REDE - Settings Store (Auto-save)
// ============================================================

import { create } from "zustand";
import type { Settings } from "../types/index";

// --- Types ---

interface SettingsState {
  settings: Settings;
}

interface SettingsActions {
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
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
  hud_position: "bottom-center",
  show_glow: true,
  show_stats: true,
  play_sounds: true,
  launch_at_login: false,
  updated_at: new Date().toISOString(),
};

// --- Auto-save debounce ---

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function debouncedSave(settings: Settings) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      const { supabase } = await import("../services/supabase");
      await supabase
        .from("settings")
        .upsert(settings, { onConflict: "user_id" });
    } catch {
      // Silently fail — settings are still persisted in memory/local state
    }
  }, 800);
}

// --- Initial State ---

const initialState: SettingsState = {
  settings: { ...DEFAULT_SETTINGS },
};

// --- Store ---

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...initialState,

  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const { settings } = get();
    const updated = {
      ...settings,
      [key]: value,
      updated_at: new Date().toISOString(),
    };
    set({ settings: updated });
    debouncedSave(updated);
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
        set({ settings: data as Settings });
      } else {
        set({ settings: { ...DEFAULT_SETTINGS, user_id: userId } });
      }
    } catch {
      // Keep defaults on failure
    }
  },

  resetSettings: () => {
    const { settings } = get();
    const updated = {
      ...DEFAULT_SETTINGS,
      user_id: settings.user_id,
      updated_at: new Date().toISOString(),
    };
    set({ settings: updated });
    debouncedSave(updated);
  },
}));

export { DEFAULT_SETTINGS };
