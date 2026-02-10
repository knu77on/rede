use tauri::{AppHandle, Emitter};

/// Start the global keyboard listener
/// Runs in a dedicated thread and emits events to the frontend
pub fn start(app: AppHandle) {
    // TODO: Implement using rdev
    // use rdev::{listen, Event, EventType, Key};
    //
    // listen(move |event: Event| {
    //     match event.event_type {
    //         EventType::KeyPress(Key::ControlLeft) | EventType::KeyPress(Key::ControlRight) => {
    //             app.emit("hotkey-pressed", ()).ok();
    //         }
    //         EventType::KeyRelease(Key::ControlLeft) | EventType::KeyRelease(Key::ControlRight) => {
    //             app.emit("hotkey-released", ()).ok();
    //         }
    //         EventType::KeyPress(Key::Escape) => {
    //             app.emit("recording-cancelled", ()).ok();
    //         }
    //         _ => {}
    //     }
    // }).expect("Failed to start keyboard listener");

    log::info!("Keyboard listener started");
    let _ = app.emit("keyboard-listener-ready", ());
}
