// ============================================================
// REDE - Text Formatters
// ============================================================

import { FILLER_WORDS } from "./constants";

/** Remove filler words from text */
export function removeFillerWords(text: string): string {
  let result = text;
  // Sort by length (longest first) to avoid partial matches
  const sortedFillers = [...FILLER_WORDS].sort((a, b) => b.length - a.length);

  for (const filler of sortedFillers) {
    // Match filler words with word boundaries
    const regex = new RegExp(`\\b${escapeRegex(filler)}\\b[,]?\\s*`, "gi");
    result = result.replace(regex, "");
  }

  // Clean up double spaces
  result = result.replace(/\s{2,}/g, " ").trim();

  // Re-capitalize first letter if needed
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }

  return result;
}

/** Auto-capitalize sentence starts */
export function autoCapitalize(text: string): string {
  // Capitalize after sentence-ending punctuation
  return text.replace(/(^|[.!?]\s+)([a-z])/g, (_, prefix, letter) => {
    return prefix + letter.toUpperCase();
  });
}

/** Escape special regex characters */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Format text for specific app context */
export function formatForContext(
  text: string,
  _context: { tone: string; emoji: boolean },
): string {
  // For now, return text as-is
  // Future: AI-powered tone adjustment
  return text;
}
