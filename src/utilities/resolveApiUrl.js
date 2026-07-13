import { BASE_URL } from "../constants";

// Use the local /api backend in development, or when explicitly enabled for Vercel.
export const USE_LOCAL_API =
  import.meta.env.VITE_USE_LOCAL_API === "true" || import.meta.env.DEV;

export function resolveApiUrl(path = "") {
  const normalizedPath = String(path).replace(/^\//, "");

  if (USE_LOCAL_API) {
    return `/api/${normalizedPath}`;
  }

  return `${BASE_URL}${normalizedPath}`;
}
