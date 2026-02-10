import { useEffect } from "react";
import { FloatingHUD } from "./components/hud/FloatingHUD";
import { SettingsWindow } from "./components/settings/SettingsWindow";
import { AuthScreen } from "./components/auth/AuthScreen";
import { useSettingsStore } from "./stores/settingsStore";
import { useAuthStore } from "./stores/authStore";
import { useRecordingStore } from "./stores/recordingStore";

type View = "hud" | "settings" | "auth";

function App() {
  const theme = useSettingsStore((s) => s.settings.theme);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const view = useAppView();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  switch (view) {
    case "settings":
      return <SettingsWindow />;
    case "hud":
    default:
      return <FloatingHUD />;
  }
}

function useAppView(): View {
  // Determine which view to show based on window context
  // The Tauri backend controls which window is shown
  const searchParams = new URLSearchParams(window.location.search);
  const view = searchParams.get("view");

  if (view === "settings") return "settings";
  if (view === "auth") return "auth";
  return "hud";
}

export default App;
