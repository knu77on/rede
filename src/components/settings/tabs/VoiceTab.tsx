// ============================================================
// REDE - Voice Settings Tab
// Compact — no scrolling
// ============================================================

import { type CSSProperties, useCallback, useState, useEffect } from "react";
import { useSettingsStore } from "../../../stores/settingsStore";
import { Toggle } from "../../common/Toggle";
import type { ActivationMode, AudioDevice } from "../../../types/index";

const S: Record<string, CSSProperties> = {
  section: { marginBottom: 16 },
  title: {
    fontSize: 11, fontWeight: 600, color: "#5A5A66",
    textTransform: "uppercase" as const, letterSpacing: "0.05em",
    marginBottom: 6, paddingLeft: 2,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.025)",
    borderRadius: 10, padding: "2px 14px",
    border: "1px solid rgba(255, 255, 255, 0.045)",
  },
  divider: { height: 1, backgroundColor: "rgba(255, 255, 255, 0.04)", margin: 0 },
  row: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "9px 0", gap: 16,
  },
  label: { fontSize: 13, fontWeight: 500, color: "#EAEAEF" },
  select: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: 6, padding: "5px 10px",
    color: "#EAEAEF", fontSize: 12, fontWeight: 500,
    fontFamily: "inherit", cursor: "pointer", minWidth: 160,
    appearance: "none" as const, outline: "none",
    transition: "all 0.12s ease", paddingRight: 24,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%235A5A66' d='M2.5 4l2.5 2.5L7.5 4'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
  },
  seg: {
    display: "flex", backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 6, padding: 2, gap: 1,
  },
  segBtn: {
    padding: "4px 11px", borderRadius: 4, border: "none",
    backgroundColor: "transparent", color: "#5A5A66",
    fontSize: 11, fontWeight: 500, cursor: "pointer",
    transition: "all 0.12s ease", fontFamily: "inherit",
  },
  segActive: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: "#EAEAEF", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
  },
};

const ACTIVATION_OPTS: { value: ActivationMode; label: string }[] = [
  { value: "push", label: "Push to Talk" },
  { value: "toggle", label: "Toggle" },
];

export function VoiceTab() {
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.updateSetting);
  const [devices, setDevices] = useState<AudioDevice[]>([]);

  useEffect(() => {
    async function load() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const all = await navigator.mediaDevices.enumerateDevices();
        setDevices(
          all.filter((d) => d.kind === "audioinput").map((d, i) => ({
            id: d.deviceId,
            name: d.label || `Microphone ${i + 1}`,
            is_default: d.deviceId === "default",
          }))
        );
      } catch {
        setDevices([{ id: "default", name: "System Default", is_default: true }]);
      }
    }
    load();
  }, []);

  const handleMode = useCallback(
    (m: ActivationMode) => update("activation_mode", m), [update],
  );

  return (
    <div>
      <div style={S.section}>
        <div style={S.title}>Input</div>
        <div style={S.card}>
          <div style={S.row}>
            <div style={S.label}>Input Device</div>
            <select style={S.select} value={settings.input_device} onChange={(e) => update("input_device", e.target.value)}>
              {devices.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div style={S.divider} />
          <div style={S.row}>
            <div style={S.label}>Activation</div>
            <div style={S.seg}>
              {ACTIVATION_OPTS.map((o) => (
                <button key={o.value} style={{ ...S.segBtn, ...(settings.activation_mode === o.value ? S.segActive : {}) }} onClick={() => handleMode(o.value)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...S.section, marginBottom: 0 }}>
        <div style={S.title}>Audio</div>
        <div style={S.card}>
          <Toggle checked={settings.noise_suppression} onChange={(v) => update("noise_suppression", v)} label="Noise Suppression" />
          <div style={S.divider} />
          <Toggle checked={settings.whisper_mode} onChange={(v) => update("whisper_mode", v)} label="Whisper Mode" />
          <div style={S.divider} />
          <Toggle checked={settings.auto_silence} onChange={(v) => update("auto_silence", v)} label="Auto-Silence Detection" />
        </div>
      </div>
    </div>
  );
}
