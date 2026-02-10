// ============================================================
// REDE - Stripe Service (via Supabase Edge Functions)
// ============================================================

import { supabase } from "./supabase";

// --- Public API ---

/**
 * Create a Stripe Checkout session for the given subscription plan.
 * Calls a Supabase Edge Function that handles Stripe interaction server-side.
 * Returns the checkout URL to redirect the user to.
 */
export async function createCheckoutSession(
  plan: "monthly" | "annual",
): Promise<string> {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError) throw sessionError;

  const accessToken = sessionData.session?.access_token;
  if (!accessToken) {
    throw new Error("User must be authenticated to create a checkout session");
  }

  const { data, error } = await supabase.functions.invoke(
    "create-checkout-session",
    {
      body: { plan },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (error) {
    throw new Error(
      `Failed to create checkout session: ${error.message}`,
    );
  }

  const checkoutUrl = data?.checkout_url as string | undefined;
  if (!checkoutUrl) {
    throw new Error("No checkout URL returned from server");
  }

  return checkoutUrl;
}

/**
 * Create a Stripe Customer Portal session so the user can manage
 * their subscription, payment method, and billing history.
 * Returns the portal URL to redirect the user to.
 */
export async function createPortalSession(): Promise<string> {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError) throw sessionError;

  const accessToken = sessionData.session?.access_token;
  if (!accessToken) {
    throw new Error("User must be authenticated to access the billing portal");
  }

  const { data, error } = await supabase.functions.invoke(
    "create-portal-session",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (error) {
    throw new Error(
      `Failed to create portal session: ${error.message}`,
    );
  }

  const portalUrl = data?.portal_url as string | undefined;
  if (!portalUrl) {
    throw new Error("No portal URL returned from server");
  }

  return portalUrl;
}
