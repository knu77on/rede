// ============================================================
// REDE HUD - Audio Equalizer Visualization Component
// Premium RED gradient bars with glow effects
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
  gap: 4,
  height: "100%",
  minHeight: 32,
};

const barBaseStyle: React.CSSProperties = {
  width: 5,
  borderRadius: 2.5,
  transition: "height 120ms ease-out, opacity 150ms ease, box-shadow 150ms ease",
  minHeight: 4,
};

// --- Keyframes ---

const equalizerKeyframes = `
@keyframes rede-eq-idle-pulse {
  0%, 100% { height: 15%; opacity: 0.35; }
  50% { height: 25%; opacity: 0.55; }
}
`;

// --- Helpers ---

function getBarColor(index: number, total: number): string {
  const t = total > 1 ? index / (total - 1) : 0;
  const r = Math.round(229 + (198 - 229) * t);
  const g = Math.round(57 + (40 - 57) * t);
  const b = Math.round(53 + (40 - 53) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function getBarGlow(index: number, total: number): string {
  const t = total > 1 ? index / (total - 1) : 0;
  const r = Math.round(229 + (198 - 229) * t);
  const g = Math.round(57 + (40 - 57) * t);
  const b = Math.round(53 + (40 - 53) * t);
  return `0 0 8px rgba(${r}, ${g}, ${b}, 0.6), 0 0 16px rgba(${r}, ${g}, ${b}, 0.3)`;
}

// --- Component ---

export const Equalizer: React.FC<EqualizerProps> = ({
  levels,
  isActive,
  barCount = 5,
}) => {
  const normalizedLevels = React.useMemo(() => {
    const result: number[] = [];
    for (let i = 0; i < barCount; i++) {
      if (i < levels.length) {
        result.push(Math.max(0, Math.min(1, levels[i])));
      } else {
        result.push(0);
      }
    }
    return result;
  }, [levels, barCount]);

  return (
    <>
      <style>{equalizerKeyframes}</style>
      <div style={containerStyle} role="img" aria-label="Audio level visualization">
        {normalizedLevels.map((level, index) => {
          const heightPercent = isActive
            ? Math.max(10, level * 100)
            : 15;

          const color = getBarColor(index, barCount);
          const showGlow = isActive && level > 0.5;

          const barStyle: React.CSSProperties = {
            ...barBaseStyle,
            height: isActive ? `${heightPercent}%` : undefined,
            backgroundColor: color,
            opacity: isActive ? 0.6 + level * 0.4 : 0.3,
            boxShadow: showGlow ? getBarGlow(index, barCount) : "none",
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
