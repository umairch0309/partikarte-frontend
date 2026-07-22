import { useFetch } from "./api-hooks/useFetch";

/**
 * Stripe Connect readiness for the logged-in business.
 * Ready = chargesEnabled (can accept ticket payments).
 */
export function useStripeConnectStatus() {
  const { response, isLoading } = useFetch(
    ["stripe-connect-status"],
    "stripe/connect/status",
    {
      staleTime: 30_000,
      gcTime: 60_000,
    }
  );

  const stripe = response?.stripe || {};
  const isStripeReady = Boolean(stripe.chargesEnabled);
  const isConnected = Boolean(stripe.accountId);

  return {
    stripe,
    isStripeReady,
    isConnected,
    isLoading,
  };
}
