// ============================================================
// REDE - Authentication Screen
// Immersive dark aesthetic with breathing waveform logo,
// gradient tagline, and elegant card layout
// ============================================================

import React from "react";
import { useAuthStore } from "../../stores/authStore";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { Button } from "../common/Button";
import { WindowShell } from "../common/WindowShell";

type AuthTab = "login" | "register";

// --- Keyframes ---

const authKeyframes = `
@keyframes rede-wave-1 {
  0%, 100% { height: 14px; }
  50% { height: 24px; }
}
@keyframes rede-wave-2 {
  0%, 100% { height: 22px; }
  50% { height: 10px; }
}
@keyframes rede-wave-3 {
  0%, 100% { height: 18px; }
  50% { height: 28px; }
}
@keyframes rede-ambient-pulse {
  0%, 100% { opacity: 0.04; }
  50% { opacity: 0.07; }
}
`;

// --- Waveform Logo ---

function WaveformLogo() {
  const barBase: React.CSSProperties = {
    width: 4,
    borderRadius: 2,
    background: "linear-gradient(180deg, #EF4444 0%, #E53935 100%)",
  };

  return (
    <div style={{
      width: 48,
      height: 48,
      borderRadius: 14,
      background: "linear-gradient(135deg, rgba(229,57,53,0.15) 0%, rgba(229,57,53,0.06) 100%)",
      border: "1px solid rgba(229,57,53,0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
      boxShadow: "0 4px 20px rgba(229,57,53,0.12)",
    }}>
      <div style={{ ...barBase, animation: "rede-wave-1 2s ease-in-out infinite" }} />
      <div style={{ ...barBase, animation: "rede-wave-2 2s ease-in-out 0.3s infinite" }} />
      <div style={{ ...barBase, animation: "rede-wave-3 2s ease-in-out 0.6s infinite" }} />
    </div>
  );
}

// --- OAuth Icons ---

const appleIcon = (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
    <path d="M14.94 13.046c-.287.66-.624 1.268-1.013 1.826-.53.76-.963 1.286-1.297 1.578-.518.48-1.073.726-1.667.74-.426 0-.94-.121-1.54-.367-.601-.245-1.154-.366-1.66-.366-.53 0-1.098.121-1.706.366-.609.246-1.1.374-1.476.388-.57.026-1.138-.228-1.706-.762-.361-.316-.813-.858-1.354-1.626-.58-.822-1.057-1.775-1.432-2.862C.697 10.556.5 9.176.5 7.84c0-1.534.332-2.856.996-3.963A5.834 5.834 0 0 1 3.584 1.79 5.597 5.597 0 0 1 6.29.965c.452 0 1.045.14 1.782.414.734.275 1.207.415 1.416.415.156 0 .686-.163 1.582-.49.847-.303 1.562-.429 2.148-.38 1.588.129 2.78.756 3.574 1.886-1.42.86-2.122 2.065-2.107 3.612.014 1.205.45 2.208 1.307 3.006.389.37.822.655 1.304.858-.105.303-.215.594-.333.87l-.023-.09ZM11.684.37c0 .944-.345 1.826-1.032 2.64-.83.972-1.834 1.534-2.922 1.445a2.944 2.944 0 0 1-.022-.358c0-.907.395-1.878 1.096-2.672.35-.401.796-.735 1.337-1.002.54-.264 1.05-.41 1.53-.44.015.13.022.259.013.387Z" fill="currentColor"/>
  </svg>
);

const googleIcon = (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
  </svg>
);

// --- Component ---

export const AuthScreen: React.FC = () => {
  const { login, loginWithOAuth, register, isLoading, error, clearError } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState<AuthTab>("login");
  const [hoveredTab, setHoveredTab] = React.useState<AuthTab | null>(null);

  const handleLogin = async (email: string, password: string) => {
    clearError();
    try { await login(email, password); } catch { /* store */ }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    clearError();
    try { await register(name, email, password); } catch { /* store */ }
  };

  const handleOAuth = async (provider: "apple" | "google") => {
    clearError();
    try { await loginWithOAuth(provider); } catch { /* store */ }
  };

  const handleTabSwitch = (tab: AuthTab) => {
    clearError();
    setActiveTab(tab);
  };

  const getTabStyle = (tab: AuthTab): React.CSSProperties => {
    const isActive = tab === activeTab;
    const isHov = tab === hoveredTab && !isActive;
    return {
      flex: 1,
      padding: "7px 0",
      fontSize: 12,
      fontWeight: 600,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      border: "none",
      borderRadius: 7,
      cursor: "pointer",
      transition: "all 120ms ease",
      textAlign: "center",
      userSelect: "none",
      letterSpacing: "-0.01em",
      backgroundColor: isActive ? "rgba(255, 255, 255, 0.07)" : "transparent",
      color: isActive ? "#EAEAEF" : isHov ? "#7A7A88" : "#4A4A56",
      boxShadow: isActive
        ? "0 1px 3px rgba(0, 0, 0, 0.25), inset 0 0.5px 0 rgba(255, 255, 255, 0.04)"
        : "none",
    };
  };

  return (
    <WindowShell title="REDE">
      <style>{authKeyframes}</style>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: "28px 24px 40px",
        position: "relative",
      }}>
        {/* Ambient glow */}
        <div style={{
          position: "absolute",
          bottom: -60,
          left: "50%",
          transform: "translateX(-50%)",
          width: 300,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(229,57,53,0.06) 0%, transparent 70%)",
          animation: "rede-ambient-pulse 4s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        <div style={{
          width: "100%",
          maxWidth: 340,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          position: "relative",
          zIndex: 1,
        }}>
          {/* Logo + Branding */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            marginBottom: 2,
          }}>
            <WaveformLogo />
            <h1 style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#EAEAEF",
              letterSpacing: "-0.03em",
              margin: 0,
            }}>
              REDE
            </h1>
            <p style={{
              fontSize: 13,
              fontWeight: 400,
              color: "#5A5A66",
              textAlign: "center",
              lineHeight: "18px",
              margin: 0,
              letterSpacing: "-0.01em",
            }}>
              Your voice, perfected.
            </p>
          </div>

          {/* Tab Toggle */}
          <div style={{
            display: "flex",
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.025)",
            borderRadius: 9,
            padding: 3,
          }}>
            <button
              style={getTabStyle("login")}
              onClick={() => handleTabSwitch("login")}
              onMouseEnter={() => setHoveredTab("login")}
              onMouseLeave={() => setHoveredTab(null)}
            >
              Sign In
            </button>
            <button
              style={getTabStyle("register")}
              onClick={() => handleTabSwitch("register")}
              onMouseEnter={() => setHoveredTab("register")}
              onMouseLeave={() => setHoveredTab(null)}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <div style={{ width: "100%" }}>
            {activeTab === "login" ? (
              <LoginForm
                onSubmit={handleLogin}
                onForgotPassword={() => console.log("Navigate to forgot password")}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={error} />
            )}
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%" }}>
            <div style={{ flex: 1, height: 1, backgroundColor: "rgba(255, 255, 255, 0.04)" }} />
            <span style={{ fontSize: 11, color: "#3A3A44", whiteSpace: "nowrap", userSelect: "none" }}>
              or continue with
            </span>
            <div style={{ flex: 1, height: 1, backgroundColor: "rgba(255, 255, 255, 0.04)" }} />
          </div>

          {/* OAuth — side by side */}
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              icon={appleIcon}
              onClick={() => handleOAuth("apple")}
              disabled={isLoading}
            >
              Apple
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              icon={googleIcon}
              onClick={() => handleOAuth("google")}
              disabled={isLoading}
            >
              Google
            </Button>
          </div>
        </div>
      </div>
    </WindowShell>
  );
};

export default AuthScreen;
