// ============================================================
// REDE - Main Authentication Screen
// macOS native glass aesthetic with WindowShell
// ============================================================

import React from "react";
import { useAuthStore } from "../../stores/authStore";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { Button } from "../common/Button";
import { WindowShell } from "../common/WindowShell";

// --- Types ---

type AuthTab = "login" | "register";

// --- Font ---

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// --- Styles ---

const contentStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  padding: "24px 32px 32px",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 380,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 20,
};

const brandingStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  marginBottom: 4,
};

const logoStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 12,
  backgroundColor: "#E53935",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 16px rgba(229, 57, 53, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.06) inset",
};

const logoTextStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: "#FFFFFF",
  letterSpacing: -0.5,
  fontFamily: FONT,
};

const appNameStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: "#F5F5F7",
  letterSpacing: "-0.02em",
  margin: 0,
  fontFamily: FONT,
};

const taglineStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#6E6E7A",
  textAlign: "center",
  lineHeight: "18px",
  margin: 0,
  fontFamily: FONT,
};

const tabBarStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  borderRadius: 8,
  padding: 2,
  border: "1px solid rgba(255, 255, 255, 0.04)",
};

const tabBaseStyle: React.CSSProperties = {
  flex: 1,
  padding: "7px 0",
  fontSize: 13,
  fontWeight: 500,
  fontFamily: FONT,
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  transition: "all 120ms ease",
  textAlign: "center",
  userSelect: "none",
};

const activeTabStyle: React.CSSProperties = {
  ...tabBaseStyle,
  backgroundColor: "rgba(255, 255, 255, 0.07)",
  color: "#F5F5F7",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
};

const inactiveTabStyle: React.CSSProperties = {
  ...tabBaseStyle,
  backgroundColor: "transparent",
  color: "#55555F",
};

const formContainerStyle: React.CSSProperties = {
  width: "100%",
};

const dividerContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
};

const dividerLineStyle: React.CSSProperties = {
  flex: 1,
  height: 1,
  backgroundColor: "rgba(255, 255, 255, 0.05)",
};

const dividerTextStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#55555F",
  fontFamily: FONT,
  whiteSpace: "nowrap",
  userSelect: "none",
};

const oauthGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  width: "100%",
};

// --- OAuth Icons ---

const appleIconSvg = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.94 13.046c-.287.66-.624 1.268-1.013 1.826-.53.76-.963 1.286-1.297 1.578-.518.48-1.073.726-1.667.74-.426 0-.94-.121-1.54-.367-.601-.245-1.154-.366-1.66-.366-.53 0-1.098.121-1.706.366-.609.246-1.1.374-1.476.388-.57.026-1.138-.228-1.706-.762-.361-.316-.813-.858-1.354-1.626-.58-.822-1.057-1.775-1.432-2.862C.697 10.556.5 9.176.5 7.84c0-1.534.332-2.856.996-3.963A5.834 5.834 0 0 1 3.584 1.79 5.597 5.597 0 0 1 6.29.965c.452 0 1.045.14 1.782.414.734.275 1.207.415 1.416.415.156 0 .686-.163 1.582-.49.847-.303 1.562-.429 2.148-.38 1.588.129 2.78.756 3.574 1.886-1.42.86-2.122 2.065-2.107 3.612.014 1.205.45 2.208 1.307 3.006.389.37.822.655 1.304.858-.105.303-.215.594-.333.87l-.023-.09ZM11.684.37c0 .944-.345 1.826-1.032 2.64-.83.972-1.834 1.534-2.922 1.445a2.944 2.944 0 0 1-.022-.358c0-.907.395-1.878 1.096-2.672.35-.401.796-.735 1.337-1.002.54-.264 1.05-.41 1.53-.44.015.13.022.259.013.387Z"
      fill="currentColor"
    />
  </svg>
);

const googleIconSvg = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
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

  const getTabStyle = (tab: AuthTab): React.CSSProperties => {
    if (tab === activeTab) return activeTabStyle;
    if (tab === hoveredTab) return { ...inactiveTabStyle, color: "#8E8E9A" };
    return inactiveTabStyle;
  };

  const handleLogin = async (email: string, password: string) => {
    clearError();
    try { await login(email, password); } catch { /* store handles error */ }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    clearError();
    try { await register(name, email, password); } catch { /* store handles error */ }
  };

  const handleForgotPassword = () => {
    console.log("Navigate to forgot password");
  };

  const handleAppleAuth = async () => {
    clearError();
    try { await loginWithOAuth("apple"); } catch { /* store handles error */ }
  };

  const handleGoogleAuth = async () => {
    clearError();
    try { await loginWithOAuth("google"); } catch { /* store handles error */ }
  };

  const handleTabSwitch = (tab: AuthTab) => {
    clearError();
    setActiveTab(tab);
  };

  return (
    <WindowShell title="REDE" scrollable={false}>
      <div style={contentStyle}>
        <div style={cardStyle}>
          {/* Branding */}
          <div style={brandingStyle}>
            <div style={logoStyle}>
              <span style={logoTextStyle}>R</span>
            </div>
            <h1 style={appNameStyle}>REDE</h1>
            <p style={taglineStyle}>
              Voice dictation that thinks before it types
            </p>
          </div>

          {/* Tab Toggle */}
          <div style={tabBarStyle}>
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
          <div style={formContainerStyle}>
            {activeTab === "login" ? (
              <LoginForm
                onSubmit={handleLogin}
                onForgotPassword={handleForgotPassword}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <RegisterForm
                onSubmit={handleRegister}
                isLoading={isLoading}
                error={error}
              />
            )}
          </div>

          {/* OAuth divider */}
          <div style={dividerContainerStyle}>
            <div style={dividerLineStyle} />
            <span style={dividerTextStyle}>
              {activeTab === "login" ? "or continue with" : "or sign up with"}
            </span>
            <div style={dividerLineStyle} />
          </div>

          {/* OAuth buttons */}
          <div style={oauthGroupStyle}>
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              icon={appleIconSvg}
              onClick={handleAppleAuth}
              disabled={isLoading}
            >
              {activeTab === "login" ? "Sign in with Apple" : "Sign up with Apple"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              icon={googleIconSvg}
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              {activeTab === "login" ? "Sign in with Google" : "Sign up with Google"}
            </Button>
          </div>
        </div>
      </div>
    </WindowShell>
  );
};

export default AuthScreen;
