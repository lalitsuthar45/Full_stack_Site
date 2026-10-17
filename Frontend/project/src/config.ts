const host =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "127.0.0.1"
    : window.location.hostname;

// Sahi tarika (Railway URL fallback ke sath):
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || "https://pythonfastapi-production-f08a.up.railway.app";