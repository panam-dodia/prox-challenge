/**
 * One-time build step: renders every page of the three source PDFs to PNG
 * images and dumps their raw text layer. Output is committed to the repo
 * under data/manual/ so the app never needs to touch a PDF (or poppler/
 * ghostscript/etc.) at runtime — just `npm run extract` once when the
 * source manuals change.
 *
 * The curated, human-quality knowledge base that the agent actually reads
 * lives in server/src/knowledge.ts and cites these page images by id.
 * This script only produces the raw materials (images + text) plus a
 * manifest so that ids stay in sync with real files.
 */
import { createCanvas } from "@napi-rs/canvas";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FILES_DIR = path.join(ROOT, "files");
const OUT_DIR = path.join(ROOT, "data", "manual");
const IMAGES_DIR = path.join(OUT_DIR, "images");

const SOURCES = [
  { id: "owner-manual", file: "owner-manual.pdf", label: "Owner's Manual & Safety Instructions" },
  { id: "quick-start-guide", file: "quick-start-guide.pdf", label: "Quick Start Guide" },
  { id: "selection-chart", file: "selection-chart.pdf", label: "How to Choose a Welder (Selection Chart)" },
] as const;

const SCALE = 2.0;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

async function extractSource(source: (typeof SOURCES)[number]) {
  const filePath = path.join(FILES_DIR, source.file);
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjsLib.getDocument({ data }).promise;

  const pages: Array<{
    id: string;
    source: string;
    sourceLabel: string;
    page: number;
    totalPages: number;
    image: string;
    rawText: string;
  }> = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: SCALE });
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext("2d") as unknown as import("pdfjs-dist").CanvasRenderingContext2D;
    await page.render({ canvasContext: ctx, viewport }).promise;

    const id = `${source.id}-p${pad(pageNum)}`;
    const imageName = `${id}.png`;
    fs.writeFileSync(path.join(IMAGES_DIR, imageName), canvas.toBuffer("image/png"));

    const textContent = await page.getTextContent();
    const rawText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    pages.push({
      id,
      source: source.id,
      sourceLabel: source.label,
      page: pageNum,
      totalPages: doc.numPages,
      image: `images/${imageName}`,
      rawText,
    });

    process.stdout.write(`  ${id} rendered (${Math.round(viewport.width)}x${Math.round(viewport.height)})\n`);
  }

  return pages;
}

async function main() {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const manifest: Record<string, unknown>[] = [];
  for (const source of SOURCES) {
    console.log(`Extracting ${source.file}...`);
    const pages = await extractSource(source);
    manifest.push(...pages);
  }

  fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\nWrote ${manifest.length} pages to data/manual/manifest.json and data/manual/images/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
