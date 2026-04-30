// Baked in at build time. On Vercel, set VITE_API_BASE_URL to your public API (e.g. Railway).
// No trailing slash: adding paths like /api/... would otherwise produce //api/... and 404s.
// Never default to localhost in production; the browser would call the visitor's machine, not your API.
const rawBase =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:8765" : "");
const BASE_URL = rawBase ? rawBase.replace(/\/+$/, "") : "";

async function request(path, { fallback = null, signal } = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${path}`);
    return await res.json();
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn(`[api] ${path} failed, using fallback:`, err.message);
    }
    return fallback;
  }
}

export const api = {
  projects: (opts) => request("/api/projects", opts),
  services: (opts) => request("/api/services", opts),
  credentials: (opts) => request("/api/credentials", opts),
  credential: (id, opts) => request(`/api/credentials/${encodeURIComponent(id)}`, opts),
  experience: (opts) => request("/api/experience", opts),
};

export { BASE_URL };
