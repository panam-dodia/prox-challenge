import { useMemo } from "react";
import type { CanvasItem } from "../types";

function artifactDoc(html: string) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 18px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif;
        color: #1a1410;
        background: #ffffff;
      }
      img { max-width: 100%; }
    </style>
  </head>
  <body>${html}</body>
</html>`;
}

export function CanvasPanel({
  items,
  activeKey,
  onSelect,
  onClose,
}: {
  items: CanvasItem[];
  activeKey: string | null;
  onSelect: (key: string) => void;
  onClose?: () => void;
}) {
  const active = useMemo(() => items.find((i) => i.key === activeKey) ?? items[items.length - 1], [items, activeKey]);

  if (!active) {
    return (
      <div className="canvas-panel canvas-empty">
        <div className="canvas-empty-inner">
          <div className="canvas-empty-icon">🔧</div>
          <p>Diagrams, manual pages, and interactive tools will open here as we talk.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="canvas-panel">
      <div className="canvas-header">
        <div className="canvas-tabs">
          {items.map((item) => (
            <button
              key={item.key}
              className={`canvas-tab ${item.key === active.key ? "active" : ""}`}
              onClick={() => onSelect(item.key)}
              title={item.kind === "image" ? item.caption : item.title}
            >
              {item.kind === "image" ? "🖼" : "⚙"} {item.kind === "image" ? `p.${item.page}` : item.title}
            </button>
          ))}
        </div>
        {onClose && (
          <button className="canvas-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        )}
      </div>

      <div className="canvas-body">
        {active.kind === "image" ? (
          <div className="canvas-image-wrap">
            <img src={active.url} alt={active.caption} />
            <div className="canvas-caption">
              <strong>{active.sourceLabel}</strong> · page {active.page}
              <p>{active.caption}</p>
            </div>
          </div>
        ) : (
          <div className="canvas-artifact-wrap">
            <div className="canvas-artifact-title">{active.title}</div>
            <iframe
              className="artifact-frame"
              sandbox="allow-scripts"
              srcDoc={artifactDoc(active.html)}
              title={active.title}
            />
          </div>
        )}
      </div>
    </div>
  );
}
