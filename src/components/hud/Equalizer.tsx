// ============================================================
// REDE - Audio Equalizer Visualization
// Refined RED gradient bars with ambient glow
// ============================================================

import React from "react";

interface EqualizerProps {
  levels: number[];
  isActive: boolean;
  barCount?: number;
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  gap: 4,
  height: "100%",
  minHeight: 32,
};

const barBase: React.CSSProperties = {
  width: 5,
  borderRadius: 2.5,
  transition: "height 120ms ease-out, opacity 150ms ease, box-shadow 150ms ease",
  minHeight: 4,
};

const eqKeyframes = `
@keyframes rede-eq-idle-pulse {
  0%, 100% { height: 15%; opacity: 0.3; }
  50% { height: 25%; opacity: 0.5; }
}
`;

function getBarColor(i: number, total: number): string {
  const t = total > 1 ? i / (total - 1) : 0;
  const r = Math.round(239 + (198 - 239) * t);
  const g = Math.round(68 + (40 - 68) * t);
  const b = Math.round(68 + (40 - 68) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function getBarGlow(i: number, total: number): string {
  const t = total > 1 ? i / (total - 1) : 0;
  const r = Math.round(239 + (198 - 239) * t);
  const g = Math.round(68 + (40 - 68) * t);
  const b = Math.round(68 + (40 - 68) * t);
  return `0 0 8px rgba(${r}, ${g}, ${b}, 0.5), 0 0 16px rgba(${r}, ${g}, ${b}, 0.25)`;
}

export const Equalizer: React.FC<EqualizerProps> = ({ levels, isActive, barCount = 5 }) => {
  const normalized = React.useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < barCount; i++) {
      out.push(i < levels.length ? Math.max(0, Math.min(1, levels[i])) : 0);
    }
    return out;
  }, [levels, barCount]);

  return (
    <>
      <style>{eqKeyframes}</style>
      <div style={containerStyle} role="img" aria-label="Audio level visualization">
        {normalized.map((level, i) => {
          const h = isActive ? Math.max(10, level * 100) : 15;
          const color = getBarColor(i, barCount);
          const glow = isActive && level > 0.5;

          return (
            <div
              key={i}
              style={{
                ...barBase,
                height: isActive ? `${h}%` : undefined,
                backgroundColor: color,
                opacity: isActive ? 0.6 + level * 0.4 : 0.3,
                boxShadow: glow ? getBarGlow(i, barCount) : "none",
                ...(!isActive ? { animation: `rede-eq-idle-pulse 1.8s ease-in-out ${i * 0.15}s infinite` } : {}),
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default Equalizer;
