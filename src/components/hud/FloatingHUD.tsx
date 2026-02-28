// ============================================================
// REDE - Floating HUD Overlay
// Stacked: Capsule > Stats > Transcription > Correction
// Position-aware with configurable screen anchor
// ============================================================

import React from "react";
import { useRecordingStore } from "../../stores/recordingStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { HUDCapsule } from "./HUDCapsule";
import { Equalizer } from "./Equalizer";
import type { HudSize, HudPosition } from "../../types/index";

// --- Palette ---

const TXT = "#EAEAEF";
const TXT2 = "#7A7A88";
const TXT3 = "#4A4A56";
const GREEN = "#22C55E";
const GREEN_RGB = "34, 197, 94";
const BG = "rgba(9, 9, 15, 0.92)";
const BORDER = "rgba(255, 255, 255, 0.06)";

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

// --- Position ---

function overlayAlign(pos: HudPosition): React.CSSProperties {
  const pad = 48;
  const base: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    display: "flex", flexDirection: "column", pointerEvents: "none", zIndex: 9999,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };
  switch (pos) {
    case "top-left": return { ...base, justifyContent: "flex-start", alignItems: "flex-start", padding: pad };
    case "top-center": return { ...base, justifyContent: "flex-start", alignItems: "center", paddingTop: pad };
    case "top-right": return { ...base, justifyContent: "flex-start", alignItems: "flex-end", padding: pad };
    case "center": return { ...base, justifyContent: "center", alignItems: "center" };
    case "bottom-left": return { ...base, justifyContent: "flex-end", alignItems: "flex-start", padding: pad };
    case "bottom-right": return { ...base, justifyContent: "flex-end", alignItems: "flex-end", padding: pad };
    case "bottom-center": default: return { ...base, justifyContent: "flex-end", alignItems: "center", paddingBottom: pad };
  }
}

// --- Styles ---

const eqSizes: Record<HudSize, React.CSSProperties> = {
  compact: { width: 36, height: 36, flexShrink: 0 },
  balanced: { width: 56, height: 44, flexShrink: 0 },
  immersive: { width: 72, height: 52, flexShrink: 0 },
};

const statsPill: React.CSSProperties = {
  marginTop: 10, padding: "5px 14px", borderRadius: 20,
  backgroundColor: BG, border: `1px solid ${BORDER}`,
  fontSize: 11, fontWeight: 500, color: TXT2, letterSpacing: 0.3,
  whiteSpace: "nowrap", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
};

const txBubble: React.CSSProperties = {
  marginTop: 10, padding: "10px 16px", borderRadius: 14,
  backgroundColor: BG, border: `1px solid ${BORDER}`,
  minWidth: 160, maxWidth: 320, fontSize: 13, fontWeight: 400,
  color: TXT, lineHeight: "18px", textAlign: "center",
  backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
  wordBreak: "break-word", overflow: "hidden", textOverflow: "ellipsis",
  display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as never,
};

const cursorEl: React.CSSProperties = {
  display: "inline-block", width: 2, height: 14, backgroundColor: TXT,
  marginLeft: 2, verticalAlign: "text-bottom", borderRadius: 1,
  animation: "rede-cursor-blink 1s ease-in-out infinite",
};

const corrPill: React.CSSProperties = {
  marginTop: 8, padding: "8px 14px", borderRadius: 10,
  backgroundColor: `rgba(${GREEN_RGB}, 0.1)`,
  border: `1px solid rgba(${GREEN_RGB}, 0.2)`,
  fontSize: 11, fontWeight: 500, color: GREEN, lineHeight: "16px",
  textAlign: "center", animation: "rede-correction-fadein 300ms ease-out",
  backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
  display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
  gap: 6, maxWidth: 320, wordBreak: "break-word",
};

function fmtDur(ms: number): string {
  const t = Math.floor(ms / 1000);
  return `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, "0")}`;
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

  const isRec = state === "recording";
  const isProc = state === "processing";
  const isActive = isRec || isProc;
  const barCount = hudSize === "compact" ? 4 : hudSize === "balanced" ? 5 : 7;

  const eqLevels = React.useMemo(() => {
    if (audioLevels.length >= barCount) return audioLevels.slice(0, barCount);
    if (audioLevels.length > 0) {
      const out: number[] = [];
      for (let i = 0; i < barCount; i++) {
        const idx = (i / (barCount - 1)) * (audioLevels.length - 1);
        const lo = Math.floor(idx);
        const hi = Math.min(lo + 1, audioLevels.length - 1);
        const t = idx - lo;
        out.push(audioLevels[lo] * (1 - t) + audioLevels[hi] * t);
      }
      return out;
    }
    return new Array(barCount).fill(0);
  }, [audioLevels, barCount]);

  const text = React.useMemo(() => {
    if (isRec) return "Listening\u2026";
    if (isProc) return "Processing\u2026";
    if (transcription) return transcription;
    return "";
  }, [transcription, isProc, isRec]);

  const showTx = isRec || isProc || !!transcription;

  return (
    <>
      <style>{hudKeyframes}</style>
      <div style={overlayAlign(hudPosition)}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "auto", transition: "transform 0.3s ease" }}>
          <HUDCapsule size={hudSize} isRecording={isRec} isProcessing={isProc} showGlow={showGlow}>
            <div style={eqSizes[hudSize]}>
              <Equalizer levels={eqLevels} isActive={isActive} barCount={barCount} />
            </div>
          </HUDCapsule>

          {showStats && isActive && (
            <div style={statsPill}>
              {fmtDur(duration)}
              <span style={{ margin: "0 6px", color: TXT3 }}>|</span>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </div>
          )}

          {showTx && (
            <div style={txBubble}>
              <span>{text}</span>
              {isProc && <span style={cursorEl} />}
            </div>
          )}

          {correction && (
            <div style={corrPill}>
              <span style={{ fontWeight: 600, flexShrink: 0 }}>Corrected</span>
              <span style={{ color: TXT3, textDecoration: "line-through" }}>{correction.original}</span>
              <span style={{ color: GREEN, flexShrink: 0 }}>{"\u2192"}</span>
              <span>{correction.corrected}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FloatingHUD;
