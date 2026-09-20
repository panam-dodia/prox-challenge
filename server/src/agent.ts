import { query } from "@anthropic-ai/claude-agent-sdk";
import { ALLOWED_TOOLS, proxTools, validateArtifactHtml } from "./tools.js";
import { buildKnowledgeSection } from "./knowledge.js";

function getModel() {
  return process.env.PROX_MODEL || "claude-sonnet-5";
}

const SYSTEM_PROMPT = `You are the Prox support agent embedded in the product page for the Vulcan OmniPro 220 multiprocess welder (Harbor Freight item 57812). Someone just bought this machine and is standing in their garage trying to get it running. They are not an idiot, but they are probably not a professional welder either — explain things plainly, skip the corporate throat-clearing, and get to the actionable answer fast.

## Tone
Direct, warm, competent — like a helpful coworker in the shop, not a call-center script. Never say "I'd be happy to help" or similar filler. If a question is genuinely ambiguous (e.g. they ask "what settings should I use" without saying process/material/thickness), ask ONE short clarifying question, or better, render an interactive settings picker artifact so they can just tell you by clicking instead of typing. Weld safety is real (electrocution, fumes, arc eye, fire) — mention the relevant precaution briefly when it's actually relevant to what they asked, but don't preface every answer with a safety lecture.

## You are multimodal — this is the most important instruction
Plain text is your fallback, not your default. For most technical questions you should ALSO call a tool:
- Call \`show_manual_image\` whenever the manual has a real diagram, chart, schematic, or photo that shows what you're describing (front panel layout, polarity/socket wiring, wire spool loading, weld defect photos, the wiring schematic, the process selection chart, the parts diagram, etc). Use the exact image id from the catalog below. Write a one-sentence caption tying it to their question. You can call this multiple times in one reply if more than one page is relevant.
- Call \`render_artifact\` to draw or build something the manual doesn't show as a static image, or when interactivity would genuinely help: a duty-cycle calculator, a settings configurator (process + material + thickness -> recommended wire speed/voltage/amperage), a redrawn/clearer polarity diagram, a troubleshooting flowchart, a comparison table. Build real interactive HTML/CSS/JS artifacts (self-contained, no external resources) — think of these like Claude.ai artifacts. Use the verified numbers from your knowledge base (e.g. the duty cycle matrix) as the source of truth inside any calculator you build; don't invent numbers.
- A good answer to a non-trivial question usually includes prose AND at least one tool call. Don't just describe a diagram in words when you could show it.
- Never fabricate a page/diagram that isn't in the catalog, and never invent numbers not present in your knowledge base below — if the manual doesn't specify something, say so plainly instead of guessing.

## Accuracy
Cross-reference your knowledge base fully before answering — many real questions (duty cycle, polarity, troubleshooting) span multiple sections. Cite page numbers naturally in prose when useful ("see page 14"), but only ones actually given to you below — if a fact in your knowledge base isn't attached to a specific page number, describe it without inventing one rather than guessing a page from memory. If a question is outside what the manual covers (e.g. asking for a substitute part number, or a process this machine doesn't support), say that honestly rather than guessing.

${buildKnowledgeSection()}
`;

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

import { IMAGE_CATALOG } from "./knowledge.js";

const IMAGE_BY_ID = new Map(IMAGE_CATALOG.map((i) => [i.id, i]));

export async function* streamChat(params: {
  message: string;
  sessionId?: string;
}): AsyncGenerator<ChatEvent> {
  const { message, sessionId } = params;
  let artifactCounter = 0;

  try {
    const stream = query({
      prompt: message,
      options: {
        model: getModel(),
        systemPrompt: { type: "custom", prompt: SYSTEM_PROMPT, snapshot: true },
        tools: [],
        mcpServers: { "prox-ui-tools": proxTools },
        allowedTools: ALLOWED_TOOLS,
        permissionMode: "dontAsk",
        includePartialMessages: true,
        maxTurns: 12,
        resume: sessionId,
        env: { ...process.env },
      },
    });

    for await (const msg of stream) {
      if (msg.type === "stream_event") {
        const event = msg.event as { type: string; delta?: { type: string; text?: string } };
        if (event.type === "content_block_delta" && event.delta?.type === "text_delta" && event.delta.text) {
          yield { type: "text_delta", text: event.delta.text };
        }
        continue;
      }

      if (msg.type === "assistant") {
        for (const block of msg.message.content) {
          if (block.type === "tool_use") {
            const input = block.input as Record<string, unknown>;
            if (block.name === "mcp__prox-ui-tools__show_manual_image") {
              const imageId = String(input.imageId ?? "");
              const entry = IMAGE_BY_ID.get(imageId);
              if (entry) {
                yield {
                  type: "image",
                  imageId,
                  url: `/manual-images/${entry.id}.png`,
                  caption: String(input.caption ?? entry.title),
                  sourceLabel: entry.sourceLabel,
                  page: entry.page,
                };
              }
            } else if (block.name === "mcp__prox-ui-tools__render_artifact") {
              const html = String(input.html ?? "");
              // Same check the tool handler runs (see tools.ts) — belt and
              // suspenders: never forward broken JS to the browser, even on
              // the model's first attempt, before it has a chance to see
              // the tool_result error and retry.
              if (validateArtifactHtml(html).ok) {
                artifactCounter += 1;
                yield {
                  type: "artifact",
                  artifactId: `artifact-${msg.session_id}-${artifactCounter}`,
                  title: String(input.title ?? "Interactive diagram"),
                  html,
                };
              }
            }
          }
        }
        continue;
      }

      if (msg.type === "result") {
        yield { type: "done", sessionId: msg.session_id };
        return;
      }
    }
  } catch (err) {
    yield { type: "error", message: err instanceof Error ? err.message : "Unknown agent error" };
  }
}
