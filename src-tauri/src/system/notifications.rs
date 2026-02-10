use thiserror::Error;

#[derive(Error, Debug)]
pub enum NotificationError {
    #[error("Notification error: {0}")]
    SendError(String),
}

/// Send a native macOS notification
pub fn send(title: &str, body: &str) -> Result<(), NotificationError> {
    // TODO: Use tauri-plugin-notification
    let _ = (title, body);
    Ok(())
}
