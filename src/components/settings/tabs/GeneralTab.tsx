// ============================================================
// REDE - General Settings Tab
// Compact — everything fits in one viewport
// ============================================================

import { type CSSProperties, useCallback, useState } from "react";
import { useSettingsStore } from "../../../stores/settingsStore";
import { Toggle } from "../../common/Toggle";
import type { Theme, HudSize, HudPosition } from "../../../types/index";

const APP_VERSION = "1.0.0";

// --- Shared Tokens ---

const S: Record<string, CSSProperties> = {
  section: { marginBottom: 16 },
  title: {
    fontSize: 11,
    fontWeight: 600,
    color: "#5A5A66",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: 6,
    paddingLeft: 2,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.025)",
    borderRadius: 10,
    padding: "2px 14px",
    border: "1px solid rgba(255, 255, 255, 0.045)",
  },
  divider: { height: 1, backgroundColor: "rgba(255, 255, 255, 0.04)", margin: 0 },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "9px 0",
    gap: 16,
  },
  label: { fontSize: 13, fontWeight: 500, color: "#EAEAEF" },
  seg: {
    display: "flex",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 6,
    padding: 2,
    gap: 1,
  },
  segBtn: {
    padding: "4px 11px",
    borderRadius: 4,
    border: "none",
    backgroundColor: "transparent",
    color: "#5A5A66",
    fontSize: 11,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.12s ease",
    fontFamily: "inherit",
  },
  segActive: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: "#EAEAEF",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
  },
};

// --- Constants ---

const THEME_OPTS: { value: Theme; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

const HUD_SIZE_OPTS: { value: HudSize; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "balanced", label: "Balanced" },
  { value: "immersive", label: "Immersive" },
];

// --- Position Grid ---

const POS_GRID: { position: HudPosition; row: number; col: number }[] = [
  { position: "top-left", row: 0, col: 0 },
  { position: "top-center", row: 0, col: 1 },
  { position: "top-right", row: 0, col: 2 },
  { position: "center", row: 1, col: 1 },
  { position: "bottom-left", row: 2, col: 0 },
  { position: "bottom-center", row: 2, col: 1 },
  { position: "bottom-right", row: 2, col: 2 },
];

const POS_ARROWS: Record<HudPosition, string> = {
  "top-left": "\u2196", "top-center": "\u2191", "top-right": "\u2197",
  "center": "\u25CF",
  "bottom-left": "\u2199", "bottom-center": "\u2193", "bottom-right": "\u2198",
};

function PositionGrid({ value, onChange }: { value: HudPosition; onChange: (p: HudPosition) => void }) {
  const [hov, setHov] = useState<HudPosition | null>(null);

  const cell: CSSProperties = {
    width: 22, height: 22, borderRadius: 4,
    border: "1px solid rgba(255, 255, 255, 0.05)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", fontSize: 9, color: "#4A4A56",
    transition: "all 0.1s ease", fontFamily: "inherit", padding: 0,
  };
  const cellActive: CSSProperties = {
    backgroundColor: "rgba(229, 57, 53, 0.12)",
    border: "1px solid rgba(229, 57, 53, 0.35)",
    color: "#E53935",
  };
  const cellHov: CSSProperties = { backgroundColor: "rgba(255, 255, 255, 0.05)", color: "#7A7A88" };

  const grid: (typeof POS_GRID[0] | null)[][] = [[null, null, null], [null, null, null], [null, null, null]];
  for (const item of POS_GRID) grid[item.row][item.col] = item;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {grid.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap: 2 }}>
          {row.map((c, ci) => {
            if (!c) return <div key={ci} style={{ width: 22, height: 22 }} />;
            const isActive = value === c.position;
            const isHov = hov === c.position && !isActive;
            return (
              <button
                key={ci}
                style={{ ...cell, ...(isActive ? cellActive : {}), ...(isHov ? cellHov : {}) }}
                onClick={() => onChange(c.position)}
                onMouseEnter={() => setHov(c.position)}
                onMouseLeave={() => setHov(null)}
                title={c.position}
              >
                {POS_ARROWS[c.position]}
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
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "up-to-date">("idle");

  const handleCheck = useCallback(async () => {
    setStatus("checking");
    try {
      const { check } = await import("@tauri-apps/plugin-updater");
      const update = await check();
      setStatus(update ? "available" : "up-to-date");
    } catch {
      setStatus("up-to-date");
    }
  }, []);

  const label =
    status === "checking" ? "Checking\u2026" :
    status === "available" ? "Update Available" :
    status === "up-to-date" ? "Up to Date" :
    "Check for Updates";

  return (
    <button
      style={{
        padding: "4px 11px", borderRadius: 6, fontSize: 11, fontWeight: 500,
        cursor: status === "checking" ? "default" : "pointer",
        fontFamily: "inherit", whiteSpace: "nowrap" as const,
        transition: "all 0.12s ease",
        opacity: status === "checking" ? 0.5 : 1,
        border: status === "available"
          ? "1px solid rgba(229, 57, 53, 0.25)" : "1px solid rgba(255, 255, 255, 0.06)",
        backgroundColor: status === "available"
          ? "rgba(229, 57, 53, 0.08)" : "rgba(255, 255, 255, 0.03)",
        color: status === "available" ? "#E53935" : status === "up-to-date" ? "#22C55E" : "#7A7A88",
      }}
      onClick={handleCheck}
      disabled={status === "checking"}
    >
      {label}
    </button>
  );
}

// --- Component ---

export function GeneralTab() {
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.updateSetting);

  return (
    <div>
      {/* Appearance */}
      <div style={S.section}>
        <div style={S.title}>Appearance</div>
        <div style={S.card}>
          <div style={S.row}>
            <div style={S.label}>Theme</div>
            <div style={S.seg}>
              {THEME_OPTS.map((o) => (
                <button key={o.value} style={{ ...S.segBtn, ...(settings.theme === o.value ? S.segActive : {}) }} onClick={() => update("theme", o.value)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HUD */}
      <div style={S.section}>
        <div style={S.title}>HUD</div>
        <div style={S.card}>
          <div style={S.row}>
            <div style={S.label}>Size</div>
            <div style={S.seg}>
              {HUD_SIZE_OPTS.map((o) => (
                <button key={o.value} style={{ ...S.segBtn, ...(settings.hud_size === o.value ? S.segActive : {}) }} onClick={() => update("hud_size", o.value)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div style={S.divider} />
          <div style={S.row}>
            <div style={S.label}>Position</div>
            <PositionGrid value={settings.hud_position} onChange={(p) => update("hud_position", p)} />
          </div>
          <div style={S.divider} />
          <Toggle checked={settings.show_glow} onChange={(v) => update("show_glow", v)} label="Recording Glow" />
        </div>
      </div>

      {/* Behavior */}
      <div style={S.section}>
        <div style={S.title}>Behavior</div>
        <div style={S.card}>
          <Toggle checked={settings.launch_at_login} onChange={(v) => update("launch_at_login", v)} label="Launch at Login" />
          <div style={S.divider} />
          <Toggle checked={settings.show_stats} onChange={(v) => update("show_stats", v)} label="Show Stats" />
          <div style={S.divider} />
          <Toggle checked={settings.play_sounds} onChange={(v) => update("play_sounds", v)} label="Sound Effects" />
        </div>
      </div>

      {/* About */}
      <div style={{ ...S.section, marginBottom: 0 }}>
        <div style={S.title}>About</div>
        <div style={S.card}>
          <div style={S.row}>
            <div>
              <div style={S.label}>REDE</div>
              <div style={{ fontSize: 11, color: "#4A4A56", marginTop: 1 }}>Version {APP_VERSION}</div>
            </div>
            <UpdateButton />
          </div>
        </div>
      </div>
    </div>
  );
}
