// ============================================================
// REDE - Application Constants
// ============================================================

export const APP_NAME = "REDE";
export const APP_VERSION = "1.0.0";
export const APP_BUNDLE_ID = "com.rede.app";

// Audio
export const AUDIO_SAMPLE_RATE = 16000;
export const AUDIO_CHANNELS = 1;
export const AUDIO_BIT_DEPTH = 16;
export const AUDIO_BUFFER_SIZE = 4096;

// Silence detection
export const SILENCE_THRESHOLD_DB = -50;
export const SILENCE_TIMEOUT_MS = 1500;
export const MIN_SPEECH_DURATION_MS = 500;

// Whisper mode
export const WHISPER_GAIN_BOOST_DB = 12;

// API chunking
export const CHUNK_DURATION_MS = 5000;
export const CHUNK_OVERLAP_MS = 500;
export const MAX_CHUNK_SIZE_MB = 25;

// Subscription
export const TRIAL_DAYS = 7;
export const OFFLINE_GRACE_DAYS = 7;
export const MAX_DEVICES = 3;
export const GRACE_PERIOD_DAYS = 7;

// Pricing
export const MONTHLY_PRICE = 9.99;
export const ANNUAL_PRICE = 79.99;

// Filler words
export const FILLER_WORDS = [
  "um",
  "uh",
  "er",
  "ah",
  "like",
  "you know",
  "I mean",
  "sort of",
  "kind of",
  "basically",
  "actually",
  "literally",
  "right",
  "so yeah",
] as const;

// Self-correction detection patterns
export const CORRECTION_PATTERNS = [
  "actually",
  "I mean",
  "no wait",
  "sorry",
  "let me rephrase",
  "I meant to say",
  "correction",
] as const;

// App contexts for tone matching
export const APP_CONTEXTS: Record<
  string,
  { tone: "casual" | "professional" | "neutral"; emoji: boolean }
> = {
  "com.tinyspeck.slackmacgap": { tone: "casual", emoji: true },
  "com.apple.mail": { tone: "professional", emoji: false },
  "com.microsoft.Outlook": { tone: "professional", emoji: false },
  "com.apple.MobileSMS": { tone: "casual", emoji: true },
  "com.apple.Notes": { tone: "neutral", emoji: false },
  default: { tone: "neutral", emoji: false },
};

// HUD dimensions
export const HUD_SIZES = {
  compact: { width: 280, height: 80 },
  balanced: { width: 360, height: 120 },
  immersive: { width: 440, height: 160 },
} as const;

// Animation durations (ms)
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  spring: { stiffness: 200, damping: 20 },
} as const;
