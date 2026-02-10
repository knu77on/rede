use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HotkeyConfig {
    pub key: String,
    pub modifiers: Vec<String>,
    pub mode: ActivationMode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ActivationMode {
    Push,   // Hold to record, release to stop
    Toggle, // Press to start, press again to stop
}

impl Default for HotkeyConfig {
    fn default() -> Self {
        Self {
            key: "Control".to_string(),
            modifiers: vec![],
            mode: ActivationMode::Push,
        }
    }
}

/// State tracking for push-to-talk debouncing
pub struct HotkeyState {
    pub is_pressed: bool,
    pub press_time: Option<std::time::Instant>,
    pub is_recording: bool,
}

impl Default for HotkeyState {
    fn default() -> Self {
        Self {
            is_pressed: false,
            press_time: None,
            is_recording: false,
        }
    }
}

impl HotkeyState {
    /// Handle key press event
    pub fn on_press(&mut self) -> bool {
        if self.is_pressed {
            return false; // Ignore repeated presses
        }
        self.is_pressed = true;
        self.press_time = Some(std::time::Instant::now());
        true
    }

    /// Handle key release event
    pub fn on_release(&mut self) -> bool {
        if !self.is_pressed {
            return false;
        }
        self.is_pressed = false;
        self.press_time = None;
        true
    }
}
