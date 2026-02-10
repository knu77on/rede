// ============================================================
// REDE - General Settings Tab
// ============================================================

import { type CSSProperties, useCallback, useState } from "react";
import { useSettingsStore } from "../../../stores/settingsStore";
import { Toggle } from "../../common/Toggle";
import type { Theme, HudSize, HudPosition } from "../../../types/index";

const APP_VERSION = "1.0.0";

// --- Styles ---

const styles: Record<string, CSSProperties> = {
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#8E8E9A",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    marginBottom: 8,
    paddingLeft: 2,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 10,
    padding: "2px 14px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    margin: 0,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
    gap: 16,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: "#F5F5F7",
  },
  rowDescription: {
    fontSize: 11,
    color: "#8E8E9A",
    marginTop: 2,
  },
  segmentedControl: {
    display: "flex",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 7,
    padding: 2,
    gap: 1,
  },
  segmentButton: {
    padding: "5px 12px",
    borderRadius: 5,
    border: "none",
    backgroundColor: "transparent",
    color: "#8E8E9A",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: "inherit",
  },
  segmentButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#F5F5F7",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
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

// --- Position Grid ---

const POSITION_GRID: { position: HudPosition; row: number; col: number }[] = [
  { position: "top-left", row: 0, col: 0 },
  { position: "top-center", row: 0, col: 1 },
  { position: "top-right", row: 0, col: 2 },
  { position: "center", row: 1, col: 1 },
  { position: "bottom-left", row: 2, col: 0 },
  { position: "bottom-center", row: 2, col: 1 },
  { position: "bottom-right", row: 2, col: 2 },
];

const POSITION_ARROWS: Record<HudPosition, string> = {
  "top-left": "\u2196",
  "top-center": "\u2191",
  "top-right": "\u2197",
  "center": "\u25CF",
  "bottom-left": "\u2199",
  "bottom-center": "\u2193",
  "bottom-right": "\u2198",
};

function PositionGrid({
  value,
  onChange,
}: {
  value: HudPosition;
  onChange: (p: HudPosition) => void;
}) {
  const [hovered, setHovered] = useState<HudPosition | null>(null);

  const cellBase: CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: 5,
    border: "1px solid rgba(255, 255, 255, 0.06)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 11,
    color: "#55555F",
    transition: "all 0.12s ease",
    fontFamily: "inherit",
    padding: 0,
  };

  const cellActive: CSSProperties = {
    backgroundColor: "rgba(229, 57, 53, 0.15)",
    border: "1px solid rgba(229, 57, 53, 0.4)",
    color: "#E53935",
  };

  const cellHover: CSSProperties = {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    color: "#8E8E9A",
  };

  const emptyCell: CSSProperties = {
    width: 28,
    height: 28,
  };

  // Build a 3x3 grid
  const grid: (typeof POSITION_GRID[0] | null)[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  for (const item of POSITION_GRID) {
    grid[item.row][item.col] = item;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {grid.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap: 3 }}>
          {row.map((cell, ci) => {
            if (!cell) {
              return <div key={ci} style={emptyCell} />;
            }
            const isActive = value === cell.position;
            const isHov = hovered === cell.position && !isActive;
            return (
              <button
                key={ci}
                style={{
                  ...cellBase,
                  ...(isActive ? cellActive : {}),
                  ...(isHov ? cellHover : {}),
                }}
                onClick={() => onChange(cell.position)}
                onMouseEnter={() => setHovered(cell.position)}
                onMouseLeave={() => setHovered(null)}
                title={cell.position}
              >
                {POSITION_ARROWS[cell.position]}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// --- Update Button ---

function UpdateButton() {
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "up-to-date" | "error">("idle");

  const handleCheck = useCallback(async () => {
    setStatus("checking");
    try {
      const { check } = await import("@tauri-apps/plugin-updater");
      const update = await check();
      setStatus(update ? "available" : "up-to-date");
    } catch {
      // In browser/demo mode, just show up-to-date
      setStatus("up-to-date");
    }
  }, []);

  const label =
    status === "checking" ? "Checking\u2026" :
    status === "available" ? "Update Available" :
    status === "up-to-date" ? "Up to Date" :
    status === "error" ? "Error" :
    "Check for Updates";

  const buttonStyle: CSSProperties = {
    padding: "6px 14px",
    borderRadius: 7,
    border: status === "available"
      ? "1px solid rgba(229, 57, 53, 0.3)"
      : "1px solid rgba(255, 255, 255, 0.1)",
    backgroundColor: status === "available"
      ? "rgba(229, 57, 53, 0.1)"
      : "rgba(255, 255, 255, 0.04)",
    color: status === "available"
      ? "#E53935"
      : status === "up-to-date"
      ? "#4CAF50"
      : "#F5F5F7",
    fontSize: 12,
    fontWeight: 500,
    cursor: status === "checking" ? "default" : "pointer",
    transition: "all 0.12s ease",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
    opacity: status === "checking" ? 0.6 : 1,
  };

  return (
    <button style={buttonStyle} onClick={handleCheck} disabled={status === "checking"}>
      {label}
    </button>
  );
}

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

  const handleHudPositionChange = useCallback(
    (position: HudPosition) => {
      updateSetting("hud_position", position);
    },
    [updateSetting],
  );

  return (
    <div>
      {/* Appearance */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Appearance</div>
        <div style={styles.card}>
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Theme</div>
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
        </div>
      </div>

      {/* HUD */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>HUD</div>
        <div style={styles.card}>
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Size</div>
              <div style={styles.rowDescription}>
                Overlay dimensions
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

          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Position</div>
              <div style={styles.rowDescription}>
                Where the HUD appears
              </div>
            </div>
            <PositionGrid
              value={settings.hud_position}
              onChange={handleHudPositionChange}
            />
          </div>

          <div style={styles.divider} />

          <Toggle
            checked={settings.show_glow}
            onChange={(v) => updateSetting("show_glow", v)}
            label="Glow Effect"
            description="Animated glow while recording"
          />
        </div>
      </div>

      {/* Behavior */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Behavior</div>
        <div style={styles.card}>
          <Toggle
            checked={settings.launch_at_login}
            onChange={(v) => updateSetting("launch_at_login", v)}
            label="Launch at Login"
            description="Start REDE when you log in"
          />

          <div style={styles.divider} />

          <Toggle
            checked={settings.show_stats}
            onChange={(v) => updateSetting("show_stats", v)}
            label="Show Stats"
            description="Word count and duration after dictation"
          />

          <div style={styles.divider} />

          <Toggle
            checked={settings.play_sounds}
            onChange={(v) => updateSetting("play_sounds", v)}
            label="Play Sounds"
            description="Audio feedback for recording events"
          />
        </div>
      </div>

      {/* About & Updates */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>About</div>
        <div style={styles.card}>
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>REDE</div>
              <div style={styles.rowDescription}>
                Version {APP_VERSION}
              </div>
            </div>
            <UpdateButton />
          </div>
        </div>
      </div>
    </div>
  );
}
