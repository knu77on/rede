use thiserror::Error;

#[derive(Error, Debug)]
pub enum LaunchError {
    #[error("Launch item error: {0}")]
    SystemError(String),
}

/// Enable or disable launch at login
pub fn set_launch_at_login(enabled: bool) -> Result<(), LaunchError> {
    // TODO: Use SMAppService (macOS 13+) or LaunchAgents
    let _ = enabled;
    Ok(())
}

/// Check if launch at login is enabled
pub fn is_launch_at_login_enabled() -> Result<bool, LaunchError> {
    // TODO: Check current launch at login status
    Ok(false)
}
