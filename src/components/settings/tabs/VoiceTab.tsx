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
  select: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: "8px 12px",
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "inherit",
    cursor: "pointer",
    minWidth: 180,
    appearance: "none" as const,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23A0A0B0' d='M3 5l3 3 3-3'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: 28,
    outline: "none",
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
        // Request microphone permission to enumerate devices
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
        // Fallback with system default
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
        <div style={styles.sectionContent}>
          {/* Input Device */}
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Input Device</div>
              <div style={styles.rowDescription}>
                Select which microphone to use for dictation
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

          {/* Activation Mode */}
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
        <div style={styles.sectionContent}>
          {/* Noise Suppression */}
          <Toggle
            checked={settings.noise_suppression}
            onChange={(v) => updateSetting("noise_suppression", v)}
            label="Noise Suppression"
            description="Filter out background noise for cleaner audio capture"
          />

          <div style={styles.divider} />

          {/* Whisper Mode */}
          <Toggle
            checked={settings.whisper_mode}
            onChange={(v) => updateSetting("whisper_mode", v)}
            label="Whisper Mode"
            description="Boost microphone gain for quiet speech environments"
          />

          <div style={styles.divider} />

          {/* Auto-Silence */}
          <Toggle
            checked={settings.auto_silence}
            onChange={(v) => updateSetting("auto_silence", v)}
            label="Auto-Silence Detection"
            description="Automatically stop recording after a period of silence"
          />
        </div>
      </div>
    </div>
  );
}
