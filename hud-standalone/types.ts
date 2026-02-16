// ============================================================
// REDE HUD - Type Definitions (Standalone)
// Only HUD-relevant types extracted from the full app
// ============================================================

// --- Recording ---

export type RecordingState = "idle" | "recording" | "processing" | "error";

export interface AudioDevice {
  id: string;
  name: string;
  is_default: boolean;
}

export interface AudioLevel {
  rms: number;
  peak: number;
  db: number;
}

export interface TranscriptionResult {
  text: string;
  language: string;
  confidence: number;
  duration_ms: number;
}

// --- Correction ---

export interface Correction {
  original: string;
  corrected: string;
}

// --- HUD Settings ---

export type ActivationMode = "push" | "toggle";
export type HudSize = "compact" | "balanced" | "immersive";
export type HudPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface HudSettings {
  activation_mode: ActivationMode;
  hud_size: HudSize;
  hud_position: HudPosition;
  show_glow: boolean;
  show_stats: boolean;
}
