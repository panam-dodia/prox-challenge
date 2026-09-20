/// <reference types="vite/client" />
/**
 * When the client and server are on the same origin (local dev, via the
 * Vite proxy in vite.config.ts), this stays empty and every request is a
 * relative path. When deployed as two separate services (e.g. a Render
 * static site + a Render web service), set VITE_API_BASE_URL at build
 * time to the backend's public URL.
 */
const rawBase = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "");
// Render's `fromService` blueprint reference returns a bare host
// (e.g. "prox-vulcan-agent-api.onrender.com"), not a full URL — add the
// scheme if it's missing. A value that already includes one (local
// overrides, other hosts) passes through unchanged.
export const API_BASE_URL = rawBase && !/^https?:\/\//.test(rawBase) ? `https://${rawBase}` : rawBase;

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
