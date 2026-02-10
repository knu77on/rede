// ============================================================
// REDE - Google Gemini Flash 2 Speech-to-Text Service
// ============================================================

import type { TranscribeResponse } from "../types/api";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

function getApiKey(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!key) {
    throw new Error("VITE_GEMINI_API_KEY is not set in environment variables");
  }
  return key;
}

/**
 * Convert audio data to base64 string
 */
function audioToBase64(audioData: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < audioData.byteLength; i++) {
    binary += String.fromCharCode(audioData[i]);
  }
  return btoa(binary);
}

/**
 * Transcribe audio using Gemini Flash 2's multimodal capabilities.
 * Sends audio as inline data and asks the model to transcribe it.
 */
export async function transcribe(
  audioData: Uint8Array,
  language?: string,
): Promise<TranscribeResponse> {
  const apiKey = getApiKey();
  const base64Audio = audioToBase64(audioData);

  const languageHint = language ? ` The audio is in ${language}.` : "";

  const requestBody = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: "audio/wav",
              data: base64Audio,
            },
          },
          {
            text: `Transcribe this audio accurately. Return only the transcribed text, nothing else. Preserve natural punctuation and capitalization.${languageHint}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2048,
    },
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

  return {
    text,
    language: language ?? "en",
    confidence: 0.95, // Gemini doesn't provide per-segment confidence
  };
}
