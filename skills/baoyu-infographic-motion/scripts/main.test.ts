import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { listNames, parseArgs, parseFormats } from "./main.ts";

test("parseArgs splits command, positionals and flags", () => {
  const a = parseArgs(["export", "a/index.html", "--format", "mp4,gif", "--fps=24", "--force", "--sfx", "none"]);
  assert.equal(a.cmd, "export");
  assert.deepEqual(a.pos, ["a/index.html"]);
  assert.deepEqual(a.flags, { format: "mp4,gif", fps: "24", force: true, sfx: "none" });
});

test("parseFormats defaults, dedupes and rejects unknown", () => {
  assert.deepEqual(parseFormats(undefined), ["mp4", "gif", "png"]);
  assert.deepEqual(parseFormats("GIF, gif,png"), ["gif", "png"]);
  assert.throws(() => parseFormats("mp4,webm"), /Unknown format "webm"/);
});

test("listNames returns sorted names for an extension", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "motion-list-"));
  for (const f of ["b.css", "a.css", "c.md"]) fs.writeFileSync(path.join(dir, f), "");
  assert.deepEqual(listNames(dir, ".css"), ["a", "b"]);
  assert.deepEqual(listNames(path.join(dir, "missing"), ".css"), []);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("every style css has a reference doc and every layout doc exists", () => {
  const skill = path.resolve(import.meta.dirname, "..");
  const styles = listNames(path.join(skill, "assets", "styles"), ".css");
  const docs = listNames(path.join(skill, "references", "styles"), ".md");
  assert.deepEqual(styles, docs);
  for (const s of styles) {
    const css = fs.readFileSync(path.join(skill, "assets", "styles", `${s}.css`), "utf8");
    assert.match(css, /:root\s*{/, `${s}.css needs a :root token block`);
    assert.doesNotMatch(css, /@import url\((?!"https:\/\/fonts\.googleapis\.com)/, `${s}.css may only import Google Fonts`);
  }
});
