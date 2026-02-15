// ============================================================
// REDE - Account Settings Tab
// Compact — no scrolling
// ============================================================

import { type CSSProperties, useCallback } from "react";
import { useAuthStore } from "../../../stores/authStore";

// --- Styles ---

const styles: Record<string, CSSProperties> = {
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#6E6E7A",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    marginBottom: 6,
    paddingLeft: 2,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 10,
    padding: "2px 14px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    margin: 0,
  },
  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 0",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "rgba(229, 57, 53, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 700,
    color: "#E53935",
    flexShrink: 0,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    borderRadius: "50%",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column" as const,
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#F5F5F7",
  },
  profileEmail: {
    fontSize: 11,
    color: "#6E6E7A",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0",
    gap: 16,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: "#F5F5F7",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    textTransform: "capitalize" as const,
  },
  statusActive: {
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    color: "#34D399",
  },
  statusTrialing: {
    backgroundColor: "rgba(229, 57, 53, 0.1)",
    color: "#E53935",
  },
  statusExpired: {
    backgroundColor: "rgba(248, 113, 113, 0.1)",
    color: "#F87171",
  },
  statusPastDue: {
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    color: "#FBBF24",
  },
  valueText: {
    fontSize: 12,
    color: "#6E6E7A",
    fontWeight: 500,
  },
  manageButton: {
    padding: "4px 11px",
    borderRadius: 6,
    border: "1px solid rgba(229, 57, 53, 0.2)",
    backgroundColor: "rgba(229, 57, 53, 0.06)",
    color: "#E53935",
    fontSize: 11,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.12s ease",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  },
  signOutButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid rgba(248, 113, 113, 0.15)",
    backgroundColor: "rgba(248, 113, 113, 0.05)",
    color: "#F87171",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.12s ease",
    fontFamily: "inherit",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 24px",
    textAlign: "center" as const,
  },
  emptyIcon: {
    fontSize: 28,
    marginBottom: 8,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#F5F5F7",
    marginBottom: 3,
  },
  emptyText: {
    fontSize: 11,
    color: "#6E6E7A",
    lineHeight: "15px",
  },
};

// --- Helpers ---

function getInitials(name: string): string {
  return name.split(" ").map((p) => p.charAt(0)).join("").toUpperCase().slice(0, 2);
}

function getStatusStyle(status: string): CSSProperties {
  switch (status) {
    case "active": return styles.statusActive;
    case "trialing": return styles.statusTrialing;
    case "past_due": return styles.statusPastDue;
    case "canceled":
    case "expired": return styles.statusExpired;
    default: return styles.statusActive;
  }
}

function formatStatusLabel(status: string): string {
  return status === "past_due" ? "Past Due" : status;
}

// --- Component ---

export function AccountTab() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const handleSignOut = useCallback(async () => {
    try { await logout(); } catch { /* store */ }
  }, [logout]);

  const handleManageSubscription = useCallback(() => {
    // TODO: Open Stripe customer portal
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>&#128100;</div>
        <div style={styles.emptyTitle}>Not signed in</div>
        <div style={styles.emptyText}>Sign in to sync across devices.</div>
      </div>
    );
  }

  const subscriptionStatus = "active";
  const subscriptionPlan: string = "monthly";

  return (
    <div>
      {/* Profile */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Profile</div>
        <div style={styles.card}>
          <div style={styles.profileCard}>
            <div style={styles.avatar}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} style={styles.avatarImage} />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div style={styles.profileInfo}>
              <span style={styles.profileName}>{user.name}</span>
              <span style={styles.profileEmail}>{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Subscription</div>
        <div style={styles.card}>
          <div style={styles.row}>
            <div style={styles.rowLabel}>Status</div>
            <span style={{ ...styles.statusBadge, ...getStatusStyle(subscriptionStatus) }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "currentColor" }} />
              {formatStatusLabel(subscriptionStatus)}
            </span>
          </div>
          <div style={styles.divider} />
          <div style={styles.row}>
            <div style={styles.rowLabel}>Plan</div>
            <span style={styles.valueText}>{subscriptionPlan === "annual" ? "Annual" : "Monthly"}</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.row}>
            <div style={styles.rowLabel}>Manage</div>
            <button style={styles.manageButton} onClick={handleManageSubscription}>Manage</button>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div style={{ ...styles.section, marginBottom: 0 }}>
        <button style={styles.signOutButton} onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
}
