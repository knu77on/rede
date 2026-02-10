use thiserror::Error;

#[derive(Error, Debug)]
pub enum KeychainError {
    #[error("Keychain error: {0}")]
    AccessError(String),
    #[error("Item not found")]
    NotFound,
}

/// Store a value in the macOS Keychain
pub fn set(service: &str, key: &str, value: &str) -> Result<(), KeychainError> {
    // TODO: Use keyring crate
    // let entry = keyring::Entry::new(service, key)
    //     .map_err(|e| KeychainError::AccessError(e.to_string()))?;
    // entry.set_password(value)
    //     .map_err(|e| KeychainError::AccessError(e.to_string()))?;
    let _ = (service, key, value);
    Ok(())
}

/// Retrieve a value from the macOS Keychain
pub fn get(service: &str, key: &str) -> Result<Option<String>, KeychainError> {
    // TODO: Use keyring crate
    // let entry = keyring::Entry::new(service, key)
    //     .map_err(|e| KeychainError::AccessError(e.to_string()))?;
    // match entry.get_password() {
    //     Ok(password) => Ok(Some(password)),
    //     Err(keyring::Error::NoEntry) => Ok(None),
    //     Err(e) => Err(KeychainError::AccessError(e.to_string())),
    // }
    let _ = (service, key);
    Ok(None)
}

/// Delete a value from the macOS Keychain
pub fn delete(service: &str, key: &str) -> Result<(), KeychainError> {
    // TODO: Use keyring crate
    // let entry = keyring::Entry::new(service, key)
    //     .map_err(|e| KeychainError::AccessError(e.to_string()))?;
    // entry.delete_credential()
    //     .map_err(|e| KeychainError::AccessError(e.to_string()))?;
    let _ = (service, key);
    Ok(())
}
