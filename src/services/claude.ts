// ============================================================
// REDE - Anthropic Claude API Service
// ============================================================

import type { ProcessResponse } from "../types/api";
import type { ProcessingOptions } from "../types/index";

// --- Constants ---

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL = "claude-sonnet-4-20250514";
const ANTHROPIC_VERSION = "2023-06-01";

// --- Helpers ---

function getApiKey(): string {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
  if (!key) {
    throw new Error(
      "VITE_ANTHROPIC_API_KEY is not set in environment variables",
    );
  }
  return key;
}

/**
 * Send a prompt to the Claude API and return the text response.
 */
async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = getApiKey();

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Claude API error (${response.status}): ${errorBody}`,
    );
  }

  const data = await response.json();
  const textBlock = data.content?.find(
    (block: { type: string }) => block.type === "text",
  );

  return textBlock?.text ?? "";
}

// --- Public API ---

/**
 * Process transcribed text with Claude, applying the specified processing options.
 * Returns the corrected text along with a list of corrections made.
 */
export async function processText(
  text: string,
  options: ProcessingOptions,
): Promise<ProcessResponse> {
  const instructions: string[] = [];

  if (options.smart_correction) {
    instructions.push(
      "Fix grammar, spelling, and self-corrections (where the speaker restated something). " +
        "Keep only the final intended version of any repeated or corrected phrases.",
    );
  }

  if (options.remove_fillers) {
    instructions.push(
      "Remove filler words such as 'um', 'uh', 'er', 'ah', 'like', 'you know', " +
        "'I mean', 'sort of', 'kind of', 'basically', 'actually', 'literally', 'right', 'so yeah'.",
    );
  }

  if (options.auto_punctuation) {
    instructions.push(
      "Add proper punctuation including periods, commas, question marks, and exclamation marks.",
    );
  }

  if (options.auto_capitalize) {
    instructions.push(
      "Capitalize the first word of each sentence, proper nouns, and acronyms.",
    );
  }

  if (options.tone) {
    instructions.push(
      `Adjust the tone to be ${options.tone}. ` +
        (options.tone === "casual"
          ? "Use conversational language and contractions."
          : options.tone === "professional"
            ? "Use formal language suitable for business communication."
            : "Keep a balanced, neutral tone."),
    );
  }

  if (instructions.length === 0) {
    // No processing requested; return original text
    return { text, corrections: [] };
  }

  const systemPrompt = [
    "You are a text processing assistant for a voice dictation application called REDE.",
    "Your job is to clean up raw speech-to-text transcriptions.",
    "Apply ONLY the processing steps listed below. Do not add new content or change the meaning.",
    "Return ONLY the processed text, with no explanations or commentary.",
    "",
    "Processing steps:",
    ...instructions.map((inst, i) => `${i + 1}. ${inst}`),
  ].join("\n");

  const processedText = await callClaude(systemPrompt, text);

  // Build a simple corrections list by comparing original and processed
  const corrections = buildCorrections(text, processedText);

  return {
    text: processedText,
    corrections,
  };
}

/**
 * Apply smart correction to fix grammar, self-corrections, and garbled speech.
 * Returns the corrected text.
 */
export async function smartCorrection(text: string): Promise<string> {
  const systemPrompt = [
    "You are a text correction assistant for a voice dictation app.",
    "Fix grammar, spelling, and self-corrections in the transcribed text.",
    "When the speaker restates or corrects themselves, keep only the final intended version.",
    "Do not add new content. Preserve the speaker's meaning and intent.",
    "Return ONLY the corrected text.",
  ].join("\n");

  return callClaude(systemPrompt, text);
}

/**
 * Remove filler words from transcribed text.
 * Returns the cleaned text.
 */
export async function removeFillers(text: string): Promise<string> {
  const systemPrompt = [
    "You are a text cleanup assistant for a voice dictation app.",
    "Remove filler words and verbal hesitations from the text.",
    "Common fillers to remove: um, uh, er, ah, like, you know, I mean, sort of, kind of, " +
      "basically, actually, literally, right, so yeah.",
    "Do not change the meaning or add new content.",
    "Return ONLY the cleaned text.",
  ].join("\n");

  return callClaude(systemPrompt, text);
}

// --- Internal ---

import type { Correction } from "../types/index";

/**
 * Build a basic list of corrections by comparing original and processed text.
 * This is a simplified diff -- full word-level diffing could be added later.
 */
function buildCorrections(original: string, processed: string): Correction[] {
  const corrections: Correction[] = [];

  if (original === processed) return corrections;

  const origWords = original.split(/\s+/);
  const procWords = processed.split(/\s+/);

  let position = 0;
  let procIndex = 0;

  for (let i = 0; i < origWords.length; i++) {
    const origWord = origWords[i];

    if (procIndex < procWords.length && origWord === procWords[procIndex]) {
      // Words match; advance both
      position += origWord.length + 1;
      procIndex++;
    } else {
      // Look ahead in processed to see if this word was removed (filler)
      const isRemoved =
        procIndex < procWords.length &&
        origWords[i + 1] === procWords[procIndex];

      if (isRemoved) {
        corrections.push({
          original: origWord,
          corrected: "",
          type: "filler_removal",
          position,
        });
      } else if (procIndex < procWords.length) {
        corrections.push({
          original: origWord,
          corrected: procWords[procIndex],
          type: "self_correction",
          position,
        });
        procIndex++;
      }
      position += origWord.length + 1;
    }
  }

  return corrections;
}
