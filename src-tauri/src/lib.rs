mod audio;
mod keyboard;
mod accessibility;
mod storage;
mod system;

use tauri::Manager;

#[tauri::command]
fn get_audio_devices() -> Result<Vec<audio::AudioDeviceInfo>, String> {
    audio::devices::list_devices().map_err(|e| e.to_string())
}

#[tauri::command]
fn start_recording(device_id: Option<String>) -> Result<(), String> {
    audio::capture::start(device_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn stop_recording() -> Result<Vec<u8>, String> {
    audio::capture::stop().map_err(|e| e.to_string())
}

#[tauri::command]
fn get_audio_level() -> Result<audio::AudioLevelInfo, String> {
    audio::capture::get_level().map_err(|e| e.to_string())
}

#[tauri::command]
fn insert_text(text: String) -> Result<(), String> {
    accessibility::text_insertion::insert(&text).map_err(|e| e.to_string())
}

#[tauri::command]
fn check_permissions() -> Result<accessibility::PermissionStatus, String> {
    accessibility::permissions::check_all().map_err(|e| e.to_string())
}

#[tauri::command]
fn request_permission(permission: String) -> Result<bool, String> {
    accessibility::permissions::request(&permission).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_focused_app() -> Result<Option<system::AppInfo>, String> {
    system::tray::get_focused_app().map_err(|e| e.to_string())
}

#[tauri::command]
fn db_execute(query: String, params: Vec<String>) -> Result<(), String> {
    storage::database::execute(&query, &params).map_err(|e| e.to_string())
}

#[tauri::command]
fn db_query(query: String, params: Vec<String>) -> Result<String, String> {
    storage::database::query(&query, &params).map_err(|e| e.to_string())
}

#[tauri::command]
fn keychain_set(service: String, key: String, value: String) -> Result<(), String> {
    storage::keychain::set(&service, &key, &value).map_err(|e| e.to_string())
}

#[tauri::command]
fn keychain_get(service: String, key: String) -> Result<Option<String>, String> {
    storage::keychain::get(&service, &key).map_err(|e| e.to_string())
}

#[tauri::command]
fn keychain_delete(service: String, key: String) -> Result<(), String> {
    storage::keychain::delete(&service, &key).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            // Initialize database
            let app_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to get app data directory");
            std::fs::create_dir_all(&app_dir).ok();

            let db_path = app_dir.join("rede.db");
            storage::database::initialize(db_path.to_str().unwrap())
                .expect("Failed to initialize database");

            // Set up keyboard listener
            let app_handle = app.handle().clone();
            std::thread::spawn(move || {
                keyboard::listener::start(app_handle);
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_audio_devices,
            start_recording,
            stop_recording,
            get_audio_level,
            insert_text,
            check_permissions,
            request_permission,
            get_focused_app,
            db_execute,
            db_query,
            keychain_set,
            keychain_get,
            keychain_delete,
        ])
        .run(tauri::generate_context!())
        .expect("error while running REDE");
}
