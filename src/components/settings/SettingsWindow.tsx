// ============================================================
// REDE - Settings Window
// macOS System Settings–inspired layout with centered toolbar
// ============================================================

import { type CSSProperties, useState, useCallback } from "react";
import { GeneralTab } from "./tabs/GeneralTab";
import { VoiceTab } from "./tabs/VoiceTab";
import { ProcessingTab } from "./tabs/ProcessingTab";
import { PrivacyTab } from "./tabs/PrivacyTab";
import { AccountTab } from "./tabs/AccountTab";

// --- Types ---

type TabId = "general" | "voice" | "processing" | "privacy" | "account";

interface TabDef {
  id: TabId;
  label: string;
}

// --- Constants ---

const TABS: TabDef[] = [
  { id: "general", label: "General" },
  { id: "voice", label: "Voice" },
  { id: "processing", label: "Processing" },
  { id: "privacy", label: "Privacy" },
  { id: "account", label: "Account" },
];

// --- Styles ---

const windowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100vh",
  backgroundColor: "#0E0E12",
  color: "#F5F5F7",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  overflow: "hidden",
};

// Toolbar — tab bar aligned with content column
const toolbarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 24px",
  height: 52,
  minHeight: 52,
  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
  backgroundColor: "rgba(14, 14, 18, 0.95)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  userSelect: "none",
};

// Inner container matches content max-width for alignment
const toolbarInnerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: 560,
};

const toolbarTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#F5F5F7",
  letterSpacing: "-0.01em",
};

const tabBarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  backgroundColor: "rgba(255, 255, 255, 0.04)",
  borderRadius: 7,
  padding: 2,
};

const tabStyle: CSSProperties = {
  padding: "5px 14px",
  borderRadius: 5,
  border: "none",
  backgroundColor: "transparent",
  color: "#8E8E9A",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.12s ease",
  fontFamily: "inherit",
  whiteSpace: "nowrap",
};

const tabActiveStyle: CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  color: "#F5F5F7",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.15)",
};

const tabHoverStyle: CSSProperties = {
  color: "#CCCCD0",
};

const contentStyle: CSSProperties = {
  flex: 1,
  overflow: "auto",
  display: "flex",
  justifyContent: "center",
};

const contentInnerStyle: CSSProperties = {
  width: "100%",
  maxWidth: 560,
  padding: "28px 32px 48px",
};

// --- Component ---

export function SettingsWindow() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);

  const handleTabClick = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralTab />;
      case "voice":
        return <VoiceTab />;
      case "processing":
        return <ProcessingTab />;
      case "privacy":
        return <PrivacyTab />;
      case "account":
        return <AccountTab />;
      default:
        return null;
    }
  };

  return (
    <div style={windowStyle}>
      {/* Toolbar — title and tabs aligned with content column */}
      <div style={toolbarStyle}>
        <div style={toolbarInnerStyle}>
          <span style={toolbarTitleStyle}>Settings</span>
          <div style={tabBarStyle}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const isHovered = hoveredTab === tab.id && !isActive;
              return (
                <button
                  key={tab.id}
                  style={{
                    ...tabStyle,
                    ...(isActive ? tabActiveStyle : {}),
                    ...(isHovered ? tabHoverStyle : {}),
                  }}
                  onClick={() => handleTabClick(tab.id)}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        <div style={contentInnerStyle}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
