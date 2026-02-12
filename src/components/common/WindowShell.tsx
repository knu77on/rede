// ============================================================
// REDE - macOS Window Shell
// Shared chrome for all views: traffic lights, title bar, glass bg
// ============================================================

import { type CSSProperties, useState, type ReactNode } from "react";

// --- Types ---

interface WindowShellProps {
  children: ReactNode;
  /** Optional title shown centered in title bar */
  title?: string;
  /** If true, content area scrolls. Default true */
  scrollable?: boolean;
  /** Extra content rendered in the title bar to the right of the title */
  toolbar?: ReactNode;
  /** Whether to show the glass bg or transparent (for HUD overlay) */
  transparent?: boolean;
}

// --- Constants ---

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// --- Traffic Light Helpers ---

async function windowAction(action: "close" | "minimize" | "toggleMaximize") {
  try {
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    const win = getCurrentWindow();
    switch (action) {
      case "close": await win.close(); break;
      case "minimize": await win.minimize(); break;
      case "toggleMaximize": {
        const maximized = await win.isMaximized();
        if (maximized) await win.unmaximize();
        else await win.maximize();
        break;
      }
    }
  } catch {
    // Browser/demo — no-op
  }
}

// --- Traffic Light Component ---

const LIGHT_SIZE = 12;
const LIGHT_GAP = 8;

const trafficLightColors = {
  close: { bg: "#FF5F57", hover: "#FF3B30" },
  minimize: { bg: "#FEBC2E", hover: "#FFB800" },
  maximize: { bg: "#28C840", hover: "#00D632" },
};

function TrafficLight({ type, onClick }: { type: "close" | "minimize" | "maximize"; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const colors = trafficLightColors[type];

  const icons: Record<string, string> = {
    close: "\u2715",
    minimize: "\u2013",
    maximize: "\u2B1A",
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: LIGHT_SIZE,
        height: LIGHT_SIZE,
        borderRadius: "50%",
        backgroundColor: hovered ? colors.hover : colors.bg,
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 7,
        fontWeight: 700,
        color: hovered ? "rgba(0, 0, 0, 0.5)" : "transparent",
        transition: "all 0.1s ease",
        lineHeight: 1,
        outline: "none",
      }}
      title={type === "close" ? "Close" : type === "minimize" ? "Minimize" : "Fullscreen"}
    >
      {icons[type]}
    </button>
  );
}

function TrafficLights() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: LIGHT_GAP, flexShrink: 0 }}>
      <TrafficLight type="close" onClick={() => windowAction("close")} />
      <TrafficLight type="minimize" onClick={() => windowAction("minimize")} />
      <TrafficLight type="maximize" onClick={() => windowAction("toggleMaximize")} />
    </div>
  );
}

// --- Styles ---

const shellStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100vh",
  fontFamily: FONT,
  color: "#F5F5F7",
  overflow: "hidden",
  // Subtle noise texture via radial gradient
  background: `
    radial-gradient(ellipse at 20% 0%, rgba(229, 57, 53, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, rgba(229, 57, 53, 0.02) 0%, transparent 50%),
    linear-gradient(180deg, #0E0E14 0%, #0A0A10 100%)
  `,
};

const shellTransparentStyle: CSSProperties = {
  ...shellStyle,
  background: "transparent",
  backgroundColor: "transparent",
};

const titleBarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  height: 48,
  minHeight: 48,
  userSelect: "none",
  // Draggable region for Tauri
  // @ts-expect-error Tauri specific CSS
  WebkitAppRegion: "drag",
  position: "relative",
  zIndex: 10,
  borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
  backgroundColor: "rgba(14, 14, 20, 0.6)",
  backdropFilter: "blur(24px) saturate(1.3)",
  WebkitBackdropFilter: "blur(24px) saturate(1.3)",
};

const titleBarButtonsStyle: CSSProperties = {
  // Buttons are not draggable
  // @ts-expect-error Tauri specific CSS
  WebkitAppRegion: "no-drag",
};

const titleTextStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: 12,
  fontWeight: 600,
  color: "#8E8E9A",
  letterSpacing: "-0.01em",
  pointerEvents: "none",
};

const toolbarAreaStyle: CSSProperties = {
  marginLeft: "auto",
  // @ts-expect-error Tauri specific CSS
  WebkitAppRegion: "no-drag",
};

const contentWrapperStyle: CSSProperties = {
  flex: 1,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const contentScrollStyle: CSSProperties = {
  flex: 1,
  overflow: "auto",
};

// --- Component ---

export function WindowShell({ children, title, scrollable = true, toolbar, transparent = false }: WindowShellProps) {
  return (
    <div style={transparent ? shellTransparentStyle : shellStyle}>
      {/* Title bar with traffic lights */}
      <div style={titleBarStyle}>
        <div style={titleBarButtonsStyle}>
          <TrafficLights />
        </div>
        {title && <span style={titleTextStyle}>{title}</span>}
        {toolbar && <div style={toolbarAreaStyle}>{toolbar}</div>}
      </div>

      {/* Content area */}
      <div style={scrollable ? contentScrollStyle : contentWrapperStyle}>
        {children}
      </div>
    </div>
  );
}
