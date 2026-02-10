// ============================================================
// REDE - Account Settings Tab
// ============================================================

import { type CSSProperties, useCallback } from "react";
import { useAuthStore } from "../../../stores/authStore";

// --- Styles ---

const styles: Record<string, CSSProperties> = {
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#A0A0B0",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: "rgba(28, 28, 35, 0.95)",
    borderRadius: 12,
    padding: "4px 16px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    margin: 0,
  },
  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "16px 0",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    backgroundColor: "rgba(229, 57, 53, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
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
    gap: 2,
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 600,
    color: "#FFFFFF",
  },
  profileEmail: {
    fontSize: 13,
    color: "#A0A0B0",
  },
  profileProvider: {
    fontSize: 11,
    color: "#606070",
    textTransform: "capitalize" as const,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 0",
    gap: 16,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: "#FFFFFF",
  },
  rowDescription: {
    fontSize: 12,
    color: "#A0A0B0",
    marginTop: 2,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    textTransform: "capitalize" as const,
  },
  statusActive: {
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    color: "#34D399",
  },
  statusTrialing: {
    backgroundColor: "rgba(229, 57, 53, 0.12)",
    color: "#E53935",
  },
  statusExpired: {
    backgroundColor: "rgba(248, 113, 113, 0.15)",
    color: "#F87171",
  },
  statusPastDue: {
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    color: "#FBBF24",
  },
  valueText: {
    fontSize: 14,
    color: "#A0A0B0",
    fontWeight: 500,
  },
  signOutButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid rgba(248, 113, 113, 0.25)",
    backgroundColor: "rgba(248, 113, 113, 0.08)",
    color: "#F87171",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: "inherit",
  },
  manageButton: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid rgba(229, 57, 53, 0.25)",
    backgroundColor: "rgba(229, 57, 53, 0.08)",
    color: "#E53935",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    textAlign: "center" as const,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 16,
    opacity: 0.4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#FFFFFF",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "#A0A0B0",
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

function getStatusStyle(
  status: string,
): CSSProperties {
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
    // TODO: Open Stripe customer portal via Tauri shell
    // await invoke("open_customer_portal");
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>&#128100;</div>
        <div style={styles.emptyTitle}>Not signed in</div>
        <div style={styles.emptyText}>
          Sign in to sync your settings, snippets, and dictionary across
          devices.
        </div>
      </div>
    );
  }

  // TODO: Fetch actual subscription from a subscription store
  // For now, show a placeholder status
  const subscriptionStatus = "active";
  const subscriptionPlan = "monthly";

  return (
    <div>
      {/* Profile */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Profile</div>
        <div style={styles.sectionContent}>
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
        <div style={styles.sectionContent}>
          {/* Status */}
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
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "currentColor",
                }}
              />
              {formatStatusLabel(subscriptionStatus)}
            </span>
          </div>

          <div style={styles.divider} />

          {/* Plan */}
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Plan</div>
            </div>
            <span style={styles.valueText}>
              {subscriptionPlan === "annual" ? "Annual" : "Monthly"}
            </span>
          </div>

          <div style={styles.divider} />

          {/* Manage */}
          <div style={styles.row}>
            <div>
              <div style={styles.rowLabel}>Manage Subscription</div>
              <div style={styles.rowDescription}>
                Update payment method, change plan, or cancel
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
