import { useEffect, useState, useCallback, useRef } from "react";
import { FloatingHUD } from "./components/hud/FloatingHUD";
import { SettingsWindow } from "./components/settings/SettingsWindow";
import { AuthScreen } from "./components/auth/AuthScreen";
import { WindowShell } from "./components/common/WindowShell";
import { useSettingsStore } from "./stores/settingsStore";
import { useAuthStore } from "./stores/authStore";
import { useRecordingStore } from "./stores/recordingStore";
import { useHistoryStore } from "./stores/historyStore";
import { isDemoMode, startDemoLoop } from "./demo";

type View = "hud" | "settings" | "auth";

function App() {
  const theme = useSettingsStore((s) => s.settings.theme);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const urlView = useAppView();
  const demo = isDemoMode();
  const [view, setView] = useState<View>(urlView);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Start demo simulation loop
  useEffect(() => {
    if (!demo) return;
    const cleanup = startDemoLoop();
    return cleanup;
  }, [demo]);

  // Feed completed dictations into history store
  useDictationHistory();

  // In demo mode, skip auth gate
  if (!demo && !isAuthenticated) {
    return <AuthScreen />;
  }

  if (view === "settings") {
    return <SettingsWindow onClose={() => setView("hud")} />;
  }

  if (view === "auth") {
    return <AuthScreen />;
  }

  return (
    <DemoShell onOpenSettings={() => setView("settings")} />
  );
}

// --- Hook: Feed dictations into history ---

function useDictationHistory() {
  const transcription = useRecordingStore((s) => s.transcription);
  const duration = useRecordingStore((s) => s.duration);
  const wordCount = useRecordingStore((s) => s.wordCount);
  const addEntry = useHistoryStore((s) => s.addEntry);
  const lastTextRef = useRef("");

  useEffect(() => {
    if (!transcription || transcription === lastTextRef.current) return;
    lastTextRef.current = transcription;

    const timer = setTimeout(() => {
      const currentCorrection = useRecordingStore.getState().correction;
      addEntry({
        text: transcription,
        originalText: currentCorrection?.original ?? null,
        wasCorrected: !!currentCorrection,
        wordCount,
        duration,
        createdAt: Date.now(),
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [transcription, addEntry, wordCount, duration]);
}

// --- Hook: Control key HUD activation ---

function useHudVisibility() {
  const [visible, setVisible] = useState(false);
  const activationMode = useSettingsStore((s) => s.settings.activation_mode);
  const controlTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastControlRef = useRef(0);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Control") return;

      if (activationMode === "push") {
        show();
      } else {
        const now = Date.now();
        if (now - lastControlRef.current < 400) {
          setVisible((prev) => !prev);
          lastControlRef.current = 0;
        } else {
          lastControlRef.current = now;
        }
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (e.key !== "Control") return;
      if (activationMode === "push") {
        if (controlTimerRef.current) clearTimeout(controlTimerRef.current);
        controlTimerRef.current = setTimeout(hide, 200);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (controlTimerRef.current) clearTimeout(controlTimerRef.current);
    };
  }, [activationMode, show, hide]);

  const recordingState = useRecordingStore((s) => s.state);
  const transcription = useRecordingStore((s) => s.transcription);

  useEffect(() => {
    if (recordingState === "recording" || recordingState === "processing") {
      show();
    }
  }, [recordingState, show]);

  useEffect(() => {
    if (!transcription) return;
    show();
    const timer = setTimeout(hide, 5000);
    return () => clearTimeout(timer);
  }, [transcription, show, hide]);

  return visible;
}

// --- HUD Wrapper with fade ---

const hudFadeKeyframes = `
@keyframes rede-hud-fadein {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes rede-hud-fadeout {
  from { opacity: 1; transform: scale(1) translateY(0); }
  to { opacity: 0; transform: scale(0.95) translateY(8px); }
}
`;

function HudWithVisibility({ alwaysVisible }: { alwaysVisible?: boolean }) {
  const visible = useHudVisibility();
  const shouldShow = alwaysVisible || visible;
  const [mounted, setMounted] = useState(shouldShow);
  const [animating, setAnimating] = useState<"in" | "out" | null>(null);

  useEffect(() => {
    if (shouldShow && !mounted) {
      setMounted(true);
      setAnimating("in");
    } else if (!shouldShow && mounted) {
      setAnimating("out");
      const timer = setTimeout(() => {
        setMounted(false);
        setAnimating(null);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [shouldShow, mounted]);

  useEffect(() => {
    if (animating === "in") {
      const timer = setTimeout(() => setAnimating(null), 250);
      return () => clearTimeout(timer);
    }
  }, [animating]);

  if (!mounted) return <style>{hudFadeKeyframes}</style>;

  return (
    <>
      <style>{hudFadeKeyframes}</style>
      <div
        style={{
          animation: animating === "in"
            ? "rede-hud-fadein 250ms ease-out forwards"
            : animating === "out"
            ? "rede-hud-fadeout 250ms ease-out forwards"
            : undefined,
        }}
      >
        <FloatingHUD />
      </div>
    </>
  );
}

// --- Demo Shell ---

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

function DemoShell({ onOpenSettings }: { onOpenSettings: () => void }) {
  const demo = isDemoMode();
  const [showNav, setShowNav] = useState(true);

  if (!demo) {
    return (
      <WindowShell transparent>
        <HudWithVisibility />
      </WindowShell>
    );
  }

  return (
    <WindowShell title="REDE" scrollable={false}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          fontFamily: FONT,
        }}
      >
        {showNav && <DemoBanner onClose={() => setShowNav(false)} />}
        <HudWithVisibility alwaysVisible />
        {showNav && <DemoNav onOpenSettings={onOpenSettings} />}
      </div>
    </WindowShell>
  );
}

function DemoBanner({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 16px",
        borderRadius: 8,
        backgroundColor: "rgba(229, 57, 53, 0.06)",
        border: "1px solid rgba(229, 57, 53, 0.15)",
        color: "#E53935",
        fontSize: 12,
        fontFamily: FONT,
      }}
    >
      <span style={{ fontWeight: 600 }}>DEMO MODE</span>
      <span style={{ color: "#6E6E7A" }}>
        Simulated recording &mdash; no microphone or APIs needed
      </span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#55555F",
          cursor: "pointer",
          fontSize: 14,
          marginLeft: 4,
          padding: 0,
        }}
      >
        &times;
      </button>
    </div>
  );
}

function DemoNav({ onOpenSettings }: { onOpenSettings: () => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const linkStyle = (key: string): React.CSSProperties => ({
    padding: "7px 14px",
    borderRadius: 7,
    backgroundColor:
      hovered === key ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.03)",
    border: `1px solid ${hovered === key ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)"}`,
    color: hovered === key ? "#F5F5F7" : "#6E6E7A",
    fontSize: 12,
    fontWeight: 500,
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.12s ease",
    fontFamily: FONT,
  });

  return (
    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
      <button
        style={linkStyle("settings")}
        onClick={onOpenSettings}
        onMouseEnter={() => setHovered("settings")}
        onMouseLeave={() => setHovered(null)}
      >
        Settings
      </button>
      <a
        href="/?demo&view=auth"
        style={linkStyle("auth")}
        onMouseEnter={() => setHovered("auth")}
        onMouseLeave={() => setHovered(null)}
      >
        Auth Screen
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
