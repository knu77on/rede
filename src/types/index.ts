// ============================================================
// REDE - Core Type Definitions
// ============================================================

// --- User & Auth ---

export type AuthProvider = "apple" | "google" | "email";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  auth_provider: AuthProvider;
  created_at: string;
  updated_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

// --- Subscription ---

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";

export type SubscriptionPlan = "monthly" | "annual";

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  trial_ends_at: string | null;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

// --- Device ---

export interface Device {
  id: string;
  user_id: string;
  device_name: string;
  device_identifier: string;
  os_version: string;
  app_version: string;
  last_active_at: string;
  created_at: string;
}

// --- Snippets ---

export interface SnippetVariable {
  key: string;
  type: "date" | "time" | "datetime" | "clipboard" | "random";
}

export interface Snippet {
  id: string;
  user_id: string;
  trigger: string;
  content: string;
  variables: SnippetVariable[] | null;
  case_sensitive: boolean;
  enabled: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

// --- Dictionary ---

export interface DictionaryWord {
  id: string;
  user_id: string;
  word: string;
  phonetic_hint: string | null;
  category: string | null;
  created_at: string;
}

// --- History ---

export interface HistoryItem {
  id: string;
  user_id: string;
  text: string;
  original_text: string | null;
  was_corrected: boolean;
  language: string;
  duration_ms: number;
  word_count: number;
  target_app: string | null;
  created_at: string;
}

// --- Settings ---

export type ActivationMode = "push" | "toggle";
export type Theme = "dark" | "light";
export type HudSize = "compact" | "balanced" | "immersive";

export interface Settings {
  user_id: string;
  private_mode: boolean;
  analytics: boolean;
  activation_mode: ActivationMode;
  input_device: string;
  noise_suppression: boolean;
  whisper_mode: boolean;
  auto_silence: boolean;
  smart_correction: boolean;
  remove_fillers: boolean;
  auto_punctuation: boolean;
  auto_capitalize: boolean;
  auto_detect_language: boolean;
  language: string;
  theme: Theme;
  hud_size: HudSize;
  show_glow: boolean;
  show_stats: boolean;
  play_sounds: boolean;
  launch_at_login: boolean;
  updated_at: string;
}

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

export interface ProcessingOptions {
  smart_correction: boolean;
  remove_fillers: boolean;
  auto_punctuation: boolean;
  auto_capitalize: boolean;
  tone?: AppTone;
}

// --- App Context ---

export type AppTone = "casual" | "professional" | "neutral";

export interface AppContext {
  app_name: string;
  bundle_id: string;
  tone: AppTone;
  use_emoji: boolean;
}

// --- Correction ---

export interface Correction {
  original: string;
  corrected: string;
  type: "self_correction" | "filler_removal" | "punctuation" | "capitalization";
  position: number;
}
