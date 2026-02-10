// ============================================================
// REDE - Reusable Input Component
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

// --- Styles ---

const ACCENT = "#7B61FF";
const ERROR_COLOR = "#F87171";

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: "#A0A0B0",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  userSelect: "none",
};

const baseInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  lineHeight: "20px",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: "#FFFFFF",
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 8,
  outline: "none",
  transition: "all 150ms ease",
  boxSizing: "border-box",
};

const focusedBorderColor = ACCENT;

const errorInputOverride: React.CSSProperties = {
  borderColor: ERROR_COLOR,
};

const errorTextStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 400,
  color: ERROR_COLOR,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  marginTop: 2,
};

const disabledStyle: React.CSSProperties = {
  opacity: 0.4,
  cursor: "not-allowed",
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
          borderColor: error ? ERROR_COLOR : focusedBorderColor,
          boxShadow: error
            ? `0 0 0 3px rgba(248, 113, 113, 0.15)`
            : `0 0 0 3px rgba(123, 97, 255, 0.15)`,
        }
      : {}),
    ...(error && !focused ? errorInputOverride : {}),
    ...(disabled ? disabledStyle : {}),
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
