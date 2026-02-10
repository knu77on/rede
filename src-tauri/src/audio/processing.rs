use thiserror::Error;

#[derive(Error, Debug)]
pub enum ProcessingError {
    #[error("Audio processing failed: {0}")]
    ProcessingFailed(String),
}

/// Configuration for silence detection
pub struct SilenceConfig {
    pub noise_gate_threshold_db: f32,
    pub silence_timeout_ms: u64,
    pub min_speech_duration_ms: u64,
}

impl Default for SilenceConfig {
    fn default() -> Self {
        Self {
            noise_gate_threshold_db: -50.0,
            silence_timeout_ms: 1500,
            min_speech_duration_ms: 500,
        }
    }
}

/// Detect if the audio buffer contains silence
pub fn is_silence(samples: &[f32], threshold_db: f32) -> bool {
    if samples.is_empty() {
        return true;
    }

    let rms = calculate_rms(samples);
    let db = 20.0 * rms.log10();
    db < threshold_db
}

/// Calculate RMS (Root Mean Square) of audio samples
pub fn calculate_rms(samples: &[f32]) -> f32 {
    if samples.is_empty() {
        return 0.0;
    }

    let sum_of_squares: f32 = samples.iter().map(|s| s * s).sum();
    (sum_of_squares / samples.len() as f32).sqrt()
}

/// Calculate peak amplitude of audio samples
pub fn calculate_peak(samples: &[f32]) -> f32 {
    samples
        .iter()
        .map(|s| s.abs())
        .fold(0.0f32, |a, b| a.max(b))
}

/// Convert linear amplitude to decibels
pub fn amplitude_to_db(amplitude: f32) -> f32 {
    if amplitude <= 0.0 {
        return -60.0;
    }
    20.0 * amplitude.log10()
}

/// Apply gain boost (for whisper mode)
pub fn apply_gain(samples: &mut [f32], gain_db: f32) {
    let gain_linear = 10.0f32.powf(gain_db / 20.0);
    for sample in samples.iter_mut() {
        *sample = (*sample * gain_linear).clamp(-1.0, 1.0);
    }
}
