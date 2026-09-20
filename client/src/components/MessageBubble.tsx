import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage, MessagePart } from "../types";

function ImageCard({ part, onOpen }: { part: Extract<MessagePart, { kind: "image" }>; onOpen: () => void }) {
  return (
    <button className="media-card" onClick={onOpen}>
      <img src={part.url} alt={part.caption} loading="lazy" />
      <div className="media-card-meta">
        <span className="media-card-caption">{part.caption}</span>
        <span className="media-card-source">
          {part.sourceLabel} · p.{part.page}
        </span>
      </div>
    </button>
  );
}

function ArtifactCard({ part, onOpen }: { part: Extract<MessagePart, { kind: "artifact" }>; onOpen: () => void }) {
  return (
    <button className="media-card artifact-card" onClick={onOpen}>
      <div className="artifact-card-icon">⚙</div>
      <div className="media-card-meta">
        <span className="media-card-caption">{part.title}</span>
        <span className="media-card-source">Interactive artifact · tap to open</span>
      </div>
    </button>
  );
}

export function MessageBubble({
  message,
  onOpenCanvas,
}: {
  message: ChatMessage;
  onOpenCanvas: (key: string) => void;
}) {
  return (
    <div className={`message-row ${message.role}`}>
      <div className={`bubble ${message.role}`}>
        {message.parts.map((part, i) => {
          if (part.kind === "text") {
            if (!part.text.trim() && message.pending) {
              return (
                <span className="typing-dots" key={i}>
                  <span />
                  <span />
                  <span />
                </span>
              );
            }
            return (
              <div className="markdown" key={i}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.text}</ReactMarkdown>
              </div>
            );
          }
          if (part.kind === "image") {
            return <ImageCard key={i} part={part} onOpen={() => onOpenCanvas(part.partKey)} />;
          }
          return <ArtifactCard key={i} part={part} onOpen={() => onOpenCanvas(part.partKey)} />;
        })}
        {message.error && <div className="error-banner">⚠ {message.error}</div>}
      </div>
    </div>
  );
}
