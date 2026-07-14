import { BASE_URL } from "../constants";

// Only use the Vite mock /api when explicitly enabled.
// Default local development talks to the Express backend (BASE_URL).
export const USE_LOCAL_API = import.meta.env.VITE_USE_LOCAL_API === "true";

export function resolveApiUrl(path = "") {
  const normalizedPath = String(path).replace(/^\//, "");

  if (USE_LOCAL_API) {
    return `/api/${normalizedPath}`;
  }

  return `${BASE_URL}${normalizedPath}`;
}
