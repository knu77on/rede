// ============================================================
// REDE - Equalizer Visualization Hook
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { useRecordingStore } from "../stores/recordingStore";

// --- Constants ---

const BAR_COUNT = 5;
const SMOOTHING_FACTOR = 0.3;
const DECAY_RATE = 0.92;
const MIN_LEVEL = 0.02;
const IDLE_ANIMATION_SPEED = 0.002;

// --- Types ---

interface EqualizerResult {
  levels: number[];
  isActive: boolean;
}

// --- Hook ---

export function useEqualizer(): EqualizerResult {
  const audioLevels = useRecordingStore((s) => s.audioLevels);
  const recordingState = useRecordingStore((s) => s.state);
  const isActive = recordingState === "recording";

  const [levels, setLevels] = useState<number[]>(
    () => new Array(BAR_COUNT).fill(0),
  );

  const smoothedRef = useRef<number[]>(new Array(BAR_COUNT).fill(0));
  const animationFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  // Distribute raw audio levels across the 5 bars with interpolation
  const distributeToBar = useCallback(
    (barIndex: number, rawLevels: number[]): number => {
      if (rawLevels.length === 0) return 0;

      if (rawLevels.length === 1) {
        // Single level: create variation by bar position
        const base = rawLevels[0];
        const variation = Math.sin((barIndex / BAR_COUNT) * Math.PI) * 0.3 + 0.7;
        return base * variation;
      }

      // Map bar index to a position in the raw levels array
      const position = (barIndex / (BAR_COUNT - 1)) * (rawLevels.length - 1);
      const lowerIndex = Math.floor(position);
      const upperIndex = Math.min(lowerIndex + 1, rawLevels.length - 1);
      const fraction = position - lowerIndex;

      // Linear interpolation
      return rawLevels[lowerIndex] * (1 - fraction) + rawLevels[upperIndex] * fraction;
    },
    [],
  );

  useEffect(() => {
    let running = true;

    const animate = () => {
      if (!running) return;

      timeRef.current += 1;
      const smoothed = smoothedRef.current;

      for (let i = 0; i < BAR_COUNT; i++) {
        let target: number;

        if (isActive && audioLevels.length > 0) {
          // Active recording: use real audio data
          target = distributeToBar(i, audioLevels);
        } else if (isActive) {
          // Recording active but no levels yet: subtle idle pulse
          target =
            MIN_LEVEL +
            Math.sin(timeRef.current * IDLE_ANIMATION_SPEED + i * 0.8) *
              MIN_LEVEL *
              0.5;
        } else {
          // Not recording: decay to zero
          target = 0;
        }

        // Smooth transition: rise fast, fall slow
        if (target > smoothed[i]) {
          smoothed[i] = smoothed[i] + (target - smoothed[i]) * SMOOTHING_FACTOR;
        } else {
          smoothed[i] = smoothed[i] * DECAY_RATE;
        }

        // Clamp
        if (smoothed[i] < MIN_LEVEL * 0.1) {
          smoothed[i] = 0;
        }
      }

      setLevels([...smoothed]);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isActive, audioLevels, distributeToBar]);

  return { levels, isActive };
}
