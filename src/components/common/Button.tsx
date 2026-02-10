// ============================================================
// REDE - Reusable Button Component
// ============================================================

import React from "react";

// --- Types ---

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

// --- Styles ---

const ACCENT = "#7B61FF";
const ACCENT_HOVER = "#6B51EF";
const ACCENT_ACTIVE = "#5B41DF";

const baseStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  border: "none",
  borderRadius: 8,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 150ms ease",
  outline: "none",
  position: "relative",
  whiteSpace: "nowrap",
  userSelect: "none",
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: ACCENT,
    color: "#FFFFFF",
  },
  secondary: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: "#FFFFFF",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#A0A0B0",
  },
  danger: {
    backgroundColor: "rgba(248, 113, 113, 0.12)",
    color: "#F87171",
  },
};

const variantHoverStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: ACCENT_HOVER,
  },
  secondary: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  ghost: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    color: "#FFFFFF",
  },
  danger: {
    backgroundColor: "rgba(248, 113, 113, 0.2)",
  },
};

const variantActiveStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: ACCENT_ACTIVE,
  },
  secondary: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  ghost: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  danger: {
    backgroundColor: "rgba(248, 113, 113, 0.25)",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: "6px 12px",
    fontSize: 12,
    lineHeight: "16px",
    borderRadius: 6,
  },
  md: {
    padding: "10px 18px",
    fontSize: 14,
    lineHeight: "20px",
    borderRadius: 8,
  },
  lg: {
    padding: "14px 24px",
    fontSize: 16,
    lineHeight: "24px",
    borderRadius: 10,
  },
};

const disabledStyle: React.CSSProperties = {
  opacity: 0.4,
  cursor: "not-allowed",
  pointerEvents: "none",
};

const spinnerStyle: React.CSSProperties = {
  width: 16,
  height: 16,
  border: "2px solid rgba(255, 255, 255, 0.3)",
  borderTopColor: "#FFFFFF",
  borderRadius: "50%",
  animation: "rede-spin 600ms linear infinite",
};

// --- Component ---

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  icon,
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...rest
}) => {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const isDisabled = disabled || loading;

  const computedStyle: React.CSSProperties = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(hovered && !isDisabled ? variantHoverStyles[variant] : {}),
    ...(pressed && !isDisabled ? variantActiveStyles[variant] : {}),
    ...(fullWidth ? { width: "100%" } : {}),
    ...(isDisabled ? disabledStyle : {}),
    ...style,
  };

  return (
    <>
      <style>{`@keyframes rede-spin { to { transform: rotate(360deg); } }`}</style>
      <button
        style={computedStyle}
        disabled={isDisabled}
        onMouseEnter={(e) => {
          setHovered(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setHovered(false);
          setPressed(false);
          onMouseLeave?.(e);
        }}
        onMouseDown={(e) => {
          setPressed(true);
          onMouseDown?.(e);
        }}
        onMouseUp={(e) => {
          setPressed(false);
          onMouseUp?.(e);
        }}
        {...rest}
      >
        {loading ? <span style={spinnerStyle} /> : icon}
        {children}
      </button>
    </>
  );
};

export default Button;
