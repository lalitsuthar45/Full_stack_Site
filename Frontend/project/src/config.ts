const LOCAL_API_URL = "http://127.0.0.1:8000";

const LIVE_API_URL =
  "https://full-stack-site-tau.vercel.app";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? LOCAL_API_URL
    : LIVE_API_URL);