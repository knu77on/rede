// ============================================================
// REDE - Login Form Component
// ============================================================

import React from "react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";

// --- Types ---

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

// --- Styles ---

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  width: "100%",
};

const forgotLinkStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#7B61FF",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  textAlign: "right",
  transition: "opacity 150ms ease",
};

const errorBannerStyle: React.CSSProperties = {
  padding: "10px 14px",
  backgroundColor: "rgba(248, 113, 113, 0.1)",
  border: "1px solid rgba(248, 113, 113, 0.2)",
  borderRadius: 8,
  fontSize: 13,
  color: "#F87171",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

// --- Validation ---

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required";
  return undefined;
}

// --- Component ---

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  isLoading = false,
  error = null,
}) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [forgotHovered, setForgotHovered] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validate()) return;

    onSubmit(email, password);
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit} noValidate>
      {error && <div style={errorBannerStyle}>{error}</div>}

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(val) => {
          setEmail(val);
          if (submitted) clearFieldError("email");
        }}
        placeholder="you@example.com"
        error={fieldErrors.email}
        autoComplete="email"
        autoFocus
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(val) => {
          setPassword(val);
          if (submitted) clearFieldError("password");
        }}
        placeholder="Enter your password"
        error={fieldErrors.password}
        autoComplete="current-password"
      />

      {onForgotPassword && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            style={{
              ...forgotLinkStyle,
              opacity: forgotHovered ? 0.8 : 1,
            }}
            onClick={onForgotPassword}
            onMouseEnter={() => setForgotHovered(true)}
            onMouseLeave={() => setForgotHovered(false)}
          >
            Forgot password?
          </button>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isLoading}
        fullWidth
        disabled={!email || !password}
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
