// ============================================================
// REDE - Database Model Types (SQLite local storage)
// ============================================================

export interface LocalSettings {
  key: string;
  value: string;
  updated_at: string;
}

export interface LocalHistoryItem {
  id: string;
  text: string;
  original_text: string | null;
  was_corrected: boolean;
  language: string;
  duration_ms: number;
  word_count: number;
  target_app: string | null;
  created_at: string;
}

export interface LocalSnippet {
  id: string;
  trigger: string;
  content: string;
  variables: string | null; // JSON serialized
  case_sensitive: number; // SQLite boolean (0/1)
  enabled: number; // SQLite boolean (0/1)
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface LocalDictionaryWord {
  id: string;
  word: string;
  phonetic_hint: string | null;
  category: string | null;
  created_at: string;
}

export interface AudioConfig {
  sample_rate: number;
  channels: number;
  bit_depth: number;
  buffer_size: number;
}

export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
  sample_rate: 16000,
  channels: 1,
  bit_depth: 16,
  buffer_size: 4096,
};

export interface SilenceDetectionConfig {
  noise_gate_threshold_db: number;
  silence_timeout_ms: number;
  min_speech_duration_ms: number;
}

export const DEFAULT_SILENCE_CONFIG: SilenceDetectionConfig = {
  noise_gate_threshold_db: -50,
  silence_timeout_ms: 1500,
  min_speech_duration_ms: 500,
};
