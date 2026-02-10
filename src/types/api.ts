// ============================================================
// REDE - API Request/Response Types
// ============================================================

import type {
  User,
  Session,
  Subscription,
  SubscriptionPlan,
  Settings,
  Snippet,
  Correction,
} from "./index";

// --- Auth ---

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OAuthRequest {
  provider: "apple" | "google";
  token: string;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  session: Session;
}

// --- Subscription ---

export interface CheckoutRequest {
  plan: SubscriptionPlan;
}

export interface CheckoutResponse {
  checkout_url: string;
}

export interface PortalResponse {
  portal_url: string;
}

export interface SubscriptionResponse {
  subscription: Subscription;
}

// --- Transcription ---

export interface TranscribeRequest {
  audio: string; // base64 encoded
  language: string | null;
}

export interface TranscribeResponse {
  text: string;
  language: string;
  confidence: number;
}

export interface ProcessRequest {
  text: string;
  options: {
    smart_correction: boolean;
    remove_fillers: boolean;
    auto_punctuation: boolean;
    auto_capitalize: boolean;
    tone?: "casual" | "professional" | "neutral";
  };
}

export interface ProcessResponse {
  text: string;
  corrections: Correction[];
}

// --- Sync ---

export interface SyncSettingsResponse {
  settings: Settings;
}

export interface SyncSnippetsResponse {
  snippets: Snippet[];
}

// --- Error ---

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
