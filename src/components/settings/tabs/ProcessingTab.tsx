// ============================================================
// REDE - Processing Settings Tab
// ============================================================

import { type CSSProperties, useCallback } from "react";
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
  },
  select: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 7,
    padding: "7px 12px",
    color: "#F5F5F7",
    fontSize: 12,
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
    minWidth: 170,
    appearance: "none" as const,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%238E8E9A' d='M2.5 4l2.5 2.5L7.5 4'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: 28,
    outline: "none",
    transition: "all 0.12s ease",
  },
};

// --- Constants ---

const LANGUAGES: { value: string; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "nl", label: "Dutch" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "ru", label: "Russian" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "pl", label: "Polish" },
  { value: "sv", label: "Swedish" },
];

// --- Component ---

export function ProcessingTab() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSetting = useSettingsStore((s) => s.updateSetting);

  const handleLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateSetting("language", e.target.value);
    },
    [updateSetting],
  );

  return (
    <div>
      {/* Text Correction */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Text Correction</div>
        <div style={styles.card}>
          <Toggle
            checked={settings.smart_correction}
            onChange={(v) => updateSetting("smart_correction", v)}
            label="Smart Correction"
            description="AI-powered self-correction detection and cleanup"
          />

          <div style={styles.divider} />

          <Toggle
            checked={settings.remove_fillers}
            onChange={(v) => updateSetting("remove_fillers", v)}
            label="Remove Fillers"
            description='Remove "um", "uh", "like", and other filler words'
          />
        </div>
      </div>

      {/* Formatting */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Formatting</div>
        <div style={styles.card}>
          <Toggle
            checked={settings.auto_punctuation}
            onChange={(v) => updateSetting("auto_punctuation", v)}
            label="Auto-Punctuation"
            description="Insert commas, periods, and other punctuation"
          />

          <div style={styles.divider} />

          <Toggle
            checked={settings.auto_capitalize}
            onChange={(v) => updateSetting("auto_capitalize", v)}
            label="Auto-Capitalize"
            description="Capitalize the first letter of each sentence"
          />
        </div>
      </div>

      {/* Language */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Language</div>
        <div style={styles.card}>
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Language</div>
              <div style={styles.rowDescription}>
                Primary language for speech recognition
              </div>
            </div>
            <select
              style={{
                ...styles.select,
                ...(settings.auto_detect_language ? { opacity: 0.5 } : {}),
              }}
              value={settings.language}
              onChange={handleLanguageChange}
              disabled={settings.auto_detect_language}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.divider} />

          <Toggle
            checked={settings.auto_detect_language}
            onChange={(v) => updateSetting("auto_detect_language", v)}
            label="Auto-Detect Language"
            description="Detect the spoken language automatically"
          />
        </div>
      </div>
    </div>
  );
}
