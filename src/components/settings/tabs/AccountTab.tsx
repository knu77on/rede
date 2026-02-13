// ============================================================
// REDE - Account Settings Tab
// ============================================================

import { type CSSProperties, useCallback } from "react";
import { useAuthStore } from "../../../stores/authStore";

// --- Styles ---

const styles: Record<string, CSSProperties> = {
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#8E8E9A",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    marginBottom: 8,
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
    gap: 14,
    padding: "14px 0",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    backgroundColor: "rgba(229, 57, 53, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
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
    gap: 1,
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#F5F5F7",
  },
  profileEmail: {
    fontSize: 12,
    color: "#8E8E9A",
  },
  profileProvider: {
    fontSize: 11,
    color: "#55555F",
    textTransform: "capitalize" as const,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
    gap: 16,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: "#F5F5F7",
  },
  rowDescription: {
    fontSize: 11,
    color: "#8E8E9A",
    marginTop: 2,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 9px",
    borderRadius: 5,
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
    fontSize: 13,
    color: "#8E8E9A",
    fontWeight: 500,
  },
  manageButton: {
    padding: "6px 14px",
    borderRadius: 7,
    border: "1px solid rgba(229, 57, 53, 0.2)",
    backgroundColor: "rgba(229, 57, 53, 0.06)",
    color: "#E53935",
    fontSize: 12,
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
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid rgba(248, 113, 113, 0.2)",
    backgroundColor: "rgba(248, 113, 113, 0.06)",
    color: "#F87171",
    fontSize: 13,
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
    padding: "40px 24px",
    textAlign: "center" as const,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 12,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#F5F5F7",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: "#8E8E9A",
    lineHeight: "17px",
  },
};

// --- Helpers ---

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getStatusStyle(status: string): CSSProperties {
  switch (status) {
    case "active":
      return styles.statusActive;
    case "trialing":
      return styles.statusTrialing;
    case "past_due":
      return styles.statusPastDue;
    case "canceled":
    case "expired":
      return styles.statusExpired;
    default:
      return styles.statusActive;
  }
}

function formatStatusLabel(status: string): string {
  switch (status) {
    case "past_due":
      return "Past Due";
    default:
      return status;
  }
}

// --- Component ---

export function AccountTab() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const handleSignOut = useCallback(async () => {
    try {
      await logout();
    } catch {
      // Error is handled by the store
    }
  }, [logout]);

  const handleManageSubscription = useCallback(() => {
    // TODO: Open Stripe customer portal
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>&#128100;</div>
        <div style={styles.emptyTitle}>Not signed in</div>
        <div style={styles.emptyText}>
          Sign in to sync settings, snippets, and dictionary across devices.
        </div>
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
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  style={styles.avatarImage}
                />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div style={styles.profileInfo}>
              <span style={styles.profileName}>{user.name}</span>
              <span style={styles.profileEmail}>{user.email}</span>
              <span style={styles.profileProvider}>
                {user.auth_provider} account
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Subscription</div>
        <div style={styles.card}>
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Status</div>
            </div>
            <span
              style={{
                ...styles.statusBadge,
                ...getStatusStyle(subscriptionStatus),
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  backgroundColor: "currentColor",
                }}
              />
              {formatStatusLabel(subscriptionStatus)}
            </span>
          </div>

          <div style={styles.divider} />

          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Plan</div>
            </div>
            <span style={styles.valueText}>
              {subscriptionPlan === "annual" ? "Annual" : "Monthly"}
            </span>
          </div>

          <div style={styles.divider} />

          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Manage Subscription</div>
              <div style={styles.rowDescription}>
                Update payment, change plan, or cancel
              </div>
            </div>
            <button
              style={styles.manageButton}
              onClick={handleManageSubscription}
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div style={styles.section}>
        <button style={styles.signOutButton} onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
