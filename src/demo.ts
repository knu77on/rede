// ============================================================
// REDE - Demo Mode
// Simulates recording, audio levels, transcription, and
// smart corrections without requiring any external services.
//
// Activate by adding ?demo to the URL:
//   http://localhost:1420/?demo
//   http://localhost:1420/?demo&view=settings
// ============================================================

import { useRecordingStore } from "./stores/recordingStore";

// --- Demo Data ---

interface DemoPhrase {
  text: string;
  correction?: { original: string; corrected: string };
}

const DEMO_PHRASES: DemoPhrase[] = [
  {
    text: "Hey, can we push the standup to 3 PM today? I have a conflict with the design review.",
    correction: {
      original: "Hey can we push the standup to 3pm today I have a conflict with the design review",
      corrected: "Hey, can we push the standup to 3 PM today? I have a conflict with the design review.",
    },
  },
  {
    text: "Just finished the pull request for the new authentication flow. Let me know if you have any feedback.",
    correction: undefined,
  },
  {
    text: "The quarterly metrics look really promising. Revenue is up 23% compared to last quarter.",
    correction: {
      original: "The quarterly metrics look really promising revenue is up 23 percent compared to last quarter",
      corrected: "The quarterly metrics look really promising. Revenue is up 23% compared to last quarter.",
    },
  },
  {
    text: "I think we should use a factory pattern here instead of the builder pattern. It will be much cleaner.",
    correction: {
      original: "I think we should use a um factory pattern here instead of the builder pattern it will be much cleaner",
      corrected: "I think we should use a factory pattern here instead of the builder pattern. It will be much cleaner.",
    },
  },
  {
    text: "Remind me to pick up groceries on the way home. We need milk, eggs, and bread.",
    correction: {
      original: "Remind me to pick up groceries on the way home we need milk eggs and bread",
      corrected: "Remind me to pick up groceries on the way home. We need milk, eggs, and bread.",
    },
  },
];

// --- State ---

let demoInterval: ReturnType<typeof setInterval> | null = null;
let demoTimeout: ReturnType<typeof setTimeout> | null = null;
let cleanupQueue: (() => void)[] = [];

// --- Public API ---

export function isDemoMode(): boolean {
  return new URLSearchParams(window.location.search).has("demo");
}

export function startDemoLoop(): () => void {
  if (!isDemoMode()) return () => {};

  let phraseIndex = 0;

  function runDemoCycle() {
    const store = useRecordingStore.getState();

    // Clear previous correction
    store.setCorrection(null);

    // Start recording
    store.startRecording();

    // Simulate audio levels while "recording"
    let elapsed = 0;
    const levelInterval = setInterval(() => {
      const levels = Array.from({ length: 7 }, (_, i) => {
        const base = Math.random() * 0.5 + 0.15;
        const wave = Math.sin(elapsed * 0.004 + i * 0.5) * 0.2;
        const pulse = Math.sin(elapsed * 0.002) * 0.1;
        return Math.max(0.05, Math.min(1, base + wave + pulse));
      });
      useRecordingStore.getState().setAudioLevels(levels);
      elapsed += 80;
    }, 80);

    // Simulate duration ticking
    const durationStart = Date.now();
    const durationInterval = setInterval(() => {
      useRecordingStore.setState({ duration: Date.now() - durationStart });
    }, 100);

    cleanupQueue.push(() => {
      clearInterval(levelInterval);
      clearInterval(durationInterval);
    });

    // Stop recording after 2.5-4 seconds
    const recordDuration = 2500 + Math.random() * 1500;
    demoTimeout = setTimeout(() => {
      clearInterval(levelInterval);
      clearInterval(durationInterval);

      // Move to processing
      useRecordingStore.getState().stopRecording();

      // Simulate processing delay, then show transcription
      demoTimeout = setTimeout(() => {
        const phrase = DEMO_PHRASES[phraseIndex % DEMO_PHRASES.length];
        phraseIndex++;
        useRecordingStore.getState().setTranscription(phrase.text);

        // Show smart correction after a short delay (if this phrase has one)
        if (phrase.correction) {
          demoTimeout = setTimeout(() => {
            useRecordingStore.getState().setCorrection(phrase.correction!);

            // Wait before next cycle
            demoTimeout = setTimeout(runDemoCycle, 4000);
          }, 800);
        } else {
          // No correction — wait then start next cycle
          demoTimeout = setTimeout(runDemoCycle, 3500);
        }
      }, 900 + Math.random() * 500);
    }, recordDuration);

    demoInterval = levelInterval;
  }

  // Start after a brief initial delay
  demoTimeout = setTimeout(runDemoCycle, 1200);

  // Return cleanup
  return () => {
    if (demoInterval) clearInterval(demoInterval);
    if (demoTimeout) clearTimeout(demoTimeout);
    for (const fn of cleanupQueue) fn();
    cleanupQueue = [];
  };
}
