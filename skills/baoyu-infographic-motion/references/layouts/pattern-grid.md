# pattern-grid

A reference card of 9-15 small tiles, each running its own looping mini animation at the same time (pointers
converge, a window slides, a stack pushes and pops, a tree lights up in visit order, a DP table fills). A master
cycle spotlights one tile at a time and a caption strip explains that tile in one line.

## Use when / Avoid when

- **Use when**: a set of techniques that are best shown by doing (algorithm patterns, data-structure operations,
  sorting methods, query patterns, git commands), cheat sheets, "N patterns you must know" posts.
- **Avoid when**: the items are concepts without a process to animate (use `bento-grid` or `periodic-table`), there
  are fewer than 6 items (use `card-pipeline` or `comparison-matrix`), or one item needs a long explanation.

## Structure

Canvas `portrait` 1080×1350 (12 tiles in 3 × 4). Use `story` for 15 tiles (3 × 5).

- **Header**: `.mi-top` (crumb, "PATTERN 01 / 12" counter), `.ttl` = one-line `.mi-title` with one `<em>` word and a
  solid `.badge`, `.mi-sub`, `.mi-rule` bound to the spotlight cycle.
- **Tiles** `.tiles.mi-body` (grid 3 columns): each `.mi-card.tile` has `--item`, an `h3` with a number + name, and
  an empty `.viz[data-anim="<name>"]`. `MotionSetup` builds the content of each `.viz` from the animation library.
- **Caption** `.cap.mi-swap-host`: one `.mi-swap` per tile (`data-item="spot" data-index="n"`), bold name + one
  line of "when to use".
- **Footer**.

## Motion recipe

- **Spotlight cycle** `spot` on `.tiles`: 12 tiles × `data-step="2"` = 24 s, `data-cycles="1"`, `data-sfx="blip"`,
  `data-accent`. The active tile's border and glow read `--on`; the caption swaps.
- **Mini animations** (`MotionSetup`, clock driven): each entry of `ANIMS` takes the `.viz` element, builds its
  DOM once, precomputes a trace of frames (the real algorithm runs at setup time) and returns `{ n, draw(k) }`.
  Every tile plays its whole trace once per period `P = M.snap(data-period || 6)` (6 s divides 24 s, so the video
  loops), frame `k = floor((t mod P) / P × n)`, redrawn only when `k` changes. The last frame holds the finished
  state; then the trace restarts from its first step.
- **States**: `draw` only writes `data-s` on cells, bars and graph nodes: `on` (current), `hit` (result or newest),
  `done` (already visited, item colour outline), `dim` (ruled out), `empty` (dashed placeholder). All colours come
  from `--item`, so each tile follows its own colour and any dark style.
- **Library** (14 entries): `two-pointers`, `sliding-window`, `binary-search`, `frequency`, `spiral`, `mono-stack`,
  `prefix-sum`, `intervals`, `greedy`, `top-k`, `backtracking`, `tree-inorder`, `graph-bfs`, `dp-grid`. The skeleton
  uses 12; `top-k` and `backtracking` are tested swaps (`data-anim="top-k"`).
- **Frame 0**: every tile shows its first step (arrays, grids and graphs fully drawn, results as dashed
  placeholders), so the poster is readable at any time; `data-poster="3"` shows most tiles half way.
- **Sound**: `blip` per spotlight step only (12 cues). Tile frames are silent, or the track gets noisy.

## Skeleton

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Learn The Patterns</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 14px; }
  .ttl { display: flex; align-items: center; gap: 18px; }
  .ttl .mi-title { font-size: calc(var(--title-size) * .78); line-height: 1.05; }
  .badge { flex: none; padding: 8px 16px; border-radius: 8px; background: var(--accent); color: var(--bg); font-family: var(--font-mono); font-size: 20px; font-weight: 700; letter-spacing: .04em; white-space: nowrap; }
  .tiles { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(4, 1fr); gap: 12px; }
  .tile { padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; min-width: 0;
    border-color: color-mix(in oklab, var(--item) calc(25% + var(--on) * 75%), var(--line));
    box-shadow: 0 0 calc(var(--on) * 22px) color-mix(in oklab, var(--item) 55%, transparent); }
  .tile h3 { font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: var(--item); white-space: nowrap; }
  .tile h3 span { color: var(--muted); margin-right: 6px; }
  .viz { flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; font-family: var(--font-mono); }
  .arr { display: flex; gap: 3px; }
  .cell { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 5px; border: 1.5px solid var(--line); background: var(--panel2); color: var(--ink); font-size: 13px; font-variant-numeric: tabular-nums; }
  .coins .cell { border-radius: 50%; }
  .cell[data-s="on"], .bar[data-s="on"] { border-color: var(--item); background: color-mix(in oklab, var(--item) 35%, var(--panel2)); color: #fff; }
  .cell[data-s="hit"], .bar[data-s="hit"] { border-color: var(--item); background: var(--item); color: var(--bg); font-weight: 700; }
  .cell[data-s="done"], .bar[data-s="done"] { border-color: color-mix(in oklab, var(--item) 60%, var(--line)); color: var(--item); }
  .cell[data-s="dim"] { opacity: .28; }
  .cell[data-s="empty"], .bar[data-s="empty"] { border-style: dashed; background: transparent; color: transparent; }
  .ptr { display: flex; gap: 3px; height: 15px; }
  .pc { width: 28px; text-align: center; font-size: 12px; color: var(--item); white-space: nowrap; }
  .note { font-size: 13px; color: var(--muted); white-space: nowrap; }
  .note.big { font-size: 15px; color: var(--ink); }
  .lb { font-size: 12px; color: var(--muted); letter-spacing: .06em; }
  .row2 { display: flex; align-items: center; gap: 8px; }
  .slide { position: relative; }
  .win { position: absolute; top: -4px; left: calc(var(--i, 0) * 31px - 4px); width: 101px; height: 32px; border: 2px solid var(--item); border-radius: 7px; box-shadow: 0 0 12px color-mix(in oklab, var(--item) 70%, transparent); }
  .grid { display: grid; grid-template-columns: repeat(var(--n), 28px); gap: 3px; }
  .grid .cell { height: 24px; }
  .ivs { position: relative; width: 250px; height: 42px; }
  .ivs.one { height: 20px; }
  .bar { position: absolute; left: calc(var(--s) * 100%); width: calc(var(--w) * 100%); top: calc(var(--y) * 22px); height: 19px; display: grid; place-items: center; border-radius: 4px; border: 1.5px solid color-mix(in oklab, var(--item) 55%, var(--line)); background: color-mix(in oklab, var(--item) 12%, var(--panel2)); color: var(--ink); font-size: 12px; font-style: normal; }
  .gv { width: 100%; height: 112px; overflow: visible; }
  .gv line { stroke: var(--line); stroke-width: 1.3; }
  .gv line[data-s="on"], .gv line[data-s="done"] { stroke: var(--item); }
  .gv circle { fill: var(--panel2); stroke: var(--line); stroke-width: 1.2; }
  .gv text { font-size: 7px; text-anchor: middle; dominant-baseline: central; fill: var(--ink); font-family: var(--font-mono); }
  .gv g[data-s="on"] circle { fill: color-mix(in oklab, var(--item) 40%, var(--panel2)); stroke: var(--item); }
  .gv g[data-s="hit"] circle { fill: var(--item); stroke: var(--item); }
  .gv g[data-s="hit"] text { fill: var(--bg); font-weight: 700; }
  .gv g[data-s="done"] circle { stroke: var(--item); }
  .gv g[data-s="done"] text { fill: var(--item); }
  .gv g[data-s="dim"] { opacity: .35; }
  .gv g[data-s="empty"] circle { stroke-dasharray: 2 2; fill: none; }
  .cap { height: 50px; border-radius: var(--radius); border: 1px solid var(--line); background: var(--panel); }
  .cap .mi-swap { display: flex; align-items: center; gap: 14px; padding: 0 18px; font-family: var(--font-mono); font-size: 16px; color: var(--ink); }
  .cap b { color: var(--item); white-space: nowrap; }
</style>
<script>
window.MotionSetup = (M) => {
  const NS = "http://www.w3.org/2000/svg";
  const h = (tag, cls, txt, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; if (parent) parent.appendChild(e); return e; };
  const sv = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
  const row = (vals, parent, cls = "arr") => { const r = h("div", cls, null, parent); return vals.map((v) => h("span", "cell", String(v), r)); };
  const mark = (el, st) => el.setAttribute("data-s", st || "");
  const graph = (el, nodes, edges) => {
    const svg = sv("svg", { viewBox: "0 0 120 64", class: "gv" }, el);
    const E = edges.map(([a, b]) => sv("line", { x1: nodes[a][0], y1: nodes[a][1], x2: nodes[b][0], y2: nodes[b][1] }, svg));
    const N = nodes.map(([x, y, l]) => { const g = sv("g", {}, svg); sv("circle", { cx: x, cy: y, r: 7 }, g); sv("text", { x, y: y + 0.4 }, g).textContent = l; return g; });
    return { E, N };
  };
  const T7 = [[60, 8, "4"], [32, 32, "2"], [88, 32, "6"], [18, 56, "1"], [46, 56, "3"], [74, 56, "5"], [102, 56, "7"]];
  const E7 = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];

  const ANIMS = {
    "two-pointers": (el) => {
      const a = [1, 2, 4, 6, 8, 11, 15], T = 14, cells = row(a, el), lab = h("div", "ptr", null, el), pl = a.map(() => h("span", "pc", "", lab)), note = h("div", "note", "", el);
      const tr = []; let L = 0, R = a.length - 1;
      for (;;) { const sm = a[L] + a[R]; tr.push([L, R, sm]); if (sm === T || L >= R) break; if (sm < T) L++; else R--; }
      return { n: tr.length + 1, draw(k) {
        const [l, r, sm] = tr[Math.min(k, tr.length - 1)], f = k >= tr.length - 1;
        cells.forEach((c, i) => mark(c, i === l || i === r ? (f ? "hit" : "on") : i < l || i > r ? "dim" : ""));
        pl.forEach((p, i) => (p.textContent = i === l ? "L" : i === r ? "R" : ""));
        note.textContent = f ? `${a[l]} + ${a[r]} = ${T} ✓` : `${a[l]} + ${a[r]} = ${sm} ${sm < T ? "<" : ">"} ${T}`;
      } };
    },
    "sliding-window": (el) => {
      const a = [2, 1, 5, 1, 3, 2, 4, 1], K = 3, wrap = h("div", "slide", null, el), cells = row(a, wrap), box = h("i", "win", null, wrap), note = h("div", "note", "", el);
      const n = a.length - K + 1, sums = [];
      for (let i = 0; i < n; i++) sums.push(a[i] + a[i + 1] + a[i + 2]);
      return { n: n + 1, draw(k) {
        const i = Math.min(k, n - 1);
        box.style.setProperty("--i", i);
        cells.forEach((c, j) => mark(c, j >= i && j < i + K ? "on" : ""));
        note.textContent = `k=3  sum ${sums[i]}  best ${Math.max(...sums.slice(0, i + 1))}`;
      } };
    },
    "binary-search": (el) => {
      const a = [1, 3, 5, 7, 9, 11, 13, 15, 17], T = 15, cells = row(a, el), lab = h("div", "ptr", null, el), pl = a.map(() => h("span", "pc", "", lab)), note = h("div", "note", "", el);
      const tr = []; let lo = 0, hi = a.length - 1;
      while (lo <= hi) { const m = (lo + hi) >> 1; tr.push([lo, m, hi]); if (a[m] === T) break; if (a[m] < T) lo = m + 1; else hi = m - 1; }
      return { n: tr.length + 1, draw(k) {
        const [lo, m, hi] = tr[Math.min(k, tr.length - 1)], f = k >= tr.length - 1;
        cells.forEach((c, i) => mark(c, i === m ? (f ? "hit" : "on") : i < lo || i > hi ? "dim" : ""));
        pl.forEach((p, i) => (p.textContent = i === m ? "mid" : i === lo ? "lo" : i === hi ? "hi" : ""));
        note.textContent = f ? `found ${T} at [${m}]` : `a[${m}]=${a[m]} ${a[m] < T ? "<" : ">"} ${T}`;
      } };
    },
    "frequency": (el) => {
      const s = [..."abacab"], keys = ["a", "b", "c"], cells = row(s, el), tb = h("div", "row2", null, el);
      const vs = keys.map((key) => { const r = h("div", "arr", null, tb); h("span", "cell", key, r); return h("span", "cell", "0", r); });
      return { n: s.length + 1, draw(k) {
        cells.forEach((c, i) => mark(c, i === k ? "on" : i < k ? "done" : ""));
        keys.forEach((key, j) => {
          vs[j].textContent = s.slice(0, Math.min(k + 1, s.length)).filter((x) => x === key).length;
          mark(vs[j], k < s.length && s[k] === key ? "hit" : "done");
        });
      } };
    },
    "spiral": (el) => {
      const N = 4, g = h("div", "grid", null, el), cs = [];
      g.style.setProperty("--n", N);
      for (let i = 0; i < N * N; i++) cs.push(h("span", "cell", "", g));
      const ord = []; let t = 0, b = N - 1, l = 0, r = N - 1;
      while (t <= b && l <= r) {
        for (let j = l; j <= r; j++) ord.push(t * N + j); t++;
        for (let i = t; i <= b; i++) ord.push(i * N + r); r--;
        if (t <= b) { for (let j = r; j >= l; j--) ord.push(b * N + j); b--; }
        if (l <= r) { for (let i = b; i >= t; i--) ord.push(i * N + l); l++; }
      }
      ord.forEach((c, i) => (cs[c].textContent = i + 1));
      return { n: ord.length + 2, draw(k) { ord.forEach((c, i) => mark(cs[c], i === k ? "hit" : i < k ? "done" : "")); } };
    },
    "mono-stack": (el) => {
      const a = [2, 7, 3, 5, 4, 6], cells = row(a, el), sr = h("div", "row2", null, el);
      h("span", "lb", "stack", sr);
      const slots = row(["", "", "", ""], sr), note = h("div", "note", "", el);
      const tr = [], S = [];
      a.forEach((x, i) => {
        while (S.length && S[S.length - 1] < x) { const p = S.pop(); tr.push({ i, S: [...S], msg: `pop ${p} (${p} < ${x})` }); }
        S.push(x); tr.push({ i, S: [...S], msg: `push ${x}` });
      });
      return { n: tr.length + 1, draw(k) {
        const f = tr[Math.min(k, tr.length - 1)];
        cells.forEach((c, j) => mark(c, j === f.i ? "on" : j < f.i ? "done" : ""));
        slots.forEach((c, j) => { c.textContent = f.S[j] ?? ""; mark(c, f.S[j] == null ? "empty" : j === f.S.length - 1 ? "hit" : "done"); });
        note.textContent = f.msg;
      } };
    },
    "prefix-sum": (el) => {
      const a = [3, 1, 4, 1, 5, 9], pre = [];
      a.reduce((s, x, i) => (pre[i] = s + x), 0);
      const r1 = h("div", "row2", null, el); h("span", "lb", "nums", r1); const c1 = row(a, r1);
      const r2 = h("div", "row2", null, el); h("span", "lb", "pre ", r2); const c2 = row(a.map(() => ""), r2);
      return { n: a.length + 2, draw(k) {
        c1.forEach((c, i) => mark(c, i === k ? "on" : i < k ? "done" : ""));
        c2.forEach((c, i) => { c.textContent = i <= k ? pre[i] : ""; mark(c, i === k ? "hit" : i < k ? "done" : "empty"); });
      } };
    },
    "intervals": (el) => {
      const iv = [[1, 3], [2, 6], [8, 10], [9, 12]], mg = [[1, 6], [8, 12]], W = 13;
      const bar = (host, [s, e], y) => { const b = h("i", "bar", `${s}-${e}`, host); b.style.cssText = `--s:${s / W};--w:${(e - s) / W};--y:${y}`; return b; };
      const lane = h("div", "ivs", null, el), bars = iv.map((v, i) => bar(lane, v, i % 2));
      h("div", "lb", "merged", el);
      const out = h("div", "ivs one", null, el), ms = mg.map((v) => bar(out, v, 0));
      return { n: 6, draw(k) {
        bars.forEach((b, i) => mark(b, (k === 1 && i < 2) || (k === 3 && i >= 2) ? "on" : ""));
        ms.forEach((b, i) => mark(b, k === 2 + 2 * i ? "hit" : k > 2 + 2 * i ? "done" : "empty"));
      } };
    },
    "greedy": (el) => {
      const coins = [25, 10, 5, 1], top = h("div", "note big", "", el), cr = row(coins, el, "arr coins");
      const tr = [], u = []; let amt = 63;
      tr.push({ amt, pick: -1, u: [] });
      while (amt > 0) { const j = coins.findIndex((c) => c <= amt); amt -= coins[j]; u.push(coins[j]); tr.push({ amt, pick: j, u: [...u] }); }
      const ur = h("div", "row2", null, el); h("span", "lb", "used", ur);
      const us = row(u.map(() => ""), ur, "arr coins");
      return { n: tr.length + 1, draw(k) {
        const f = tr[Math.min(k, tr.length - 1)];
        top.textContent = `amount = ${f.amt}`;
        cr.forEach((c, j) => mark(c, j === f.pick ? "on" : ""));
        us.forEach((c, j) => { c.textContent = f.u[j] ?? ""; mark(c, f.u[j] == null ? "empty" : j === f.u.length - 1 && k < tr.length ? "hit" : "done"); });
      } };
    },
    "top-k": (el) => {
      const a = [5, 1, 8, 3, 9, 2], cells = row(a, el), g = graph(el, [[60, 14, ""], [36, 48, ""], [84, 48, ""]], [[0, 1], [0, 2]]), note = h("div", "note", "", el);
      g.N[0].parentNode.setAttribute("viewBox", "0 4 120 54");
      const tr = [], H = [];
      a.forEach((x, i) => { H.push(x); H.sort((p, q) => p - q); let msg = `push ${x}`; if (H.length > 3) msg += ` pop ${H.shift()}`; tr.push({ i, H: [...H], msg }); });
      return { n: tr.length + 1, draw(k) {
        const f = tr[Math.min(k, tr.length - 1)];
        cells.forEach((c, j) => mark(c, j === f.i ? "on" : j < f.i ? "done" : ""));
        g.N.forEach((nd, j) => { nd.querySelector("text").textContent = f.H[j] ?? ""; mark(nd, f.H[j] == null ? "empty" : j === 0 ? "hit" : "done"); });
        note.textContent = `${f.msg} → top 3: ${[...f.H].reverse().join(" ")}`;
      } };
    },
    "backtracking": (el) => {
      const nodes = [[60, 8, "{}"], [32, 32, "1"], [88, 32, "{}"], [18, 56, "12"], [46, 56, "1"], [74, 56, "2"], [102, 56, "{}"]];
      const kids = { 0: [1, 2], 1: [3, 4], 2: [5, 6] }, g = graph(el, nodes, E7), note = h("div", "note", "", el);
      const tr = [], seen = new Set(), out = [];
      const dfs = (u, path) => {
        path = [...path, u]; seen.add(u);
        if (!kids[u]) out.push(nodes[u][2]);
        tr.push({ path, seen: new Set(seen), out: [...out] });
        (kids[u] || []).forEach((v) => { dfs(v, path); tr.push({ path, seen: new Set(seen), out: [...out] }); });
      };
      dfs(0, []);
      return { n: tr.length + 1, draw(k) {
        const f = tr[Math.min(k, tr.length - 1)], last = f.path[f.path.length - 1];
        g.N.forEach((nd, i) => mark(nd, i === last ? "hit" : f.path.includes(i) ? "on" : f.seen.has(i) ? "dim" : ""));
        E7.forEach(([a, b], j) => mark(g.E[j], f.path.includes(a) && f.path.includes(b) ? "on" : ""));
        note.textContent = `subsets: ${f.out.join(" ")}`;
      } };
    },
    "tree-inorder": (el) => {
      const g = graph(el, T7, E7), ord = [3, 1, 4, 0, 5, 2, 6], note = h("div", "note", "", el);
      return { n: ord.length + 2, draw(k) {
        g.N.forEach((nd, i) => { const p = ord.indexOf(i); mark(nd, p === k ? "hit" : p < k ? "done" : ""); });
        E7.forEach(([a, b], j) => mark(g.E[j], ord.indexOf(a) <= k && ord.indexOf(b) <= k ? "done" : ""));
        note.textContent = "in-order: " + ord.slice(0, Math.min(k + 1, ord.length)).map((i) => T7[i][2]).join(" ");
      } };
    },
    "graph-bfs": (el) => {
      const nodes = [[12, 32, "A"], [40, 10, "B"], [40, 54, "C"], [74, 10, "D"], [74, 54, "E"], [106, 32, "F"]];
      const edges = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5]], par = [-1, 0, 0, 1, 2, 3];
      const g = graph(el, nodes, edges), note = h("div", "note", "", el);
      return { n: nodes.length + 2, draw(k) {
        g.N.forEach((nd, i) => mark(nd, i === k ? "hit" : i < k ? "done" : ""));
        edges.forEach(([a, b], j) => mark(g.E[j], (par[b] === a && b <= k) || (par[a] === b && a <= k) ? "done" : ""));
        note.textContent = "visit: " + nodes.slice(0, Math.min(k + 1, nodes.length)).map((x) => x[2]).join(" ");
      } };
    },
    "dp-grid": (el) => {
      const R = 4, C = 5, g = h("div", "grid", null, el), cs = [], dp = [];
      g.style.setProperty("--n", C);
      for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) { dp.push(i === 0 || j === 0 ? 1 : dp[(i - 1) * C + j] + dp[i * C + j - 1]); cs.push(h("span", "cell", "", g)); }
      const note = h("div", "note", "paths[i][j] = up + left", el);
      return { n: R * C + 2, draw(k) { cs.forEach((c, i) => { c.textContent = i <= k ? dp[i] : ""; mark(c, i === k ? "hit" : i < k ? "done" : "empty"); }); } };
    },
  };

  document.querySelectorAll("[data-anim]").forEach((el) => {
    const a = ANIMS[el.dataset.anim](el), P = M.snap(parseFloat(el.dataset.period || 6));
    let last = -1;
    M.on((t) => {
      const k = Math.min(a.n - 1, Math.floor((((t % P) + P) % P) / P * a.n));
      if (k !== last) { last = k; a.draw(k); }
    });
  });
};
</script>
</head>
<body data-canvas="portrait" data-cycles="1" data-sfx="soft" data-fps="30" data-poster="3">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">INTERVIEW PREP / ALGORITHMS</span><span class="mi-meta">PATTERN <span data-counter="spot">01</span> / 12</span></div>
    <div class="ttl"><h1 class="mi-title">Stop grinding. Learn the <em>patterns</em>.</h1><span class="badge">12 PATTERNS</span></div>
    <div class="mi-sub"><span>spot the shape</span><span class="sep">&gt;</span><span>pick the pattern</span><span class="sep">&gt;</span><span>write one loop</span></div>
    <div class="mi-rule" data-progress="spot"></div>
  </header>

  <section class="tiles mi-body" data-cycle="spot" data-step="2" data-sfx="blip" data-accent data-master>
    <div class="mi-card tile" style="--item:var(--c4)" data-item data-color="var(--c4)"><h3><span>01</span>Two pointers</h3><div class="viz" data-anim="two-pointers"></div></div>
    <div class="mi-card tile" style="--item:var(--c1)" data-item data-color="var(--c1)"><h3><span>02</span>Sliding window</h3><div class="viz" data-anim="sliding-window"></div></div>
    <div class="mi-card tile" style="--item:var(--c3)" data-item data-color="var(--c3)"><h3><span>03</span>Binary search</h3><div class="viz" data-anim="binary-search"></div></div>
    <div class="mi-card tile" style="--item:var(--c2)" data-item data-color="var(--c2)"><h3><span>04</span>Frequency count</h3><div class="viz" data-anim="frequency"></div></div>
    <div class="mi-card tile" style="--item:var(--c3)" data-item data-color="var(--c3)"><h3><span>05</span>Matrix spiral</h3><div class="viz" data-anim="spiral"></div></div>
    <div class="mi-card tile" style="--item:var(--c1)" data-item data-color="var(--c1)"><h3><span>06</span>Monotonic stack</h3><div class="viz" data-anim="mono-stack"></div></div>
    <div class="mi-card tile" style="--item:var(--c5)" data-item data-color="var(--c5)"><h3><span>07</span>Prefix sum</h3><div class="viz" data-anim="prefix-sum"></div></div>
    <div class="mi-card tile" style="--item:var(--c4)" data-item data-color="var(--c4)"><h3><span>08</span>Merge intervals</h3><div class="viz" data-anim="intervals"></div></div>
    <div class="mi-card tile" style="--item:var(--c1)" data-item data-color="var(--c1)"><h3><span>09</span>Greedy</h3><div class="viz" data-anim="greedy"></div></div>
    <div class="mi-card tile" style="--item:var(--c2)" data-item data-color="var(--c2)"><h3><span>10</span>Tree traversal</h3><div class="viz" data-anim="tree-inorder"></div></div>
    <div class="mi-card tile" style="--item:var(--c3)" data-item data-color="var(--c3)"><h3><span>11</span>Breadth-first search</h3><div class="viz" data-anim="graph-bfs"></div></div>
    <div class="mi-card tile" style="--item:var(--c6)" data-item data-color="var(--c6)"><h3><span>12</span>Dynamic programming</h3><div class="viz" data-anim="dp-grid"></div></div>
  </section>

  <div class="cap mi-swap-host">
    <div class="mi-swap" style="--item:var(--c4)" data-item="spot" data-index="0"><b>Two pointers</b>sorted array, find a pair: move the pointer that fixes the sum</div>
    <div class="mi-swap" style="--item:var(--c1)" data-item="spot" data-index="1"><b>Sliding window</b>best run of k items: add the new one, drop the old one</div>
    <div class="mi-swap" style="--item:var(--c3)" data-item="spot" data-index="2"><b>Binary search</b>sorted input: halve the range until it hits</div>
    <div class="mi-swap" style="--item:var(--c2)" data-item="spot" data-index="3"><b>Frequency count</b>anagrams, duplicates, majority: count once in a map</div>
    <div class="mi-swap" style="--item:var(--c3)" data-item="spot" data-index="4"><b>Matrix spiral</b>walk the border, shrink it, repeat</div>
    <div class="mi-swap" style="--item:var(--c1)" data-item="spot" data-index="5"><b>Monotonic stack</b>next greater item: pop everything smaller</div>
    <div class="mi-swap" style="--item:var(--c5)" data-item="spot" data-index="6"><b>Prefix sum</b>many range sums: build running totals once</div>
    <div class="mi-swap" style="--item:var(--c4)" data-item="spot" data-index="7"><b>Merge intervals</b>sort by start, join when they overlap</div>
    <div class="mi-swap" style="--item:var(--c1)" data-item="spot" data-index="8"><b>Greedy</b>take the largest piece that still fits</div>
    <div class="mi-swap" style="--item:var(--c2)" data-item="spot" data-index="9"><b>Tree traversal</b>left, node, right gives a BST in order</div>
    <div class="mi-swap" style="--item:var(--c3)" data-item="spot" data-index="10"><b>Breadth-first search</b>shortest steps: visit level by level</div>
    <div class="mi-swap" style="--item:var(--c6)" data-item="spot" data-index="11"><b>Dynamic programming</b>each cell reuses answers already stored</div>
  </div>
  <footer class="mi-foot"><span>CODING NOTES / PATTERN CARD</span><span class="path">SHAPE &gt; PATTERN &gt; LOOP</span><span class="mark">patternbook</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Pick a subset**: change `data-anim` on each `.viz`, the `h3`, the caption line and the tile count. Keep
  tiles × step = video length (9 tiles: step 2 s = 18 s; 15 tiles on `story`: step 1.6 s = 24 s) and use a tile
  period that divides it (6 s for 18 s or 24 s). Set `grid-template-rows` to the row count.
- **Add a mini animation**: add `name: (el) => { … return { n, draw(k) }; }` to `ANIMS`. Build the DOM with the
  helpers `row()` (array of cells), `graph()` (SVG nodes + edges in a 120 × 64 view box), `h()`; compute the trace
  as an array first, then let `draw(k)` read `trace[min(k, trace.length - 1)]` and only call `mark(el, state)` or set
  text. Do not keep state between calls (the renderer can seek to any `t`). Use `n = trace.length + 1` so the
  finished state holds for one frame. Keep traces at 6-22 frames for a 6 s period.
- **Data**: change the arrays at the top of each entry (target sums, coins, graph nodes). Keep arrays at 9 cells or
  fewer (28 px cells fit about 9 in a 1080 px tile) and graph labels at 1-2 characters.
- **Style**: tested with `midnight-grid` (dark navy, 5 neon colours, DM Serif headline). Any dark style with 5-6
  distinct `--c*` colours fits (`neon-constellation`, `github-dark`, `telemetry-sim`); on light styles the `on`
  state (item colour 35 % on `--panel2`) still reads, but `hit` text uses `--bg`, so check contrast.
- **Pitfalls**: `.win` (sliding window) assumes 28 px cells + 3 px gap (`--i × 31px`); change both if you resize
  cells. `<i>` bars need `font-style: normal`. The spotlight is for attention only: every tile animates all the time.
