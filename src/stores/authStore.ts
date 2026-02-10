// ============================================================
// REDE - Authentication Store
// ============================================================

import { create } from "zustand";
import type { User, Session, AuthProvider } from "../types/index";

// --- Types ---

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: AuthProvider) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

// --- Initial State ---

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// --- Store ---

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Supabase auth: signInWithPassword
      const { supabase } = await import("../services/supabase");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const supaUser = data.session?.user;
      if (!supaUser || !data.session) {
        throw new Error("No session returned from authentication");
      }

      const user: User = {
        id: supaUser.id,
        email: supaUser.email ?? email,
        name: supaUser.user_metadata?.name ?? "",
        avatar_url: supaUser.user_metadata?.avatar_url ?? null,
        auth_provider: "email",
        created_at: supaUser.created_at,
        updated_at: supaUser.updated_at ?? supaUser.created_at,
      };

      const session: Session = {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at ?? 0,
        user,
      };

      set({
        user,
        session,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  loginWithOAuth: async (provider: AuthProvider) => {
    set({ isLoading: true, error: null });
    try {
      const { supabase } = await import("../services/supabase");

      // Map our AuthProvider type to Supabase OAuth provider
      const oauthProvider = provider === "email" ? undefined : provider;
      if (!oauthProvider) {
        throw new Error("OAuth is not available for email provider");
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: oauthProvider,
      });
      if (error) throw error;

      // OAuth redirects the user; session is restored via onAuthStateChange
      // isLoading remains true until the redirect completes
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "OAuth login failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { supabase } = await import("../services/supabase");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;

      const supaUser = data.session?.user ?? data.user;
      if (!supaUser) {
        // User created but email confirmation may be required
        set({ isLoading: false });
        return;
      }

      if (data.session) {
        const user: User = {
          id: supaUser.id,
          email: supaUser.email ?? email,
          name,
          avatar_url: null,
          auth_provider: "email",
          created_at: supaUser.created_at,
          updated_at: supaUser.updated_at ?? supaUser.created_at,
        };

        const session: Session = {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at ?? 0,
          user,
        };

        set({
          user,
          session,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const { supabase } = await import("../services/supabase");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({ ...initialState });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Logout failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  refreshSession: async () => {
    const { session } = get();
    if (!session) return;

    try {
      const { supabase } = await import("../services/supabase");
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: session.refresh_token,
      });
      if (error) throw error;

      if (data.session) {
        const supaUser = data.session.user;
        const user: User = {
          id: supaUser.id,
          email: supaUser.email ?? session.user.email,
          name: supaUser.user_metadata?.name ?? session.user.name,
          avatar_url:
            supaUser.user_metadata?.avatar_url ?? session.user.avatar_url,
          auth_provider: session.user.auth_provider,
          created_at: supaUser.created_at,
          updated_at: supaUser.updated_at ?? supaUser.created_at,
        };

        const newSession: Session = {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at ?? 0,
          user,
        };

        set({ session: newSession, user });
      }
    } catch {
      // If refresh fails, force logout
      set({ ...initialState });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
