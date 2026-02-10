// ============================================================
// REDE - General Settings Tab
// ============================================================

import { type CSSProperties, useCallback } from "react";
import { useSettingsStore } from "../../../stores/settingsStore";
import { Toggle } from "../../common/Toggle";
import type { Theme, HudSize } from "../../../types/index";

// --- Styles ---

const styles: Record<string, CSSProperties> = {
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#A0A0B0",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: "rgba(28, 28, 35, 0.95)",
    borderRadius: 12,
    padding: "4px 16px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    margin: 0,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 0",
    gap: 16,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: "#FFFFFF",
  },
  rowDescription: {
    fontSize: 12,
    color: "#A0A0B0",
    marginTop: 2,
  },
  segmentedControl: {
    display: "flex",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  segmentButton: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "transparent",
    color: "#A0A0B0",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: "inherit",
  },
  segmentButtonActive: {
    backgroundColor: "#7B61FF",
    color: "#FFFFFF",
    boxShadow: "0 2px 8px rgba(123, 97, 255, 0.3)",
  },
};

// --- Constants ---

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

const HUD_SIZE_OPTIONS: { value: HudSize; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "balanced", label: "Balanced" },
  { value: "immersive", label: "Immersive" },
];

// --- Component ---

export function GeneralTab() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSetting = useSettingsStore((s) => s.updateSetting);

  const handleThemeChange = useCallback(
    (theme: Theme) => {
      updateSetting("theme", theme);
    },
    [updateSetting],
  );

  const handleHudSizeChange = useCallback(
    (size: HudSize) => {
      updateSetting("hud_size", size);
    },
    [updateSetting],
  );

  return (
    <div>
      {/* Appearance */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Appearance</div>
        <div style={styles.sectionContent}>
          {/* Theme */}
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Theme</div>
              <div style={styles.rowDescription}>
                Choose your preferred color scheme
              </div>
            </div>
            <div style={styles.segmentedControl}>
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  style={{
                    ...styles.segmentButton,
                    ...(settings.theme === option.value
                      ? styles.segmentButtonActive
                      : {}),
                  }}
                  onClick={() => handleThemeChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.divider} />

          {/* HUD Size */}
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>HUD Size</div>
              <div style={styles.rowDescription}>
                Adjust the floating overlay dimensions
              </div>
            </div>
            <div style={styles.segmentedControl}>
              {HUD_SIZE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  style={{
                    ...styles.segmentButton,
                    ...(settings.hud_size === option.value
                      ? styles.segmentButtonActive
                      : {}),
                  }}
                  onClick={() => handleHudSizeChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.divider} />

          {/* Show Glow */}
          <Toggle
            checked={settings.show_glow}
            onChange={(v) => updateSetting("show_glow", v)}
            label="Show Glow Effect"
            description="Display animated glow around the HUD while recording"
          />
        </div>
      </div>

      {/* Behavior */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Behavior</div>
        <div style={styles.sectionContent}>
          {/* Launch at Login */}
          <Toggle
            checked={settings.launch_at_login}
            onChange={(v) => updateSetting("launch_at_login", v)}
            label="Launch at Login"
            description="Automatically start REDE when you log in to your Mac"
          />

          <div style={styles.divider} />

          {/* Show Stats */}
          <Toggle
            checked={settings.show_stats}
            onChange={(v) => updateSetting("show_stats", v)}
            label="Show Stats"
            description="Display word count and duration after each dictation"
          />

          <div style={styles.divider} />

          {/* Play Sounds */}
          <Toggle
            checked={settings.play_sounds}
            onChange={(v) => updateSetting("play_sounds", v)}
            label="Play Sounds"
            description="Audio feedback for recording start, stop, and errors"
          />
        </div>
      </div>
    </div>
  );
}
