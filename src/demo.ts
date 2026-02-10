// ============================================================
// REDE - Demo Mode
// Simulates recording, audio levels, and transcription
// without requiring Tauri, Supabase, or any external services.
//
// Activate by adding ?demo to the URL:
//   http://localhost:1420/?demo
//   http://localhost:1420/?demo&view=settings
// ============================================================

import { useRecordingStore } from "./stores/recordingStore";

const DEMO_PHRASES = [
  "Hey, can we push the standup to 3pm today? I have a conflict with the design review.",
  "Just finished the pull request for the new authentication flow. Let me know if you have any feedback.",
  "The quarterly metrics look really promising. Revenue is up 23% compared to last quarter.",
  "I think we should use a factory pattern here instead of the builder pattern. It will be cleaner.",
  "Remind me to pick up groceries on the way home. We need milk, eggs, and bread.",
];

let demoInterval: ReturnType<typeof setInterval> | null = null;
let demoTimeout: ReturnType<typeof setTimeout> | null = null;

export function isDemoMode(): boolean {
  return new URLSearchParams(window.location.search).has("demo");
}

export function startDemoLoop(): () => void {
  if (!isDemoMode()) return () => {};

  let phraseIndex = 0;

  function runDemoCycle() {
    const store = useRecordingStore.getState();

    // Start recording
    store.startRecording();

    // Simulate audio levels while "recording"
    let elapsed = 0;
    const levelInterval = setInterval(() => {
      const levels = Array.from({ length: 7 }, () =>
        Math.random() * 0.6 + 0.15 + Math.sin(elapsed * 0.003) * 0.15,
      );
      useRecordingStore.getState().setAudioLevels(levels);
      elapsed += 80;
    }, 80);

    // Simulate duration ticking
    const durationStart = Date.now();
    const durationInterval = setInterval(() => {
      useRecordingStore.setState({ duration: Date.now() - durationStart });
    }, 100);

    // Stop recording after 2-4 seconds
    const recordDuration = 2000 + Math.random() * 2000;
    demoTimeout = setTimeout(() => {
      clearInterval(levelInterval);
      clearInterval(durationInterval);

      // Move to processing
      useRecordingStore.getState().stopRecording();

      // Simulate processing delay, then show transcription
      demoTimeout = setTimeout(() => {
        const phrase = DEMO_PHRASES[phraseIndex % DEMO_PHRASES.length];
        phraseIndex++;
        useRecordingStore.getState().setTranscription(phrase);

        // Wait before next cycle
        demoTimeout = setTimeout(runDemoCycle, 3000);
      }, 800 + Math.random() * 600);
    }, recordDuration);

    demoInterval = levelInterval;
  }

  // Start after a brief initial delay
  demoTimeout = setTimeout(runDemoCycle, 1000);

  // Return cleanup
  return () => {
    if (demoInterval) clearInterval(demoInterval);
    if (demoTimeout) clearTimeout(demoTimeout);
  };
}
