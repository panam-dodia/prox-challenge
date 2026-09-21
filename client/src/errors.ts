/**
 * `fetch()` rejects with a generic TypeError ("Failed to fetch" in Chrome,
 * "NetworkError when attempting to fetch resource" in Firefox, "Load
 * failed" in Safari) whenever the request never got a response at all —
 * DNS failure, connection refused, or (the common real case here) the
 * Render free-tier backend is still waking up from being spun down after
 * 15 minutes idle. That raw browser message means nothing to a user and
 * looks like the app is broken. A server-returned error (4xx/5xx with a
 * real body) is informative on its own and passes through unchanged.
 */
export function describeError(err: unknown): string {
  if (err instanceof TypeError && /fetch|network|load failed/i.test(err.message)) {
    return "Couldn't reach the server. If this is the hosted demo, the free-tier backend sleeps after inactivity and can take up to a minute to wake up — try sending your message again in a few seconds.";
  }
  return err instanceof Error ? err.message : "Connection error";
}
