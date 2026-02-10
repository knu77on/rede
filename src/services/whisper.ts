// ============================================================
// REDE - OpenAI Whisper API Service
// ============================================================

import type { TranscribeResponse } from "../types/api";

// --- Constants ---

const OPENAI_API_URL = "https://api.openai.com/v1/audio/transcriptions";
const MAX_CHUNK_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB per OpenAI limit
const WHISPER_MODEL = "whisper-1";

// --- Helpers ---

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!key) {
    throw new Error("VITE_OPENAI_API_KEY is not set in environment variables");
  }
  return key;
}

/**
 * Split large audio data into chunks that fit within the OpenAI file size limit.
 * Each chunk is returned as a separate Uint8Array.
 */
function chunkAudioData(audioData: Uint8Array): Uint8Array[] {
  if (audioData.byteLength <= MAX_CHUNK_SIZE_BYTES) {
    return [audioData];
  }

  const chunks: Uint8Array[] = [];
  let offset = 0;

  while (offset < audioData.byteLength) {
    const end = Math.min(offset + MAX_CHUNK_SIZE_BYTES, audioData.byteLength);
    chunks.push(audioData.slice(offset, end));
    offset = end;
  }

  return chunks;
}

/**
 * Send a single audio chunk to the OpenAI Whisper API.
 */
async function transcribeChunk(
  chunk: Uint8Array,
  language?: string,
): Promise<TranscribeResponse> {
  const apiKey = getApiKey();

  const blob = new Blob([chunk], { type: "audio/wav" });
  const formData = new FormData();
  formData.append("file", blob, "audio.wav");
  formData.append("model", WHISPER_MODEL);
  formData.append("response_format", "verbose_json");

  if (language) {
    formData.append("language", language);
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Whisper API error (${response.status}): ${errorBody}`,
    );
  }

  const data = await response.json();

  return {
    text: data.text ?? "",
    language: data.language ?? language ?? "en",
    confidence: data.segments?.[0]?.avg_logprob
      ? Math.exp(data.segments[0].avg_logprob)
      : 1.0,
  };
}

// --- Public API ---

/**
 * Transcribe audio data using the OpenAI Whisper API.
 * Handles chunking for large audio files automatically.
 */
export async function transcribe(
  audioData: Uint8Array,
  language?: string,
): Promise<TranscribeResponse> {
  const chunks = chunkAudioData(audioData);

  if (chunks.length === 1) {
    return transcribeChunk(chunks[0], language);
  }

  // Process multiple chunks and concatenate results
  const results = await Promise.all(
    chunks.map((chunk) => transcribeChunk(chunk, language)),
  );

  // Merge transcriptions from all chunks
  const combinedText = results.map((r) => r.text).join(" ");
  const detectedLanguage = results[0].language;

  // Average confidence across chunks
  const avgConfidence =
    results.reduce((sum, r) => sum + r.confidence, 0) / results.length;

  return {
    text: combinedText,
    language: detectedLanguage,
    confidence: avgConfidence,
  };
}
