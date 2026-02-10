// ============================================================
// REDE - Settings Window (Main Container)
// ============================================================

import { type CSSProperties, useState, useCallback } from "react";
import { useSettingsStore } from "../../stores/settingsStore";
import { GeneralTab } from "./tabs/GeneralTab";
import { VoiceTab } from "./tabs/VoiceTab";
import { ProcessingTab } from "./tabs/ProcessingTab";
import { PrivacyTab } from "./tabs/PrivacyTab";
import { AccountTab } from "./tabs/AccountTab";

// --- Types ---

type TabId = "general" | "voice" | "processing" | "privacy" | "account";

interface TabDefinition {
  id: TabId;
  label: string;
  icon: string;
}

// --- Constants ---

const TABS: TabDefinition[] = [
  { id: "general", label: "General", icon: "\u2699" },
  { id: "voice", label: "Voice", icon: "\uD83C\uDF99" },
  { id: "processing", label: "Processing", icon: "\u2728" },
  { id: "privacy", label: "Privacy", icon: "\uD83D\uDD12" },
  { id: "account", label: "Account", icon: "\uD83D\uDC64" },
];

// --- Styles ---

const styles: Record<string, CSSProperties> = {
  window: {
    display: "flex",
    width: "100%",
    height: "100vh",
    backgroundColor: "rgba(18, 18, 22, 0.95)",
    color: "#FFFFFF",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    overflow: "hidden",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    width: 220,
    minWidth: 220,
    backgroundColor: "rgba(14, 14, 18, 0.98)",
    borderRight: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "24px 0",
    gap: 2,
  },
  sidebarHeader: {
    padding: "0 20px 20px",
    fontSize: 13,
    fontWeight: 600,
    color: "#A0A0B0",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  tabList: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "0 8px",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "transparent",
    color: "#A0A0B0",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s ease",
    textAlign: "left" as const,
    width: "100%",
    fontFamily: "inherit",
  },
  tabActive: {
    backgroundColor: "rgba(229, 57, 53, 0.12)",
    color: "#FFFFFF",
  },
  tabHover: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  tabIcon: {
    fontSize: 16,
    width: 20,
    textAlign: "center" as const,
  },
  content: {
    flex: 1,
    overflow: "auto",
    padding: "32px 40px",
  },
  contentHeader: {
    fontSize: 24,
    fontWeight: 700,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  contentSubheader: {
    fontSize: 14,
    color: "#A0A0B0",
    marginBottom: 32,
  },
  versionBadge: {
    marginTop: "auto",
    padding: "12px 20px",
    fontSize: 11,
    color: "#606070",
    textAlign: "center" as const,
  },
};

// --- Tab Descriptions ---

const TAB_DESCRIPTIONS: Record<TabId, string> = {
  general: "Appearance, behavior, and system preferences",
  voice: "Microphone, activation, and audio settings",
  processing: "Text correction, formatting, and language",
  privacy: "Data handling, analytics, and history",
  account: "Profile, subscription, and sign out",
};

// --- Component ---

export function SettingsWindow() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);
  const hasUnsavedChanges = useSettingsStore((s) => s.hasUnsavedChanges);
  const saveSettings = useSettingsStore((s) => s.saveSettings);

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
    <div style={styles.window}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>Settings</div>
        <div style={styles.tabList}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const isHovered = hoveredTab === tab.id && !isActive;

            return (
              <button
                key={tab.id}
                style={{
                  ...styles.tab,
                  ...(isActive ? styles.tabActive : {}),
                  ...(isHovered ? styles.tabHover : {}),
                }}
                onClick={() => handleTabClick(tab.id)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <span style={styles.tabIcon}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Save indicator */}
        {hasUnsavedChanges && (
          <div
            style={{
              margin: "auto 16px 0",
              padding: "10px 12px",
              borderRadius: 8,
              backgroundColor: "rgba(229, 57, 53, 0.08)",
              border: "1px solid rgba(229, 57, 53, 0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              onClick={saveSettings}
              style={{
                background: "none",
                border: "none",
                color: "#E53935",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                padding: 0,
              }}
            >
              Save Changes
            </button>
          </div>
        )}

        <div style={styles.versionBadge}>REDE v1.0.0</div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h1 style={styles.contentHeader}>
          {TABS.find((t) => t.id === activeTab)?.label}
        </h1>
        <p style={styles.contentSubheader}>{TAB_DESCRIPTIONS[activeTab]}</p>
        {renderTabContent()}
      </div>
    </div>
  );
}
