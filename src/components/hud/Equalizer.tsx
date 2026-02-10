// ============================================================
// REDE - Audio Equalizer Visualization Component
// ============================================================

import React from "react";

// --- Types ---

interface EqualizerProps {
  levels: number[];
  isActive: boolean;
  barCount?: number;
}

// --- Styles ---

const containerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  gap: 3,
  height: "100%",
  minHeight: 32,
};

const barBaseStyle: React.CSSProperties = {
  width: 4,
  borderRadius: 2,
  transition: "height 120ms ease-out, opacity 150ms ease",
  minHeight: 3,
};

// --- Keyframes ---

const glowKeyframes = `
@keyframes rede-eq-idle-pulse {
  0%, 100% { height: 15%; opacity: 0.4; }
  50% { height: 25%; opacity: 0.6; }
}
`;

// --- Helpers ---

function getBarGradient(index: number, total: number): string {
  // Gradient from #7B61FF (left) to #5B41DF (right)
  const t = total > 1 ? index / (total - 1) : 0;
  const r = Math.round(123 + (91 - 123) * t);
  const g = Math.round(97 + (65 - 97) * t);
  const b = Math.round(255 + (223 - 255) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// --- Component ---

export const Equalizer: React.FC<EqualizerProps> = ({
  levels,
  isActive,
  barCount = 5,
}) => {
  // Normalize levels array to match barCount
  const normalizedLevels = React.useMemo(() => {
    const result: number[] = [];
    for (let i = 0; i < barCount; i++) {
      if (i < levels.length) {
        // Clamp between 0 and 1
        result.push(Math.max(0, Math.min(1, levels[i])));
      } else {
        result.push(0);
      }
    }
    return result;
  }, [levels, barCount]);

  return (
    <>
      <style>{glowKeyframes}</style>
      <div style={containerStyle} role="img" aria-label="Audio level visualization">
        {normalizedLevels.map((level, index) => {
          const heightPercent = isActive
            ? Math.max(10, level * 100)
            : 15;

          const barStyle: React.CSSProperties = {
            ...barBaseStyle,
            height: isActive ? `${heightPercent}%` : undefined,
            backgroundColor: getBarGradient(index, barCount),
            opacity: isActive ? 0.6 + level * 0.4 : 0.3,
            boxShadow: isActive && level > 0.5
              ? `0 0 6px ${getBarGradient(index, barCount)}40`
              : "none",
            ...(
              !isActive
                ? {
                    animation: `rede-eq-idle-pulse 1.8s ease-in-out ${index * 0.15}s infinite`,
                  }
                : {}
            ),
          };

          return <div key={index} style={barStyle} />;
        })}
      </div>
    </>
  );
};

export default Equalizer;
