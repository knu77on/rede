// ============================================================
// REDE - Settings Hook
// ============================================================

import { useCallback } from "react";
import { useSettingsStore } from "../stores/settingsStore";
import type { Settings } from "../types/index";

// --- Types ---

interface UseSettingsResult {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;
}

// --- Hook ---

export function useSettings(): UseSettingsResult {
  const settings = useSettingsStore((s) => s.settings);
  const storeUpdateSetting = useSettingsStore((s) => s.updateSetting);
  const storeSaveSettings = useSettingsStore((s) => s.saveSettings);
  const storeResetSettings = useSettingsStore((s) => s.resetSettings);

  const updateSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      storeUpdateSetting(key, value);
    },
    [storeUpdateSetting],
  );

  const saveSettings = useCallback(async () => {
    await storeSaveSettings();
  }, [storeSaveSettings]);

  const resetSettings = useCallback(() => {
    storeResetSettings();
  }, [storeResetSettings]);

  return {
    settings,
    updateSetting,
    saveSettings,
    resetSettings,
  };
}
