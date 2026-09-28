#!/usr/bin/env bun
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import type { SfxProfile } from "./ffmpeg-args.ts";

const SKILL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(SKILL_DIR, "assets");
const CANVASES = ["portrait", "square", "story", "landscape", "paper"];
const FORMATS = ["mp4", "gif", "png"] as const;
const PROFILES = ["soft", "music", "none"];

const USAGE = `Usage:
  main.ts init <dir> [--style <name>] [--canvas portrait|square|story|landscape|paper] [--force]
  main.ts export <index.html> [--out <dir>] [--name infographic] [--format mp4,gif,png]
                 [--fps 30] [--duration <s>] [--cycles <n>] [--bpm <n>] [--sfx soft|music|none]
                 [--music <file>] [--music-volume 0.35] [--gif-fps 15] [--gif-width 540]
                 [--gif-colors 256] [--gif-dither bayer|sierra|none] [--scale 1] [--quality 92]
  main.ts preview <index.html>
  main.ts list styles|layouts`;

export interface Args {
  cmd: string;
  pos: string[];
  flags: Record<string, string | boolean>;
}

export function parseArgs(argv: string[]): Args {
  const [cmd = "", ...rest] = argv;
  const pos: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=", 2);
      if (v !== undefined) flags[k] = v;
      else if (rest[i + 1] !== undefined && !rest[i + 1].startsWith("--")) flags[k] = rest[++i];
      else flags[k] = true;
    } else pos.push(a);
  }
  return { cmd, pos, flags };
}

const str = (f: Args["flags"], k: string): string | undefined => (typeof f[k] === "string" ? (f[k] as string) : undefined);
const numFlag = (f: Args["flags"], k: string, d?: number): number | undefined => {
  const v = str(f, k);
  if (v === undefined) return d;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`--${k} must be a positive number, got "${v}"`);
  return n;
};

export function parseFormats(v: string | undefined): (typeof FORMATS)[number][] {
  const list = (v ?? "mp4,gif,png").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  for (const f of list) if (!FORMATS.includes(f as never)) throw new Error(`Unknown format "${f}". Use ${FORMATS.join(", ")}.`);
  return [...new Set(list)] as (typeof FORMATS)[number][];
}

export function listNames(dir: string, ext: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(ext)).map((f) => f.slice(0, -ext.length)).sort();
}

function init(a: Args) {
  const dir = a.pos[0];
  if (!dir) throw new Error("init needs a target directory");
  const style = str(a.flags, "style") ?? "light-dashboard";
  const canvas = str(a.flags, "canvas") ?? "portrait";
  if (!CANVASES.includes(canvas) && !/^\d+x\d+$/.test(canvas)) throw new Error(`Unknown canvas "${canvas}"`);
  const styleFile = path.join(ASSETS, "styles", `${style}.css`);
  if (!fs.existsSync(styleFile)) throw new Error(`Unknown style "${style}". Run: main.ts list styles`);
  fs.mkdirSync(dir, { recursive: true });
  const index = path.join(dir, "index.html");
  if (fs.existsSync(index) && !a.flags.force) throw new Error(`${index} exists. Use --force to overwrite the scaffold.`);
  fs.copyFileSync(path.join(ASSETS, "motion.js"), path.join(dir, "motion.js"));
  fs.copyFileSync(path.join(ASSETS, "motion.css"), path.join(dir, "motion.css"));
  fs.copyFileSync(styleFile, path.join(dir, "style.css"));
  const tpl = fs.readFileSync(path.join(ASSETS, "template.html"), "utf8").replaceAll("{{CANVAS}}", canvas).replaceAll("{{STYLE}}", style);
  fs.writeFileSync(index, tpl);
  console.log(JSON.stringify({ status: "ok", dir: path.resolve(dir), index: path.resolve(index), style, canvas }));
}

async function exportCmd(a: Args) {
  const html = a.pos[0];
  if (!html || !fs.existsSync(html)) throw new Error(`HTML file not found: ${html ?? "(missing)"}`);
  const sfx = str(a.flags, "sfx");
  if (sfx && !PROFILES.includes(sfx)) throw new Error(`--sfx must be one of ${PROFILES.join(", ")}`);
  const music = str(a.flags, "music");
  if (music && !fs.existsSync(music)) throw new Error(`Music file not found: ${music}`);
  const { exportInfographic } = await import("./export.ts");
  let last = -1;
  const res = await exportInfographic({
    html,
    outDir: str(a.flags, "out") ?? path.dirname(path.resolve(html)),
    name: str(a.flags, "name") ?? "infographic",
    formats: parseFormats(str(a.flags, "format")),
    fps: numFlag(a.flags, "fps"),
    duration: numFlag(a.flags, "duration"),
    cycles: numFlag(a.flags, "cycles"),
    bpm: numFlag(a.flags, "bpm"),
    sfx: sfx as SfxProfile | undefined,
    music: music ? path.resolve(music) : undefined,
    musicVolume: numFlag(a.flags, "music-volume"),
    gifFps: numFlag(a.flags, "gif-fps", 15)!,
    gifWidth: numFlag(a.flags, "gif-width", 540)!,
    gifColors: numFlag(a.flags, "gif-colors"),
    gifDither: str(a.flags, "gif-dither"),
    scale: numFlag(a.flags, "scale", 1)!,
    quality: numFlag(a.flags, "quality", 92)!,
    onProgress: (d, n) => {
      const pct = Math.floor((d / n) * 10);
      if (pct !== last) {
        last = pct;
        process.stderr.write(`frames ${d}/${n}\n`);
      }
    },
  });
  console.log(JSON.stringify({
    status: "ok",
    files: res.files,
    duration: res.meta.duration,
    fps: res.meta.fps,
    canvas: res.meta.canvas,
    sfx: res.meta.sfx,
    cues: res.meta.cues.length,
    seconds: res.seconds,
    ...(res.warnings.length ? { warnings: res.warnings } : {}),
  }));
}

function preview(a: Args) {
  const html = a.pos[0];
  if (!html || !fs.existsSync(html)) throw new Error(`HTML file not found: ${html ?? "(missing)"}`);
  const file = path.resolve(html);
  const [bin, args] = process.platform === "darwin" ? ["open", [file]] : process.platform === "win32" ? ["cmd", ["/c", "start", "", file]] : ["xdg-open", [file]];
  spawn(bin, args as string[], { stdio: "ignore", detached: true }).unref();
  console.log(JSON.stringify({ status: "ok", opened: file }));
}

function list(a: Args) {
  const what = a.pos[0];
  if (what === "styles") console.log(listNames(path.join(ASSETS, "styles"), ".css").join("\n"));
  else if (what === "layouts") console.log(listNames(path.join(SKILL_DIR, "references", "layouts"), ".md").join("\n"));
  else throw new Error("list needs: styles | layouts");
}

async function main() {
  const a = parseArgs(process.argv.slice(2));
  if (a.cmd === "init") init(a);
  else if (a.cmd === "export") await exportCmd(a);
  else if (a.cmd === "preview") preview(a);
  else if (a.cmd === "list") list(a);
  else {
    console.log(USAGE);
    if (a.cmd && a.cmd !== "help" && a.cmd !== "--help") process.exitCode = 1;
  }
}

if (import.meta.main) {
  main().catch((e) => {
    console.log(JSON.stringify({ status: "error", error: e instanceof Error ? e.message : String(e) }));
    process.exit(1);
  });
}
