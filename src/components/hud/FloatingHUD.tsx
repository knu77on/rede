// ============================================================
// REDE - Floating HUD Overlay Component
// Stacked vertical layout: Capsule > Stats > Transcription > Correction
// Position-aware — anchors to configurable screen position
// ============================================================

import React from "react";
import { useRecordingStore } from "../../stores/recordingStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { HUDCapsule } from "./HUDCapsule";
import { Equalizer } from "./Equalizer";
import type { HudSize, HudPosition } from "../../types/index";

// --- Brand Colors ---

const COLOR_PRIMARY = "#F5F5F7";
const COLOR_SECONDARY = "#8E8E9A";
const COLOR_TERTIARY = "#55555F";
const COLOR_GREEN = "#4CAF50";
const COLOR_GREEN_RGB = "76, 175, 80";
const COLOR_BG_DARK = "rgba(12, 12, 16, 0.92)";
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

// --- Position Logic ---

function getOverlayAlignment(position: HudPosition): React.CSSProperties {
  const pad = 48;
  const base: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    pointerEvents: "none",
    zIndex: 9999,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  };

  switch (position) {
    case "top-left":
      return { ...base, justifyContent: "flex-start", alignItems: "flex-start", padding: pad };
    case "top-center":
      return { ...base, justifyContent: "flex-start", alignItems: "center", paddingTop: pad };
    case "top-right":
      return { ...base, justifyContent: "flex-start", alignItems: "flex-end", padding: pad };
    case "center":
      return { ...base, justifyContent: "center", alignItems: "center" };
    case "bottom-left":
      return { ...base, justifyContent: "flex-end", alignItems: "flex-start", padding: pad };
    case "bottom-right":
      return { ...base, justifyContent: "flex-end", alignItems: "flex-end", padding: pad };
    case "bottom-center":
    default:
      return { ...base, justifyContent: "flex-end", alignItems: "center", paddingBottom: pad };
  }
}

// --- Styles ---

const stackContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  pointerEvents: "auto",
  transition: "transform 0.3s ease",
};

const equalizerContainerSizes: Record<HudSize, React.CSSProperties> = {
  compact: { width: 36, height: 36, flexShrink: 0 },
  balanced: { width: 56, height: 44, flexShrink: 0 },
  immersive: { width: 72, height: 52, flexShrink: 0 },
};

const statsPillStyle: React.CSSProperties = {
  marginTop: 10,
  padding: "5px 14px",
  borderRadius: 20,
  backgroundColor: COLOR_BG_DARK,
  border: `1px solid ${COLOR_BORDER}`,
  fontSize: 11,
  fontWeight: 500,
  color: COLOR_SECONDARY,
  letterSpacing: 0.3,
  whiteSpace: "nowrap",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const transcriptionBubbleStyle: React.CSSProperties = {
  marginTop: 10,
  padding: "10px 16px",
  borderRadius: 14,
  backgroundColor: COLOR_BG_DARK,
  border: `1px solid ${COLOR_BORDER}`,
  minWidth: 160,
  maxWidth: 320,
  fontSize: 13,
  fontWeight: 400,
  color: COLOR_PRIMARY,
  lineHeight: "18px",
  textAlign: "center",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  wordBreak: "break-word",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical" as never,
};

const cursorStyle: React.CSSProperties = {
  display: "inline-block",
  width: 2,
  height: 14,
  backgroundColor: COLOR_PRIMARY,
  marginLeft: 2,
  verticalAlign: "text-bottom",
  borderRadius: 1,
  animation: "rede-cursor-blink 1s ease-in-out infinite",
};

// Correction — wrapping pill, grows upward
const correctionPillStyle: React.CSSProperties = {
  marginTop: 8,
  padding: "8px 14px",
  borderRadius: 10,
  backgroundColor: `rgba(${COLOR_GREEN_RGB}, 0.12)`,
  border: `1px solid rgba(${COLOR_GREEN_RGB}, 0.25)`,
  fontSize: 11,
  fontWeight: 500,
  color: COLOR_GREEN,
  lineHeight: "16px",
  textAlign: "center",
  animation: "rede-correction-fadein 300ms ease-out",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  maxWidth: 320,
  wordBreak: "break-word",
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
  const correction = useRecordingStore((s) => s.correction);

  const hudSize = useSettingsStore((s) => s.settings.hud_size);
  const hudPosition = useSettingsStore((s) => s.settings.hud_position);
  const showGlow = useSettingsStore((s) => s.settings.show_glow);
  const showStats = useSettingsStore((s) => s.settings.show_stats);

  const isRecording = state === "recording";
  const isProcessing = state === "processing";
  const isActive = isRecording || isProcessing;

  const barCount = hudSize === "compact" ? 4 : hudSize === "balanced" ? 5 : 7;

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

  const displayText = React.useMemo(() => {
    if (isRecording) return "Listening\u2026";
    if (isProcessing) return "Processing\u2026";
    if (transcription) return transcription;
    return "";
  }, [transcription, isProcessing, isRecording]);

  const showCursor = isProcessing;
  const showTranscription = isRecording || isProcessing || !!transcription;
  const overlayStyle = getOverlayAlignment(hudPosition);

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
              <span style={{ margin: "0 6px", color: COLOR_TERTIARY }}>|</span>
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

          {/* 4. Smart Correction — compact pill */}
          {correction && (
            <div style={correctionPillStyle}>
              <span style={{ fontWeight: 600, flexShrink: 0 }}>Corrected</span>
              <span style={{ color: COLOR_TERTIARY, textDecoration: "line-through" }}>
                {correction.original}
              </span>
              <span style={{ color: COLOR_GREEN, flexShrink: 0 }}>{"\u2192"}</span>
              <span>
                {correction.corrected}
              </span>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default FloatingHUD;
