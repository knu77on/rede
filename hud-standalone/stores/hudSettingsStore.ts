// ============================================================
// REDE HUD - HUD Settings Store (Standalone)
// Lightweight settings store with only HUD-relevant fields
// No Supabase dependency — pure local state
// ============================================================

import { create } from "zustand";
import type { HudSettings } from "../types";

// --- Types ---

interface HudSettingsState {
  settings: HudSettings;
}

interface HudSettingsActions {
  updateSetting: <K extends keyof HudSettings>(key: K, value: HudSettings[K]) => void;
  resetSettings: () => void;
}

export type HudSettingsStore = HudSettingsState & HudSettingsActions;

// --- Defaults ---

const DEFAULT_SETTINGS: HudSettings = {
  activation_mode: "push",
  hud_size: "balanced",
  hud_position: "bottom-center",
  show_glow: true,
  show_stats: true,
};

// --- Store ---

export const useHudSettingsStore = create<HudSettingsStore>((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },

  updateSetting: <K extends keyof HudSettings>(key: K, value: HudSettings[K]) => {
    const { settings } = get();
    set({ settings: { ...settings, [key]: value } });
  },

  resetSettings: () => {
    set({ settings: { ...DEFAULT_SETTINGS } });
  },
}));

export { DEFAULT_SETTINGS };
