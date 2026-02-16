// ============================================================
// REDE HUD - HUD Capsule Container Component
// Glassmorphic capsule with red/green glow states
// ============================================================

import React from "react";
import type { HudSize } from "../types";

// --- Types ---

interface HUDCapsuleProps {
  size: HudSize;
  isRecording: boolean;
  isProcessing: boolean;
  showGlow: boolean;
  children: React.ReactNode;
}

// --- Dimensions ---

const sizeConfig: Record<HudSize, { width: number; height: number; borderRadius: number }> = {
  compact: { width: 72, height: 72, borderRadius: 36 },
  balanced: { width: 120, height: 72, borderRadius: 36 },
  immersive: { width: 160, height: 80, borderRadius: 40 },
};

// --- Brand Colors ---

const REDE_RED_RGB = "229, 57, 53";
const REDE_GREEN_RGB = "76, 175, 80";
const BORDER_IDLE = "rgba(255, 255, 255, 0.07)";

// --- Keyframes ---

const capsuleKeyframes = `
@keyframes rede-glow-recording {
  0%, 100% {
    box-shadow:
      0 0 15px rgba(${REDE_RED_RGB}, 0.3),
      0 0 30px rgba(${REDE_RED_RGB}, 0.15),
      inset 0 0 15px rgba(${REDE_RED_RGB}, 0.05);
    border-color: rgba(${REDE_RED_RGB}, 0.5);
  }
  50% {
    box-shadow:
      0 0 25px rgba(${REDE_RED_RGB}, 0.5),
      0 0 50px rgba(${REDE_RED_RGB}, 0.25),
      inset 0 0 20px rgba(${REDE_RED_RGB}, 0.08);
    border-color: rgba(${REDE_RED_RGB}, 0.7);
  }
}

@keyframes rede-glow-processing {
  0%, 100% {
    box-shadow:
      0 0 15px rgba(${REDE_GREEN_RGB}, 0.3),
      0 0 30px rgba(${REDE_GREEN_RGB}, 0.15),
      inset 0 0 15px rgba(${REDE_GREEN_RGB}, 0.05);
    border-color: rgba(${REDE_GREEN_RGB}, 0.5);
  }
  50% {
    box-shadow:
      0 0 25px rgba(${REDE_GREEN_RGB}, 0.5),
      0 0 50px rgba(${REDE_GREEN_RGB}, 0.25),
      inset 0 0 20px rgba(${REDE_GREEN_RGB}, 0.08);
    border-color: rgba(${REDE_GREEN_RGB}, 0.7);
  }
}
`;

// --- Component ---

export const HUDCapsule: React.FC<HUDCapsuleProps> = ({
  size,
  isRecording,
  isProcessing,
  showGlow,
  children,
}) => {
  const config = sizeConfig[size];
  const glowActive = showGlow && (isRecording || isProcessing);

  const borderColor = isRecording
    ? `rgba(${REDE_RED_RGB}, 0.5)`
    : isProcessing
      ? `rgba(${REDE_GREEN_RGB}, 0.5)`
      : BORDER_IDLE;

  const capsuleStyle: React.CSSProperties = {
    width: config.width,
    height: config.height,
    borderRadius: config.borderRadius,
    backgroundColor: "rgba(12, 12, 16, 0.88)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: `1.5px solid ${borderColor}`,
    boxShadow: glowActive
      ? undefined
      : "0 4px 24px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    boxSizing: "border-box",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    transition: "width 300ms ease, height 300ms ease, border-radius 300ms ease, border-color 300ms ease, box-shadow 300ms ease",
    animation: glowActive
      ? isRecording
        ? "rede-glow-recording 2s ease-in-out infinite"
        : "rede-glow-processing 1.5s ease-in-out infinite"
      : "none",
    position: "relative",
  };

  return (
    <>
      <style>{capsuleKeyframes}</style>
      <div style={capsuleStyle} role="status" aria-live="polite">
        {children}
      </div>
    </>
  );
};

export default HUDCapsule;
