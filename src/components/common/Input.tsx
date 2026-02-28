// ============================================================
// REDE - Input Component
// Clean, spacious inputs with refined focus states
// ============================================================

import React from "react";

interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "search" | "url";
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  id?: string;
  name?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  disabled = false,
  autoFocus,
  autoComplete,
  id,
  name,
}) => {
  const [focused, setFocused] = React.useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const borderColor = error
    ? "rgba(239, 68, 68, 0.5)"
    : focused
    ? "rgba(229, 57, 53, 0.5)"
    : "rgba(255, 255, 255, 0.06)";

  const shadow = focused
    ? error
      ? "0 0 0 3px rgba(239, 68, 68, 0.08)"
      : "0 0 0 3px rgba(229, 57, 53, 0.08)"
    : "none";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%" }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#7A7A88",
            letterSpacing: "0.01em",
            userSelect: "none",
          }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        style={{
          width: "100%",
          padding: "10px 14px",
          fontSize: 13,
          lineHeight: "18px",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          color: "#EAEAEF",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          border: `1px solid ${borderColor}`,
          borderRadius: 9,
          outline: "none",
          transition: "all 150ms ease",
          boxSizing: "border-box",
          boxShadow: shadow,
          ...(disabled ? { opacity: 0.35, cursor: "not-allowed" } : {}),
        }}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error && (
        <span style={{ fontSize: 11, color: "#EF4444", marginTop: 1 }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
