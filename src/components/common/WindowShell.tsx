// ============================================================
// REDE - Window Shell
// Refined macOS chrome with depth and ambient warmth
// ============================================================

import { type CSSProperties, useState, type ReactNode } from "react";

// --- Types ---

interface WindowShellProps {
  children: ReactNode;
  title?: string;
  toolbar?: ReactNode;
  transparent?: boolean;
}

// --- Traffic Lights ---

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

const trafficColors = {
  close: { bg: "#FF5F57", hover: "#FF3B30" },
  minimize: { bg: "#FEBC2E", hover: "#FFB800" },
  maximize: { bg: "#28C840", hover: "#00D632" },
};

function TrafficLight({ type, onClick }: { type: "close" | "minimize" | "maximize"; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const colors = trafficColors[type];
  const icons: Record<string, string> = { close: "\u2715", minimize: "\u2013", maximize: "\u2B1A" };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 12,
        height: 12,
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
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
      <TrafficLight type="close" onClick={() => windowAction("close")} />
      <TrafficLight type="minimize" onClick={() => windowAction("minimize")} />
      <TrafficLight type="maximize" onClick={() => windowAction("toggleMaximize")} />
    </div>
  );
}

// --- Styles ---

const noDrag: CSSProperties = {
  // @ts-expect-error Tauri no-drag
  WebkitAppRegion: "no-drag",
};

const shellStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100vh",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  color: "#EAEAEF",
  overflow: "hidden",
  background: `
    radial-gradient(ellipse at 30% -10%, rgba(229, 57, 53, 0.04) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 110%, rgba(229, 57, 53, 0.025) 0%, transparent 60%),
    linear-gradient(180deg, #0C0C14 0%, #09090F 100%)
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
  height: 42,
  minHeight: 42,
  flexShrink: 0,
  userSelect: "none",
  // @ts-expect-error Tauri draggable region
  WebkitAppRegion: "drag",
  position: "relative",
  zIndex: 10,
  borderBottom: "1px solid rgba(255, 255, 255, 0.035)",
  backgroundColor: "rgba(12, 12, 18, 0.7)",
  backdropFilter: "blur(20px) saturate(1.4)",
  WebkitBackdropFilter: "blur(20px) saturate(1.4)",
};

const titleTextStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: 12,
  fontWeight: 600,
  color: "#5A5A66",
  letterSpacing: "-0.01em",
  pointerEvents: "none",
};

const toolbarStyle: CSSProperties = {
  ...noDrag,
  marginLeft: "auto",
};

const contentStyle: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  display: "flex",
  flexDirection: "column",
};

// --- Component ---

export function WindowShell({ children, title, toolbar, transparent = false }: WindowShellProps) {
  return (
    <div style={transparent ? shellTransparentStyle : shellStyle}>
      <div style={titleBarStyle}>
        <div style={noDrag}>
          <TrafficLights />
        </div>
        {title && <span style={titleTextStyle}>{title}</span>}
        {toolbar && <div style={toolbarStyle}>{toolbar}</div>}
      </div>
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
}
