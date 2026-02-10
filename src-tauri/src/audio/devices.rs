use super::AudioDeviceInfo;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum DeviceError {
    #[error("Failed to enumerate audio devices: {0}")]
    EnumerationError(String),
    #[error("No audio input devices found")]
    NoDevicesFound,
}

/// List available audio input devices
pub fn list_devices() -> Result<Vec<AudioDeviceInfo>, DeviceError> {
    // TODO: Implement using cpal
    // use cpal::traits::{DeviceTrait, HostTrait};
    // let host = cpal::default_host();
    // let devices = host.input_devices()
    //     .map_err(|e| DeviceError::EnumerationError(e.to_string()))?;

    // Placeholder - returns empty list until cpal is integrated
    Ok(vec![AudioDeviceInfo {
        id: "default".to_string(),
        name: "Default Input Device".to_string(),
        is_default: true,
    }])
}

/// Get the default input device
pub fn get_default_device() -> Result<AudioDeviceInfo, DeviceError> {
    list_devices()?
        .into_iter()
        .find(|d| d.is_default)
        .ok_or(DeviceError::NoDevicesFound)
}
