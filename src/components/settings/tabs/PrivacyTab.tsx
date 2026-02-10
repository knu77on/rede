// ============================================================
// REDE - Privacy Settings Tab
// ============================================================

import { type CSSProperties, useCallback, useState } from "react";
import { useSettingsStore } from "../../../stores/settingsStore";
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
  retentionNote: {
    fontSize: 11,
    color: "#55555F",
    lineHeight: "15px",
    padding: "8px 0",
  },
};

// --- Component ---

export function PrivacyTab() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSetting = useSettingsStore((s) => s.updateSetting);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearHistory = useCallback(() => {
    setShowClearConfirm(false);
  }, []);

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
        <div style={styles.sectionTitle}>Dictation History</div>
        <div style={styles.card}>
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Recent Dictations</div>
              <div style={styles.rowDescription}>
                Your last 12 hours of dictations are kept locally so you can
                review or copy them. After 12 hours they are automatically
                deleted.
              </div>
            </div>
          </div>

          <div style={styles.divider} />

          <div style={{ ...styles.row, flexDirection: "column" as const, alignItems: "flex-start", gap: 4 }}>
            <div style={styles.rowLabel}>When Private Mode is on</div>
            <div style={styles.rowDescription}>
              Dictations are never stored — they are discarded immediately after
              being inserted into the active text field. No history is kept.
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Clear History</div>
              <div style={styles.rowDescription}>
                Delete all local dictation history now
              </div>
            </div>
            <button
              style={styles.dangerButton}
              onClick={() => setShowClearConfirm(true)}
            >
              Clear All
            </button>
          </div>

          <div style={styles.retentionNote}>
            Dictations older than 12 hours are automatically purged. Nothing is
            ever sent to external servers unless Private Mode is off and you are
            using cloud transcription.
          </div>
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
