import { Router } from "express";
import { streamChat } from "../agent.js";

export const chatRouter = Router();

chatRouter.post("/chat", async (req, res) => {
  const { message, sessionId } = req.body ?? {};

  if (typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  res.writeHead(200, {
    "Content-Type": "application/x-ndjson; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const send = (obj: unknown) => {
    res.write(`${JSON.stringify(obj)}\n`);
  };

  req.on("close", () => {
    // Client disconnected; the generator will finish naturally once the
    // underlying SDK query resolves. Nothing to clean up explicitly here.
  });

  try {
    for await (const event of streamChat({ message, sessionId: typeof sessionId === "string" ? sessionId : undefined })) {
      send(event);
    }
  } catch (err) {
    send({ type: "error", message: err instanceof Error ? err.message : "Unknown error" });
  } finally {
    res.end();
  }
});
