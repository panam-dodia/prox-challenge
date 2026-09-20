import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { IMAGE_CATALOG, IMAGE_IDS } from "./knowledge.js";

/**
 * Structured payloads emitted alongside the tool's text return value.
 * The chat route listens for these tool_use blocks in the stream and
 * forwards a matching UI event to the frontend (see routes/chat.ts).
 * The `content` returned here is just what Claude itself "sees" as the
 * tool result — the frontend never reads it.
 */

/**
 * Server-side safety net for generated artifacts: LLM-written inline <script>
 * blocks occasionally contain a real JS syntax error (e.g. a double-escaped
 * apostrophe like `machine\\'s` inside a single-quoted string, which
 * terminates the string early and throws `Unexpected identifier`). A syntax
 * error anywhere in the script means NONE of it runs — including whatever
 * wires up onclick handlers — so the whole artifact looks "unclickable"
 * with no visible sign of what broke. `new Function(...)` compiles (but
 * never executes) each script's source, which is enough to catch syntax
 * errors before the artifact ever reaches the browser.
 */
export function validateArtifactHtml(html: string): { ok: true } | { ok: false; error: string } {
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = scriptRegex.exec(html))) {
    try {
      // eslint-disable-next-line no-new-func
      new Function(match[1]);
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }
  return { ok: true };
}

const showManualImage = tool(
  "show_manual_image",
  "Display a real page/diagram/photo from the Vulcan OmniPro 220 manual to the user, inline in the chat. Use the exact imageId from the reference image catalog in your system prompt. Use this whenever a diagram, chart, schematic, or photo would explain the answer better than prose alone (e.g. polarity setup, front panel layout, weld defect photos, wiring schematic, selection chart).",
  {
    imageId: z
      .string()
      .describe("Exact id from the reference image catalog, e.g. 'owner-manual-p14'"),
    caption: z
      .string()
      .describe("One sentence explaining what the user is looking at and why it's relevant to their question"),
  },
  async ({ imageId, caption }) => {
    if (!IMAGE_IDS.has(imageId)) {
      const suggestions = IMAGE_CATALOG.slice(0, 5)
        .map((i) => i.id)
        .join(", ");
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `Unknown imageId "${imageId}". It must exactly match an id from the catalog, e.g. ${suggestions}.`,
          },
        ],
      };
    }
    return {
      content: [{ type: "text" as const, text: `Shown to user: ${imageId} — ${caption}` }],
    };
  },
  { annotations: { readOnlyHint: true, title: "Show manual image" } }
);

const renderArtifact = tool(
  "render_artifact",
  "Render an interactive, self-contained HTML artifact inline in the chat — like a duty-cycle calculator, a settings configurator, a redrawn/clarified diagram, or a troubleshooting flowchart. Use this whenever something is too cognitively hard to explain in plain text, or the user would benefit from plugging in their own numbers. The HTML must be fully self-contained: inline <style> and <script> only, no external network requests, no imports. Keep it visually clean and legible at ~600px wide. Prefer plain HTML/CSS/SVG/JS — no frameworks.\n\nJS string-escaping matters here: a single syntax error anywhere in your <script> silently breaks EVERY handler in it (including tab/button switching), with no visible error to the user. Prefer double-quoted strings or template literals (`text`) over single-quoted strings so apostrophes in words like \"machine's\" or \"doesn't\" never need escaping — that exact mistake (writing a literal backslash before an apostrophe inside a single-quoted string) is the most common way this breaks. Prefer addEventListener wiring in one script block over inline onclick=\"...\" attributes, which are more escaping-prone. Your script is syntax-checked server-side before the user ever sees it; a rejected call will tell you the exact parse error to fix.\n\nAlso handle out-of-range or edge-case input explicitly wherever a control accepts free numeric entry (e.g. an amperage field/slider) — if a value is above the machine's rated max or otherwise outside what the manual specifies, show a clear message saying so instead of leaving the result area blank.",
  {
    title: z.string().describe("Short title shown above the artifact, e.g. 'Duty Cycle Calculator'"),
    html: z
      .string()
      .describe("Complete, self-contained HTML fragment (not a full document — no <html>/<head>/<body> tags needed, just the content)."),
  },
  async ({ title, html }) => {
    const validation = validateArtifactHtml(html);
    if (!validation.ok) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `The <script> in this artifact has a JavaScript syntax error and was NOT shown to the user: ${validation.error}. This usually means an apostrophe inside a single-quoted string wasn't escaped correctly (e.g. "machine's" needs to be "machine\\'s" in a single-quoted string, or better, just use double quotes/template literals to avoid the issue entirely). Fix the script and call render_artifact again.`,
          },
        ],
      };
    }
    return {
      content: [{ type: "text" as const, text: `Rendered interactive artifact for user: ${title}` }],
    };
  },
  { annotations: { readOnlyHint: true, title: "Render interactive artifact" } }
);

export const proxTools = createSdkMcpServer({
  name: "prox-ui-tools",
  version: "1.0.0",
  tools: [showManualImage, renderArtifact],
});

export const ALLOWED_TOOLS = [
  "mcp__prox-ui-tools__show_manual_image",
  "mcp__prox-ui-tools__render_artifact",
];
