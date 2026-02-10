// ============================================================
// REDE - Color Palette & Theme
// Premium design system — REDE Red brand identity
// ============================================================

export const colors = {
  dark: {
    bg: {
      primary: "rgba(12, 12, 16, 0.97)",
      secondary: "rgba(20, 20, 26, 0.97)",
      tertiary: "rgba(28, 28, 36, 0.95)",
      overlay: "rgba(0, 0, 0, 0.6)",
      elevated: "rgba(32, 32, 40, 0.98)",
    },
    text: {
      primary: "#F5F5F7",
      secondary: "#8E8E9A",
      tertiary: "#55555F",
      accent: "#E53935",
    },
    accent: {
      primary: "#E53935",
      secondary: "#C62828",
      hover: "#EF5350",
      success: "#4CAF50",
      warning: "#FF9800",
      error: "#F44336",
    },
    border: {
      primary: "rgba(255, 255, 255, 0.07)",
      secondary: "rgba(255, 255, 255, 0.04)",
      accent: "rgba(229, 57, 53, 0.3)",
    },
    glow: {
      recording: "rgba(229, 57, 53, 0.45)",
      processing: "rgba(76, 175, 80, 0.4)",
      error: "rgba(244, 67, 54, 0.4)",
    },
  },
  light: {
    bg: {
      primary: "rgba(255, 255, 255, 0.97)",
      secondary: "rgba(248, 248, 250, 0.97)",
      tertiary: "rgba(240, 240, 244, 0.95)",
      overlay: "rgba(0, 0, 0, 0.25)",
      elevated: "rgba(255, 255, 255, 0.98)",
    },
    text: {
      primary: "#1A1A24",
      secondary: "#6E6E7A",
      tertiary: "#9E9EA8",
      accent: "#C62828",
    },
    accent: {
      primary: "#E53935",
      secondary: "#C62828",
      hover: "#EF5350",
      success: "#43A047",
      warning: "#EF6C00",
      error: "#D32F2F",
    },
    border: {
      primary: "rgba(0, 0, 0, 0.07)",
      secondary: "rgba(0, 0, 0, 0.04)",
      accent: "rgba(229, 57, 53, 0.25)",
    },
    glow: {
      recording: "rgba(229, 57, 53, 0.35)",
      processing: "rgba(76, 175, 80, 0.3)",
      error: "rgba(244, 67, 54, 0.3)",
    },
  },
} as const;

export type ThemeColors = (typeof colors)["dark"] | (typeof colors)["light"];

export function getThemeColors(theme: "dark" | "light") {
  return colors[theme];
}

// Brand constants
export const REDE_RED = "#E53935";
export const REDE_RED_DEEP = "#C62828";
export const REDE_RED_LIGHT = "#EF5350";
export const REDE_GREEN = "#4CAF50";
