// ============================================================
// REDE - Processing Settings Tab
// Compact — no scrolling
// ============================================================

import { type CSSProperties, useCallback } from "react";
import { useSettingsStore } from "../../../stores/settingsStore";
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
  select: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: 6, padding: "5px 10px",
    color: "#EAEAEF", fontSize: 12, fontWeight: 500,
    fontFamily: "inherit", cursor: "pointer", minWidth: 160,
    appearance: "none" as const, outline: "none",
    transition: "all 0.12s ease", paddingRight: 24,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%235A5A66' d='M2.5 4l2.5 2.5L7.5 4'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
  },
};

const LANGUAGES = [
  { value: "en", label: "English" }, { value: "es", label: "Spanish" },
  { value: "fr", label: "French" }, { value: "de", label: "German" },
  { value: "it", label: "Italian" }, { value: "pt", label: "Portuguese" },
  { value: "nl", label: "Dutch" }, { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" }, { value: "zh", label: "Chinese" },
  { value: "ru", label: "Russian" }, { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" }, { value: "pl", label: "Polish" },
  { value: "sv", label: "Swedish" },
];

export function ProcessingTab() {
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.updateSetting);

  const handleLang = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => update("language", e.target.value), [update],
  );

  return (
    <div>
      <div style={S.section}>
        <div style={S.title}>Correction</div>
        <div style={S.card}>
          <Toggle checked={settings.smart_correction} onChange={(v) => update("smart_correction", v)} label="Smart Correction" />
          <div style={S.divider} />
          <Toggle checked={settings.remove_fillers} onChange={(v) => update("remove_fillers", v)} label="Remove Fillers" />
        </div>
      </div>

      <div style={S.section}>
        <div style={S.title}>Formatting</div>
        <div style={S.card}>
          <Toggle checked={settings.auto_punctuation} onChange={(v) => update("auto_punctuation", v)} label="Auto-Punctuation" />
          <div style={S.divider} />
          <Toggle checked={settings.auto_capitalize} onChange={(v) => update("auto_capitalize", v)} label="Auto-Capitalize" />
        </div>
      </div>

      <div style={{ ...S.section, marginBottom: 0 }}>
        <div style={S.title}>Language</div>
        <div style={S.card}>
          <div style={S.row}>
            <div style={S.label}>Language</div>
            <select
              style={{ ...S.select, ...(settings.auto_detect_language ? { opacity: 0.4 } : {}) }}
              value={settings.language}
              onChange={handleLang}
              disabled={settings.auto_detect_language}
            >
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div style={S.divider} />
          <Toggle checked={settings.auto_detect_language} onChange={(v) => update("auto_detect_language", v)} label="Auto-Detect" />
        </div>
      </div>
    </div>
  );
}
