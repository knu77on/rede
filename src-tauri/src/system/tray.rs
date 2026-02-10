use super::AppInfo;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum TrayError {
    #[error("Tray error: {0}")]
    SystemError(String),
}

/// Get information about the currently focused application
pub fn get_focused_app() -> Result<Option<AppInfo>, TrayError> {
    // TODO: Use NSWorkspace to get the frontmost application
    // let workspace = NSWorkspace::sharedWorkspace();
    // let app = workspace.frontmostApplication();
    Ok(None)
}

/// Get the tone context for a given application
pub fn get_app_tone(bundle_id: &str) -> &'static str {
    match bundle_id {
        "com.tinyspeck.slackmacgap" => "casual",
        "com.apple.mail" | "com.microsoft.Outlook" => "professional",
        "com.apple.MobileSMS" => "casual",
        "com.apple.Notes" => "neutral",
        _ => "neutral",
    }
}
