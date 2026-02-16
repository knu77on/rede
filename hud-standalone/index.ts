// ============================================================
// REDE HUD - Standalone Package Exports
// ============================================================

// Entry point
export { HudApp } from "./HudApp";

// Components
export { FloatingHUD } from "./components/FloatingHUD";
export { HUDCapsule } from "./components/HUDCapsule";
export { Equalizer } from "./components/Equalizer";

// Stores
export { useRecordingStore } from "./stores/recordingStore";
export { useHudSettingsStore } from "./stores/hudSettingsStore";

// Hooks
export { useHudVisibility } from "./hooks/useHudVisibility";
export { useHudFade, hudFadeKeyframes } from "./hooks/useHudFade";

// Demo
export { startDemoLoop } from "./demo";

// Types
export type {
  RecordingState,
  HudSize,
  HudPosition,
  HudSettings,
  ActivationMode,
  Correction,
  AudioDevice,
  AudioLevel,
  TranscriptionResult,
} from "./types";
