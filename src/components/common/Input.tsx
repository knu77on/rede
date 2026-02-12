// ============================================================
// REDE - Reusable Input Component
// macOS dark glass aesthetic
// ============================================================

import React from "react";

// --- Types ---

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

// --- Constants ---

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const ACCENT = "#E53935";
const ERROR_COLOR = "#F87171";

// --- Styles ---

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: "#8E8E9A",
  fontFamily: FONT,
  userSelect: "none",
};

const baseInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  lineHeight: "20px",
  fontFamily: FONT,
  color: "#F5F5F7",
  backgroundColor: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 8,
  outline: "none",
  transition: "all 150ms ease",
  boxSizing: "border-box",
};

const errorTextStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 400,
  color: ERROR_COLOR,
  fontFamily: FONT,
  marginTop: 2,
};

// --- Component ---

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

  const computedInputStyle: React.CSSProperties = {
    ...baseInputStyle,
    ...(focused
      ? {
          borderColor: error ? ERROR_COLOR : ACCENT,
          boxShadow: error
            ? "0 0 0 3px rgba(248, 113, 113, 0.12)"
            : "0 0 0 3px rgba(229, 57, 53, 0.12)",
        }
      : {}),
    ...(error && !focused ? { borderColor: ERROR_COLOR } : {}),
    ...(disabled ? { opacity: 0.4, cursor: "not-allowed" } : {}),
  };

  return (
    <div style={wrapperStyle}>
      {label && (
        <label htmlFor={inputId} style={labelStyle}>
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
        style={computedInputStyle}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error && <span style={errorTextStyle}>{error}</span>}
    </div>
  );
};

export default Input;
