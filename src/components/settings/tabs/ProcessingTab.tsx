// ============================================================
// REDE - Processing Settings Tab
// ============================================================

import { type CSSProperties, useCallback } from "react";
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
  select: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: "8px 12px",
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "inherit",
    cursor: "pointer",
    minWidth: 180,
    appearance: "none" as const,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23A0A0B0' d='M3 5l3 3 3-3'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: 28,
    outline: "none",
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
        <div style={styles.sectionContent}>
          {/* Smart Correction */}
          <Toggle
            checked={settings.smart_correction}
            onChange={(v) => updateSetting("smart_correction", v)}
            label="Smart Correction"
            description="AI-powered self-correction detection and cleanup"
          />

          <div style={styles.divider} />

          {/* Remove Fillers */}
          <Toggle
            checked={settings.remove_fillers}
            onChange={(v) => updateSetting("remove_fillers", v)}
            label="Remove Fillers"
            description='Automatically remove "um", "uh", "like", and other filler words'
          />
        </div>
      </div>

      {/* Formatting */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Formatting</div>
        <div style={styles.sectionContent}>
          {/* Auto-Punctuation */}
          <Toggle
            checked={settings.auto_punctuation}
            onChange={(v) => updateSetting("auto_punctuation", v)}
            label="Auto-Punctuation"
            description="Intelligently insert commas, periods, and other punctuation"
          />

          <div style={styles.divider} />

          {/* Auto-Capitalize */}
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
        <div style={styles.sectionContent}>
          {/* Language Selector */}
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

          {/* Auto-Detect Language */}
          <Toggle
            checked={settings.auto_detect_language}
            onChange={(v) => updateSetting("auto_detect_language", v)}
            label="Auto-Detect Language"
            description="Automatically detect the spoken language instead of using a fixed selection"
          />
        </div>
      </div>
    </div>
  );
}
