import assert from "node:assert/strict";
import test from "node:test";

import { buildGifArgs, buildMixArgs, buildVideoArgs, frameTimes, LUFS } from "./ffmpeg-args.ts";

test("frameTimes covers the duration without the end frame", () => {
  const t = frameTimes(2, 30);
  assert.equal(t.length, 60);
  assert.equal(t[0], 0);
  assert.ok(Math.abs(t[59] - 59 / 30) < 1e-6);
});

test("frameTimes always returns at least one frame", () => {
  assert.deepEqual(frameTimes(0.01, 30), [0]);
});

test("buildMixArgs normalizes sfx only when no music", () => {
  const a = buildMixArgs({ sfxWav: "in.wav", out: "out.wav", duration: 12, loop: true, profile: "soft" });
  const graph = a[a.indexOf("-filter_complex") + 1];
  assert.equal(graph, `[0:a]loudnorm=I=${LUFS.soft}:TP=-1.5:LRA=11[out]`);
  assert.ok(!a.includes("-stream_loop"));
  assert.equal(a.at(-1), "out.wav");
});

test("buildMixArgs loops and trims music under the cues", () => {
  const a = buildMixArgs({ sfxWav: "in.wav", out: "o.wav", duration: 20, loop: false, profile: "music", music: "m.mp3", musicVolume: 0.5 });
  assert.deepEqual(a.slice(a.indexOf("-stream_loop"), a.indexOf("-stream_loop") + 4), ["-stream_loop", "-1", "-i", "m.mp3"]);
  const graph = a[a.indexOf("-filter_complex") + 1];
  assert.match(graph, /atrim=0:20\.000/);
  assert.match(graph, /volume=0\.5/);
  assert.match(graph, /afade=t=out:st=18\.500:d=1\.500/);
  assert.match(graph, /amix=inputs=2:duration=first:normalize=0/);
  assert.match(graph, new RegExp(`loudnorm=I=${LUFS.music}`));
});

test("buildMixArgs uses click-free micro fades for loops", () => {
  const a = buildMixArgs({ sfxWav: "in.wav", out: "o.wav", duration: 10, loop: true, profile: "soft", music: "m.mp3" });
  const graph = a[a.indexOf("-filter_complex") + 1];
  assert.match(graph, /afade=t=in:st=0:d=0\.05/);
  assert.match(graph, /afade=t=out:st=9\.950:d=0\.05/);
});

test("buildVideoArgs maps audio only when given", () => {
  const silent = buildVideoArgs({ fps: 30, duration: 6, out: "v.mp4" });
  assert.ok(!silent.includes("-c:a"));
  assert.deepEqual(silent.slice(0, 9), ["-y", "-v", "error", "-f", "image2pipe", "-framerate", "30", "-i", "-"]);
  const withAudio = buildVideoArgs({ fps: 24, duration: 6, out: "v.mp4", audio: "a.wav", crf: 20 });
  assert.ok(withAudio.includes("a.wav"));
  assert.equal(withAudio[withAudio.indexOf("-crf") + 1], "20");
  assert.equal(withAudio[withAudio.indexOf("-t") + 1], "6.000");
  assert.ok(withAudio.includes("aac"));
});

test("buildGifArgs sets palette, size and loop flag", () => {
  const g = buildGifArgs({ input: "v.mp4", out: "a.gif", fps: 15, width: 540, loop: true, colors: 128 });
  const vf = g[g.indexOf("-vf") + 1];
  assert.match(vf, /^fps=15,scale=540:-1:flags=lanczos/);
  assert.match(vf, /palettegen=max_colors=128:stats_mode=diff/);
  assert.match(vf, /paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle$/);
  const sierra = buildGifArgs({ input: "v", out: "o", fps: 10, width: 400, loop: true, dither: "sierra" });
  assert.match(sierra[sierra.indexOf("-vf") + 1], /dither=sierra2_4a/);
  assert.equal(g[g.indexOf("-loop") + 1], "0");
  assert.equal(buildGifArgs({ input: "v", out: "o", fps: 10, width: 400, loop: false }).at(-2), "-1");
});
