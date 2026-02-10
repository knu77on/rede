// ============================================================
// REDE - Hotkey Events Hook
// ============================================================

import { useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useRecordingStore } from "../stores/recordingStore";

// --- Types ---

interface UseHotkeyResult {
  isHotkeyPressed: boolean;
}

// --- Hook ---

export function useHotkey(): UseHotkeyResult {
  const [isHotkeyPressed, setIsHotkeyPressed] = useState(false);

  const startRecording = useRecordingStore((s) => s.startRecording);
  const stopRecording = useRecordingStore((s) => s.stopRecording);
  const cancelRecording = useRecordingStore((s) => s.cancelRecording);
  const recordingState = useRecordingStore((s) => s.state);

  useEffect(() => {
    const unlisteners: Array<() => void> = [];

    async function setupListeners() {
      // Listen for hotkey press
      const unlistenPressed = await listen("hotkey-pressed", () => {
        setIsHotkeyPressed(true);

        // Start recording if currently idle
        if (recordingState === "idle" || recordingState === "error") {
          startRecording();
        }
      });
      unlisteners.push(unlistenPressed);

      // Listen for hotkey release
      const unlistenReleased = await listen("hotkey-released", () => {
        setIsHotkeyPressed(false);

        // Stop recording if currently recording
        if (recordingState === "recording") {
          stopRecording();
        }
      });
      unlisteners.push(unlistenReleased);

      // Listen for recording cancellation
      const unlistenCancelled = await listen("recording-cancelled", () => {
        setIsHotkeyPressed(false);
        cancelRecording();
      });
      unlisteners.push(unlistenCancelled);
    }

    setupListeners();

    return () => {
      unlisteners.forEach((unlisten) => unlisten());
    };
  }, [recordingState, startRecording, stopRecording, cancelRecording]);

  return { isHotkeyPressed };
}
