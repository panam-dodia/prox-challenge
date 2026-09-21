/// <reference types="vite/client" />
/**
 * When the client and server are on the same origin (local dev, via the
 * Vite proxy in vite.config.ts), this stays empty and every request is a
 * relative path. When deployed as two separate services (e.g. a Render
 * static site + a Render web service), set VITE_API_BASE_URL at build
 * time to the backend's public URL.
 */
const rawBase = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "");
// Tolerate a bare host (no scheme) too, in case VITE_API_BASE_URL is ever
// set to just a domain rather than a full URL.
export const API_BASE_URL = rawBase && !/^https?:\/\//.test(rawBase) ? `https://${rawBase}` : rawBase;

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
