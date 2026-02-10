// ============================================================
// REDE - Audio Device Management Hook
// Dynamically imports Tauri API so it works in browser too.
// ============================================================

import { useState, useEffect, useCallback } from "react";
import type { AudioDevice } from "../types/index";
import { useRecordingStore } from "../stores/recordingStore";

interface UseAudioResult {
  devices: AudioDevice[];
  selectedDevice: string;
  selectDevice: (id: string) => void;
  isRecording: boolean;
}

export function useAudio(): UseAudioResult {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("default");

  const recordingState = useRecordingStore((s) => s.state);

  const isRecording = recordingState === "recording";

  // Load available audio devices on mount
  useEffect(() => {
    async function loadDevices() {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        const result = await invoke<AudioDevice[]>("get_audio_devices");
        setDevices(result);

        const defaultDevice = result.find((d) => d.is_default);
        if (defaultDevice) {
          setSelectedDevice(defaultDevice.id);
        } else if (result.length > 0) {
          setSelectedDevice(result[0].id);
        }
      } catch {
        // Not running inside Tauri — provide fallback device
        setDevices([
          { id: "default", name: "System Default", is_default: true },
        ]);
      }
    }
    loadDevices();
  }, []);

  const selectDevice = useCallback((id: string) => {
    setSelectedDevice(id);
  }, []);

  // Start/stop recording via Tauri commands (no-op in browser)
  useEffect(() => {
    if (recordingState !== "recording") return;
    (async () => {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("start_recording", { deviceId: selectedDevice });
      } catch {
        // Browser mode — recording handled by demo.ts or ignored
      }
    })();
  }, [recordingState === "recording"]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (recordingState !== "processing") return;
    (async () => {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("stop_recording");
      } catch {
        // Browser mode
      }
    })();
  }, [recordingState === "processing"]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    devices,
    selectedDevice,
    selectDevice,
    isRecording,
  };
}
