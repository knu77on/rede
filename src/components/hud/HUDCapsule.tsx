// ============================================================
// REDE - HUD Capsule Container Component
// ============================================================

import React from "react";
import type { HudSize } from "../../types/index";

// --- Types ---

interface HUDCapsuleProps {
  size: HudSize;
  isRecording: boolean;
  isProcessing: boolean;
  showGlow: boolean;
  children: React.ReactNode;
}

// --- Dimensions ---

const sizeConfig: Record<HudSize, { width: number; height: number; padding: string; borderRadius: number }> = {
  compact: { width: 280, height: 80, padding: "10px 16px", borderRadius: 40 },
  balanced: { width: 360, height: 120, padding: "14px 22px", borderRadius: 60 },
  immersive: { width: 440, height: 160, padding: "18px 28px", borderRadius: 80 },
};

// --- Keyframes ---

const capsuleKeyframes = `
@keyframes rede-glow-recording {
  0%, 100% {
    box-shadow:
      0 0 15px rgba(123, 97, 255, 0.3),
      0 0 30px rgba(123, 97, 255, 0.15),
      inset 0 0 15px rgba(123, 97, 255, 0.05);
    border-color: rgba(123, 97, 255, 0.5);
  }
  50% {
    box-shadow:
      0 0 25px rgba(123, 97, 255, 0.5),
      0 0 50px rgba(123, 97, 255, 0.25),
      inset 0 0 20px rgba(123, 97, 255, 0.08);
    border-color: rgba(123, 97, 255, 0.7);
  }
}

@keyframes rede-glow-processing {
  0%, 100% {
    box-shadow:
      0 0 15px rgba(52, 211, 153, 0.3),
      0 0 30px rgba(52, 211, 153, 0.15),
      inset 0 0 15px rgba(52, 211, 153, 0.05);
    border-color: rgba(52, 211, 153, 0.5);
  }
  50% {
    box-shadow:
      0 0 25px rgba(52, 211, 153, 0.5),
      0 0 50px rgba(52, 211, 153, 0.25),
      inset 0 0 20px rgba(52, 211, 153, 0.08);
    border-color: rgba(52, 211, 153, 0.7);
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

  const capsuleStyle: React.CSSProperties = {
    width: config.width,
    height: config.height,
    padding: config.padding,
    borderRadius: config.borderRadius,
    backgroundColor: "rgba(18, 18, 22, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid ${
      isRecording
        ? "rgba(123, 97, 255, 0.4)"
        : isProcessing
          ? "rgba(52, 211, 153, 0.4)"
          : "rgba(255, 255, 255, 0.08)"
    }`,
    boxShadow: glowActive
      ? undefined
      : "0 4px 24px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2)",
    display: "flex",
    alignItems: "center",
    gap: size === "compact" ? 10 : size === "balanced" ? 14 : 18,
    overflow: "hidden",
    boxSizing: "border-box",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    transition: "border-color 300ms ease, box-shadow 300ms ease",
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
