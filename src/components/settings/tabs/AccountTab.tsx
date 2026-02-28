// ============================================================
// REDE - Account Settings Tab
// Compact — no scrolling
// ============================================================

import { type CSSProperties, useCallback } from "react";
import { useAuthStore } from "../../../stores/authStore";

const S: Record<string, CSSProperties> = {
  section: { marginBottom: 16 },
  title: {
    fontSize: 11, fontWeight: 600, color: "#5A5A66",
    textTransform: "uppercase" as const, letterSpacing: "0.05em",
    marginBottom: 6, paddingLeft: 2,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.025)",
    borderRadius: 10, padding: "2px 14px",
    border: "1px solid rgba(255, 255, 255, 0.045)",
  },
  divider: { height: 1, backgroundColor: "rgba(255, 255, 255, 0.04)", margin: 0 },
  row: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "9px 0", gap: 16,
  },
  label: { fontSize: 13, fontWeight: 500, color: "#EAEAEF" },
};

function getInitials(name: string): string {
  return name.split(" ").map((p) => p.charAt(0)).join("").toUpperCase().slice(0, 2);
}

function statusColor(s: string): CSSProperties {
  switch (s) {
    case "active": return { backgroundColor: "rgba(34,197,94,0.08)", color: "#22C55E" };
    case "trialing": return { backgroundColor: "rgba(229,57,53,0.08)", color: "#E53935" };
    case "past_due": return { backgroundColor: "rgba(245,158,11,0.08)", color: "#F59E0B" };
    default: return { backgroundColor: "rgba(239,68,68,0.08)", color: "#EF4444" };
  }
}

export function AccountTab() {
  const user = useAuthStore((s) => s.user);
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const handleSignOut = useCallback(async () => {
    try { await logout(); } catch { /* store */ }
  }, [logout]);

  if (!isAuth || !user) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "40px 24px", textAlign: "center",
      }}>
        <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.2 }}>&#128100;</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#EAEAEF", marginBottom: 3 }}>Not signed in</div>
        <div style={{ fontSize: 11, color: "#5A5A66" }}>Sign in to sync across devices.</div>
      </div>
    );
  }

  const subStatus: string = "active";
  const subPlan: string = "monthly";

  return (
    <div>
      <div style={S.section}>
        <div style={S.title}>Profile</div>
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              backgroundColor: "rgba(229,57,53,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 700, color: "#E53935", flexShrink: 0,
              overflow: "hidden",
            }}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              ) : getInitials(user.name)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#EAEAEF" }}>{user.name}</span>
              <span style={{ fontSize: 11, color: "#5A5A66" }}>{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={S.section}>
        <div style={S.title}>Subscription</div>
        <div style={S.card}>
          <div style={S.row}>
            <div style={S.label}>Status</div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
              textTransform: "capitalize",
              ...statusColor(subStatus),
            }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "currentColor" }} />
              {subStatus === "past_due" ? "Past Due" : subStatus}
            </span>
          </div>
          <div style={S.divider} />
          <div style={S.row}>
            <div style={S.label}>Plan</div>
            <span style={{ fontSize: 12, color: "#5A5A66", fontWeight: 500 }}>
              {subPlan === "annual" ? "Annual" : "Monthly"}
            </span>
          </div>
          <div style={S.divider} />
          <div style={S.row}>
            <div style={S.label}>Manage</div>
            <button style={{
              padding: "4px 11px", borderRadius: 6, fontSize: 11, fontWeight: 500,
              border: "1px solid rgba(229,57,53,0.18)",
              backgroundColor: "rgba(229,57,53,0.06)",
              color: "#E53935", cursor: "pointer", fontFamily: "inherit",
            }}>
              Manage
            </button>
          </div>
        </div>
      </div>

      <div style={{ ...S.section, marginBottom: 0 }}>
        <button
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "100%", padding: "9px 16px", borderRadius: 8,
            border: "1px solid rgba(239,68,68,0.12)",
            backgroundColor: "rgba(239,68,68,0.04)",
            color: "#EF4444", fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.12s ease",
          }}
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
