import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import {
  CdpConnection,
  findChromeExecutable,
  getFreePort,
  gracefulKillChrome,
  launchChrome,
  sleep,
  waitForChromeDebugPort,
  type PlatformCandidates,
} from "baoyu-chrome-cdp";
import { buildGifArgs, buildMixArgs, buildVideoArgs, frameTimes, type SfxProfile } from "./ffmpeg-args.ts";

export type Format = "mp4" | "gif" | "png";

export interface ExportOptions {
  html: string;
  outDir: string;
  name: string;
  formats: Format[];
  fps?: number;
  duration?: number;
  cycles?: number;
  bpm?: number;
  sfx?: SfxProfile;
  music?: string;
  musicVolume?: number;
  gifFps: number;
  gifWidth: number;
  gifColors?: number;
  gifDither?: string;
  scale: number;
  quality: number;
  onProgress?: (done: number, total: number) => void;
}

export interface Meta {
  duration: number;
  fps: number;
  loop: boolean;
  poster: number;
  beat: number;
  canvas: { width: number; height: number };
  sfx: SfxProfile;
  cues: { name: string; t: number; gain: number }[];
}

const CHROME: PlatformCandidates = {
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ],
  win32: [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ],
  default: [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium",
    "/usr/bin/microsoft-edge",
  ],
};

function run(bin: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn(bin, args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${bin} exited ${code}: ${err.trim()}`))));
  });
}

class Page {
  constructor(private cdp: CdpConnection, private sid: string) {}

  send<T>(method: string, params?: Record<string, unknown>, timeoutMs?: number) {
    return this.cdp.send<T>(method, params, { sessionId: this.sid, timeoutMs });
  }

  async eval<T>(expr: string, timeoutMs = 60_000): Promise<T> {
    const r = await this.send<{ result: { value: T }; exceptionDetails?: { exception?: { description?: string }; text?: string } }>(
      "Runtime.evaluate",
      { expression: expr, awaitPromise: true, returnByValue: true },
      timeoutMs,
    );
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text ?? "evaluate failed");
    return r.result.value;
  }

  async shot(format: "png" | "jpeg", quality: number): Promise<Buffer> {
    const r = await this.send<{ data: string }>("Page.captureScreenshot", {
      format,
      ...(format === "jpeg" ? { quality } : {}),
      captureBeyondViewport: false,
      fromSurface: true,
    });
    return Buffer.from(r.data, "base64");
  }
}

async function openBrowser(): Promise<{ cdp: CdpConnection; chrome: ChildProcess; port: number; profile: string }> {
  const chromePath = findChromeExecutable({ candidates: CHROME, envNames: ["BAOYU_CHROME_PATH"] });
  if (!chromePath) throw new Error("Chrome not found. Install Google Chrome / Chromium / Edge, or set BAOYU_CHROME_PATH.");
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "baoyu-motion-chrome-"));
  const port = await getFreePort("BAOYU_MOTION_DEBUG_PORT");
  const chrome = await launchChrome({
    chromePath,
    profileDir: profile,
    port,
    headless: true,
    extraArgs: [
      "--hide-scrollbars",
      "--mute-audio",
      "--force-color-profile=srgb",
      "--font-render-hinting=none",
      "--autoplay-policy=no-user-gesture-required",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--allow-file-access-from-files",
    ],
  });
  const ws = await waitForChromeDebugPort(port, 30_000, { includeLastError: true });
  const cdp = await CdpConnection.connect(ws, 30_000, { defaultTimeoutMs: 60_000 });
  return { cdp, chrome, port, profile };
}

function pageUrl(html: string, o: ExportOptions): string {
  const u = pathToFileURL(path.resolve(html));
  u.searchParams.set("export", "1");
  if (o.duration) u.searchParams.set("duration", String(o.duration));
  if (o.cycles) u.searchParams.set("cycles", String(o.cycles));
  if (o.fps) u.searchParams.set("fps", String(o.fps));
  if (o.bpm) u.searchParams.set("bpm", String(o.bpm));
  return u.toString();
}

async function waitReady(page: Page, timeoutMs = 30_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const ok = await page.eval<boolean>("!!(window.Motion && window.Motion.ready)").catch(() => false);
    if (ok) return;
    await sleep(100);
  }
  throw new Error("Page did not become ready. Check that motion.js is loaded at the end of <body>.");
}

async function waitFonts(page: Page, timeoutMs = 30_000): Promise<string[]> {
  const start = Date.now();
  let missing: string[] = [];
  while (Date.now() - start < timeoutMs) {
    missing = await page.eval<string[]>("typeof Motion.missingFonts === \"function\" ? Motion.missingFonts() : []");
    if (!missing.length) return [];
    await sleep(250);
  }
  return missing;
}

async function writeFrame(stream: NodeJS.WritableStream, buf: Buffer): Promise<void> {
  if (!stream.write(buf)) await new Promise<void>((r) => stream.once("drain", () => r()));
}

export async function exportInfographic(o: ExportOptions): Promise<{ meta: Meta; files: Record<string, string>; seconds: number; warnings: string[] }> {
  const t0 = Date.now();
  fs.mkdirSync(o.outDir, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "baoyu-motion-"));
  const files: Record<string, string> = {};
  let browser: Awaited<ReturnType<typeof openBrowser>> | null = null;
  const cleanup = async () => {
    if (browser) {
      try { browser.cdp.close(); } catch {}
      await gracefulKillChrome(browser.chrome, browser.port);
      fs.rmSync(browser.profile, { recursive: true, force: true });
      browser = null;
    }
    fs.rmSync(tmp, { recursive: true, force: true });
  };
  const onSignal = () => {
    cleanup().finally(() => process.exit(130));
  };
  process.once("SIGINT", onSignal);
  process.once("SIGTERM", onSignal);

  try {
    browser = await openBrowser();
    const { cdp } = browser;
    const { targetId } = await cdp.send<{ targetId: string }>("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp.send<{ sessionId: string }>("Target.attachToTarget", { targetId, flatten: true });
    const page = new Page(cdp, sessionId);
    await page.send("Page.enable");
    await page.send("Runtime.enable");

    const probeUrl = pageUrl(o.html, o);
    await page.send("Emulation.setDeviceMetricsOverride", { width: 1080, height: 1350, deviceScaleFactor: o.scale, mobile: false });
    await page.send("Page.navigate", { url: probeUrl });
    await waitReady(page);
    let meta = await page.eval<Meta>("Motion.meta()");
    const { width, height } = meta.canvas;
    if (width !== 1080 || height !== 1350) {
      await page.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: o.scale, mobile: false });
      await page.send("Page.navigate", { url: probeUrl });
      await waitReady(page);
      meta = await page.eval<Meta>("Motion.meta()");
    }
    const missingFonts = await waitFonts(page);
    if (missingFonts.length) {
      await page.send("Page.reload", { ignoreCache: false });
      await waitReady(page);
      meta = await page.eval<Meta>("Motion.meta()");
    }
    const fps = o.fps ?? meta.fps;
    const profile: SfxProfile = o.sfx ?? meta.sfx ?? "soft";

    if (o.formats.includes("png")) {
      await page.eval(`Motion.seek(${meta.poster})`);
      const out = path.join(o.outDir, `${o.name}.png`);
      fs.writeFileSync(out, await page.shot("png", 100));
      files.png = out;
    }

    const wantVideo = o.formats.includes("mp4") || o.formats.includes("gif");
    if (wantVideo) {
      let audio: string | undefined;
      if (o.formats.includes("mp4") && (profile !== "none" || o.music)) {
        const chunks = await page.eval<number>(`Motion.prepareWav(${JSON.stringify(profile)})`, 180_000);
        const raw = path.join(tmp, "sfx.wav");
        const fd = fs.openSync(raw, "w");
        for (let i = 0; i < chunks; i++) fs.writeSync(fd, Buffer.from(await page.eval<string>(`Motion.wavChunk(${i})`), "base64"));
        fs.closeSync(fd);
        audio = path.join(tmp, "mix.wav");
        await run("ffmpeg", buildMixArgs({ sfxWav: raw, out: audio, duration: meta.duration, loop: meta.loop, profile, music: o.music, musicVolume: o.musicVolume }));
      }

      const mp4 = o.formats.includes("mp4") ? path.join(o.outDir, `${o.name}.mp4`) : path.join(tmp, "video.mp4");
      const ff = spawn("ffmpeg", buildVideoArgs({ fps, duration: meta.duration, out: mp4, audio, crf: o.formats.includes("mp4") ? 18 : 10 }), {
        stdio: ["pipe", "ignore", "pipe"],
      });
      let ffErr = "";
      ff.stderr.on("data", (d) => (ffErr += d));
      const done = new Promise<void>((resolve, reject) => {
        ff.on("error", reject);
        ff.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}: ${ffErr.trim()}`))));
      });
      const times = frameTimes(meta.duration, fps);
      for (let i = 0; i < times.length; i++) {
        await page.eval(`(Motion.seek(${times[i]}), new Promise(r => requestAnimationFrame(() => r(1))))`);
        await writeFrame(ff.stdin, await page.shot("jpeg", o.quality));
        o.onProgress?.(i + 1, times.length);
      }
      ff.stdin.end();
      await done;
      if (o.formats.includes("mp4")) files.mp4 = mp4;

      if (o.formats.includes("gif")) {
        const gif = path.join(o.outDir, `${o.name}.gif`);
        await run("ffmpeg", buildGifArgs({ input: mp4, out: gif, fps: o.gifFps, width: o.gifWidth, loop: meta.loop, colors: o.gifColors, dither: o.gifDither }));
        files.gif = gif;
      }
    }

    const stillMissing = missingFonts.length ? await waitFonts(page, 5_000) : [];
    return { meta: { ...meta, fps, sfx: profile }, files, seconds: (Date.now() - t0) / 1000, warnings: stillMissing.length ? [`fonts not loaded: ${stillMissing.join(", ")}`] : [] };
  } finally {
    process.off("SIGINT", onSignal);
    process.off("SIGTERM", onSignal);
    await cleanup();
  }
}
