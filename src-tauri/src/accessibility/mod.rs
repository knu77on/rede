pub mod permissions;
pub mod text_insertion;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PermissionStatus {
    pub microphone: PermissionState,
    pub accessibility: PermissionState,
    pub input_monitoring: PermissionState,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PermissionState {
    Granted,
    Denied,
    NotDetermined,
}
