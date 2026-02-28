// ============================================================
// REDE - Login Form
// Clean, minimal form with refined validation
// ============================================================

import React from "react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required";
  return undefined;
}

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
    <form
      style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}
      onSubmit={handleSubmit}
      noValidate
    >
      {error && (
        <div style={{
          padding: "9px 14px",
          backgroundColor: "rgba(239, 68, 68, 0.06)",
          border: "1px solid rgba(239, 68, 68, 0.12)",
          borderRadius: 8,
          fontSize: 12,
          color: "#EF4444",
          lineHeight: "17px",
        }}>
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(val) => { setEmail(val); if (submitted) clearFieldError("email"); }}
        placeholder="you@example.com"
        error={fieldErrors.email}
        autoComplete="email"
        autoFocus
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(val) => { setPassword(val); if (submitted) clearFieldError("password"); }}
        placeholder="Enter your password"
        error={fieldErrors.password}
        autoComplete="current-password"
      />

      {onForgotPassword && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            style={{
              fontSize: 12,
              color: "#E53935",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              opacity: forgotHovered ? 0.65 : 1,
              transition: "opacity 150ms ease",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
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
