export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5600/api/"
    : "https://partikarte-backend.vercel.app/api/");

export const WEB_URL =
  import.meta.env.VITE_WEB_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5173/"
    : "https://partikarte-frontend.vercel.app/");

export const CryptKey = "glennphilips";
