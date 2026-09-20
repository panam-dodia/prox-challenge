import type { ChatEvent } from "./types";
import { apiUrl } from "./config";

export async function* sendMessage(params: {
  message: string;
  sessionId?: string;
  signal?: AbortSignal;
}): AsyncGenerator<ChatEvent> {
  const res = await fetch(apiUrl("/api/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: params.message, sessionId: params.sessionId }),
    signal: params.signal,
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (!line) continue;
      try {
        yield JSON.parse(line) as ChatEvent;
      } catch {
        // ignore malformed line
      }
    }
  }

  const rest = buffer.trim();
  if (rest) {
    try {
      yield JSON.parse(rest) as ChatEvent;
    } catch {
      // ignore
    }
  }
}
