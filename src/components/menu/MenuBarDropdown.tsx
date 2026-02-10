// ============================================================
// REDE - Menu Bar Dropdown Component
// ============================================================

import React, { useCallback, useEffect, useRef } from "react";
import { useRecordingStore } from "../../stores/recordingStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { MenuItem } from "./MenuItem";

// --- Types ---

interface MenuBarDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- Styles ---

const backdropStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 10000,
};

const dropdownStyle: React.CSSProperties = {
  position: "fixed",
  top: 28,
  right: 8,
  width: 260,
  backgroundColor: "rgba(30, 30, 36, 0.98)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 10,
  padding: "6px",
  boxShadow:
    "0 16px 48px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 0.5px rgba(255, 255, 255, 0.06)",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  zIndex: 10001,
  display: "flex",
  flexDirection: "column",
  gap: 1,
  animation: "rede-dropdown-enter 120ms ease-out",
  transformOrigin: "top right",
};

const statusRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 500,
  color: "#A0A0B0",
  lineHeight: "16px",
  userSelect: "none",
};

const statusDotStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  flexShrink: 0,
};

// --- Keyframes ---

const dropdownKeyframes = `
@keyframes rede-dropdown-enter {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(-4px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
`;

// --- Icons (inline SVGs) ---

const micIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1a2.5 2.5 0 0 0-2.5 2.5v4a2.5 2.5 0 0 0 5 0v-4A2.5 2.5 0 0 0 8 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7v.5a4 4 0 0 1-8 0V7M8 12v2.5M6 14.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const stopIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3.5" y="3.5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

const privacyIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.5L2.5 4v3.5c0 3.5 2.3 6.2 5.5 7 3.2-.8 5.5-3.5 5.5-7V4L8 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const whisperIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1v14M4.5 4v8M11.5 4v8M1.5 6.5v3M14.5 6.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const historyIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const settingsIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M13.2 9.8a1.1 1.1 0 0 0 .22 1.21l.04.04a1.33 1.33 0 1 1-1.88 1.88l-.04-.04a1.1 1.1 0 0 0-1.21-.22 1.1 1.1 0 0 0-.67 1.01v.12a1.33 1.33 0 1 1-2.67 0v-.06a1.1 1.1 0 0 0-.72-1.01 1.1 1.1 0 0 0-1.21.22l-.04.04a1.33 1.33 0 1 1-1.88-1.88l.04-.04a1.1 1.1 0 0 0 .22-1.21 1.1 1.1 0 0 0-1.01-.67h-.12a1.33 1.33 0 1 1 0-2.67h.06a1.1 1.1 0 0 0 1.01-.72 1.1 1.1 0 0 0-.22-1.21l-.04-.04A1.33 1.33 0 1 1 5.04 2.6l.04.04a1.1 1.1 0 0 0 1.21.22h.05a1.1 1.1 0 0 0 .67-1.01v-.12a1.33 1.33 0 1 1 2.67 0v.06a1.1 1.1 0 0 0 .67 1.01 1.1 1.1 0 0 0 1.21-.22l.04-.04a1.33 1.33 0 1 1 1.88 1.88l-.04.04a1.1 1.1 0 0 0-.22 1.21v.05a1.1 1.1 0 0 0 1.01.67h.12a1.33 1.33 0 0 1 0 2.67h-.06a1.1 1.1 0 0 0-1.01.67Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const quitIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 14H3.33A1.33 1.33 0 0 1 2 12.67V3.33A1.33 1.33 0 0 1 3.33 2H6M10.67 11.33 14 8l-3.33-3.33M14 8H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// --- Component ---

export const MenuBarDropdown: React.FC<MenuBarDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const recordingState = useRecordingStore((s) => s.state);
  const startRecording = useRecordingStore((s) => s.startRecording);
  const stopRecording = useRecordingStore((s) => s.stopRecording);

  const privateMode = useSettingsStore((s) => s.settings.private_mode);
  const whisperMode = useSettingsStore((s) => s.settings.whisper_mode);
  const updateSetting = useSettingsStore((s) => s.updateSetting);

  const isRecording = recordingState === "recording";
  const isProcessing = recordingState === "processing";

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // Determine status display
  const statusColor = isRecording
    ? "#F87171"
    : isProcessing
      ? "#34D399"
      : "#4ADE80";

  const statusText = isRecording
    ? "Recording"
    : isProcessing
      ? "Processing"
      : "Ready";

  const handleRecordingToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    onClose();
  };

  const handleSessionHistory = () => {
    // TODO: Open session history panel
    console.log("Open session history");
    onClose();
  };

  const handleSettings = () => {
    // TODO: Open settings window
    console.log("Open settings");
    onClose();
  };

  const handleQuit = () => {
    // TODO: Quit the application via Tauri
    console.log("Quit application");
    onClose();
  };

  return (
    <>
      <style>{dropdownKeyframes}</style>

      {/* Invisible backdrop to catch outside clicks */}
      <div style={backdropStyle} onClick={onClose} />

      {/* Dropdown menu */}
      <div style={dropdownStyle} ref={dropdownRef} role="menu">
        {/* Status indicator */}
        <div style={statusRowStyle}>
          <div style={{ ...statusDotStyle, backgroundColor: statusColor }} />
          <span>{statusText}</span>
        </div>

        <MenuItem
          label="Privacy Mode"
          icon={privacyIcon}
          toggle
          checked={privateMode}
          onClick={() => updateSetting("private_mode", !privateMode)}
        />

        <MenuItem
          label={isRecording ? "Stop Recording" : "Start Recording"}
          icon={isRecording ? stopIcon : micIcon}
          shortcut={isRecording ? undefined : "\u2318\u21E7R"}
          onClick={handleRecordingToggle}
          disabled={isProcessing}
          divider
        />

        <MenuItem
          label="Whisper Mode"
          icon={whisperIcon}
          toggle
          checked={whisperMode}
          onClick={() => updateSetting("whisper_mode", !whisperMode)}
        />

        <MenuItem
          label="Session History"
          icon={historyIcon}
          onClick={handleSessionHistory}
          divider
        />

        <MenuItem
          label="Settings"
          icon={settingsIcon}
          shortcut={"\u2318,"}
          onClick={handleSettings}
        />

        <MenuItem
          label="Quit REDE"
          icon={quitIcon}
          shortcut={"\u2318Q"}
          onClick={handleQuit}
          destructive
          divider
        />
      </div>
    </>
  );
};

export default MenuBarDropdown;
