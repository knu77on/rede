use super::AudioLevelInfo;
use std::sync::{Arc, Mutex};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum CaptureError {
    #[error("Failed to start audio capture: {0}")]
    StartError(String),
    #[error("Failed to stop audio capture: {0}")]
    StopError(String),
    #[error("Audio capture not active")]
    NotActive,
    #[error("Audio capture already active")]
    AlreadyActive,
}

lazy_static_buffer! {}

static AUDIO_BUFFER: once_cell::sync::Lazy<Arc<Mutex<Vec<u8>>>> =
    once_cell::sync::Lazy::new(|| Arc::new(Mutex::new(Vec::new())));

static IS_RECORDING: once_cell::sync::Lazy<Arc<Mutex<bool>>> =
    once_cell::sync::Lazy::new(|| Arc::new(Mutex::new(false)));

static CURRENT_LEVEL: once_cell::sync::Lazy<Arc<Mutex<AudioLevelInfo>>> =
    once_cell::sync::Lazy::new(|| {
        Arc::new(Mutex::new(AudioLevelInfo {
            rms: 0.0,
            peak: 0.0,
            db: -60.0,
        }))
    });

/// Start audio capture from the specified device (or default)
pub fn start(device_id: Option<String>) -> Result<(), CaptureError> {
    let mut recording = IS_RECORDING
        .lock()
        .map_err(|e| CaptureError::StartError(e.to_string()))?;

    if *recording {
        return Err(CaptureError::AlreadyActive);
    }

    // Clear the buffer
    if let Ok(mut buffer) = AUDIO_BUFFER.lock() {
        buffer.clear();
    }

    *recording = true;
    let _device_id = device_id;

    // TODO: Initialize cpal stream with AudioConfig::default()
    // and start capturing audio data into AUDIO_BUFFER
    // The stream callback should also update CURRENT_LEVEL

    Ok(())
}

/// Stop audio capture and return the captured audio data
pub fn stop() -> Result<Vec<u8>, CaptureError> {
    let mut recording = IS_RECORDING
        .lock()
        .map_err(|e| CaptureError::StopError(e.to_string()))?;

    if !*recording {
        return Err(CaptureError::NotActive);
    }

    *recording = false;

    // TODO: Stop cpal stream

    let buffer = AUDIO_BUFFER
        .lock()
        .map_err(|e| CaptureError::StopError(e.to_string()))?;

    Ok(buffer.clone())
}

/// Get the current audio input level
pub fn get_level() -> Result<AudioLevelInfo, CaptureError> {
    let level = CURRENT_LEVEL
        .lock()
        .map_err(|e| CaptureError::StopError(e.to_string()))?;

    Ok(level.clone())
}
