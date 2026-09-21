import { useRef, useState } from "react";
import { sendMessage } from "./api";
import { apiUrl } from "./config";
import { describeError } from "./errors";
import { MessageBubble } from "./components/MessageBubble";
import { CanvasPanel } from "./components/CanvasPanel";
import { StarterPrompts } from "./components/StarterPrompts";
import type { CanvasItem, ChatMessage, MessagePart } from "./types";

let idCounter = 0;
const nextId = () => `m${++idCounter}`;

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [activeCanvasKey, setActiveCanvasKey] = useState<string | null>(null);
  const [canvasOpenMobile, setCanvasOpenMobile] = useState(false);
  const sessionIdRef = useRef<string | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  async function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: ChatMessage = { id: nextId(), role: "user", parts: [{ kind: "text", text: trimmed }] };
    const assistantId = nextId();
    const assistantMsg: ChatMessage = { id: assistantId, role: "assistant", parts: [{ kind: "text", text: "" }], pending: true };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    function updateAssistant(mutate: (parts: MessagePart[]) => MessagePart[]) {
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, parts: mutate(m.parts) } : m))
      );
    }

    let partKeyCounter = 0;

    try {
      for await (const event of sendMessage({ message: trimmed, sessionId: sessionIdRef.current, signal: controller.signal })) {
        if (event.type === "text_delta" && event.text) {
          updateAssistant((parts) => {
            const last = parts[parts.length - 1];
            if (last && last.kind === "text") {
              return [...parts.slice(0, -1), { kind: "text", text: last.text + event.text }];
            }
            return [...parts, { kind: "text", text: event.text! }];
          });
        } else if (event.type === "image" && event.imageId && event.url) {
          const key = `img-${event.imageId}-${++partKeyCounter}`;
          const item: CanvasItem = {
            kind: "image",
            key,
            imageId: event.imageId,
            url: apiUrl(event.url),
            caption: event.caption ?? "",
            sourceLabel: event.sourceLabel ?? "",
            page: event.page ?? 0,
          };
          setCanvasItems((prev) => [...prev, item]);
          setActiveCanvasKey(key);
          setCanvasOpenMobile(true);
          updateAssistant((parts) => [
            ...parts,
            { kind: "image", partKey: key, imageId: item.imageId, url: item.url, caption: item.caption, sourceLabel: item.sourceLabel, page: item.page },
            { kind: "text", text: "" },
          ]);
        } else if (event.type === "artifact" && event.artifactId && event.html) {
          const key = `art-${event.artifactId}`;
          const item: CanvasItem = { kind: "artifact", key, artifactId: event.artifactId, title: event.title ?? "Artifact", html: event.html };
          setCanvasItems((prev) => [...prev, item]);
          setActiveCanvasKey(key);
          setCanvasOpenMobile(true);
          updateAssistant((parts) => [
            ...parts,
            { kind: "artifact", partKey: key, artifactId: item.artifactId, title: item.title, html: item.html },
            { kind: "text", text: "" },
          ]);
        } else if (event.type === "done") {
          sessionIdRef.current = event.sessionId;
        } else if (event.type === "error") {
          setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, error: event.message } : m)));
        }
      }
    } catch (err) {
      setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, error: describeError(err) } : m)));
    } finally {
      setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, pending: false } : m)));
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  const hasStarted = messages.length > 0;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">VULCAN</span>
          <span className="brand-sep">/</span>
          <span className="brand-model">OmniPro 220</span>
        </div>
        <div className="brand-tag">Prox multimodal support agent</div>
      </header>

      <main className="app-main">
        <section className="chat-column">
          <div className="chat-scroll">
            {!hasStarted && <StarterPrompts onPick={handleSend} />}
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
                onOpenCanvas={(key) => {
                  setActiveCanvasKey(key);
                  setCanvasOpenMobile(true);
                }}
              />
            ))}
          </div>

          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about setup, settings, troubleshooting..."
              disabled={isStreaming}
              autoFocus
            />
            <button type="submit" disabled={isStreaming || !input.trim()}>
              {isStreaming ? "…" : "Send"}
            </button>
          </form>
        </section>

        <section className={`canvas-column ${canvasOpenMobile ? "mobile-open" : ""}`}>
          <CanvasPanel
            items={canvasItems}
            activeKey={activeCanvasKey}
            onSelect={setActiveCanvasKey}
            onClose={() => setCanvasOpenMobile(false)}
          />
        </section>
      </main>
    </div>
  );
}
