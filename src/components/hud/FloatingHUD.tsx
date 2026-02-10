// ============================================================
// REDE - Floating HUD Overlay Component
// ============================================================

import React from "react";
import { useRecordingStore } from "../../stores/recordingStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { HUDCapsule } from "./HUDCapsule";
import { Equalizer } from "./Equalizer";
import type { HudSize } from "../../types/index";

// --- Styles ---

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
  zIndex: 9999,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const capsuleWrapperStyle: React.CSSProperties = {
  pointerEvents: "auto",
};

const equalizerContainerSizes: Record<HudSize, React.CSSProperties> = {
  compact: { width: 28, height: 32, flexShrink: 0 },
  balanced: { width: 36, height: 48, flexShrink: 0 },
  immersive: { width: 44, height: 64, flexShrink: 0 },
};

const contentContainerStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: 4,
  overflow: "hidden",
  minWidth: 0,
};

const transcriptionTextStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 400,
  color: "#FFFFFF",
  lineHeight: "18px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const transcriptionTextImmersiveStyle: React.CSSProperties = {
  ...transcriptionTextStyle,
  fontSize: 15,
  lineHeight: "22px",
  whiteSpace: "normal",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
};

const statusTextStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: "#A0A0B0",
  lineHeight: "14px",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const statsContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const statStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 400,
  color: "#606070",
  lineHeight: "14px",
  whiteSpace: "nowrap",
};

const recordingDotStyle: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: "50%",
  backgroundColor: "#F87171",
  flexShrink: 0,
};

const processingDotStyle: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: "50%",
  backgroundColor: "#34D399",
  flexShrink: 0,
};

// --- Keyframes ---

const hudKeyframes = `
@keyframes rede-hud-dot-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
`;

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

  const hudSize = useSettingsStore((s) => s.settings.hud_size);
  const showGlow = useSettingsStore((s) => s.settings.show_glow);
  const showStats = useSettingsStore((s) => s.settings.show_stats);

  const isRecording = state === "recording";
  const isProcessing = state === "processing";
  const isActive = isRecording || isProcessing;

  const barCount = hudSize === "compact" ? 4 : hudSize === "balanced" ? 5 : 7;

  // Use audioLevels directly if available, otherwise generate default levels
  const equalizerLevels = React.useMemo(() => {
    if (audioLevels.length >= barCount) {
      return audioLevels.slice(0, barCount);
    }
    if (audioLevels.length > 0) {
      // Pad to barCount by interpolating
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

  // Determine display text
  const displayText = React.useMemo(() => {
    if (transcription) return transcription;
    if (isProcessing) return "Processing...";
    if (isRecording) return "Listening...";
    return "Ready";
  }, [transcription, isProcessing, isRecording]);

  // Determine status label
  const statusLabel = React.useMemo(() => {
    if (isRecording) return "Recording";
    if (isProcessing) return "Processing";
    return "Idle";
  }, [isRecording, isProcessing]);

  const isImmersive = hudSize === "immersive";

  return (
    <>
      <style>{hudKeyframes}</style>
      <div style={overlayStyle}>
        <div style={capsuleWrapperStyle}>
          <HUDCapsule
            size={hudSize}
            isRecording={isRecording}
            isProcessing={isProcessing}
            showGlow={showGlow}
          >
            {/* Equalizer */}
            <div style={equalizerContainerSizes[hudSize]}>
              <Equalizer
                levels={equalizerLevels}
                isActive={isActive}
                barCount={barCount}
              />
            </div>

            {/* Content */}
            <div style={contentContainerStyle}>
              {/* Status row */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {isRecording && (
                  <div
                    style={{
                      ...recordingDotStyle,
                      animation: "rede-hud-dot-pulse 1.2s ease-in-out infinite",
                    }}
                  />
                )}
                {isProcessing && (
                  <div
                    style={{
                      ...processingDotStyle,
                      animation: "rede-hud-dot-pulse 0.8s ease-in-out infinite",
                    }}
                  />
                )}
                <span style={statusTextStyle}>{statusLabel}</span>
              </div>

              {/* Transcription text */}
              <div
                style={isImmersive ? transcriptionTextImmersiveStyle : transcriptionTextStyle}
                title={displayText}
              >
                {displayText}
              </div>

              {/* Stats */}
              {showStats && isActive && (
                <div style={statsContainerStyle}>
                  <span style={statStyle}>{formatDuration(duration)}</span>
                  <span style={{ ...statStyle, color: "rgba(255,255,255,0.15)" }}>|</span>
                  <span style={statStyle}>
                    {wordCount} {wordCount === 1 ? "word" : "words"}
                  </span>
                </div>
              )}
            </div>
          </HUDCapsule>
        </div>
      </div>
    </>
  );
};

export default FloatingHUD;
