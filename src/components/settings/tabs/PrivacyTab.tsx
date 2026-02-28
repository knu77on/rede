// ============================================================
// REDE - Privacy Settings Tab
// Compact — history list is the only scrollable
// ============================================================

import { type CSSProperties, useCallback, useState } from "react";
import { useSettingsStore } from "../../../stores/settingsStore";
import { useHistoryStore, type DictationEntry } from "../../../stores/historyStore";
import { Toggle } from "../../common/Toggle";

const S: Record<string, CSSProperties> = {
  section: { marginBottom: 16 },
  title: {
    fontSize: 11, fontWeight: 600, color: "#5A5A66",
    textTransform: "uppercase" as const, letterSpacing: "0.05em",
    marginBottom: 6, paddingLeft: 2,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.025)",
    borderRadius: 10, padding: "2px 14px",
    border: "1px solid rgba(255, 255, 255, 0.045)",
  },
  divider: { height: 1, backgroundColor: "rgba(255, 255, 255, 0.04)", margin: 0 },
  row: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "9px 0", gap: 16,
  },
  label: { fontSize: 13, fontWeight: 500, color: "#EAEAEF" },
};

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  return `${Math.floor(min / 60)}h ${min % 60}m ago`;
}

function HistoryEntry({ entry }: { entry: DictationEntry }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(entry.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [entry.text]);

  return (
    <div style={{ padding: "6px 0" }}>
      <div style={{ fontSize: 12, color: "#EAEAEF", lineHeight: "16px", wordBreak: "break-word" }}>{entry.text}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, fontSize: 10, color: "#4A4A56" }}>
        <span>{formatTimeAgo(entry.createdAt)}</span>
        <span>{entry.wordCount}w</span>
        {entry.wasCorrected && (
          <span style={{ fontSize: 9, fontWeight: 600, color: "#22C55E", backgroundColor: "rgba(34,197,94,0.08)", borderRadius: 3, padding: "0 4px" }}>
            Corrected
          </span>
        )}
        <button
          style={{
            marginLeft: "auto", padding: "1px 6px", borderRadius: 4,
            border: "1px solid rgba(255, 255, 255, 0.05)",
            backgroundColor: "transparent", color: "#4A4A56",
            fontSize: 10, cursor: "pointer", fontFamily: "inherit",
          }}
          onClick={copy}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export function PrivacyTab() {
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.updateSetting);
  const entries = useHistoryStore((s) => s.entries);
  const clearAll = useHistoryStore((s) => s.clearAll);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = useCallback(() => { clearAll(); setShowConfirm(false); }, [clearAll]);

  return (
    <div>
      <div style={S.section}>
        <div style={S.title}>Privacy</div>
        <div style={S.card}>
          <Toggle
            checked={settings.private_mode}
            onChange={(v) => update("private_mode", v)}
            label="Private Mode"
            description="Transcription stays local, nothing sent to cloud"
          />
          <div style={S.divider} />
          <Toggle checked={settings.analytics} onChange={(v) => update("analytics", v)} label="Usage Analytics" />
        </div>
      </div>

      <div style={S.section}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={S.title}>
            History
            {entries.length > 0 && (
              <span style={{ color: "#4A4A56", fontWeight: 400, marginLeft: 4 }}>({entries.length})</span>
            )}
          </div>
          {entries.length > 0 && (
            <button
              style={{
                padding: "3px 9px", borderRadius: 5, fontSize: 10, fontWeight: 600,
                border: "1px solid rgba(239, 68, 68, 0.15)",
                backgroundColor: "rgba(239, 68, 68, 0.05)",
                color: "#EF4444", cursor: "pointer", fontFamily: "inherit",
              }}
              onClick={() => setShowConfirm(true)}
            >
              Clear All
            </button>
          )}
        </div>
        <div style={S.card}>
          {entries.length === 0 ? (
            <div style={{ padding: "16px 0", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#4A4A56" }}>
                {settings.private_mode ? "No history in Private Mode" : "Dictations from the last 12 hours appear here"}
              </div>
            </div>
          ) : (
            <div style={{ maxHeight: 200, overflowY: "auto" }}>
              {entries.map((e, i) => (
                <div key={e.id}>
                  {i > 0 && <div style={S.divider} />}
                  <HistoryEntry entry={e} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ ...S.section, marginBottom: 0 }}>
        <div style={S.title}>Data</div>
        <div style={S.card}>
          <div style={S.row}>
            <div style={S.label}>Export Data</div>
            <button
              style={{
                padding: "4px 11px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                border: "1px solid rgba(255, 255, 255, 0.06)",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                color: "#7A7A88", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            style={{
              backgroundColor: "rgba(16, 16, 22, 0.98)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: 12, padding: 16, maxWidth: 320, width: "100%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(24px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: "#EAEAEF", marginBottom: 4 }}>Clear all history?</div>
            <div style={{ fontSize: 12, color: "#5A5A66", lineHeight: "16px", marginBottom: 14 }}>
              This will permanently delete all dictation history on this device.
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                style={{
                  padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  backgroundColor: "transparent", color: "#7A7A88",
                  cursor: "pointer", fontFamily: "inherit",
                }}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                  border: "none", backgroundColor: "#EF4444", color: "#FFFFFF",
                  cursor: "pointer", fontFamily: "inherit",
                }}
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
