import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chatRouter } from "./routes/chat.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const IMAGES_DIR = path.join(REPO_ROOT, "data", "manual", "images");

// The server workspace's cwd is server/, but .env lives at the repo root
// (one place for the whole app, matching the README's `cp .env.example .env`).
dotenv.config({ path: path.join(REPO_ROOT, ".env") });

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    "\n[prox] WARNING: ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key before chatting.\n"
  );
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/manual-images", express.static(IMAGES_DIR, { maxAge: "7d", immutable: true }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY) });
});

app.use("/api", chatRouter);

const PORT = Number(process.env.PORT) || 8787;
app.listen(PORT, () => {
  console.log(`[prox] server listening on http://localhost:${PORT}`);
});
