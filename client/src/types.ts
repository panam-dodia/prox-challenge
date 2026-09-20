export interface ChatEvent {
  type: "text_delta" | "image" | "artifact" | "done" | "error";
  text?: string;
  imageId?: string;
  url?: string;
  caption?: string;
  sourceLabel?: string;
  page?: number;
  artifactId?: string;
  title?: string;
  html?: string;
  sessionId?: string;
  message?: string;
}

export type MessagePart =
  | { kind: "text"; text: string }
  | { kind: "image"; partKey: string; imageId: string; url: string; caption: string; sourceLabel: string; page: number }
  | { kind: "artifact"; partKey: string; artifactId: string; title: string; html: string };

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  parts: MessagePart[];
  pending?: boolean;
  error?: string;
}

export type CanvasItem =
  | { kind: "image"; key: string; imageId: string; url: string; caption: string; sourceLabel: string; page: number }
  | { kind: "artifact"; key: string; artifactId: string; title: string; html: string };
