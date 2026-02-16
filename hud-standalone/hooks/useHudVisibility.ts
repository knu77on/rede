// ============================================================
// REDE HUD - HUD Visibility Hook (Standalone)
// Control key activation (push-to-talk / double-tap toggle)
// Auto-shows during recording and after transcription
// ============================================================

import { useState, useCallback, useEffect, useRef } from "react";
import { useRecordingStore } from "../stores/recordingStore";
import { useHudSettingsStore } from "../stores/hudSettingsStore";

export function useHudVisibility() {
  const [visible, setVisible] = useState(false);
  const activationMode = useHudSettingsStore((s) => s.settings.activation_mode);
  const controlTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastControlRef = useRef(0);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Control") return;

      if (activationMode === "push") {
        show();
      } else {
        const now = Date.now();
        if (now - lastControlRef.current < 400) {
          setVisible((prev) => !prev);
          lastControlRef.current = 0;
        } else {
          lastControlRef.current = now;
        }
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (e.key !== "Control") return;
      if (activationMode === "push") {
        if (controlTimerRef.current) clearTimeout(controlTimerRef.current);
        controlTimerRef.current = setTimeout(hide, 200);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (controlTimerRef.current) clearTimeout(controlTimerRef.current);
    };
  }, [activationMode, show, hide]);

  const recordingState = useRecordingStore((s) => s.state);
  const transcription = useRecordingStore((s) => s.transcription);

  useEffect(() => {
    if (recordingState === "recording" || recordingState === "processing") {
      show();
    }
  }, [recordingState, show]);

  useEffect(() => {
    if (!transcription) return;
    show();
    const timer = setTimeout(hide, 5000);
    return () => clearTimeout(timer);
  }, [transcription, show, hide]);

  return visible;
}
