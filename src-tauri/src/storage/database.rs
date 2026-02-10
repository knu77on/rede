use std::sync::Mutex;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum DatabaseError {
    #[error("Database error: {0}")]
    SqliteError(String),
    #[error("Database not initialized")]
    NotInitialized,
}

static DB_PATH: once_cell::sync::Lazy<Mutex<Option<String>>> =
    once_cell::sync::Lazy::new(|| Mutex::new(None));

/// Initialize the SQLite database with schema
pub fn initialize(path: &str) -> Result<(), DatabaseError> {
    let mut db_path = DB_PATH
        .lock()
        .map_err(|e| DatabaseError::SqliteError(e.to_string()))?;
    *db_path = Some(path.to_string());

    // TODO: Open database connection and run migrations
    // let conn = rusqlite::Connection::open(path)
    //     .map_err(|e| DatabaseError::SqliteError(e.to_string()))?;

    // Run schema migrations
    // create_tables(&conn)?;

    Ok(())
}

/// Execute a write query
pub fn execute(query: &str, params: &[String]) -> Result<(), DatabaseError> {
    let db_path = DB_PATH
        .lock()
        .map_err(|e| DatabaseError::SqliteError(e.to_string()))?;
    let _path = db_path.as_ref().ok_or(DatabaseError::NotInitialized)?;

    // TODO: Execute query with rusqlite
    let _ = (query, params);
    Ok(())
}

/// Execute a read query and return results as JSON
pub fn query(query: &str, params: &[String]) -> Result<String, DatabaseError> {
    let db_path = DB_PATH
        .lock()
        .map_err(|e| DatabaseError::SqliteError(e.to_string()))?;
    let _path = db_path.as_ref().ok_or(DatabaseError::NotInitialized)?;

    // TODO: Execute query and serialize results to JSON
    let _ = (query, params);
    Ok("[]".to_string())
}

/// SQL schema for local database
pub const SCHEMA: &str = r#"
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS history (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    original_text TEXT,
    was_corrected INTEGER NOT NULL DEFAULT 0,
    language TEXT NOT NULL DEFAULT 'en',
    duration_ms INTEGER NOT NULL DEFAULT 0,
    word_count INTEGER NOT NULL DEFAULT 0,
    target_app TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS snippets (
    id TEXT PRIMARY KEY,
    trigger TEXT NOT NULL,
    content TEXT NOT NULL,
    variables TEXT,
    case_sensitive INTEGER NOT NULL DEFAULT 0,
    enabled INTEGER NOT NULL DEFAULT 1,
    usage_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS dictionary (
    id TEXT PRIMARY KEY,
    word TEXT NOT NULL UNIQUE,
    phonetic_hint TEXT,
    category TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at);
CREATE INDEX IF NOT EXISTS idx_snippets_trigger ON snippets(trigger);
CREATE INDEX IF NOT EXISTS idx_dictionary_word ON dictionary(word);
"#;
