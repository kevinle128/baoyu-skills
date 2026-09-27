(() => {
  const CANVAS = {
    portrait: [1080, 1350],
    square: [1080, 1080],
    story: [1080, 1920],
    landscape: [1920, 1080],
    paper: [1200, 1600],
  };
  const query = new URLSearchParams(location.search);
  const EXPORT = query.has("export");
  const root = document.documentElement;
  const body = document.body;
  const cfg = Object.assign({}, body.dataset, Object.fromEntries(query));

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const mod = (a, n) => ((a % n) + n) % n;
  const frac = (v) => v - Math.floor(v);
  const ease = {
    linear: (x) => x,
    out: (x) => 1 - Math.pow(1 - x, 3),
    in: (x) => x * x * x,
    inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    sine: (x) => 0.5 - 0.5 * Math.cos(Math.PI * x),
    back: (x) => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2),
  };
  const num = (v, d) => (v === undefined || v === "" || isNaN(+v) ? d : +v);
  const rng = (seed) => {
    let s = seed >>> 0 || 1;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let r = Math.imul(s ^ (s >>> 15), 1 | s);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  };
  const hash = (str) => {
    let h = 2166136261;
    for (const c of String(str)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return h >>> 0;
  };
  const pad = (n, w) => String(n).padStart(w, "0");
  const setVar = (el, k, v) => el.style.setProperty(k, typeof v === "number" ? v.toFixed(4) : v);

  const [cw, ch] = (() => {
    const c = cfg.canvas || "portrait";
    if (CANVAS[c]) return CANVAS[c];
    const m = /^(\d+)x(\d+)$/.exec(c);
    return m ? [+m[1], +m[2]] : CANVAS.portrait;
  })();
  setVar(root, "--mi-w", cw + "px");
  setVar(root, "--mi-h", ch + "px");

  const state = {
    duration: 10,
    fps: num(cfg.fps, 30),
    loop: cfg.loop !== "false",
    poster: num(cfg.poster, 0),
    t: 0,
  };
  const updaters = [];
  const hooks = [];
  const cues = [];
  const cycles = new Map();

  const snap = (period) => {
    if (!state.loop || !period) return period;
    const k = Math.max(1, Math.round(state.duration / Math.abs(period)));
    return Math.sign(period) * (state.duration / k);
  };
  const cue = (name, t, gain = 1) => {
    if (!name || name === "none") return;
    if (t < 0 || t >= state.duration) return;
    cues.push({ name, t: +t.toFixed(4), gain });
  };

  function scanCycles() {
    document.querySelectorAll("[data-cycle]").forEach((el, i) => {
      const id = el.dataset.cycle || "c" + i;
      el.dataset.cycle = id;
      cycles.set(id, {
        id,
        el,
        step: num(el.dataset.step, 1.2),
        offset: num(el.dataset.offset, 0),
        fade: num(el.dataset.fade, 0.25),
        sfx: el.dataset.sfx,
        gain: num(el.dataset.gain, 1),
        accent: el.hasAttribute("data-accent"),
        members: [],
        n: 0,
      });
    });
    const auto = new Map();
    document.querySelectorAll("[data-item]").forEach((el) => {
      const id = el.dataset.item || el.parentElement?.closest("[data-cycle]")?.dataset.cycle;
      const c = cycles.get(id);
      if (!c) return;
      let idx = el.dataset.index;
      if (idx === undefined) {
        idx = auto.get(id) || 0;
        auto.set(id, idx + 1);
      }
      c.members.push({ el, idx: +idx });
    });
    for (const c of cycles.values()) {
      const total = Math.max(1, ...c.members.map((m) => m.idx + 1));
      let order = null;
      if (c.el.dataset.order) order = c.el.dataset.order.split(",").map((v) => +v.trim() - 1).filter((v) => v >= 0);
      else if (c.el.hasAttribute("data-shuffle")) {
        const r = rng(hash(c.el.dataset.shuffle || c.id));
        order = [...Array(total).keys()];
        for (let i = order.length - 1; i > 0; i--) {
          const j = Math.floor(r() * (i + 1));
          [order[i], order[j]] = [order[j], order[i]];
        }
      }
      if (order && order.length) {
        c.order = order;
        for (const m of c.members) m.idx = order.indexOf(m.idx);
        c.n = order.length;
      } else c.n = num(c.el.dataset.count, total);
      c.period = c.n * c.step;
    }
  }

  function resolveDuration() {
    const master = [...cycles.values()].find((c) => c.el.hasAttribute("data-master")) || cycles.values().next().value;
    const outro = num(cfg.outro, 0);
    if (master && num(cfg.bpm, 0) > 0) {
      master.step = (60 / +cfg.bpm) * Math.max(1, Math.round(master.step / (60 / +cfg.bpm)));
      master.period = master.n * master.step;
    }
    if (cfg.duration) state.duration = +cfg.duration;
    else if (master) state.duration = master.period * num(cfg.cycles, 2) + outro;
    state.master = master;
    state.outro = outro;
    state.beat = master ? master.step : 1;
  }

  function cycleAt(c, t) {
    const local = t - c.offset;
    const cur = Math.floor(mod(local, c.period) / c.step);
    return { cur, p: mod(local, c.step) / c.step, cycleP: mod(local, c.period) / c.period };
  }

  function envelope(c, idx, t) {
    const f = Math.min(c.fade, c.step / 2);
    const v = mod(t - c.offset - idx * c.step + f, c.period) - f;
    if (v < 0) return { on: ease.sine((v + f) / f), age: v };
    if (v < c.step - f) return { on: 1, age: v };
    if (v < c.step) return { on: 1 - ease.sine((v - c.step + f) / f), age: v };
    return { on: 0, age: v };
  }

  function setupCycles() {
    for (const c of cycles.values()) {
      const colors = [];
      c.members.forEach((m) => {
        if (m.el.dataset.color && colors[m.idx] === undefined) colors[m.idx] = m.el.dataset.color;
      });
      const limit = state.duration - state.outro;
      for (let k = 0; ; k++) {
        const t = c.offset + k * c.step;
        if (t >= limit) break;
        if (t < 0) continue;
        const idx = mod(k, c.n);
        const own = c.members.find((m) => m.idx === idx && m.el.dataset.sfx);
        cue(own ? own.el.dataset.sfx : c.sfx, t, c.gain);
      }
      setVar(c.el, "--count", c.n);
      updaters.push((t) => {
        const { cur, p, cycleP } = cycleAt(c, t);
        const f = Math.min(c.fade, c.step / 2);
        const left = c.period - mod(t - c.offset, c.period);
        const wrapFade = left < f ? ease.sine(left / f) : 1;
        c.el.dataset.active = cur;
        setVar(c.el, "--index", cur);
        setVar(c.el, "--step-p", p);
        setVar(c.el, "--cycle-p", cycleP);
        for (const m of c.members) {
          const el = m.el;
          if (m.idx < 0) {
            el.__m = { on: 0, age: 0, p: 0, done: 0, st: "queued", wrap: 1 };
            setVar(el, "--on", 0);
            continue;
          }
          const { on, age } = envelope(c, m.idx, t);
          const st = m.idx === cur ? "active" : m.idx < cur ? "done" : "queued";
          const a = st === "queued" ? 0 : Math.max(0, age);
          const done = st === "done" ? wrapFade : 0;
          const wrap = m.idx === c.n - 1 ? wrapFade : 1;
          const p = st === "done" ? done : st === "active" ? clamp(a / c.step) * wrap : 0;
          el.__m = { on, age: a, p, done, st, wrap };
          setVar(el, "--on", on);
          setVar(el, "--p", p);
          setVar(el, "--done", done);
          setVar(el, "--age", a);
          if (el.dataset.state !== st) {
            el.dataset.state = st;
            el.classList.toggle("is-active", st === "active");
            el.classList.toggle("is-done", st === "done");
            el.classList.toggle("is-queued", st === "queued");
          }
        }
        document.querySelectorAll(`[data-counter="${c.id}"]`).forEach((el) => {
          const txt = pad((c.order ? c.order[cur] : cur) + 1, num(el.dataset.pad, 2));
          if (el.textContent !== txt) el.textContent = txt;
        });
        if (c.accent && colors.length) {
          const next = colors[cur] || colors[0];
          const prev = colors[mod(cur - 1, c.n)] || next;
          const { on } = envelope(c, cur, t);
          const mix = on >= 1 ? next : `color-mix(in oklab, ${next} ${(on * 100).toFixed(1)}%, ${prev})`;
          root.style.setProperty("--accent", mix);
        }
      });
    }
  }

  const itemAge = (el) => (el.__m ? el.__m.age : null);

  function timed(el, t, dflt) {
    const m = el.__m;
    const dur = num(el.dataset.dur, dflt);
    if (m) return m.st === "done" ? m.done : m.st === "queued" ? 0 : clamp(m.age / dur) * m.wrap;
    if (el.dataset.at !== undefined) return clamp((t - +el.dataset.at) / dur);
    return 1;
  }

  function setupLinks() {
    document.querySelectorAll("[data-link]").forEach((el) => {
      const svg = el.ownerSVGElement;
      if (!svg) return;
      const sr = svg.getBoundingClientRect();
      const k = sr.width / (svg.clientWidth || sr.width) || 1;
      const box = (sel) => {
        const n = document.querySelector(sel);
        if (!n) throw new Error("data-link target not found: " + sel);
        const r = n.getBoundingClientRect();
        const x = (r.left - sr.left) / k;
        const y = (r.top - sr.top) / k;
        const w = r.width / k;
        const h = r.height / k;
        return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
      };
      const [fa, fb] = el.dataset.link.trim().split(/\s+/);
      const [sa, sideA] = fa.split("@");
      const [sb, sideB] = fb.split("@");
      const A = box(sa);
      const B = box(sb);
      const horiz = Math.abs(B.cx - A.cx) >= Math.abs(B.cy - A.cy);
      const sA = sideA || (horiz ? (B.cx > A.cx ? "right" : "left") : B.cy > A.cy ? "bottom" : "top");
      const sB = sideB || (horiz ? (B.cx > A.cx ? "left" : "right") : B.cy > A.cy ? "top" : "bottom");
      const gap = num(el.dataset.gap, 0);
      const pt = (b, side) => {
        const n = { left: [-1, 0], right: [1, 0], top: [0, -1], bottom: [0, 1], center: [0, 0] }[side] || [0, 0];
        const x = side === "left" ? b.x : side === "right" ? b.x + b.w : b.cx;
        const y = side === "top" ? b.y : side === "bottom" ? b.y + b.h : b.cy;
        return { x: x + n[0] * gap, y: y + n[1] * gap, n };
      };
      const a = pt(A, sA);
      const b = pt(B, sB);
      const shape = el.dataset.shape || "curve";
      const f = (v) => v.toFixed(1);
      let d;
      if (shape === "straight") d = `M${f(a.x)},${f(a.y)} L${f(b.x)},${f(b.y)}`;
      else if (shape === "elbow") {
        if (a.n[0]) {
          const mx = (a.x + b.x) / 2;
          d = `M${f(a.x)},${f(a.y)} H${f(mx)} V${f(b.y)} H${f(b.x)}`;
        } else if (b.n[0]) d = `M${f(a.x)},${f(a.y)} V${f(b.y)} H${f(b.x)}`;
        else {
          const my = (a.y + b.y) / 2;
          d = `M${f(a.x)},${f(a.y)} V${f(my)} H${f(b.x)} V${f(b.y)}`;
        }
      } else {
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        const c = Math.max(30, dist * num(el.dataset.bend, 0.45));
        const na = a.n[0] || a.n[1] ? a.n : [0, 0];
        const nb = b.n[0] || b.n[1] ? b.n : [0, 0];
        d = `M${f(a.x)},${f(a.y)} C${f(a.x + na[0] * c)},${f(a.y + na[1] * c)} ${f(b.x + nb[0] * c)},${f(b.y + nb[1] * c)} ${f(b.x)},${f(b.y)}`;
      }
      el.setAttribute("d", d);
    });
  }

  function setupBeams() {
    document.querySelectorAll("[data-beam]").forEach((el) => {
      const len = el.getTotalLength();
      const c = cycles.get(el.dataset.item || el.closest("[data-cycle]")?.dataset.cycle);
      const drawDur = num(el.dataset.draw, c ? c.step * 0.6 : 0.8);
      const rev = el.hasAttribute("data-reverse");
      el.style.strokeDasharray = `${len} ${len}`;
      let dot = null;
      if (el.dataset.dot !== "0") {
        dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("r", el.dataset.dotR || "5");
        dot.setAttribute("class", "mi-beam-dot " + (el.dataset.dotClass || ""));
        el.after(dot);
      }
      if (c && el.dataset.sfxEnd) {
        const own = c.members.find((m) => m.el === el);
        if (own) {
          for (let t = c.offset + own.idx * c.step + drawDur; t < state.duration - state.outro; t += c.period) cue(el.dataset.sfxEnd, t);
        }
      }
      updaters.push((t) => {
        const p = ease.inOut(timed(el, t, drawDur));
        el.style.strokeDashoffset = (rev ? -1 : 1) * len * (1 - p);
        if (dot) {
          const pt = el.getPointAtLength((rev ? 1 - p : p) * len);
          dot.setAttribute("cx", pt.x);
          dot.setAttribute("cy", pt.y);
          const on = el.__m ? el.__m.on : 1;
          dot.style.opacity = p > 0 && p < 1 ? on : 0;
        }
      });
    });
  }

  function setupPackets() {
    document.querySelectorAll("[data-packets]").forEach((el) => {
      const n = num(el.dataset.packets, 3);
      const period = snap(num(el.dataset.period, 3));
      const len = el.getTotalLength();
      const rev = el.hasAttribute("data-reverse");
      const off = num(el.dataset.phaseOffset, 0);
      const dots = [];
      for (let i = 0; i < n; i++) {
        const d = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        d.setAttribute("r", el.dataset.r || "3");
        d.setAttribute("class", "mi-packet " + (el.dataset.packetClass || ""));
        el.after(d);
        dots.push(d);
      }
      updaters.push((t) => {
        dots.forEach((d, i) => {
          const u = frac(t / period + i / n + off);
          const pt = el.getPointAtLength((rev ? 1 - u : u) * len);
          d.setAttribute("cx", pt.x);
          d.setAttribute("cy", pt.y);
          d.style.opacity = Math.sin(Math.PI * u).toFixed(3);
        });
      });
    });
  }

  function setupWaves() {
    document.querySelectorAll("[data-spin]").forEach((el) => {
      const period = snap(num(el.dataset.spin, 20));
      updaters.push((t) => {
        el.style.transform = `rotate(${((360 * t) / period).toFixed(3)}deg)`;
      });
    });
    document.querySelectorAll("[data-pulse]").forEach((el) => {
      const period = snap(num(el.dataset.pulse, 2));
      const off = num(el.dataset.phaseOffset, 0);
      updaters.push((t) => setVar(el, "--pulse", 0.5 - 0.5 * Math.cos(2 * Math.PI * (t / period + off))));
    });
    document.querySelectorAll("[data-phase]").forEach((el) => {
      const period = snap(num(el.dataset.phase, 4));
      const off = num(el.dataset.phaseOffset, 0);
      updaters.push((t) => setVar(el, "--phase", frac(t / period + off)));
    });
    document.querySelectorAll("[data-drift]").forEach((el, i) => {
      const amp = num(el.dataset.drift, 6);
      const r = rng(hash(el.dataset.seed || i + 1));
      const k = [1, 2, 3].map(() => ({ m: 1 + Math.floor(r() * 3), ph: r() }));
      const base = snap(num(el.dataset.period, 8));
      updaters.push((t) => {
        const x = amp * Math.sin(2 * Math.PI * (t / base) * k[0].m + k[0].ph * 6.28);
        const y = amp * Math.cos(2 * Math.PI * (t / base) * k[1].m + k[1].ph * 6.28);
        el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
      });
    });
    document.querySelectorAll("[data-flash]").forEach((el) => {
      const hz = num(el.dataset.flash, 3);
      updaters.push((t) => {
        const age = itemAge(el);
        const on = el.__m ? el.__m.on : 0;
        const f = age === null || age < 0 ? 0 : on * (0.5 + 0.5 * Math.cos(2 * Math.PI * hz * age)) * Math.exp(-age * 1.2);
        setVar(el, "--flash", f);
      });
    });
  }

  function setupStars() {
    document.querySelectorAll("[data-starfield]").forEach((el, i) => {
      const n = num(el.dataset.starfield, 60);
      const r = rng(hash(el.dataset.seed || "stars" + i));
      const stars = [];
      for (let k = 0; k < n; k++) {
        const s = document.createElement("i");
        s.className = "mi-star";
        s.style.left = (r() * 100).toFixed(2) + "%";
        s.style.top = (r() * 100).toFixed(2) + "%";
        const size = 1 + r() * num(el.dataset.size, 2.5);
        s.style.width = s.style.height = size.toFixed(2) + "px";
        el.appendChild(s);
        stars.push({ s, p: snap(2 + r() * 5), ph: r(), base: 0.25 + r() * 0.4 });
      }
      updaters.push((t) => {
        for (const st of stars) {
          st.s.style.opacity = (st.base + 0.6 * Math.max(0, Math.sin(2 * Math.PI * (t / st.p + st.ph))) ** 3).toFixed(3);
        }
      });
    });
  }

  function fmtNum(v, el) {
    const dec = num(el.dataset.decimals, 0);
    let s = v.toFixed(dec);
    if (el.hasAttribute("data-group")) s = (+s).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    return (el.dataset.prefix || "") + s + (el.dataset.suffix || "");
  }

  function waveNoise(seed) {
    const r = rng(seed);
    const parts = [0, 1, 2].map(() => ({ m: 1 + Math.floor(r() * 4), ph: r(), a: 0.3 + r() * 0.7 }));
    const total = parts.reduce((s, p) => s + p.a, 0);
    return (t) => parts.reduce((s, p) => s + p.a * Math.sin(2 * Math.PI * (p.m * t / state.duration + p.ph)), 0) / total;
  }

  function setupData() {
    document.querySelectorAll("[data-count]").forEach((el) => {
      const to = +el.dataset.count;
      const from = num(el.dataset.from, 0);
      if (!el.hasAttribute("data-decimals")) {
        const m = /\.(\d+)/.exec(el.dataset.count);
        el.dataset.decimals = m ? m[1].length : 0;
      }
      updaters.push((t) => {
        const p = ease.out(timed(el, t, 1.2));
        el.textContent = fmtNum(from + (to - from) * p, el);
      });
    });
    document.querySelectorAll("[data-ticker]").forEach((el, i) => {
      const base = +el.dataset.ticker;
      const jit = num(el.dataset.jitter, Math.abs(base) * 0.02);
      const noise = waveNoise(hash(el.dataset.seed || "tk" + i));
      updaters.push((t) => {
        el.textContent = fmtNum(base + jit * noise(t), el);
      });
    });
    document.querySelectorAll("[data-clock]").forEach((el) => {
      updaters.push((t) => {
        const s = Math.floor(t);
        const cs = Math.floor((t - s) * 100);
        const txt = (el.dataset.prefix || "") + (el.dataset.clock === "mm:ss" ? `${pad(Math.floor(s / 60), 2)}:${pad(s % 60, 2)}` : `${pad(s, 2)}.${pad(cs, 2)}`);
        if (el.textContent !== txt) el.textContent = txt;
      });
    });
    document.querySelectorAll("[data-bar]").forEach((el, i) => {
      const raw = el.dataset.bar;
      const v = raw.endsWith("%") ? parseFloat(raw) / 100 : +raw;
      const jit = num(el.dataset.jitter, 0);
      const noise = jit ? waveNoise(hash(el.dataset.seed || "bar" + i)) : null;
      updaters.push((t) => {
        let val = v * ease.out(timed(el, t, 0.9));
        if (noise) val = clamp(val + jit * noise(t));
        setVar(el, "--value", val);
      });
    });
    document.querySelectorAll("[data-progress]").forEach((el) => {
      const key = el.dataset.progress;
      updaters.push((t) => {
        const c = cycles.get(key);
        setVar(el, "--value", c ? cycleAt(c, t).cycleP : clamp(t / state.duration));
      });
    });
    document.querySelectorAll("[data-sparkline], [data-sine]").forEach((el, i) => {
      const sine = el.hasAttribute("data-sine");
      const vb = el.viewBox.baseVal;
      const W = vb && vb.width ? vb.width : 200;
      const H = vb && vb.height ? vb.height : 40;
      const pts = num(sine ? el.dataset.points : el.dataset.sparkline, sine ? 80 : 24);
      const waves = num(el.dataset.waves, 2);
      const speed = Math.max(1, Math.round(num(el.dataset.speed, 2)));
      const r = rng(hash(el.dataset.seed || "sp" + i));
      const comps = sine ? [{ f: waves, a: 1, ph: 0 }] : [1, 2, 3].map((k) => ({ f: k * waves, a: 1 / k, ph: r() }));
      const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      line.setAttribute("class", "mi-line");
      line.setAttribute("fill", "none");
      el.appendChild(line);
      updaters.push((t) => {
        const shift = (speed * t) / state.duration;
        let d = "";
        for (let k = 0; k <= pts; k++) {
          const x = k / pts;
          const y = comps.reduce((s, c) => s + c.a * Math.sin(2 * Math.PI * (c.f * x - shift + c.ph)), 0) / comps.reduce((s, c) => s + c.a, 0);
          d += `${(x * W).toFixed(1)},${(H / 2 - y * H * 0.42).toFixed(1)} `;
        }
        line.setAttribute("points", d);
      });
    });
  }

  function setupFollow() {
    document.querySelectorAll("[data-follow]").forEach((el) => {
      const c = cycles.get(el.dataset.follow);
      if (!c) return;
      const cmds = [];
      c.members.forEach((m) => {
        if (m.idx >= 0 && m.el.dataset.cmd && cmds[m.idx] === undefined) cmds[m.idx] = m.el.dataset.cmd;
      });
      const prefix = el.dataset.prefix || "";
      el.textContent = "";
      const span = document.createElement("span");
      const caret = document.createElement("i");
      caret.className = "mi-caret";
      el.append(span, caret);
      const dur = num(el.dataset.dur, c.step * 0.6);
      updaters.push((t) => {
        const { cur, p } = cycleAt(c, t);
        const cmd = cmds[cur] || "";
        const n = Math.round(cmd.length * clamp((p * c.step) / dur));
        const txt = prefix + cmd.slice(0, n);
        if (span.textContent !== txt) span.textContent = txt;
        caret.style.opacity = n < cmd.length || Math.floor(t * 2.5) % 2 === 0 ? 1 : 0;
      });
    });
  }

  function setupGrep() {
    document.querySelectorAll("[data-grep]").forEach((el) => {
      const queries = el.dataset.grep.split("|").map((q) => q.trim()).filter(Boolean);
      if (!queries.length) return;
      const n = queries.length;
      let step = num(el.dataset.step, 3);
      if (state.loop) step = state.duration / (n * Math.max(1, Math.round(state.duration / (step * n))));
      const typeDur = num(el.dataset.dur, Math.min(1, step * 0.35));
      const rows = [...el.querySelectorAll("[data-grep-row]")].map((r) => ({ r, text: (r.dataset.grepRow || r.textContent).toLowerCase() }));
      const qEls = el.querySelectorAll("[data-grep-query]");
      const cEls = el.querySelectorAll("[data-grep-count]");
      const hits = queries.map((q) => rows.map((x) => x.text.includes(q.toLowerCase())));
      if (el.dataset.sfx) for (let k = 0; k * step < state.duration - state.outro; k++) cue(el.dataset.sfx, k * step + typeDur, num(el.dataset.gain, 0.8));
      updaters.push((t) => {
        const k = Math.floor(mod(t, n * step) / step);
        const age = mod(t, step);
        const q = queries[k];
        const typed = q.slice(0, Math.round(q.length * clamp(age / typeDur)));
        const show = ease.out(clamp((age - typeDur) / 0.3));
        const fadeOut = age > step - 0.25 ? ease.sine((step - age) / 0.25) : 1;
        qEls.forEach((e) => {
          if (e.textContent !== typed) e.textContent = typed;
        });
        const count = hits[k].filter(Boolean).length;
        cEls.forEach((e) => {
          const txt = String(show > 0 ? count : 0);
          if (e.textContent !== txt) e.textContent = txt;
        });
        rows.forEach((x, i) => {
          const m = hits[k][i] ? show * fadeOut : 0;
          setVar(x.r, "--match", m);
          setVar(x.r, "--miss", hits[k][i] ? 0 : show * fadeOut);
        });
      });
    });
  }

  function setupScramble() {
    document.querySelectorAll("[data-scramble]").forEach((el, i) => {
      const final = el.textContent;
      const dur = num(el.dataset.scramble, 0.6);
      const period = el.__m === undefined && !el.hasAttribute("data-item") ? snap(num(el.dataset.period, state.master ? state.master.period : 4)) : 0;
      const seed = hash(el.dataset.seed || "sc" + i);
      updaters.push((t) => {
        let active;
        if (el.hasAttribute("data-item")) active = el.__m && el.__m.st === "active" && el.__m.age < dur && t >= dur;
        else if (el.dataset.at !== undefined) active = t >= +el.dataset.at && t < +el.dataset.at + dur;
        else active = mod(t, period) > period - dur;
        let txt = final;
        if (active) {
          const r = rng(seed + Math.floor(t * 20));
          txt = final.replace(/[0-9]/g, () => String(Math.floor(r() * 10)));
        }
        if (el.textContent !== txt) el.textContent = txt;
      });
    });
  }

  function setupSelect() {
    document.querySelectorAll("[data-select]").forEach((el) => {
      updaters.push((t) => setVar(el, "--sel", ease.inOut(timed(el, t, num(el.dataset.select, 0.6)))));
    });
  }

  function setupText() {
    document.querySelectorAll("[data-type]").forEach((el) => {
      const text = el.textContent;
      el.textContent = "";
      const span = document.createElement("span");
      const caret = document.createElement("i");
      caret.className = "mi-caret";
      el.append(span, caret);
      updaters.push((t) => {
        const p = timed(el, t, num(el.dataset.dur, Math.max(0.4, text.length * 0.035)));
        const n = Math.round(text.length * p);
        if (span.textContent.length !== n) span.textContent = text.slice(0, n);
        caret.style.opacity = p < 1 || Math.floor(t * 2.5) % 2 === 0 ? 1 : 0;
      });
    });
    document.querySelectorAll("[data-log]").forEach((el) => {
      const lines = [...el.querySelectorAll("[data-line]")].map((l) => l.innerHTML);
      const rows = num(el.dataset.rows, Math.min(6, lines.length));
      const L = lines.length;
      let step = num(el.dataset.log, 0.6);
      if (state.loop) step = state.duration / (L * Math.max(1, Math.round(state.duration / (step * L))));
      el.innerHTML = "";
      setVar(el, "--rows", rows);
      const box = document.createElement("div");
      box.className = "mi-log-rows";
      el.appendChild(box);
      const rowEls = [];
      for (let k = 0; k <= rows; k++) {
        const r = document.createElement("div");
        r.className = "mi-log-row";
        box.appendChild(r);
        rowEls.push(r);
      }
      if (el.dataset.sfx) for (let t = 0; t < state.duration - state.outro; t += step) cue(el.dataset.sfx, t, num(el.dataset.gain, 0.6));
      let last = -1;
      updaters.push((t) => {
        const c = Math.floor(t / step);
        const u = (t - c * step) / step;
        if (c !== last) {
          rowEls.forEach((r, k) => {
            const li = mod(c - rows + k, L);
            r.innerHTML = lines[li];
            r.classList.toggle("is-new", k === rows);
          });
          last = c;
        }
        const s = ease.out(clamp(u / 0.35));
        box.style.transform = `translateY(${(-s * 100 / (rows + 1)).toFixed(3)}%)`;
        rowEls[rows].style.opacity = s.toFixed(3);
      });
    });
  }

  function setupEnter() {
    document.querySelectorAll("[data-enter]").forEach((el) => {
      const at = num(el.dataset.at, 0);
      const dur = num(el.dataset.dur, 0.6);
      if (el.dataset.sfx && !el.hasAttribute("data-item")) cue(el.dataset.sfx, at, num(el.dataset.gain, 1));
      updaters.push((t) => setVar(el, "--in", ease.out(clamp((t - at) / dur))));
    });
  }

  const animRate = new WeakMap();
  function driveCss(t) {
    for (const a of document.getAnimations()) {
      let rate = animRate.get(a);
      if (rate === undefined) {
        rate = 1;
        const tm = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
        if (state.loop && tm && tm.iterations === Infinity && tm.duration > 0) {
          const D = state.duration * 1000;
          const k = Math.max(1, Math.round(D / tm.duration));
          rate = (tm.duration * k) / D;
        }
        animRate.set(a, rate);
        a.pause();
      }
      a.currentTime = t * 1000 * rate;
    }
    document.querySelectorAll("svg").forEach((s) => {
      if (s.animationsPaused && !s.animationsPaused()) s.pauseAnimations();
      if (s.setCurrentTime) s.setCurrentTime(t);
    });
  }

  function render(t) {
    state.t = t;
    for (const u of updaters) u(t);
    for (const h of hooks) h(t, state);
    driveCss(t);
  }

  const SFX = {
    tick(ctx, out, t, g, noise) {
      const s = ctx.createBufferSource();
      s.buffer = noise;
      const f = ctx.createBiquadFilter();
      f.type = "highpass";
      f.frequency.value = 3500;
      const e = ctx.createGain();
      e.gain.setValueAtTime(0.0001, t);
      e.gain.exponentialRampToValueAtTime(0.35 * g, t + 0.002);
      e.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      s.connect(f).connect(e).connect(out);
      s.start(t, (t * 7.3) % 1, 0.05);
    },
    blip(ctx, out, t, g) {
      tone(ctx, out, t, "sine", 1760, 2100, 0.002, 0.09, 0.28 * g);
      tone(ctx, out, t, "sine", 3520, 3520, 0.001, 0.04, 0.05 * g);
    },
    thump(ctx, out, t, g) {
      tone(ctx, out, t, "sine", 150, 48, 0.003, 0.22, 0.9 * g);
    },
    kick(ctx, out, t, g) {
      tone(ctx, out, t, "sine", 120, 42, 0.002, 0.32, 1.0 * g);
      SFX.tick(ctx, out, t, 0.4 * g, ctx.__noise);
    },
    packet(ctx, out, t, g, noise) {
      const s = ctx.createBufferSource();
      s.buffer = noise;
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 4200;
      f.Q.value = 6;
      const e = ctx.createGain();
      e.gain.setValueAtTime(0.0001, t);
      e.gain.exponentialRampToValueAtTime(0.5 * g, t + 0.004);
      e.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      s.connect(f).connect(e).connect(out);
      s.start(t, (t * 3.1) % 1, 0.08);
      tone(ctx, out, t, "triangle", 2600, 3200, 0.002, 0.05, 0.06 * g);
    },
    pop(ctx, out, t, g) {
      tone(ctx, out, t, "sine", 720, 260, 0.002, 0.09, 0.5 * g);
      tone(ctx, out, t, "triangle", 1400, 900, 0.001, 0.03, 0.12 * g);
    },
    whoosh(ctx, out, t, g, noise) {
      const s = ctx.createBufferSource();
      s.buffer = noise;
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.Q.value = 1.2;
      f.frequency.setValueAtTime(300, t);
      f.frequency.exponentialRampToValueAtTime(3200, t + 0.45);
      const e = ctx.createGain();
      e.gain.setValueAtTime(0.0001, t);
      e.gain.exponentialRampToValueAtTime(0.35 * g, t + 0.2);
      e.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      s.connect(f).connect(e).connect(out);
      s.start(t, 0, 0.6);
    },
    chime(ctx, out, t, g) {
      [880, 1318.5, 1760, 2637].forEach((f, i) => tone(ctx, out, t + i * 0.012, "sine", f, f, 0.003, 1.6 - i * 0.25, (0.16 / (i + 1)) * g));
    },
    riser(ctx, out, t, g, noise, len = 2) {
      const s = ctx.createBufferSource();
      s.buffer = noise;
      s.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.Q.value = 2;
      f.frequency.setValueAtTime(200, t);
      f.frequency.exponentialRampToValueAtTime(6000, t + len);
      const e = ctx.createGain();
      e.gain.setValueAtTime(0.0001, t);
      e.gain.exponentialRampToValueAtTime(0.25 * g, t + len * 0.95);
      e.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.05);
      s.connect(f).connect(e).connect(out);
      s.start(t);
      s.stop(t + len + 0.1);
    },
    success(ctx, out, t, g) {
      tone(ctx, out, t, "sine", 1046.5, 1046.5, 0.003, 0.12, 0.2 * g);
      tone(ctx, out, t + 0.09, "sine", 1568, 1568, 0.003, 0.3, 0.2 * g);
    },
    error(ctx, out, t, g) {
      tone(ctx, out, t, "square", 220, 180, 0.003, 0.14, 0.07 * g);
      tone(ctx, out, t + 0.12, "square", 180, 150, 0.003, 0.18, 0.07 * g);
    },
    type(ctx, out, t, g, noise) {
      SFX.tick(ctx, out, t, 0.6 * g, noise);
      tone(ctx, out, t, "square", 900, 700, 0.001, 0.015, 0.02 * g);
    },
  };

  function tone(ctx, out, t, type, f0, f1, att, dec, g) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dec);
    const e = ctx.createGain();
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(Math.max(0.0002, g), t + att);
    e.gain.exponentialRampToValueAtTime(0.0001, t + att + dec);
    o.connect(e).connect(out);
    o.start(t);
    o.stop(t + att + dec + 0.05);
  }

  const CHORDS = [
    [220, 261.63, 329.63, 392],
    [174.61, 220, 261.63, 329.63],
    [196, 246.94, 293.66, 392],
    [164.81, 196, 246.94, 329.63],
  ];

  function pad_(ctx, out, D, g, loop, steps) {
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    lp.Q.value = 0.4;
    const bus = ctx.createGain();
    bus.gain.value = g;
    lp.connect(bus).connect(out);
    const seg = D / steps;
    for (let k = 0; k < steps; k++) {
      const t0 = k * seg;
      CHORDS[k % CHORDS.length].forEach((f, i) => {
        [-5, 5].forEach((det) => {
          const o = ctx.createOscillator();
          o.type = i === 0 ? "triangle" : "sawtooth";
          o.frequency.value = f * (i === 0 ? 0.5 : 1);
          o.detune.value = det;
          const e = ctx.createGain();
          const lvl = i === 0 ? 0.22 : 0.06;
          const xf = steps > 1 ? Math.min(0.6, seg / 4) : 0;
          e.gain.setValueAtTime(xf ? 0.0001 : lvl, Math.max(0, t0 - xf));
          if (xf) e.gain.linearRampToValueAtTime(lvl, t0 + xf);
          e.gain.setValueAtTime(lvl, t0 + seg - xf);
          if (xf) e.gain.linearRampToValueAtTime(0.0001, t0 + seg + xf);
          o.connect(e).connect(lp);
          o.start(Math.max(0, t0 - xf));
          o.stop(Math.min(D, t0 + seg + xf) + 0.01);
        });
      });
    }
    if (!loop) {
      bus.gain.setValueAtTime(0.0001, 0);
      bus.gain.linearRampToValueAtTime(g, 1.2);
      bus.gain.setValueAtTime(g, Math.max(1.2, D - 1.5));
      bus.gain.linearRampToValueAtTime(0.0001, D);
    }
  }

  async function renderAudio(profile = cfg.sfx || "soft", sampleRate = 48000) {
    const D = state.duration;
    const ctx = new OfflineAudioContext(2, Math.ceil(D * sampleRate), sampleRate);
    const noise = ctx.createBuffer(1, sampleRate * 2, sampleRate);
    const r = rng(12345);
    const nd = noise.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = r() * 2 - 1;
    ctx.__noise = noise;
    const master = ctx.createDynamicsCompressor();
    master.threshold.value = -14;
    master.ratio.value = 3;
    master.connect(ctx.destination);
    const sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.9;
    sfxBus.connect(master);
    if (profile === "none") return ctx.startRendering();
    const beat = state.beat;
    const end = D - state.outro;
    if (profile === "soft") {
      pad_(ctx, master, D, 0.05, state.loop, 1);
      const tickEvery = clamp(beat / 2, 0.25, 0.6);
      for (let t = 0; t < end - 1e-6; t += tickEvery) SFX.tick(ctx, sfxBus, t, 0.35, noise);
    } else if (profile === "music") {
      const bars = Math.max(1, Math.round(D / (beat * 8)));
      pad_(ctx, master, D, 0.07, state.loop, Math.max(1, Math.min(4, bars)));
      for (let t = 0; t < end - 1e-6; t += beat) {
        SFX.kick(ctx, sfxBus, t, 0.8, noise);
        SFX.tick(ctx, sfxBus, t + beat / 2, 0.5, noise);
      }
      if (!state.loop) SFX.riser(ctx, sfxBus, 0, 0.8, noise, Math.min(4, beat * 4));
    }
    for (const c of cues) {
      const fn = SFX[c.name];
      if (fn) fn(ctx, sfxBus, c.t, c.gain, noise);
    }
    return ctx.startRendering();
  }

  function toWav(buf) {
    const n = buf.length;
    const chs = buf.numberOfChannels;
    const data = new DataView(new ArrayBuffer(44 + n * chs * 2));
    const w = (o, s) => [...s].forEach((c, i) => data.setUint8(o + i, c.charCodeAt(0)));
    w(0, "RIFF");
    data.setUint32(4, 36 + n * chs * 2, true);
    w(8, "WAVEfmt ");
    data.setUint32(16, 16, true);
    data.setUint16(20, 1, true);
    data.setUint16(22, chs, true);
    data.setUint32(24, buf.sampleRate, true);
    data.setUint32(28, buf.sampleRate * chs * 2, true);
    data.setUint16(32, chs * 2, true);
    data.setUint16(34, 16, true);
    w(36, "data");
    data.setUint32(40, n * chs * 2, true);
    const ch = [...Array(chs)].map((_, i) => buf.getChannelData(i));
    let o = 44;
    for (let i = 0; i < n; i++) {
      for (let c = 0; c < chs; c++) {
        data.setInt16(o, clamp(ch[c][i], -1, 1) * 32767, true);
        o += 2;
      }
    }
    return new Uint8Array(data.buffer);
  }

  let wavChunks = null;
  async function prepareWav(profile) {
    const bytes = toWav(await renderAudio(profile));
    wavChunks = [];
    const size = 512 * 1024;
    for (let i = 0; i < bytes.length; i += size) {
      let s = "";
      const part = bytes.subarray(i, i + size);
      for (let k = 0; k < part.length; k += 8192) s += String.fromCharCode.apply(null, part.subarray(k, k + 8192));
      wavChunks.push(btoa(s));
    }
    return wavChunks.length;
  }

  let player = null;
  let fontFaces = [];
  const missingFonts = () =>
    fontFaces.filter((f) => {
      try {
        return !document.fonts.check(f);
      } catch {
        return false;
      }
    }).map((f) => f.replace(/^.*"(.*)"$/, "$1"));
  function setupPlayer() {
    const stage = document.querySelector(".mi-page") || body.firstElementChild;
    const fit = () => {
      const bar = 56;
      const s = Math.min(innerWidth / cw, (innerHeight - bar) / ch, 1);
      root.style.setProperty("--fit", s.toFixed(4));
    };
    fit();
    addEventListener("resize", fit);
    root.classList.add("mi-preview");
    const ui = document.createElement("div");
    ui.className = "mi-player";
    ui.innerHTML = `<button data-act="play">▶</button><button data-act="sound">♪ off</button><input type="range" min="0" max="1000" value="0"><span class="mi-time">0.00s</span>`;
    body.appendChild(ui);
    if (query.has("nobar")) ui.style.display = "none";
    const range = ui.querySelector("input");
    const timeEl = ui.querySelector(".mi-time");
    const playBtn = ui.querySelector('[data-act="play"]');
    const soundBtn = ui.querySelector('[data-act="sound"]');
    let playing = false;
    let start = 0;
    let base = 0;
    let actx = null;
    let buffer = null;
    let src = null;
    let sound = false;
    const stopSound = () => {
      if (src) try { src.stop(); } catch {}
      src = null;
    };
    const startSound = async () => {
      if (!sound || !playing) return;
      actx = actx || new AudioContext();
      if (!buffer) buffer = await renderAudio();
      stopSound();
      src = actx.createBufferSource();
      src.buffer = buffer;
      src.loop = state.loop;
      src.connect(actx.destination);
      src.start(0, mod(state.t, state.duration));
    };
    const show = (t) => {
      render(t);
      range.value = Math.round((t / state.duration) * 1000);
      timeEl.textContent = t.toFixed(2) + "s / " + state.duration.toFixed(2) + "s";
    };
    const frame = (now) => {
      if (!playing) return;
      let t = base + Math.max(0, now - start) / 1000;
      if (t >= state.duration) {
        if (state.loop) t = mod(t, state.duration);
        else {
          t = state.duration - 1e-3;
          playing = false;
          playBtn.textContent = "▶";
        }
      }
      if (playing) requestAnimationFrame(frame);
      try {
        show(t);
      } catch (err) {
        console.error(err);
      }
    };
    const play = () => {
      playing = true;
      base = state.t;
      start = performance.now();
      playBtn.textContent = "❚❚";
      startSound();
      requestAnimationFrame(frame);
    };
    const pause = () => {
      playing = false;
      playBtn.textContent = "▶";
      stopSound();
    };
    playBtn.onclick = () => (playing ? pause() : play());
    soundBtn.onclick = () => {
      sound = !sound;
      soundBtn.textContent = sound ? "♪ on" : "♪ off";
      if (sound) startSound();
      else stopSound();
    };
    range.oninput = () => {
      const was = playing;
      pause();
      show((range.value / 1000) * state.duration);
      if (was) play();
    };
    addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        playing ? pause() : play();
      }
      if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
        pause();
        show(mod(state.t + (e.code === "ArrowRight" ? 1 : -1) / state.fps, state.duration));
      }
    });
    show(num(query.get("t"), state.poster));
    if (!query.has("paused")) play();
    player = { play, pause, show };
    return stage;
  }

  const Motion = {
    ease,
    clamp,
    snap,
    rng,
    get duration() {
      return state.duration;
    },
    get t() {
      return state.t;
    },
    on(fn) {
      hooks.push(fn);
      return Motion;
    },
    sfx(name, t, gain = 1) {
      cue(name, t, gain);
      return Motion;
    },
    seek(t) {
      render(t);
      return t;
    },
    meta() {
      return {
        duration: state.duration,
        fps: state.fps,
        loop: state.loop,
        poster: state.poster,
        beat: state.beat,
        outro: state.outro,
        canvas: { width: cw, height: ch },
        sfx: cfg.sfx || "soft",
        cues: [...cues].sort((a, b) => a.t - b.t),
      };
    },
    missingFonts() {
      return [...new Set(missingFonts())];
    },
    renderAudio,
    prepareWav,
    wavChunk(i) {
      return wavChunks ? wavChunks[i] : null;
    },
    get player() {
      return player;
    },
  };

  async function init() {
    if (EXPORT) root.classList.add("mi-export");
    const loaded = document.readyState === "complete" ? Promise.resolve() : new Promise((r) => addEventListener("load", r, { once: true }));
    const fontsUsed = async () => {
      await loaded;
      const faces = new Set();
      document.querySelectorAll("body *").forEach((el) => {
        const cs = getComputedStyle(el);
        const fam = cs.fontFamily.split(",")[0].trim().replace(/^["']|["']$/g, "");
        if (fam) faces.add(`${cs.fontStyle} ${cs.fontWeight} 32px "${fam}"`);
      });
      fontFaces = [...faces];
      await Promise.all(fontFaces.map((f) => document.fonts.load(f).catch(() => null)));
      await document.fonts.ready;
    };
    try {
      await Promise.race([fontsUsed(), new Promise((r) => setTimeout(r, 10000))]);
    } catch {}
    setupLinks();
    scanCycles();
    resolveDuration();
    setupCycles();
    setupEnter();
    setupBeams();
    setupPackets();
    setupWaves();
    setupStars();
    setupData();
    setupText();
    setupFollow();
    setupGrep();
    setupScramble();
    setupSelect();
    const custom = window.MotionSetup;
    if (typeof custom === "function") await custom(Motion);
    if (EXPORT) render(num(query.get("t"), state.poster));
    else setupPlayer();
    Motion.ready = true;
    window.dispatchEvent(new Event("motion:ready"));
  }

  window.Motion = Motion;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
