use thiserror::Error;

#[derive(Error, Debug)]
pub enum InsertionError {
    #[error("Failed to insert text: {0}")]
    InsertionFailed(String),
    #[error("No focused text field found")]
    NoTextField,
    #[error("Accessibility permission not granted")]
    PermissionDenied,
}

/// Insert text at the current cursor position using Accessibility API
pub fn insert(text: &str) -> Result<(), InsertionError> {
    // Try AX API first, fall back to clipboard
    match insert_via_accessibility(text) {
        Ok(()) => Ok(()),
        Err(_) => insert_via_clipboard(text),
    }
}

/// Insert text using macOS Accessibility API (AXUIElement)
fn insert_via_accessibility(text: &str) -> Result<(), InsertionError> {
    // TODO: Implement using accessibility-sys or core-foundation
    // 1. Get the focused element using AXUIElementCopySystemWide
    // 2. Get the focused element's AXFocusedUIElement
    // 3. Check if it supports AXValue (text field)
    // 4. Get current AXSelectedTextRange
    // 5. Set AXSelectedText to replace selection, or
    //    Set AXValue with text appended at cursor position
    let _ = text;
    Err(InsertionError::InsertionFailed(
        "AX API not yet implemented".to_string(),
    ))
}

/// Fallback: Insert text via clipboard (Cmd+V)
fn insert_via_clipboard(text: &str) -> Result<(), InsertionError> {
    // TODO: Implement clipboard-based insertion
    // 1. Save current clipboard contents
    // 2. Set clipboard to the new text
    // 3. Simulate Cmd+V keystroke
    // 4. Restore original clipboard contents after brief delay
    let _ = text;
    Err(InsertionError::InsertionFailed(
        "Clipboard insertion not yet implemented".to_string(),
    ))
}
