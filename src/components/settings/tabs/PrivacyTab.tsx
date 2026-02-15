// ============================================================
// REDE - Privacy Settings Tab
// Compact — fits in viewport, history list is the only scrollable
// ============================================================

import { type CSSProperties, useCallback, useState } from "react";
import { useSettingsStore } from "../../../stores/settingsStore";
import { useHistoryStore, type DictationEntry } from "../../../stores/historyStore";
import { Toggle } from "../../common/Toggle";

// --- Styles ---

const styles: Record<string, CSSProperties> = {
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#6E6E7A",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    marginBottom: 6,
    paddingLeft: 2,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 10,
    padding: "2px 14px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    margin: 0,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0",
    gap: 16,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: "#F5F5F7",
  },
  actionButton: {
    padding: "4px 11px",
    borderRadius: 6,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: "#8E8E9A",
    fontSize: 11,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.12s ease",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  },
  dangerButton: {
    padding: "3px 9px",
    borderRadius: 5,
    border: "1px solid rgba(248, 113, 113, 0.2)",
    backgroundColor: "rgba(248, 113, 113, 0.06)",
    color: "#F87171",
    fontSize: 10,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  },
  confirmOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  confirmDialog: {
    backgroundColor: "rgba(20, 20, 26, 0.98)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: "16px",
    maxWidth: 320,
    width: "100%",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
  },
};

// --- History Entry ---

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ago`;
}

function HistoryEntry({ entry }: { entry: DictationEntry }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(entry.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [entry.text]);

  return (
    <div style={{ padding: "6px 0" }}>
      <div style={{ fontSize: 12, color: "#F5F5F7", lineHeight: "16px", wordBreak: "break-word" }}>{entry.text}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, fontSize: 10, color: "#55555F" }}>
        <span>{formatTimeAgo(entry.createdAt)}</span>
        <span>{entry.wordCount}w</span>
        {entry.wasCorrected && (
          <span style={{ fontSize: 9, fontWeight: 600, color: "#4CAF50", backgroundColor: "rgba(76, 175, 80, 0.1)", borderRadius: 3, padding: "0 4px" }}>
            Corrected
          </span>
        )}
        <button
          style={{ marginLeft: "auto", padding: "1px 6px", borderRadius: 4, border: "1px solid rgba(255, 255, 255, 0.06)", backgroundColor: "transparent", color: "#55555F", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}
          onClick={handleCopy}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// --- Component ---

export function PrivacyTab() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSetting = useSettingsStore((s) => s.updateSetting);
  const entries = useHistoryStore((s) => s.entries);
  const clearAll = useHistoryStore((s) => s.clearAll);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearHistory = useCallback(() => {
    clearAll();
    setShowClearConfirm(false);
  }, [clearAll]);

  const handleExportData = useCallback(() => {
    // TODO: Export user data
  }, []);

  return (
    <div>
      {/* Privacy Controls */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Privacy</div>
        <div style={styles.card}>
          <Toggle
            checked={settings.private_mode}
            onChange={(v) => updateSetting("private_mode", v)}
            label="Private Mode"
            description="Transcription stays local, nothing sent to cloud"
          />
          <div style={styles.divider} />
          <Toggle
            checked={settings.analytics}
            onChange={(v) => updateSetting("analytics", v)}
            label="Usage Analytics"
          />
        </div>
      </div>

      {/* Dictation History */}
      <div style={styles.section}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={styles.sectionTitle}>
            History
            {entries.length > 0 && (
              <span style={{ color: "#55555F", fontWeight: 400, marginLeft: 4 }}>({entries.length})</span>
            )}
          </div>
          {entries.length > 0 && (
            <button style={styles.dangerButton} onClick={() => setShowClearConfirm(true)}>Clear All</button>
          )}
        </div>

        <div style={styles.card}>
          {entries.length === 0 ? (
            <div style={{ padding: "16px 0", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#55555F" }}>
                {settings.private_mode ? "No history in Private Mode" : "Dictations from the last 12 hours appear here"}
              </div>
            </div>
          ) : (
            <div style={{ maxHeight: 200, overflowY: "auto" }}>
              {entries.map((entry, i) => (
                <div key={entry.id}>
                  {i > 0 && <div style={styles.divider} />}
                  <HistoryEntry entry={entry} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Data */}
      <div style={{ ...styles.section, marginBottom: 0 }}>
        <div style={styles.sectionTitle}>Data</div>
        <div style={styles.card}>
          <div style={styles.row}>
            <div style={styles.rowLabel}>Export Data</div>
            <button style={styles.actionButton} onClick={handleExportData}>Export</button>
          </div>
        </div>
      </div>

      {/* Clear History Confirmation */}
      {showClearConfirm && (
        <div style={styles.confirmOverlay} onClick={() => setShowClearConfirm(false)}>
          <div style={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F7", marginBottom: 4 }}>Clear all history?</div>
            <div style={{ fontSize: 12, color: "#6E6E7A", lineHeight: "16px", marginBottom: 14 }}>
              This will permanently delete all dictation history on this device.
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "transparent", color: "#8E8E9A", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
                onClick={() => setShowClearConfirm(false)}
              >Cancel</button>
              <button
                style={{ padding: "5px 12px", borderRadius: 6, border: "none", backgroundColor: "#F87171", color: "#FFFFFF", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                onClick={handleClearHistory}
              >Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
