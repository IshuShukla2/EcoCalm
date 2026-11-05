// EcoCalm API Base URL configuration for local dev, Render, and Vercel
export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export const apiPath = (path) => {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${API_URL}${path}`;
};

// Intercept window.fetch so all existing /api calls automatically route to VITE_API_URL
if (typeof window !== "undefined" && API_URL) {
  const originalFetch = window.fetch;
  window.fetch = (input, init) => {
    if (typeof input === "string" && input.startsWith("/api")) {
      input = `${API_URL}${input}`;
    }
    return originalFetch(input, init);
  };
}

export default API_URL;

