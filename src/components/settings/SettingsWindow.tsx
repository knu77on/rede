// ============================================================
// REDE - Settings Window
// Refined tab bar with warm glass chrome
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

type TabId = "general" | "voice" | "processing" | "privacy" | "account";

const TABS: { id: TabId; label: string }[] = [
  { id: "general", label: "General" },
  { id: "voice", label: "Voice" },
  { id: "processing", label: "Processing" },
  { id: "privacy", label: "Privacy" },
  { id: "account", label: "Account" },
];

const tabBarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  borderRadius: 8,
  padding: 2,
};

const tabBase: CSSProperties = {
  padding: "5px 12px",
  borderRadius: 6,
  border: "none",
  backgroundColor: "transparent",
  color: "#5A5A66",
  fontSize: 11,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.12s ease",
  fontFamily: "inherit",
  whiteSpace: "nowrap",
  letterSpacing: "-0.01em",
};

const tabActive: CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.07)",
  color: "#EAEAEF",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2), inset 0 0.5px 0 rgba(255, 255, 255, 0.03)",
};

export function SettingsWindow(_props: SettingsWindowProps = {}) {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);

  const handleTabClick = useCallback((tabId: TabId) => setActiveTab(tabId), []);

  const renderContent = () => {
    switch (activeTab) {
      case "general": return <GeneralTab />;
      case "voice": return <VoiceTab />;
      case "processing": return <ProcessingTab />;
      case "privacy": return <PrivacyTab />;
      case "account": return <AccountTab />;
      default: return null;
    }
  };

  const tabBar = (
    <div style={tabBarStyle}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const isHov = hoveredTab === tab.id && !isActive;
        return (
          <button
            key={tab.id}
            style={{
              ...tabBase,
              ...(isActive ? tabActive : {}),
              ...(isHov ? { color: "#7A7A88" } : {}),
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
    <WindowShell title="Settings" toolbar={tabBar}>
      <div style={{ width: "100%", maxWidth: 540, margin: "0 auto", padding: "16px 28px 20px" }}>
        {renderContent()}
      </div>
    </WindowShell>
  );
}
