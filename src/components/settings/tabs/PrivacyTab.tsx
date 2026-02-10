// ============================================================
// REDE - Privacy Settings Tab
// ============================================================

import { type CSSProperties, useCallback, useState } from "react";
import { useSettingsStore } from "../../../stores/settingsStore";
import { Toggle } from "../../common/Toggle";

// --- Styles ---

const styles: Record<string, CSSProperties> = {
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#A0A0B0",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: "rgba(28, 28, 35, 0.95)",
    borderRadius: 12,
    padding: "4px 16px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    margin: 0,
  },
  infoBox: {
    backgroundColor: "rgba(229, 57, 53, 0.08)",
    border: "1px solid rgba(229, 57, 53, 0.15)",
    borderRadius: 10,
    padding: "14px 16px",
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#FFFFFF",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#A0A0B0",
    lineHeight: "18px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 0",
    gap: 16,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: "#FFFFFF",
  },
  rowDescription: {
    fontSize: 12,
    color: "#A0A0B0",
    marginTop: 2,
  },
  actionButton: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  },
  dangerButton: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid rgba(248, 113, 113, 0.3)",
    backgroundColor: "rgba(248, 113, 113, 0.1)",
    color: "#F87171",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s ease",
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
    backgroundColor: "rgba(28, 28, 35, 0.98)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: "24px",
    maxWidth: 380,
    width: "100%",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 14,
    color: "#A0A0B0",
    lineHeight: "20px",
    marginBottom: 20,
  },
  confirmActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButton: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.12)",
    backgroundColor: "transparent",
    color: "#A0A0B0",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  confirmDestructiveButton: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#F87171",
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

// --- Component ---

export function PrivacyTab() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSetting = useSettingsStore((s) => s.updateSetting);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearHistory = useCallback(() => {
    // TODO: Invoke Tauri command to clear local SQLite history
    // await invoke("clear_history");
    setShowClearConfirm(false);
  }, []);

  const handleExportData = useCallback(() => {
    // TODO: Invoke Tauri command to export user data
    // await invoke("export_data");
  }, []);

  return (
    <div>
      {/* Privacy Info */}
      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>Your data stays private</div>
        <div style={styles.infoText}>
          REDE processes audio on your device first. When Private Mode is on,
          audio is never sent to the cloud -- all transcription happens locally.
          History is stored only on your Mac in an encrypted SQLite database.
        </div>
      </div>

      {/* Privacy Controls */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Privacy Controls</div>
        <div style={styles.sectionContent}>
          {/* Private Mode */}
          <Toggle
            checked={settings.private_mode}
            onChange={(v) => updateSetting("private_mode", v)}
            label="Private Mode"
            description="Keep all transcription local. No audio data is sent to the cloud."
          />

          <div style={styles.divider} />

          {/* Analytics */}
          <Toggle
            checked={settings.analytics}
            onChange={(v) => updateSetting("analytics", v)}
            label="Usage Analytics"
            description="Send anonymous usage statistics to help improve REDE"
          />
        </div>
      </div>

      {/* Data Management */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Data Management</div>
        <div style={styles.sectionContent}>
          {/* Clear History */}
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Clear History</div>
              <div style={styles.rowDescription}>
                Permanently delete all local dictation history
              </div>
            </div>
            <button
              style={styles.dangerButton}
              onClick={() => setShowClearConfirm(true)}
            >
              Clear All
            </button>
          </div>

          <div style={styles.divider} />

          {/* Export Data */}
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Export Data</div>
              <div style={styles.rowDescription}>
                Download a copy of your history, snippets, and settings
              </div>
            </div>
            <button style={styles.actionButton} onClick={handleExportData}>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Clear History Confirmation Dialog */}
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
