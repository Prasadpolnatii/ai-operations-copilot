/**
 * Generates an original, royalty-free score + sound design for ALPHA TO OMEGA.
 *
 * Every hit is placed from the shot list in src/shots.ts, so re-timing shots and
 * re-running `npm run score` keeps the sound frame-locked to the picture.
 *
 *   node scripts/make-score.mjs  →  public/audio/score.raw.wav  (then loudnorm → score.wav)
 *
 * Pure JS synthesis: additive choir pads, Karplus-Strong plucks, sub booms,
 * thunder, risers, whooshes, bells, heartbeats, glitch bursts, Freeverb reverb.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const { SHOTS, SHOT_STARTS, TOTAL_FRAMES, actRange } = await import(new URL("../src/shots.ts", import.meta.url));

const SR = 44100;
const FPS = 30;
const N = Math.ceil((TOTAL_FRAMES / FPS) * SR);
const s = (frame) => Math.round((frame / FPS) * SR);

// ───────── buses ─────────
const dryL = new Float32Array(N);
const dryR = new Float32Array(N);
const send = new Float32Array(N); // mono reverb send

const add = (buf, at, gain = 1, pan = 0, rev = 0.25) => {
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < buf.length; i++) {
    const j = at + i;
    if (j < 0 || j >= N) continue;
    dryL[j] += buf[i] * gl;
    dryR[j] += buf[i] * gr;
    send[j] += buf[i] * gain * rev;
  }
};

// ───────── utils ─────────
let seed = 1337;
const rnd = () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const len = (sec) => Math.max(1, Math.round(sec * SR));
const hz = (note) => 440 * Math.pow(2, (note - 69) / 12); // MIDI → Hz

/** RBJ biquad, processes in place; `fc` may be a function of sample index (sweeps). */
const biquad = (x, type, fc, q = 0.707) => {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const f = typeof fc === "function" ? fc(i) : fc;
    const w = (2 * Math.PI * Math.min(f, SR * 0.45)) / SR;
    const cs = Math.cos(w), al = Math.sin(w) / (2 * q);
    let b0, b1, b2;
    if (type === "lp") { b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = b0; }
    else if (type === "hp") { b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = b0; }
    else { b0 = al; b1 = 0; b2 = -al; } // band-pass
    const a0 = 1 + al, a1 = -2 * cs, a2 = 1 - al;
    const y = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = y;
    x[i] = y;
  }
  return x;
};

// ───────── instruments (mono) ─────────

/** Choir/string pad: detuned additive voices + "ah" formants. */
const pad = (notes, dur, { attack = 0.6, release = 0.8, bright = 0.5, vib = 0.004 } = {}) => {
  const n = len(dur + release);
  const out = new Float32Array(n);
  for (const note of notes) {
    const f0 = hz(note);
    const maxH = Math.min(18, Math.floor(7000 / f0));
    for (const det of [-0.006, 0, 0.0065]) {
      const ph = rnd() * 6.28;
      for (let i = 0; i < n; i++) {
        const t = i / SR;
        const f = f0 * (1 + det) * (1 + vib * Math.sin(2 * Math.PI * 5.2 * t + ph));
        let v = 0;
        for (let h = 1; h <= maxH; h++) v += Math.sin(2 * Math.PI * f * h * t + ph * h) * Math.pow(h, -1.2 - (1 - bright));
        out[i] += v;
      }
    }
  }
  const f1 = biquad(Float32Array.from(out), "bp", 720, 2.2);
  const f2 = biquad(Float32Array.from(out), "bp", 1150, 2.5);
  const body = biquad(Float32Array.from(out), "lp", 900 + bright * 3500);
  const nr = len(release);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.min(1, t / attack) * (i > n - nr ? (n - i) / nr : 1);
    out[i] = (body[i] * 0.55 + f1[i] * 0.9 + f2[i] * 0.6) * env / (notes.length * 9);
  }
  return out;
};

const boom = (dur = 1.6, f0 = 95, f1 = 34) => {
  const n = len(dur);
  const out = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (f1 + (f0 - f1) * Math.exp(-t * 7))) / SR;
    out[i] = Math.tanh(Math.sin(ph) * 1.6) * Math.exp(-t * (2.6 / dur)) + (i < 600 ? noise() * (1 - i / 600) * 0.6 : 0);
  }
  return out;
};

const kick = () => boom(0.32, 130, 45);

const tick = (f = 2400, amp = 1) => {
  const n = len(0.045);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 90) + (i < 140 ? noise() * 0.8 : 0)) * amp;
  }
  return biquad(out, "hp", 900);
};

const hat = () => {
  const n = len(0.05);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = noise() * Math.exp((-i / SR) * 70);
  return biquad(out, "hp", 7000);
};

const whoosh = (dur, fA = 300, fB = 4000) => {
  const n = len(dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = noise() * Math.pow(Math.sin((Math.PI * i) / n), 2);
  return biquad(out, "bp", (i) => fA * Math.pow(fB / fA, i / n), 1.4);
};

const riser = (dur) => {
  const n = len(dur);
  const nz = new Float32Array(n);
  for (let i = 0; i < n; i++) nz[i] = noise();
  biquad(nz, "bp", (i) => 250 * Math.pow(30, i / n), 1.8);
  const out = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const p = i / n;
    ph += (2 * Math.PI * 110 * Math.pow(8, p * p)) / SR;
    const saw = ((ph / (2 * Math.PI)) % 1) * 2 - 1;
    out[i] = (nz[i] * 0.9 + saw * 0.18) * Math.pow(p, 2.2);
  }
  return out;
};

const thunder = (dur = 2.2) => {
  const n = len(dur);
  const out = new Float32Array(n);
  let crackle = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    if (rnd() < 0.002) crackle = 1;
    crackle *= 0.9993;
    out[i] = noise() * (Math.exp(-t * 1.6) * 0.7 + crackle * 0.5);
  }
  const low = biquad(Float32Array.from(out), "lp", 380);
  const crack = new Float32Array(n);
  for (let i = 0; i < Math.min(n, len(0.12)); i++) crack[i] = noise() * Math.exp(-(i / SR) * 30);
  for (let i = 0; i < n; i++) out[i] = low[i] * 2.2 + crack[i] * 0.8;
  return out;
};

const bell = (f0, dur = 3) => {
  const n = len(dur);
  const out = new Float32Array(n);
  const parts = [[1, 1, 1], [2, 0.55, 1.6], [2.41, 0.4, 2.2], [3.0, 0.3, 2.8], [4.2, 0.2, 3.5], [5.43, 0.14, 4.5]];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let v = 0;
    for (const [r, a, d] of parts) v += Math.sin(2 * Math.PI * f0 * r * t) * a * Math.exp((-t * d * 3) / dur);
    out[i] = v * 0.35 * Math.min(1, i / 60);
  }
  return out;
};

/** Karplus-Strong pluck (harp/koto-like). */
const pluck = (f, dur = 0.9) => {
  const n = len(dur);
  const p = Math.round(SR / f);
  const buf = Float32Array.from({ length: p }, noise);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const k = i % p;
    const nx = buf[(k + 1) % p];
    out[i] = buf[k];
    buf[k] = (buf[k] + nx) * 0.497;
  }
  return biquad(out, "lp", 5000);
};

const heart = () => {
  const out = new Float32Array(len(0.5));
  for (const [off, a] of [[0, 1], [0.17, 0.75]]) {
    const b = boom(0.22, 70, 38);
    const o = len(off);
    for (let i = 0; i < b.length && o + i < out.length; i++) out[o + i] += b[i] * a;
  }
  return out;
};

const glitch = (dur = 0.07) => {
  const n = len(dur);
  const out = new Float32Array(n);
  let f = 200 + rnd() * 2000, ph = 0;
  for (let i = 0; i < n; i++) {
    if (i % 300 === 0) f = 150 + rnd() * 3000;
    ph += f / SR;
    const sq = (ph % 1) < 0.5 ? 1 : -1;
    out[i] = Math.round((sq * 0.6 + noise() * 0.4) * 4) / 4; // 3-bit crush
  }
  return out;
};

const wind = (dur, cutoff = 600) => {
  const n = len(dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = noise() * (0.6 + 0.4 * Math.sin(2 * Math.PI * 0.7 * t)) * Math.min(1, t / 0.3, (dur - t) / 0.3);
  }
  return biquad(biquad(out, "lp", cutoff), "hp", 120);
};

const rumble = (dur) => {
  const n = len(dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = noise() * (0.5 + 0.5 * Math.abs(Math.sin(2 * Math.PI * 11 * t))) * Math.pow(t / dur, 1.5);
  }
  return biquad(out, "lp", 220);
};

// ───────── score ─────────
const A = Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8].map((a) => [a, actRange(a)]));
const start = (id) => SHOT_STARTS[SHOTS.findIndex((x) => x.id === id)];
const secs = (frames) => frames / FPS;
const D = 50, F = 53, Fs = 54, G = 55, A_ = 57, Bb = 58, C = 60, Cs = 61; // octave-3 note numbers

// Sub drone through everything (D1/D2), swelling on the drop
add(pad([26, 38], secs(TOTAL_FRAMES), { attack: 1.5, release: 0.6, bright: 0.1 }), 0, 0.9, 0, 0.05);

// ACT 1 — "Let there be light"
add(boom(2.2, 70, 30), s(0), 0.55, 0, 0.5);
add(bell(hz(86), 2.5), s(2), 0.22, 0.2, 0.9);
add(pad([D, F, A_, D + 12], secs(A[1].durationInFrames + 6), { attack: 0.5, bright: 0.35 }), s(0), 0.8, 0, 0.6);
SHOTS.forEach((sh, i) => {
  const at = s(SHOT_STARTS[i]);
  const isFlash = sh.art === "flash" || sh.fx?.invert || sh.fx?.duo;
  if (sh.act === 1) {
    add(tick(1800 + (i % 5) * 300, 0.5), at, 0.35, (i % 2 ? 0.3 : -0.3), 0.3);
    if (isFlash) { add(boom(0.35, 160, 60), at, 0.35, 0, 0.4); add(hat(), at, 0.4, 0, 0.5); }
  }
});
add(whoosh(secs(A[1].from + A[1].durationInFrames - start("a1-walk1")), 400, 2500), s(start("a1-walk1")), 0.35, -0.2, 0.4);

// ACT 2 — cross draw-on shimmer + harp arpeggio, one note per 3f cut
add(bell(hz(81), 2.2), s(A[2].from), 0.18, 0, 0.9);
add(pad([D, F, A_, D + 12, F + 12], secs(A[2].durationInFrames), { attack: 0.15, bright: 0.55 }), s(A[2].from), 0.85, 0, 0.5);
const arp = [62, 65, 69, 74, 77, 81, 77, 74, 69, 74, 81];
SHOTS.filter((x) => x.act === 2).forEach((sh, k) => {
  const at = s(start(sh.id));
  add(pluck(hz(arp[k % arp.length])), at, 0.42, k % 2 ? 0.35 : -0.35, 0.45);
  add(hat(), at, 0.22, 0.4, 0.1);
  if (k % 4 === 0) add(kick(), at, 0.55, 0, 0.05);
});

// ACT 3 — storm hold: wind, rain, Bb pad, orchestral stabs on the strobes
add(wind(secs(A[3].durationInFrames + 8), 900), s(A[3].from), 0.5, 0, 0.3);
add(pad([Bb - 12, D, F, Bb], secs(A[3].durationInFrames), { attack: 0.3, bright: 0.4 }), s(A[3].from), 0.9, 0, 0.6);
add(whoosh(secs(A[3].durationInFrames), 120, 900), s(A[3].from), 0.5, 0, 0.3);
for (const st of SHOTS.find((x) => x.id === "a3-water").fx.strobes) {
  const at = s(A[3].from + st.at);
  add(boom(0.6, 120, 45), at, 0.6, 0, 0.3);
  add(pad([Bb, D + 12, F + 12], 0.12, { attack: 0.005, release: 0.35, bright: 0.9 }), at, 1.4, 0, 0.7);
}

// ACT 4 — symbols barrage: pitched tick on every icon, pulse tightening, riser into a 2-frame pre-drop silence
const preDrop = A[5].from - 2;
add(pad([G - 12, Bb - 12, D, G], secs(24), { attack: 0.2, bright: 0.45 }), s(A[4].from), 0.8, 0, 0.5);
add(pad([A_ - 12, Cs, 64, A_], secs(preDrop - A[4].from - 24), { attack: 0.1, release: 0.05, bright: 0.6 }), s(A[4].from + 24), 0.85, 0, 0.5);
SHOTS.filter((x) => x.act === 4).forEach((sh, k) => {
  const at = s(start(sh.id));
  if (start(sh.id) >= preDrop) return;
  add(tick(hz(74 + k), 0.9), at, 0.4, k % 2 ? 0.25 : -0.25, 0.35);
  if (k % 2 === 0 || k > 10) add(kick(), at, 0.5, 0, 0.05);
});
add(riser(secs(preDrop - A[4].from)), s(A[4].from), 0.55, 0, 0.3);

// ACT 5 — THE DROP at F148: sub boom + thunder + full choir
add(boom(3.2, 90, 28), s(A[5].from), 1.0, 0, 0.35);
add(pad([D - 12, D, F, A_, D + 12, F + 12, A_ + 12], secs(A[5].durationInFrames + 4), { attack: 0.03, bright: 0.75 }), s(A[5].from), 1.15, 0, 0.7);
for (const lf of [0, 6, 10]) add(thunder(lf === 0 ? 2.6 : 1.4), s(A[5].from + lf), lf === 0 ? 0.75 : 0.45, lf === 6 ? -0.4 : 0.3, 0.4);
add(bell(hz(38), 3.5), s(start("a5-crosses")), 0.6, 0, 0.6); // death toll on the three crosses
add(boom(1.4, 70, 30), s(start("a5-crosses")), 0.5, 0, 0.3);
add(pad([Bb - 12, D + 12, F + 12, Bb + 12], secs(14), { attack: 0.08, bright: 0.9 }), s(start("a5-arms")), 0.9, 0, 0.8);
add(bell(hz(82), 2), s(start("a5-arms")), 0.2, 0.3, 0.9);

// ACT 6 — miracles: heartbeat pulse, glitch bursts, whoosh per cut, stone grind → white impact
add(pad([D, F, A_, C], secs(start("a6-tomb-in") - A[6].from), { attack: 0.4, bright: 0.4 }), s(A[6].from), 0.7, 0, 0.6);
for (let f = A[6].from; f < A[7].from; f += 12) add(heart(), s(f), 0.55, 0, 0.1);
SHOTS.filter((x) => x.act === 6).forEach((sh, k) => {
  const at = start(sh.id);
  add(whoosh(Math.min(0.45, secs(sh.d) + 0.1), 500, 3500), s(at - 2), 0.3, k % 2 ? 0.5 : -0.5, 0.3);
  for (const g of sh.fx?.glitch ?? []) add(glitch(0.05), s(at + g), 0.18, (rnd() - 0.5) * 1.2, 0.2);
});
add(wind(secs(4), 1200), s(start("a6-storm")), 0.35, 0, 0.3);
add(riser(secs(8)), s(start("a6-warp")), 0.3, 0, 0.3);
add(whoosh(0.5, 200, 1200), s(start("a6-reach")), 0.5, 0, 0.3); // splash
for (let k = 0; k < 3; k++) add(whoosh(0.12, 600, 1800), s(start("a6-dove") + k * 2), 0.3, 0.2, 0.3); // wing flaps
add(pad([D - 12, A_ - 12, D], secs(14 + 7), { attack: 0.5, bright: 0.25 }), s(start("a6-tomb-in")), 0.9, 0, 0.5);
add(rumble(secs(7)), s(start("a6-stone")), 0.9, 0, 0.2);
add(boom(1.6, 110, 40), s(start("a6-sunburst")), 0.7, 0, 0.5);
add(bell(hz(86), 2), s(start("a6-sunburst")), 0.2, 0, 0.9);

// ACT 7 — every eye: tick per cut, heartbeat accelerating, A-dominant tension, riser into the release
add(pad([A_ - 12, Cs, 64, A_, Cs + 12], secs(A[7].durationInFrames), { attack: 0.1, release: 0.05, bright: 0.65 }), s(A[7].from), 0.9, 0, 0.5);
SHOTS.filter((x) => x.act === 7).forEach((sh, k) => {
  add(tick(3200 - k * 60, 0.9), s(start(sh.id)), 0.42, k % 2 ? 0.4 : -0.4, 0.2);
  if (sh.p?.tear) add(bell(hz(93), 0.8), s(start(sh.id)), 0.08, 0.5, 0.9);
});
for (let f = A[7].from, gap = 11; f < A[8].from - 2; f += gap, gap = Math.max(6, gap - 1)) add(heart(), s(f), 0.6, 0, 0.05);
add(riser(secs(A[7].durationInFrames)), s(A[7].from), 0.5, 0, 0.3);

// ACT 8 — release into D MAJOR: impact, doves, wings, title chime
add(boom(2.8, 85, 30), s(A[8].from), 0.85, 0, 0.6);
add(pad([D - 12, D, Fs, A_, D + 12, Fs + 12, A_ + 12], secs(A[8].durationInFrames), { attack: 0.05, release: 0.3, bright: 0.85 }), s(A[8].from), 1.15, 0, 0.75);
add(whoosh(0.4, 200, 6000), s(start("a8-eruption")), 0.4, 0, 0.4);
add(wind(secs(9), 2000), s(start("a8-clouds")), 0.3, 0, 0.4);
for (let k = 0; k < 9; k++) add(whoosh(0.1, 900, 2600), s(start("a8-doves") + k * 1.5), 0.16, (rnd() - 0.5) * 1.6, 0.3);
add(whoosh(0.6, 150, 1500), s(start("a8-wings")), 0.55, 0, 0.5);
add(bell(hz(74), 2.5), s(start("a8-title")), 0.4, -0.15, 0.9);
add(bell(hz(81), 2.5), s(start("a8-title") + 2), 0.28, 0.15, 0.9);
add(boom(1.5, 70, 32), s(start("a8-title")), 0.45, 0, 0.6);

// ───────── reverb (Freeverb) ─────────
const freeverb = (x, offset) => {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((l) => ({ b: new Float32Array(l + offset), i: 0, s: 0 }));
  const aps = [556, 441, 341, 225].map((l) => ({ b: new Float32Array(l + offset), i: 0 }));
  const out = new Float32Array(x.length);
  for (let n = 0; n < x.length; n++) {
    const inp = x[n] * 0.015;
    let y = 0;
    for (const c of combs) {
      const o = c.b[c.i];
      c.s = o * 0.75 + c.s * 0.25;
      c.b[c.i] = inp + c.s * 0.86;
      c.i = (c.i + 1) % c.b.length;
      y += o;
    }
    for (const a of aps) {
      const o = a.b[a.i];
      a.b[a.i] = y + o * 0.5;
      a.i = (a.i + 1) % a.b.length;
      y = o - y;
    }
    out[n] = y;
  }
  return out;
};
const wetL = freeverb(send, 0);
const wetR = freeverb(send, 23);

// ───────── master: mix, last-frames fade, soft clip, 16-bit WAV ─────────
const fade = len(0.25);
const outL = new Float32Array(N);
const outR = new Float32Array(N);
let peak = 0;
for (let i = 0; i < N; i++) {
  // pre-drop gap: duck the whole mix (dry + reverb) for the 2 frames before F148
  const ramp = len(0.006);
  const g0 = s(preDrop), g1 = s(A[5].from);
  const duck = i < g0 - ramp || i >= g1 ? 1 : i < g0 ? 1 - ((i - (g0 - ramp)) / ramp) * 0.97 : i > g1 - ramp ? 0.03 + ((i - (g1 - ramp)) / ramp) * 0.97 : 0.03;
  const g = (i > N - fade ? (N - i) / fade : 1) * duck;
  outL[i] = (dryL[i] + wetL[i] * 2.2) * g;
  outR[i] = (dryR[i] + wetR[i] * 2.2) * g;
  peak = Math.max(peak, Math.abs(outL[i]), Math.abs(outR[i]));
}
const norm = 0.9 / peak;
const pcm = Buffer.alloc(44 + N * 4);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + N * 4, 4); pcm.write("WAVE", 8);
pcm.write("fmt ", 12); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22);
pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 4, 28); pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34);
pcm.write("data", 36); pcm.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  pcm.writeInt16LE(Math.round(Math.tanh(outL[i] * norm * 1.1) * 32000), 44 + i * 4);
  pcm.writeInt16LE(Math.round(Math.tanh(outR[i] * norm * 1.1) * 32000), 46 + i * 4);
}
mkdirSync(new URL("../public/audio/", import.meta.url), { recursive: true });
writeFileSync(new URL("../public/audio/score.raw.wav", import.meta.url), pcm);
console.log(`score.raw.wav · ${(N / SR).toFixed(3)} s · ${TOTAL_FRAMES} frames · drop at F${A[5].from} (${(A[5].from / FPS).toFixed(2)} s)`);

// ───────── loudness: two-pass EBU R128 → −14 LUFS, −1 dBTP (needs ffmpeg on PATH) ─────────
const raw = fileURLToPath(new URL("../public/audio/score.raw.wav", import.meta.url));
const final = fileURLToPath(new URL("../public/audio/score.wav", import.meta.url));
const measure = execFileSync("sh", ["-c", `ffmpeg -hide_banner -i "${raw}" -af loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json -f null - 2>&1`], { encoding: "utf8" });
const m = JSON.parse(measure.slice(measure.lastIndexOf("{"), measure.lastIndexOf("}") + 1));
execFileSync("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-y", "-i", raw,
  "-af", `loudnorm=I=-14:TP=-1.0:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=44100`,
  "-c:a", "pcm_s16le", final,
]);
rmSync(raw);
console.log(`score.wav · loudness-normalised (input ${m.input_i} LUFS → −14 LUFS, TP ≤ −1 dBTP)`);
