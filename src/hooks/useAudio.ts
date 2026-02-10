// ============================================================
// REDE - Audio Device Management Hook
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { AudioDevice } from "../types/index";
import { useRecordingStore } from "../stores/recordingStore";

// --- Types ---

interface UseAudioResult {
  devices: AudioDevice[];
  selectedDevice: string;
  selectDevice: (id: string) => void;
  isRecording: boolean;
}

// --- Hook ---

export function useAudio(): UseAudioResult {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("default");

  const recordingState = useRecordingStore((s) => s.state);
  const startRecordingState = useRecordingStore((s) => s.startRecording);
  const stopRecordingState = useRecordingStore((s) => s.stopRecording);
  const setError = useRecordingStore((s) => s.setError);

  const isRecording = recordingState === "recording";

  // Load available audio devices on mount
  useEffect(() => {
    async function loadDevices() {
      try {
        const result = await invoke<AudioDevice[]>("get_audio_devices");
        setDevices(result);

        // Auto-select the default device if available
        const defaultDevice = result.find((d) => d.is_default);
        if (defaultDevice) {
          setSelectedDevice(defaultDevice.id);
        } else if (result.length > 0) {
          setSelectedDevice(result[0].id);
        }
      } catch (err) {
        console.error("Failed to load audio devices:", err);
        // Provide a fallback device entry
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

  // Start/stop recording helpers via Tauri commands
  useEffect(() => {
    if (recordingState === "recording") {
      invoke("start_recording", { deviceId: selectedDevice }).catch(
        (err: unknown) => {
          const message =
            err instanceof Error ? err.message : "Failed to start recording";
          setError(message);
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordingState === "recording"]);

  useEffect(() => {
    if (recordingState === "processing") {
      invoke("stop_recording").catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Failed to stop recording";
        setError(message);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordingState === "processing"]);

  // Expose store actions for external callers that need them
  void startRecordingState;
  void stopRecordingState;

  return {
    devices,
    selectedDevice,
    selectDevice,
    isRecording,
  };
}
