// The backend URL. For local development, set VITE_API_URL=http://127.0.0.1:8000 in .env
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://funmade-college-backend-app.onrender.com");

export const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || "School Management Portal";

