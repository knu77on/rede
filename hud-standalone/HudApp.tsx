// ============================================================
// REDE HUD - Standalone Entry Point
// Self-contained HUD with demo simulation loop
//
// Usage:
//   import { HudApp } from "./hud-standalone/HudApp";
//   <HudApp />
//
// Or run the demo directly — all stores and hooks are included.
// No auth, no settings UI, no Supabase — just the HUD.
// ============================================================

import { useEffect, useState } from "react";
import { FloatingHUD } from "./components/FloatingHUD";
import { useHudVisibility } from "./hooks/useHudVisibility";
import { useHudFade, hudFadeKeyframes } from "./hooks/useHudFade";
import { startDemoLoop } from "./demo";

// --- HUD with Visibility + Fade ---

function HudWithVisibility({ alwaysVisible }: { alwaysVisible?: boolean }) {
  const visible = useHudVisibility();
  const shouldShow = alwaysVisible || visible;
  const { mounted, animating } = useHudFade(shouldShow);

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

// --- Demo Banner ---

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

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

// --- Main App ---

export function HudApp() {
  const [showBanner, setShowBanner] = useState(true);

  // Start demo simulation loop on mount
  useEffect(() => {
    const cleanup = startDemoLoop();
    return cleanup;
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        fontFamily: FONT,
        color: "#F5F5F7",
        background: `
          radial-gradient(ellipse at 20% 0%, rgba(229, 57, 53, 0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 100%, rgba(229, 57, 53, 0.02) 0%, transparent 50%),
          linear-gradient(180deg, #0E0E14 0%, #0A0A10 100%)
        `,
      }}
    >
      {showBanner && <DemoBanner onClose={() => setShowBanner(false)} />}
      <HudWithVisibility alwaysVisible />
    </div>
  );
}

export default HudApp;
