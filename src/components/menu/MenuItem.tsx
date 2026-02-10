// ============================================================
// REDE - Reusable Menu Item Component
// ============================================================

import React from "react";

// --- Types ---

interface MenuItemProps {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  shortcut?: string;
  toggle?: boolean;
  checked?: boolean;
  divider?: boolean;
  destructive?: boolean;
  disabled?: boolean;
}

// --- Styles ---

const dividerStyle: React.CSSProperties = {
  height: 1,
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  margin: "4px 0",
  border: "none",
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "7px 12px",
  fontSize: 13,
  fontWeight: 400,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: "#FFFFFF",
  backgroundColor: "transparent",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  transition: "background-color 100ms ease",
  width: "100%",
  textAlign: "left",
  outline: "none",
  userSelect: "none",
  lineHeight: "18px",
};

const hoveredItemStyle: React.CSSProperties = {
  backgroundColor: "rgba(123, 97, 255, 0.12)",
};

const disabledItemStyle: React.CSSProperties = {
  opacity: 0.35,
  cursor: "default",
  pointerEvents: "none",
};

const destructiveBaseStyle: React.CSSProperties = {
  color: "#F87171",
};

const destructiveHoveredStyle: React.CSSProperties = {
  backgroundColor: "rgba(248, 113, 113, 0.1)",
};

const iconWrapperStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 18,
  height: 18,
  flexShrink: 0,
  color: "#A0A0B0",
};

const labelContainerStyle: React.CSSProperties = {
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const shortcutStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 400,
  color: "#606070",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  flexShrink: 0,
  letterSpacing: 0.3,
};

const toggleTrackStyle: React.CSSProperties = {
  position: "relative",
  width: 32,
  height: 18,
  borderRadius: 9,
  transition: "background-color 150ms ease",
  flexShrink: 0,
  cursor: "pointer",
};

const toggleKnobStyle: React.CSSProperties = {
  position: "absolute",
  top: 2,
  width: 14,
  height: 14,
  borderRadius: "50%",
  backgroundColor: "#FFFFFF",
  transition: "left 150ms ease",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
};

// --- Component ---

export const MenuItem: React.FC<MenuItemProps> = ({
  label,
  onClick,
  icon,
  shortcut,
  toggle,
  checked,
  divider,
  destructive,
  disabled,
}) => {
  const [hovered, setHovered] = React.useState(false);

  // Render divider above the item if divider is set
  if (divider) {
    return (
      <>
        <div style={dividerStyle} />
        <MenuItemButton
          label={label}
          onClick={onClick}
          icon={icon}
          shortcut={shortcut}
          toggle={toggle}
          checked={checked}
          destructive={destructive}
          disabled={disabled}
          hovered={hovered}
          setHovered={setHovered}
        />
      </>
    );
  }

  return (
    <MenuItemButton
      label={label}
      onClick={onClick}
      icon={icon}
      shortcut={shortcut}
      toggle={toggle}
      checked={checked}
      destructive={destructive}
      disabled={disabled}
      hovered={hovered}
      setHovered={setHovered}
    />
  );
};

// --- Internal button renderer ---

interface MenuItemButtonProps {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  shortcut?: string;
  toggle?: boolean;
  checked?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  hovered: boolean;
  setHovered: (v: boolean) => void;
}

const MenuItemButton: React.FC<MenuItemButtonProps> = ({
  label,
  onClick,
  icon,
  shortcut,
  toggle,
  checked,
  destructive,
  disabled,
  hovered,
  setHovered,
}) => {
  const computedStyle: React.CSSProperties = {
    ...itemStyle,
    ...(destructive ? destructiveBaseStyle : {}),
    ...(hovered && !disabled
      ? destructive
        ? destructiveHoveredStyle
        : hoveredItemStyle
      : {}),
    ...(disabled ? disabledItemStyle : {}),
  };

  const computedIconStyle: React.CSSProperties = {
    ...iconWrapperStyle,
    ...(destructive ? { color: "#F87171" } : {}),
    ...(hovered && !disabled && !destructive ? { color: "#FFFFFF" } : {}),
  };

  return (
    <button
      style={computedStyle}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
    >
      {icon && <span style={computedIconStyle}>{icon}</span>}

      <span style={labelContainerStyle}>{label}</span>

      {shortcut && <span style={shortcutStyle}>{shortcut}</span>}

      {toggle !== undefined && (
        <div
          style={{
            ...toggleTrackStyle,
            backgroundColor: checked ? "#7B61FF" : "rgba(255, 255, 255, 0.15)",
          }}
        >
          <div
            style={{
              ...toggleKnobStyle,
              left: checked ? 16 : 2,
            }}
          />
        </div>
      )}
    </button>
  );
};

export default MenuItem;
