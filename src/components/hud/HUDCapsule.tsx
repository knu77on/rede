// ============================================================
// REDE - HUD Capsule Container
// Glassmorphic capsule with refined glow states
// ============================================================

import React from "react";
import type { HudSize } from "../../types/index";

interface HUDCapsuleProps {
  size: HudSize;
  isRecording: boolean;
  isProcessing: boolean;
  showGlow: boolean;
  children: React.ReactNode;
}

const sizeConfig: Record<HudSize, { width: number; height: number; borderRadius: number }> = {
  compact: { width: 72, height: 72, borderRadius: 36 },
  balanced: { width: 120, height: 72, borderRadius: 36 },
  immersive: { width: 160, height: 80, borderRadius: 40 },
};

const RED_RGB = "239, 68, 68";
const GREEN_RGB = "34, 197, 94";

const capsuleKeyframes = `
@keyframes rede-glow-recording {
  0%, 100% {
    box-shadow: 0 0 15px rgba(${RED_RGB}, 0.25), 0 0 30px rgba(${RED_RGB}, 0.12), inset 0 0 12px rgba(${RED_RGB}, 0.04);
    border-color: rgba(${RED_RGB}, 0.4);
  }
  50% {
    box-shadow: 0 0 25px rgba(${RED_RGB}, 0.4), 0 0 50px rgba(${RED_RGB}, 0.2), inset 0 0 18px rgba(${RED_RGB}, 0.06);
    border-color: rgba(${RED_RGB}, 0.6);
  }
}
@keyframes rede-glow-processing {
  0%, 100% {
    box-shadow: 0 0 15px rgba(${GREEN_RGB}, 0.25), 0 0 30px rgba(${GREEN_RGB}, 0.12), inset 0 0 12px rgba(${GREEN_RGB}, 0.04);
    border-color: rgba(${GREEN_RGB}, 0.4);
  }
  50% {
    box-shadow: 0 0 25px rgba(${GREEN_RGB}, 0.4), 0 0 50px rgba(${GREEN_RGB}, 0.2), inset 0 0 18px rgba(${GREEN_RGB}, 0.06);
    border-color: rgba(${GREEN_RGB}, 0.6);
  }
}
`;

export const HUDCapsule: React.FC<HUDCapsuleProps> = ({ size, isRecording, isProcessing, showGlow, children }) => {
  const cfg = sizeConfig[size];
  const glowActive = showGlow && (isRecording || isProcessing);

  const borderColor = isRecording
    ? `rgba(${RED_RGB}, 0.4)`
    : isProcessing
    ? `rgba(${GREEN_RGB}, 0.4)`
    : "rgba(255, 255, 255, 0.06)";

  return (
    <>
      <style>{capsuleKeyframes}</style>
      <div
        style={{
          width: cfg.width,
          height: cfg.height,
          borderRadius: cfg.borderRadius,
          backgroundColor: "rgba(9, 9, 15, 0.9)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1.5px solid ${borderColor}`,
          boxShadow: glowActive ? undefined : "0 4px 24px rgba(0, 0, 0, 0.45), 0 1px 4px rgba(0, 0, 0, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          boxSizing: "border-box",
          transition: "width 300ms ease, height 300ms ease, border-radius 300ms ease, border-color 300ms ease, box-shadow 300ms ease",
          animation: glowActive
            ? isRecording
              ? "rede-glow-recording 2s ease-in-out infinite"
              : "rede-glow-processing 1.5s ease-in-out infinite"
            : "none",
          position: "relative",
        }}
        role="status"
        aria-live="polite"
      >
        {children}
      </div>
    </>
  );
};

export default HUDCapsule;
