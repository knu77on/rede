// ============================================================
// REDE - Privacy Settings Tab
// ============================================================

import { type CSSProperties, useCallback, useState } from "react";
import { useSettingsStore } from "../../../stores/settingsStore";
import { useHistoryStore, type DictationEntry } from "../../../stores/historyStore";
import { Toggle } from "../../common/Toggle";

// --- Styles ---

const styles: Record<string, CSSProperties> = {
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#8E8E9A",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    marginBottom: 8,
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
  infoBox: {
    backgroundColor: "rgba(229, 57, 53, 0.06)",
    border: "1px solid rgba(229, 57, 53, 0.12)",
    borderRadius: 10,
    padding: "12px 14px",
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#F5F5F7",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#8E8E9A",
    lineHeight: "17px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
    gap: 16,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: "#F5F5F7",
  },
  rowDescription: {
    fontSize: 11,
    color: "#8E8E9A",
    marginTop: 2,
    lineHeight: "15px",
  },
  actionButton: {
    padding: "6px 14px",
    borderRadius: 7,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: "#F5F5F7",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.12s ease",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  },
  dangerButton: {
    padding: "6px 14px",
    borderRadius: 7,
    border: "1px solid rgba(248, 113, 113, 0.25)",
    backgroundColor: "rgba(248, 113, 113, 0.08)",
    color: "#F87171",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.12s ease",
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
    borderRadius: 14,
    padding: "20px",
    maxWidth: 360,
    width: "100%",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
  },
  confirmTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#F5F5F7",
    marginBottom: 6,
  },
  confirmText: {
    fontSize: 12,
    color: "#8E8E9A",
    lineHeight: "17px",
    marginBottom: 16,
  },
  confirmActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
  },
  cancelButton: {
    padding: "6px 14px",
    borderRadius: 7,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backgroundColor: "transparent",
    color: "#8E8E9A",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  confirmDestructiveButton: {
    padding: "6px 14px",
    borderRadius: 7,
    border: "none",
    backgroundColor: "#F87171",
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

// --- History Entry ---

const entryStyle: CSSProperties = {
  padding: "10px 0",
};

const entryTextStyle: CSSProperties = {
  fontSize: 13,
  color: "#F5F5F7",
  lineHeight: "18px",
  wordBreak: "break-word",
};

const entryMetaStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginTop: 4,
  fontSize: 11,
  color: "#55555F",
};

const correctionBadgeStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: "#4CAF50",
  backgroundColor: "rgba(76, 175, 80, 0.1)",
  border: "1px solid rgba(76, 175, 80, 0.2)",
  borderRadius: 4,
  padding: "1px 6px",
};

const copyButtonStyle: CSSProperties = {
  marginLeft: "auto",
  padding: "2px 8px",
  borderRadius: 5,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  backgroundColor: "transparent",
  color: "#55555F",
  fontSize: 11,
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all 0.12s ease",
};

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
    <div style={entryStyle}>
      <div style={entryTextStyle}>{entry.text}</div>
      <div style={entryMetaStyle}>
        <span>{formatTimeAgo(entry.createdAt)}</span>
        <span>{entry.wordCount} {entry.wordCount === 1 ? "word" : "words"}</span>
        {entry.wasCorrected && (
          <span style={correctionBadgeStyle}>Corrected</span>
        )}
        <button
          style={copyButtonStyle}
          onClick={handleCopy}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#8E8E9A";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#55555F";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// --- Empty State ---

const emptyStateStyle: CSSProperties = {
  padding: "24px 0",
  textAlign: "center",
};

const emptyIconStyle: CSSProperties = {
  fontSize: 24,
  marginBottom: 8,
  opacity: 0.3,
};

const emptyTextStyle: CSSProperties = {
  fontSize: 12,
  color: "#55555F",
  lineHeight: "17px",
};

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
      {/* Privacy Info */}
      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>Your data stays private</div>
        <div style={styles.infoText}>
          REDE processes audio on your device first. When Private Mode is
          enabled, audio is never sent to the cloud. History is stored only on
          your Mac in an encrypted database.
        </div>
      </div>

      {/* Privacy Controls */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Privacy</div>
        <div style={styles.card}>
          <Toggle
            checked={settings.private_mode}
            onChange={(v) => updateSetting("private_mode", v)}
            label="Private Mode"
            description="All transcription stays local. No audio sent to cloud."
          />

          <div style={styles.divider} />

          <Toggle
            checked={settings.analytics}
            onChange={(v) => updateSetting("analytics", v)}
            label="Usage Analytics"
            description="Anonymous usage data to help improve REDE"
          />
        </div>
      </div>

      {/* Dictation History */}
      <div style={styles.section}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={styles.sectionTitle}>
            Dictation History
            {entries.length > 0 && (
              <span style={{ color: "#55555F", fontWeight: 400, marginLeft: 6 }}>
                ({entries.length})
              </span>
            )}
          </div>
          {entries.length > 0 && (
            <button
              style={{ ...styles.dangerButton, padding: "4px 10px", fontSize: 11 }}
              onClick={() => setShowClearConfirm(true)}
            >
              Clear All
            </button>
          )}
        </div>

        {settings.private_mode && (
          <div style={{
            padding: "10px 14px",
            borderRadius: 10,
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 12, color: "#8E8E9A", lineHeight: "17px" }}>
              Private Mode is on — dictations are discarded immediately and no
              history is kept.
            </div>
          </div>
        )}

        <div style={styles.card}>
          {entries.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={emptyIconStyle}>{"\uD83C\uDF99\uFE0F"}</div>
              <div style={emptyTextStyle}>
                {settings.private_mode
                  ? "No history in Private Mode"
                  : "No dictations yet"}
              </div>
              <div style={{ ...emptyTextStyle, marginTop: 4, fontSize: 11 }}>
                {settings.private_mode
                  ? "Turn off Private Mode to keep a 12-hour history"
                  : "Your last 12 hours of dictations will appear here"}
              </div>
            </div>
          ) : (
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {entries.map((entry, i) => (
                <div key={entry.id}>
                  {i > 0 && <div style={styles.divider} />}
                  <HistoryEntry entry={entry} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          fontSize: 11,
          color: "#55555F",
          lineHeight: "15px",
          padding: "8px 2px 0",
        }}>
          Dictations older than 12 hours are automatically deleted. Nothing is
          stored outside your Mac.
        </div>
      </div>

      {/* Data */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Data</div>
        <div style={styles.card}>
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Export Data</div>
              <div style={styles.rowDescription}>
                Download history, snippets, and settings
              </div>
            </div>
            <button style={styles.actionButton} onClick={handleExportData}>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Clear History Confirmation */}
      {showClearConfirm && (
        <div
          style={styles.confirmOverlay}
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            style={styles.confirmDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.confirmTitle}>Clear all history?</div>
            <div style={styles.confirmText}>
              This will permanently delete all dictation history stored on this
              device. This action cannot be undone.
            </div>
            <div style={styles.confirmActions}>
              <button
                style={styles.cancelButton}
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button
                style={styles.confirmDestructiveButton}
                onClick={handleClearHistory}
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
