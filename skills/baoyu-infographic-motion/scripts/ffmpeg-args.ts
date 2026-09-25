export type SfxProfile = "soft" | "music" | "none";

export interface MixOptions {
  sfxWav: string;
  out: string;
  duration: number;
  loop: boolean;
  profile: SfxProfile;
  music?: string;
  musicVolume?: number;
}

export const LUFS: Record<SfxProfile, number> = { soft: -16, music: -14, none: -16 };

export function buildMixArgs(o: MixOptions): string[] {
  const d = o.duration;
  const lufs = LUFS[o.profile];
  const norm = `loudnorm=I=${lufs}:TP=-1.5:LRA=11`;
  const args = ["-y", "-v", "error", "-i", o.sfxWav];
  let graph: string;
  if (o.music) {
    const vol = o.musicVolume ?? 0.35;
    const fadeOut = Math.min(1.5, d / 4);
    const fades = o.loop
      ? `afade=t=in:st=0:d=0.05,afade=t=out:st=${(d - 0.05).toFixed(3)}:d=0.05`
      : `afade=t=in:st=0:d=1,afade=t=out:st=${(d - fadeOut).toFixed(3)}:d=${fadeOut.toFixed(3)}`;
    args.push("-stream_loop", "-1", "-i", o.music);
    graph = `[1:a]atrim=0:${d.toFixed(3)},asetpts=N/SR/TB,aresample=48000,volume=${vol},${fades}[m];[0:a][m]amix=inputs=2:duration=first:normalize=0,${norm}[out]`;
  } else {
    graph = `[0:a]${norm}[out]`;
  }
  args.push("-filter_complex", graph, "-map", "[out]", "-t", d.toFixed(3), "-ar", "48000", "-ac", "2", o.out);
  return args;
}

export interface VideoOptions {
  fps: number;
  duration: number;
  out: string;
  audio?: string;
  crf?: number;
}

export function buildVideoArgs(o: VideoOptions): string[] {
  const args = ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(o.fps), "-i", "-"];
  if (o.audio) args.push("-i", o.audio);
  args.push(
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", String(o.crf ?? 18),
    "-pix_fmt", "yuv420p",
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-r", String(o.fps),
  );
  if (o.audio) args.push("-c:a", "aac", "-b:a", "192k", "-map", "0:v", "-map", "1:a");
  args.push("-t", o.duration.toFixed(3), "-movflags", "+faststart", o.out);
  return args;
}

export interface GifOptions {
  input: string;
  out: string;
  fps: number;
  width: number;
  loop: boolean;
  colors?: number;
  dither?: string;
}

export function buildGifArgs(o: GifOptions): string[] {
  const colors = o.colors ?? 256;
  const dither = { bayer: "bayer:bayer_scale=4", sierra: "sierra2_4a", none: "none" }[o.dither ?? "bayer"] ?? o.dither;
  const vf = `fps=${o.fps},scale=${o.width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=${colors}:stats_mode=diff[p];[b][p]paletteuse=dither=${dither}:diff_mode=rectangle`;
  return ["-y", "-v", "error", "-i", o.input, "-vf", vf, "-loop", o.loop ? "0" : "-1", o.out];
}

export function frameTimes(duration: number, fps: number): number[] {
  const n = Math.max(1, Math.round(duration * fps));
  return Array.from({ length: n }, (_, i) => +(i / fps).toFixed(6));
}
