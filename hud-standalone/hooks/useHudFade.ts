// ============================================================
// REDE HUD - HUD Fade Hook (Standalone)
// Manages mount/unmount with 250ms fade in/out animations
// ============================================================

import { useState, useEffect } from "react";

export const hudFadeKeyframes = `
@keyframes rede-hud-fadein {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes rede-hud-fadeout {
  from { opacity: 1; transform: scale(1) translateY(0); }
  to { opacity: 0; transform: scale(0.95) translateY(8px); }
}
`;

interface HudFadeState {
  mounted: boolean;
  animating: "in" | "out" | null;
}

export function useHudFade(shouldShow: boolean): HudFadeState {
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

  return { mounted, animating };
}
