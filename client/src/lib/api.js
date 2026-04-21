const BASE_URL =
  (import.meta.env && import.meta.env.VITE_API_BASE_URL) || "http://localhost:8000";

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
  experience: (opts) => request("/api/experience", opts),
};

export { BASE_URL };
