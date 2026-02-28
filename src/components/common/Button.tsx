// ============================================================
// REDE - Button Component
// Clean, confident buttons with depth and polish
// ============================================================

import React from "react";

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

const ACCENT = "#E53935";

const base: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  border: "none",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 140ms ease",
  outline: "none",
  position: "relative",
  whiteSpace: "nowrap",
  userSelect: "none",
  letterSpacing: "-0.01em",
};

const variants: Record<ButtonVariant, { normal: React.CSSProperties; hover: React.CSSProperties; active: React.CSSProperties }> = {
  primary: {
    normal: {
      background: `linear-gradient(180deg, #EF4444 0%, ${ACCENT} 100%)`,
      color: "#FFFFFF",
      boxShadow: "0 1px 2px rgba(0,0,0,0.3), 0 4px 12px rgba(229,57,53,0.2), inset 0 1px 0 rgba(255,255,255,0.12)",
    },
    hover: {
      boxShadow: "0 2px 4px rgba(0,0,0,0.3), 0 6px 20px rgba(229,57,53,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
      transform: "translateY(-0.5px)",
    },
    active: {
      background: `linear-gradient(180deg, ${ACCENT} 0%, #C62828 100%)`,
      boxShadow: "0 1px 2px rgba(0,0,0,0.4), inset 0 1px 2px rgba(0,0,0,0.1)",
      transform: "translateY(0.5px)",
    },
  },
  secondary: {
    normal: {
      backgroundColor: "rgba(255, 255, 255, 0.04)",
      color: "#CCCCD4",
      border: "1px solid rgba(255, 255, 255, 0.07)",
    },
    hover: {
      backgroundColor: "rgba(255, 255, 255, 0.07)",
      color: "#EAEAEF",
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    active: {
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      color: "#CCCCD4",
    },
  },
  ghost: {
    normal: {
      backgroundColor: "transparent",
      color: "#7A7A88",
    },
    hover: {
      backgroundColor: "rgba(255, 255, 255, 0.04)",
      color: "#EAEAEF",
    },
    active: {
      backgroundColor: "rgba(255, 255, 255, 0.02)",
    },
  },
  danger: {
    normal: {
      backgroundColor: "rgba(239, 68, 68, 0.08)",
      color: "#EF4444",
      border: "1px solid rgba(239, 68, 68, 0.12)",
    },
    hover: {
      backgroundColor: "rgba(239, 68, 68, 0.14)",
      borderColor: "rgba(239, 68, 68, 0.2)",
    },
    active: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
    },
  },
};

const sizes: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "6px 12px", fontSize: 12, borderRadius: 7 },
  md: { padding: "9px 16px", fontSize: 13, borderRadius: 8 },
  lg: { padding: "11px 22px", fontSize: 14, borderRadius: 10 },
};

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
  const v = variants[variant];

  const computed: React.CSSProperties = {
    ...base,
    ...v.normal,
    ...sizes[size],
    ...(hovered && !isDisabled ? v.hover : {}),
    ...(pressed && !isDisabled ? v.active : {}),
    ...(fullWidth ? { width: "100%" } : {}),
    ...(isDisabled ? { opacity: 0.35, cursor: "not-allowed", pointerEvents: "none" as const } : {}),
    ...style,
  };

  return (
    <>
      <style>{`@keyframes rede-spin { to { transform: rotate(360deg); } }`}</style>
      <button
        style={computed}
        disabled={isDisabled}
        onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e); }}
        onMouseLeave={(e) => { setHovered(false); setPressed(false); onMouseLeave?.(e); }}
        onMouseDown={(e) => { setPressed(true); onMouseDown?.(e); }}
        onMouseUp={(e) => { setPressed(false); onMouseUp?.(e); }}
        {...rest}
      >
        {loading ? (
          <span style={{
            width: 14,
            height: 14,
            border: "2px solid rgba(255, 255, 255, 0.25)",
            borderTopColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "rede-spin 600ms linear infinite",
          }} />
        ) : icon}
        {children}
      </button>
    </>
  );
};

export default Button;
