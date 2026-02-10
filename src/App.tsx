import { useEffect, useState } from "react";
import { FloatingHUD } from "./components/hud/FloatingHUD";
import { SettingsWindow } from "./components/settings/SettingsWindow";
import { AuthScreen } from "./components/auth/AuthScreen";
import { useSettingsStore } from "./stores/settingsStore";
import { useAuthStore } from "./stores/authStore";
import { isDemoMode, startDemoLoop } from "./demo";

type View = "hud" | "settings" | "auth";

function App() {
  const theme = useSettingsStore((s) => s.settings.theme);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const view = useAppView();
  const demo = isDemoMode();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Start demo simulation loop
  useEffect(() => {
    if (!demo) return;
    const cleanup = startDemoLoop();
    return cleanup;
  }, [demo]);

  // In demo mode, skip auth gate
  if (!demo && !isAuthenticated) {
    return <AuthScreen />;
  }

  switch (view) {
    case "settings":
      return <SettingsWindow />;
    case "auth":
      return <AuthScreen />;
    case "hud":
    default:
      return <DemoShell />;
  }
}

/** Wraps the HUD with a visible background and navigation for demo/dev */
function DemoShell() {
  const demo = isDemoMode();
  const [showNav, setShowNav] = useState(demo);

  if (!demo) {
    return <FloatingHUD />;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#08080C",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        gap: 32,
      }}
    >
      {showNav && <DemoBanner onClose={() => setShowNav(false)} />}
      <FloatingHUD />
      {showNav && <DemoNav />}
    </div>
  );
}

function DemoBanner({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 20px",
        borderRadius: 10,
        backgroundColor: "rgba(229, 57, 53, 0.08)",
        border: "1px solid rgba(229, 57, 53, 0.2)",
        color: "#E53935",
        fontSize: 13,
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <span style={{ fontWeight: 600 }}>DEMO MODE</span>
      <span style={{ color: "#8E8E9A" }}>
        Simulated recording &mdash; no microphone or APIs needed
      </span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#55555F",
          cursor: "pointer",
          fontSize: 16,
          marginLeft: 8,
          padding: 0,
        }}
      >
        &times;
      </button>
    </div>
  );
}

function DemoNav() {
  const [hovered, setHovered] = useState<string | null>(null);

  const linkStyle = (key: string): React.CSSProperties => ({
    padding: "8px 16px",
    borderRadius: 8,
    backgroundColor:
      hovered === key ? "rgba(229, 57, 53, 0.1)" : "rgba(255, 255, 255, 0.04)",
    border: `1px solid ${hovered === key ? "rgba(229, 57, 53, 0.2)" : "rgba(255, 255, 255, 0.06)"}`,
    color: hovered === key ? "#E53935" : "#8E8E9A",
    fontSize: 13,
    fontWeight: 500,
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });

  return (
    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
      <a
        href="/?demo"
        style={linkStyle("hud")}
        onMouseEnter={() => setHovered("hud")}
        onMouseLeave={() => setHovered(null)}
      >
        HUD View
      </a>
      <a
        href="/?demo&view=settings"
        style={linkStyle("settings")}
        onMouseEnter={() => setHovered("settings")}
        onMouseLeave={() => setHovered(null)}
      >
        Settings
      </a>
      <a
        href="/?demo&view=auth"
        style={linkStyle("auth")}
        onMouseEnter={() => setHovered("auth")}
        onMouseLeave={() => setHovered(null)}
      >
        Auth Screen
      </a>
      <a
        href="/"
        style={{ ...linkStyle("exit"), color: "#55555F" }}
        onMouseEnter={() => setHovered("exit")}
        onMouseLeave={() => setHovered(null)}
      >
        Exit Demo
      </a>
    </div>
  );
}

function useAppView(): View {
  const searchParams = new URLSearchParams(window.location.search);
  const view = searchParams.get("view");

  if (view === "settings") return "settings";
  if (view === "auth") return "auth";
  return "hud";
}

export default App;
