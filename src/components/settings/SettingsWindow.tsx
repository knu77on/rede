// ============================================================
// REDE - Settings Window
// Uses shared WindowShell with tabs in toolbar area
// ============================================================

import { type CSSProperties, useState, useCallback } from "react";
import { GeneralTab } from "./tabs/GeneralTab";
import { VoiceTab } from "./tabs/VoiceTab";
import { ProcessingTab } from "./tabs/ProcessingTab";
import { PrivacyTab } from "./tabs/PrivacyTab";
import { AccountTab } from "./tabs/AccountTab";
import { WindowShell } from "../common/WindowShell";

interface SettingsWindowProps {
  onClose?: () => void;
}

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
  backgroundColor: "rgba(255, 255, 255, 0.07)",
  color: "#F5F5F7",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
};

const tabHoverStyle: CSSProperties = {
  color: "#CCCCD0",
};

const contentInnerStyle: CSSProperties = {
  width: "100%",
  maxWidth: 560,
  margin: "0 auto",
  padding: "28px 32px 48px",
};

// --- Component ---

export function SettingsWindow(_props: SettingsWindowProps = {}) {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);

  const handleTabClick = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "general": return <GeneralTab />;
      case "voice": return <VoiceTab />;
      case "processing": return <ProcessingTab />;
      case "privacy": return <PrivacyTab />;
      case "account": return <AccountTab />;
      default: return null;
    }
  };

  const tabBarElement = (
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
  );

  return (
    <WindowShell title="Settings" toolbar={tabBarElement}>
      <div style={contentInnerStyle}>
        {renderTabContent()}
      </div>
    </WindowShell>
  );
}
