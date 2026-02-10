// ============================================================
// REDE - Color Palette & Theme
// ============================================================

export const colors = {
  dark: {
    bg: {
      primary: "rgba(18, 18, 22, 0.95)",
      secondary: "rgba(28, 28, 35, 0.95)",
      tertiary: "rgba(38, 38, 48, 0.9)",
      overlay: "rgba(0, 0, 0, 0.5)",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A0A0B0",
      tertiary: "#606070",
      accent: "#7B61FF",
    },
    accent: {
      primary: "#7B61FF",
      secondary: "#5B41DF",
      success: "#34D399",
      warning: "#FBBF24",
      error: "#F87171",
    },
    border: {
      primary: "rgba(255, 255, 255, 0.08)",
      secondary: "rgba(255, 255, 255, 0.04)",
    },
    glow: {
      recording: "rgba(123, 97, 255, 0.4)",
      processing: "rgba(52, 211, 153, 0.4)",
      error: "rgba(248, 113, 113, 0.4)",
    },
  },
  light: {
    bg: {
      primary: "rgba(255, 255, 255, 0.95)",
      secondary: "rgba(245, 245, 250, 0.95)",
      tertiary: "rgba(235, 235, 242, 0.9)",
      overlay: "rgba(0, 0, 0, 0.3)",
    },
    text: {
      primary: "#1A1A2E",
      secondary: "#5A5A70",
      tertiary: "#9A9AB0",
      accent: "#7B61FF",
    },
    accent: {
      primary: "#7B61FF",
      secondary: "#5B41DF",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
    border: {
      primary: "rgba(0, 0, 0, 0.08)",
      secondary: "rgba(0, 0, 0, 0.04)",
    },
    glow: {
      recording: "rgba(123, 97, 255, 0.3)",
      processing: "rgba(16, 185, 129, 0.3)",
      error: "rgba(239, 68, 68, 0.3)",
    },
  },
} as const;

export type ThemeColors = (typeof colors)["dark"];

export function getThemeColors(theme: "dark" | "light"): ThemeColors {
  return colors[theme];
}
