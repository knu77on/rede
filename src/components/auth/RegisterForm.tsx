// ============================================================
// REDE - Registration Form Component
// macOS dark glass aesthetic
// ============================================================

import React from "react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";

// --- Types ---

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

// --- Constants ---

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// --- Styles ---

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  width: "100%",
};

const errorBannerStyle: React.CSSProperties = {
  padding: "10px 14px",
  backgroundColor: "rgba(248, 113, 113, 0.08)",
  border: "1px solid rgba(248, 113, 113, 0.15)",
  borderRadius: 8,
  fontSize: 12,
  color: "#F87171",
  fontFamily: FONT,
  lineHeight: "17px",
};

const strengthContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const strengthBarTrackStyle: React.CSSProperties = {
  display: "flex",
  gap: 4,
  height: 3,
};

const strengthSegmentBaseStyle: React.CSSProperties = {
  flex: 1,
  height: "100%",
  borderRadius: 2,
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  transition: "background-color 200ms ease",
};

const strengthLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  fontFamily: FONT,
  lineHeight: "14px",
  transition: "color 200ms ease",
};

const termsTextStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#55555F",
  fontFamily: FONT,
  textAlign: "center",
  lineHeight: "16px",
};

const termsLinkStyle: React.CSSProperties = {
  color: "#E53935",
  textDecoration: "none",
  cursor: "pointer",
};

// --- Password Strength ---

interface StrengthResult {
  score: number;
  label: string;
  color: string;
}

function computePasswordStrength(password: string): StrengthResult {
  if (!password) return { score: 0, label: "", color: "#55555F" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  score = Math.min(4, score);

  const levels: Record<number, { label: string; color: string }> = {
    0: { label: "Very weak", color: "#F87171" },
    1: { label: "Weak", color: "#F87171" },
    2: { label: "Fair", color: "#FBBF24" },
    3: { label: "Strong", color: "#34D399" },
    4: { label: "Very strong", color: "#34D399" },
  };

  return { score, ...levels[score] };
}

// --- Validation ---

function validateName(name: string): string | undefined {
  if (!name.trim()) return "Name is required";
  return undefined;
}

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return undefined;
}

function validateConfirmPassword(password: string, confirm: string): string | undefined {
  if (!confirm) return "Please confirm your password";
  if (password !== confirm) return "Passwords do not match";
  return undefined;
}

// --- Component ---

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  error = null,
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const strength = computePasswordStrength(password);

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

    const nameError = validateName(name);
    if (nameError) errors.name = nameError;

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;

    const confirmError = validateConfirmPassword(password, confirmPassword);
    if (confirmError) errors.confirmPassword = confirmError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validate()) return;

    onSubmit(name, email, password);
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit} noValidate>
      {error && <div style={errorBannerStyle}>{error}</div>}

      <Input
        label="Name"
        type="text"
        value={name}
        onChange={(val) => {
          setName(val);
          if (submitted) clearFieldError("name");
        }}
        placeholder="Your name"
        error={fieldErrors.name}
        autoComplete="name"
        autoFocus
      />

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
      />

      <div style={strengthContainerStyle}>
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(val) => {
            setPassword(val);
            if (submitted) clearFieldError("password");
          }}
          placeholder="At least 8 characters"
          error={fieldErrors.password}
          autoComplete="new-password"
        />

        {password.length > 0 && (
          <>
            <div style={strengthBarTrackStyle}>
              {[0, 1, 2, 3].map((segment) => (
                <div
                  key={segment}
                  style={{
                    ...strengthSegmentBaseStyle,
                    backgroundColor:
                      segment < strength.score
                        ? strength.color
                        : "rgba(255, 255, 255, 0.06)",
                  }}
                />
              ))}
            </div>
            <span style={{ ...strengthLabelStyle, color: strength.color }}>
              {strength.label}
            </span>
          </>
        )}
      </div>

      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(val) => {
          setConfirmPassword(val);
          if (submitted) clearFieldError("confirmPassword");
        }}
        placeholder="Re-enter your password"
        error={fieldErrors.confirmPassword}
        autoComplete="new-password"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isLoading}
        fullWidth
      >
        Create Account
      </Button>

      <p style={termsTextStyle}>
        By creating an account, you agree to our{" "}
        <a href="#terms" style={termsLinkStyle}>
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#privacy" style={termsLinkStyle}>
          Privacy Policy
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;
