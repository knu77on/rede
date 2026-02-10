// ============================================================
// REDE - Floating HUD Overlay Component
// Stacked vertical layout: Capsule > Stats > Transcription > Correction
// ============================================================

import React from "react";
import { useRecordingStore } from "../../stores/recordingStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { HUDCapsule } from "./HUDCapsule";
import { Equalizer } from "./Equalizer";
import type { HudSize } from "../../types/index";

// --- Brand Colors ---

const COLOR_PRIMARY = "#F5F5F7";
const COLOR_SECONDARY = "#8E8E9A";
const COLOR_TERTIARY = "#55555F";
const COLOR_GREEN = "#4CAF50";
const COLOR_GREEN_RGB = "76, 175, 80";
const COLOR_BG_DARK = "rgba(12, 12, 16, 0.97)";
const COLOR_BORDER = "rgba(255, 255, 255, 0.07)";

// --- Keyframes ---

const hudKeyframes = `
@keyframes rede-cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes rede-correction-fadein {
  0% { opacity: 0; transform: translateY(4px); }
  100% { opacity: 1; transform: translateY(0); }
}
`;

// --- Styles ---

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
  zIndex: 9999,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const stackContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  pointerEvents: "auto",
};

const equalizerContainerSizes: Record<HudSize, React.CSSProperties> = {
  compact: { width: 36, height: 36, flexShrink: 0 },
  balanced: { width: 56, height: 44, flexShrink: 0 },
  immersive: { width: 72, height: 52, flexShrink: 0 },
};

// Stats pill
const statsPillStyle: React.CSSProperties = {
  marginTop: 12,
  padding: "6px 16px",
  borderRadius: 20,
  backgroundColor: COLOR_BG_DARK,
  border: `1px solid ${COLOR_BORDER}`,
  fontSize: 12,
  fontWeight: 500,
  color: COLOR_SECONDARY,
  letterSpacing: 0.3,
  whiteSpace: "nowrap",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  transition: "opacity 200ms ease, transform 200ms ease",
};

// Transcription bubble
const transcriptionBubbleStyle: React.CSSProperties = {
  marginTop: 12,
  padding: "12px 20px",
  borderRadius: 16,
  backgroundColor: COLOR_BG_DARK,
  border: `1px solid ${COLOR_BORDER}`,
  minWidth: 200,
  maxWidth: 360,
  fontSize: 14,
  fontWeight: 400,
  color: COLOR_PRIMARY,
  lineHeight: "20px",
  textAlign: "center",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  transition: "opacity 200ms ease",
  wordBreak: "break-word",
};

// Blinking cursor
const cursorStyle: React.CSSProperties = {
  display: "inline-block",
  width: 2,
  height: 16,
  backgroundColor: COLOR_PRIMARY,
  marginLeft: 2,
  verticalAlign: "text-bottom",
  borderRadius: 1,
  animation: "rede-cursor-blink 1s ease-in-out infinite",
};

// Correction badge
const correctionBadgeStyle: React.CSSProperties = {
  marginTop: 8,
  padding: "8px 16px",
  borderRadius: 12,
  backgroundColor: `rgba(${COLOR_GREEN_RGB}, 0.15)`,
  border: `1px solid rgba(${COLOR_GREEN_RGB}, 0.3)`,
  fontSize: 13,
  fontWeight: 400,
  color: COLOR_PRIMARY,
  lineHeight: "18px",
  textAlign: "center",
  animation: "rede-correction-fadein 300ms ease-out",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  whiteSpace: "nowrap",
};

const strikethroughStyle: React.CSSProperties = {
  textDecoration: "line-through",
  color: COLOR_TERTIARY,
  opacity: 0.7,
};

const arrowStyle: React.CSSProperties = {
  color: COLOR_GREEN,
  fontWeight: 500,
  fontSize: 13,
  margin: "0 2px",
};

const correctedTextStyle: React.CSSProperties = {
  color: COLOR_GREEN,
  fontWeight: 500,
};

// --- Helpers ---

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// --- Component ---

export const FloatingHUD: React.FC = () => {
  const state = useRecordingStore((s) => s.state);
  const audioLevels = useRecordingStore((s) => s.audioLevels);
  const duration = useRecordingStore((s) => s.duration);
  const transcription = useRecordingStore((s) => s.transcription);
  const wordCount = useRecordingStore((s) => s.wordCount);
  const correction = useRecordingStore((s) => (s as any).correction as { original: string; corrected: string } | null);

  const hudSize = useSettingsStore((s) => s.settings.hud_size);
  const showGlow = useSettingsStore((s) => s.settings.show_glow);
  const showStats = useSettingsStore((s) => s.settings.show_stats);

  const isRecording = state === "recording";
  const isProcessing = state === "processing";
  const isActive = isRecording || isProcessing;

  const barCount = hudSize === "compact" ? 4 : hudSize === "balanced" ? 5 : 7;

  // Normalize audio levels to match barCount
  const equalizerLevels = React.useMemo(() => {
    if (audioLevels.length >= barCount) {
      return audioLevels.slice(0, barCount);
    }
    if (audioLevels.length > 0) {
      const result: number[] = [];
      for (let i = 0; i < barCount; i++) {
        const srcIdx = (i / (barCount - 1)) * (audioLevels.length - 1);
        const lo = Math.floor(srcIdx);
        const hi = Math.min(lo + 1, audioLevels.length - 1);
        const t = srcIdx - lo;
        result.push(audioLevels[lo] * (1 - t) + audioLevels[hi] * t);
      }
      return result;
    }
    return new Array(barCount).fill(0);
  }, [audioLevels, barCount]);

  // Determine display text for transcription bubble
  const displayText = React.useMemo(() => {
    if (isRecording) return "Listening...";
    if (isProcessing) return "Processing...";
    if (transcription) return transcription;
    return "";
  }, [transcription, isProcessing, isRecording]);

  // Show cursor when processing (typing animation)
  const showCursor = isProcessing;

  // Show transcription bubble when there is something to display
  const showTranscription = isRecording || isProcessing || !!transcription;

  return (
    <>
      <style>{hudKeyframes}</style>
      <div style={overlayStyle}>
        <div style={stackContainerStyle}>

          {/* 1. HUD Capsule with Equalizer only */}
          <HUDCapsule
            size={hudSize}
            isRecording={isRecording}
            isProcessing={isProcessing}
            showGlow={showGlow}
          >
            <div style={equalizerContainerSizes[hudSize]}>
              <Equalizer
                levels={equalizerLevels}
                isActive={isActive}
                barCount={barCount}
              />
            </div>
          </HUDCapsule>

          {/* 2. Stats pill */}
          {showStats && isActive && (
            <div style={statsPillStyle}>
              {formatDuration(duration)}
              <span style={{ margin: "0 8px", color: COLOR_TERTIARY }}>|</span>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </div>
          )}

          {/* 3. Transcription bubble */}
          {showTranscription && (
            <div style={transcriptionBubbleStyle}>
              <span>{displayText}</span>
              {showCursor && <span style={cursorStyle} />}
            </div>
          )}

          {/* 4. Smart Correction badge */}
          {correction && (
            <div style={correctionBadgeStyle}>
              <span style={strikethroughStyle}>{correction.original}</span>
              <span style={arrowStyle}>{"\u2192"}</span>
              <span style={correctedTextStyle}>{correction.corrected}</span>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default FloatingHUD;
