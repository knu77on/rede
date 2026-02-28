// ============================================================
// REDE - Registration Form
// Streamlined sign-up with password strength feedback
// ============================================================

import React from "react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

interface StrengthResult { score: number; label: string; color: string; }

function computeStrength(pw: string): StrengthResult {
  if (!pw) return { score: 0, label: "", color: "#4A4A56" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  s = Math.min(4, s);
  const map: Record<number, { label: string; color: string }> = {
    0: { label: "Very weak", color: "#EF4444" },
    1: { label: "Weak", color: "#EF4444" },
    2: { label: "Fair", color: "#F59E0B" },
    3: { label: "Strong", color: "#22C55E" },
    4: { label: "Very strong", color: "#22C55E" },
  };
  return { score: s, ...map[s] };
}

function validateName(n: string) { return !n.trim() ? "Name is required" : undefined; }
function validateEmail(e: string) {
  if (!e.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return "Enter a valid email";
  return undefined;
}
function validatePassword(p: string) {
  if (!p) return "Password is required";
  if (p.length < 8) return "At least 8 characters";
  return undefined;
}
function validateConfirm(pw: string, c: string) {
  if (!c) return "Please confirm your password";
  if (pw !== c) return "Passwords do not match";
  return undefined;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  error = null,
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const strength = computeStrength(password);

  const clearErr = (f: string) => {
    if (fieldErrors[f]) setFieldErrors((p) => { const n = { ...p }; delete n[f]; return n; });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const ne = validateName(name); if (ne) e.name = ne;
    const ee = validateEmail(email); if (ee) e.email = ee;
    const pe = validatePassword(password); if (pe) e.password = pe;
    const ce = validateConfirm(password, confirm); if (ce) e.confirm = ce;
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    onSubmit(name, email, password);
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
        label="Name"
        type="text"
        value={name}
        onChange={(v) => { setName(v); if (submitted) clearErr("name"); }}
        placeholder="Your name"
        error={fieldErrors.name}
        autoComplete="name"
        autoFocus
      />

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(v) => { setEmail(v); if (submitted) clearErr("email"); }}
        placeholder="you@example.com"
        error={fieldErrors.email}
        autoComplete="email"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(v) => { setPassword(v); if (submitted) clearErr("password"); }}
          placeholder="At least 8 characters"
          error={fieldErrors.password}
          autoComplete="new-password"
        />
        {password.length > 0 && (
          <>
            <div style={{ display: "flex", gap: 3, height: 3, marginTop: 2 }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: "100%",
                    borderRadius: 2,
                    backgroundColor: i < strength.score ? strength.color : "rgba(255,255,255,0.05)",
                    transition: "background-color 200ms ease",
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: strength.color }}>
              {strength.label}
            </span>
          </>
        )}
      </div>

      <Input
        label="Confirm Password"
        type="password"
        value={confirm}
        onChange={(v) => { setConfirm(v); if (submitted) clearErr("confirm"); }}
        placeholder="Re-enter your password"
        error={fieldErrors.confirm}
        autoComplete="new-password"
      />

      <Button type="submit" variant="primary" size="lg" loading={isLoading} fullWidth>
        Create Account
      </Button>

      <p style={{
        fontSize: 11,
        color: "#4A4A56",
        textAlign: "center",
        lineHeight: "16px",
      }}>
        By creating an account, you agree to our{" "}
        <a href="#terms" style={{ color: "#E53935", textDecoration: "none" }}>Terms</a>
        {" "}and{" "}
        <a href="#privacy" style={{ color: "#E53935", textDecoration: "none" }}>Privacy Policy</a>
      </p>
    </form>
  );
};

export default RegisterForm;
