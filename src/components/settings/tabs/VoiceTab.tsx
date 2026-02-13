// ============================================================
// REDE - Voice Settings Tab
// ============================================================

import { type CSSProperties, useCallback, useState, useEffect } from "react";
import { useSettingsStore } from "../../../stores/settingsStore";
import { Toggle } from "../../common/Toggle";
import type { ActivationMode, AudioDevice } from "../../../types/index";

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
  select: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 7,
    padding: "7px 12px",
    color: "#F5F5F7",
    fontSize: 12,
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
    minWidth: 170,
    appearance: "none" as const,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%238E8E9A' d='M2.5 4l2.5 2.5L7.5 4'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: 28,
    outline: "none",
    transition: "all 0.12s ease",
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

const ACTIVATION_OPTIONS: { value: ActivationMode; label: string }[] = [
  { value: "push", label: "Push to Talk" },
  { value: "toggle", label: "Toggle" },
];

// --- Component ---

export function VoiceTab() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSetting = useSettingsStore((s) => s.updateSetting);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);

  // Enumerate audio input devices
  useEffect(() => {
    async function loadDevices() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const inputDevices: AudioDevice[] = devices
          .filter((d) => d.kind === "audioinput")
          .map((d, i) => ({
            id: d.deviceId,
            name: d.label || `Microphone ${i + 1}`,
            is_default: d.deviceId === "default",
          }));
        setAudioDevices(inputDevices);
      } catch {
        setAudioDevices([
          { id: "default", name: "System Default", is_default: true },
        ]);
      }
    }
    loadDevices();
  }, []);

  const handleActivationModeChange = useCallback(
    (mode: ActivationMode) => {
      updateSetting("activation_mode", mode);
    },
    [updateSetting],
  );

  const handleDeviceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateSetting("input_device", e.target.value);
    },
    [updateSetting],
  );

  return (
    <div>
      {/* Input */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Input</div>
        <div style={styles.card}>
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Input Device</div>
              <div style={styles.rowDescription}>
                Microphone used for dictation
              </div>
            </div>
            <select
              style={styles.select}
              value={settings.input_device}
              onChange={handleDeviceChange}
            >
              {audioDevices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.divider} />

          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Activation Mode</div>
              <div style={styles.rowDescription}>
                How the hotkey controls recording
              </div>
            </div>
            <div style={styles.segmentedControl}>
              {ACTIVATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  style={{
                    ...styles.segmentButton,
                    ...(settings.activation_mode === option.value
                      ? styles.segmentButtonActive
                      : {}),
                  }}
                  onClick={() => handleActivationModeChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audio Processing */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Audio Processing</div>
        <div style={styles.card}>
          <Toggle
            checked={settings.noise_suppression}
            onChange={(v) => updateSetting("noise_suppression", v)}
            label="Noise Suppression"
            description="Filter out background noise for cleaner audio"
          />

          <div style={styles.divider} />

          <Toggle
            checked={settings.whisper_mode}
            onChange={(v) => updateSetting("whisper_mode", v)}
            label="Whisper Mode"
            description="Boost gain for quiet speech environments"
          />

          <div style={styles.divider} />

          <Toggle
            checked={settings.auto_silence}
            onChange={(v) => updateSetting("auto_silence", v)}
            label="Auto-Silence Detection"
            description="Stop recording after a period of silence"
          />
        </div>
      </div>
    </div>
  );
}
