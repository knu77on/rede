// ============================================================
// REDE - Hotkey Events Hook
// Dynamically imports Tauri API so it works in browser too.
// ============================================================

import { useState, useEffect } from "react";
import { useRecordingStore } from "../stores/recordingStore";

interface UseHotkeyResult {
  isHotkeyPressed: boolean;
}

export function useHotkey(): UseHotkeyResult {
  const [isHotkeyPressed, setIsHotkeyPressed] = useState(false);

  const startRecording = useRecordingStore((s) => s.startRecording);
  const stopRecording = useRecordingStore((s) => s.stopRecording);
  const cancelRecording = useRecordingStore((s) => s.cancelRecording);
  const recordingState = useRecordingStore((s) => s.state);

  useEffect(() => {
    const unlisteners: Array<() => void> = [];

    async function setupListeners() {
      try {
        const { listen } = await import("@tauri-apps/api/event");

        const unlistenPressed = await listen("hotkey-pressed", () => {
          setIsHotkeyPressed(true);
          if (recordingState === "idle" || recordingState === "error") {
            startRecording();
          }
        });
        unlisteners.push(unlistenPressed);

        const unlistenReleased = await listen("hotkey-released", () => {
          setIsHotkeyPressed(false);
          if (recordingState === "recording") {
            stopRecording();
          }
        });
        unlisteners.push(unlistenReleased);

        const unlistenCancelled = await listen("recording-cancelled", () => {
          setIsHotkeyPressed(false);
          cancelRecording();
        });
        unlisteners.push(unlistenCancelled);
      } catch {
        // Not running inside Tauri — hotkeys unavailable in browser mode
      }
    }

    setupListeners();

    return () => {
      unlisteners.forEach((unlisten) => unlisten());
    };
  }, [recordingState, startRecording, stopRecording, cancelRecording]);

  return { isHotkeyPressed };
}
