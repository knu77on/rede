// ============================================================
// REDE - Reusable Toggle Switch Component
// ============================================================

import { type CSSProperties, useCallback } from "react";

// --- Types ---

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

// --- Styles ---

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0",
    gap: 16,
    cursor: "pointer",
    userSelect: "none",
  },
  containerDisabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
  textBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "#F5F5F7",
    lineHeight: "18px",
  },
  description: {
    fontSize: 11,
    fontWeight: 400,
    color: "#6E6E7A",
    lineHeight: "14px",
  },
  track: {
    position: "relative",
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    transition: "background-color 0.2s ease",
    flexShrink: 0,
    cursor: "pointer",
  },
  trackChecked: {
    backgroundColor: "#E53935",
  },
  thumb: {
    position: "absolute",
    top: 2,
    left: 2,
    width: 16,
    height: 16,
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
  },
  thumbChecked: {
    transform: "translateX(16px)",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.3), 0 0 6px rgba(229, 57, 53, 0.3)",
  },
};

// --- Component ---

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: ToggleProps) {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onChange(!checked);
    }
  }, [checked, onChange, disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!disabled) {
          onChange(!checked);
        }
      }
    },
    [checked, onChange, disabled],
  );

  return (
    <div
      style={{
        ...styles.container,
        ...(disabled ? styles.containerDisabled : {}),
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      tabIndex={disabled ? -1 : 0}
    >
      <div style={styles.textBlock}>
        <span style={styles.label}>{label}</span>
        {description && <span style={styles.description}>{description}</span>}
      </div>
      <div
        style={{
          ...styles.track,
          ...(checked ? styles.trackChecked : {}),
        }}
      >
        <div
          style={{
            ...styles.thumb,
            ...(checked ? styles.thumbChecked : {}),
          }}
        />
      </div>
    </div>
  );
}
