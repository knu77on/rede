// ============================================================
// REDE - Toggle Switch Component
// Smooth, tactile toggle with subtle glow on activation
// ============================================================

import { type CSSProperties, useCallback } from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: ToggleProps) {
  const handleClick = useCallback(() => {
    if (!disabled) onChange(!checked);
  }, [checked, onChange, disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        e.preventDefault();
        onChange(!checked);
      }
    },
    [checked, onChange, disabled],
  );

  const containerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "9px 0",
    gap: 14,
    cursor: disabled ? "default" : "pointer",
    userSelect: "none",
    opacity: disabled ? 0.4 : 1,
  };

  const trackStyle: CSSProperties = {
    position: "relative",
    width: 38,
    height: 22,
    borderRadius: 11,
    backgroundColor: checked ? "#E53935" : "rgba(255, 255, 255, 0.1)",
    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
    flexShrink: 0,
    cursor: disabled ? "default" : "pointer",
    boxShadow: checked
      ? "0 0 10px rgba(229, 57, 53, 0.2), inset 0 1px 1px rgba(0,0,0,0.1)"
      : "inset 0 1px 2px rgba(0,0,0,0.15)",
  };

  const thumbStyle: CSSProperties = {
    position: "absolute",
    top: 2,
    left: 2,
    width: 18,
    height: 18,
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.25)",
    transform: checked ? "translateX(16px)" : "translateX(0)",
  };

  return (
    <div
      style={containerStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      tabIndex={disabled ? -1 : 0}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#EAEAEF", lineHeight: "18px" }}>
          {label}
        </span>
        {description && (
          <span style={{ fontSize: 11, color: "#5A5A66", lineHeight: "14px" }}>
            {description}
          </span>
        )}
      </div>
      <div style={trackStyle}>
        <div style={thumbStyle} />
      </div>
    </div>
  );
}
