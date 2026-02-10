// ============================================================
// REDE - Auth State Hook
// ============================================================

import { useCallback } from "react";
import { useAuthStore } from "../stores/authStore";
import type { User, AuthProvider } from "../types/index";

// --- Types ---

interface UseAuthResult {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: AuthProvider) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

// --- Hook ---

export function useAuth(): UseAuthResult {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const storeLogin = useAuthStore((s) => s.login);
  const storeLoginWithOAuth = useAuthStore((s) => s.loginWithOAuth);
  const storeLogout = useAuthStore((s) => s.logout);
  const storeRegister = useAuthStore((s) => s.register);

  const login = useCallback(
    async (email: string, password: string) => {
      await storeLogin(email, password);
    },
    [storeLogin],
  );

  const loginWithOAuth = useCallback(
    async (provider: AuthProvider) => {
      await storeLoginWithOAuth(provider);
    },
    [storeLoginWithOAuth],
  );

  const logout = useCallback(async () => {
    await storeLogout();
  }, [storeLogout]);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await storeRegister(name, email, password);
    },
    [storeRegister],
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithOAuth,
    logout,
    register,
  };
}
