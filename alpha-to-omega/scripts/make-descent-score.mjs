/**
 * Ambient spatial score for ABOVE EVERY NAME (the unbroken descent).
 *
 * Cues are placed from src/descent/camera.ts — when the camera reaches each
 * world — so re-timing the camera re-times the sound:
 *   wind + airy choir (Heaven) → night chime + crickets (Bethlehem) → ocean swells
 *   (Galilee) → heartbeat begins (Gethsemane) → heartbeat + thunder + embers
 *   (Calvary) → slowing heartbeat (tomb) → stone rumble → 0.4 s TRUE silence →
 *   choir swell + upward rush → dawn chimes.
 *
 *   npm run score:descent  →  public/audio/descent.wav  (−14 LUFS, −1 dBTP; needs ffmpeg)
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const { FPS, TOTAL, T, frameAtWorld } = await import(new URL("../src/descent/camera.ts", import.meta.url));

const SR = 44100;
const N = Math.ceil((TOTAL / FPS) * SR);
const s = (frame) => Math.round((frame / FPS) * SR);
const dryL = new Float32Array(N), dryR = new Float32Array(N), send = new Float32Array(N);

let seed = 777;
const rnd = () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const len = (sec) => Math.max(1, Math.round(sec * SR));
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

const add = (buf, at, gain = 1, pan = 0, rev = 0.3) => {
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4), gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < buf.length; i++) {
    const j = at + i;
    if (j < 0 || j >= N) continue;
    dryL[j] += buf[i] * gl; dryR[j] += buf[i] * gr; send[j] += buf[i] * gain * rev;
  }
};

const biquad = (x, type, fc, q = 0.707) => {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const f = typeof fc === "function" ? fc(i) : fc;
    const w = (2 * Math.PI * Math.min(f, SR * 0.45)) / SR, cs = Math.cos(w), al = Math.sin(w) / (2 * q);
    let b0, b1, b2;
    if (type === "lp") { b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = b0; }
    else if (type === "hp") { b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = b0; }
    else { b0 = al; b1 = 0; b2 = -al; }
    const a0 = 1 + al, a1 = -2 * cs, a2 = 1 - al;
    const y = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = y; x[i] = y;
  }
  return x;
};

/* ───────── instruments ───────── */
const pad = (notes, dur, { attack = 0.8, release = 1, bright = 0.5 } = {}) => {
  const n = len(dur + release), out = new Float32Array(n);
  for (const note of notes) {
    const f0 = hz(note), maxH = Math.min(16, Math.floor(7000 / f0));
    for (const det of [-0.006, 0, 0.0065]) {
      const ph = rnd() * 6.28;
      for (let i = 0; i < n; i++) {
        const t = i / SR, f = f0 * (1 + det) * (1 + 0.004 * Math.sin(2 * Math.PI * 5 * t + ph));
        let v = 0;
        for (let h = 1; h <= maxH; h++) v += Math.sin(2 * Math.PI * f * h * t + ph * h) * Math.pow(h, -1.25 - (1 - bright));
        out[i] += v;
      }
    }
  }
  const f1 = biquad(Float32Array.from(out), "bp", 720, 2.2), f2 = biquad(Float32Array.from(out), "bp", 1150, 2.5), body = biquad(Float32Array.from(out), "lp", 900 + bright * 3500);
  const nr = len(release);
  for (let i = 0; i < n; i++) {
    const env = Math.min(1, i / SR / attack) * (i > n - nr ? (n - i) / nr : 1);
    out[i] = ((body[i] * 0.55 + f1[i] * 0.9 + f2[i] * 0.6) * env) / (notes.length * 9);
  }
  return out;
};
const boom = (dur = 1.6, f0 = 95, f1 = 34) => {
  const n = len(dur), out = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (f1 + (f0 - f1) * Math.exp(-t * 7))) / SR;
    out[i] = Math.tanh(Math.sin(ph) * 1.6) * Math.exp(-t * (2.6 / dur));
  }
  return out;
};
const bell = (f0, dur = 3) => {
  const n = len(dur), out = new Float32Array(n);
  const parts = [[1, 1, 1], [2, 0.55, 1.6], [2.41, 0.4, 2.2], [3.0, 0.3, 2.8], [4.2, 0.2, 3.5], [5.43, 0.14, 4.5]];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let v = 0;
    for (const [r, a, d] of parts) v += Math.sin(2 * Math.PI * f0 * r * t) * a * Math.exp((-t * d * 3) / dur);
    out[i] = v * 0.35 * Math.min(1, i / 60);
  }
  return out;
};
const wind = (dur, lo = 300, hi = 2400) => {
  const n = len(dur), out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = noise() * (0.55 + 0.45 * Math.sin(2 * Math.PI * 0.35 * t + 1) * Math.sin(2 * Math.PI * 0.13 * t)) * Math.min(1, t / 0.6, (dur - t) / 0.6);
  }
  return biquad(out, "bp", (i) => lo + (hi - lo) * (0.5 + 0.5 * Math.sin((2 * Math.PI * 0.25 * i) / SR)), 0.9);
};
/** one ocean swell: rising hiss + low body, crest, wash */
const wave = (dur = 2.2) => {
  const n = len(dur), out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const p = i / n;
    out[i] = noise() * Math.pow(Math.sin(Math.PI * Math.pow(p, 0.7)), 2);
  }
  const body = biquad(Float32Array.from(out), "lp", 500);
  const hiss = biquad(Float32Array.from(out), "bp", (i) => 900 + 2600 * Math.sin(Math.PI * (i / n)), 0.8);
  for (let i = 0; i < n; i++) out[i] = body[i] * 1.6 + hiss[i] * 0.5;
  return out;
};
const heart = () => {
  const out = new Float32Array(len(0.55));
  for (const [off, a] of [[0, 1], [0.17, 0.7]]) {
    const b = boom(0.24, 68, 36), o = len(off);
    for (let i = 0; i < b.length && o + i < out.length; i++) out[o + i] += b[i] * a;
  }
  return out;
};
const crickets = (dur) => {
  const n = len(dur), out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR, train = (t * 3.1) % 1 < 0.22 ? 1 : 0, pulse = (t * 42) % 1 < 0.5 ? 1 : 0;
    out[i] = Math.sin(2 * Math.PI * 4600 * t) * train * pulse * 0.25;
  }
  return out;
};
const crackle = (dur) => {
  const n = len(dur), out = new Float32Array(n);
  for (let i = 0; i < n; i++) if (rnd() < 0.0009) for (let k = 0; k < 90 && i + k < n; k++) out[i + k] += noise() * Math.exp(-k / 18) * (0.4 + rnd());
  return biquad(out, "bp", 2400, 0.9);
};
const thunder = (dur = 3) => {
  const n = len(dur), out = new Float32Array(n);
  let c = 0;
  for (let i = 0; i < n; i++) {
    if (rnd() < 0.0015) c = 1;
    c *= 0.9994;
    out[i] = noise() * (Math.exp((-i / SR) * 1.1) * 0.6 + c * 0.4) * Math.min(1, i / len(0.25));
  }
  return biquad(out, "lp", 260);
};
const rumble = (dur) => {
  const n = len(dur), out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = noise() * (0.5 + 0.5 * Math.abs(Math.sin(2 * Math.PI * 9 * t + Math.sin(t * 7)))) * Math.pow(t / dur, 1.3);
  }
  return biquad(biquad(out, "lp", 240), "hp", 30);
};
const rush = (dur) => {
  const n = len(dur), nz = new Float32Array(n);
  for (let i = 0; i < n; i++) nz[i] = noise();
  biquad(nz, "bp", (i) => 200 * Math.pow(40, Math.pow(i / n, 1.2)), 1.2);
  const out = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const p = i / n;
    ph += (2 * Math.PI * 220 * Math.pow(6, p)) / SR;
    out[i] = (nz[i] + Math.sin(ph) * 0.12) * Math.sin(Math.PI * Math.min(1, p * 1.15)) ;
  }
  return out;
};

/* ───────── cues from the camera ───────── */
const W = (u) => frameAtWorld(u); // frame where the camera reaches world position u
const sec = (frames) => frames / FPS;
const D = 50, F = 53, Fs = 54, A = 57, Cs = 61, E = 64;

// sub drone through the descent, deepening, cut by the silence gate
add(pad([26, 38], sec(T.silenceStart), { attack: 2, release: 0.1, bright: 0.08 }), 0, 0.7, 0, 0.05);

// HEAVEN — air and an airy A-major choir
add(wind(sec(W(1) + 10), 600, 3500), 0, 0.32, -0.2, 0.4);
add(pad([A, Cs, E, A + 12], sec(W(0.9)), { attack: 0.6, release: 0.8, bright: 0.65 }), 0, 0.85, 0, 0.8);
add(bell(hz(88), 3), s(6), 0.12, 0.3, 0.9);

// BETHLEHEM — night: crickets, a single star chime, quiet D-minor pad
add(crickets(sec(W(1.6) - W(0.6))), s(W(0.6)), 0.05, 0.5, 0.2);
add(crickets(sec(W(1.6) - W(0.7))), s(W(0.7)), 0.04, -0.5, 0.2);
add(bell(hz(81), 2.6), s(W(0.85)), 0.22, 0, 0.9);
add(pad([D, F, A], sec(W(2) - W(0.6)), { attack: 0.8, bright: 0.35 }), s(W(0.6)), 0.6, 0, 0.6);

// GALILEE — three ocean swells across the sea
for (const [k, pan] of [[1.55, -0.4], [1.95, 0.3], [2.35, -0.1]]) add(wave(2.2), s(W(k)), 0.65, pan, 0.25);

// GETHSEMANE → CALVARY → TOMB — the heartbeat, 66 → 60 → 46 bpm, growing then fading into the stone
const hbStart = W(2.6);
for (let f = hbStart, k = 0; f < T.rumbleStart + 14; k++) {
  const p = (f - hbStart) / (T.rumbleStart - hbStart);
  const bpm = p < 0.55 ? 66 - p * 10 : 60 - (p - 0.55) * 31;
  add(heart(), s(f), 0.14 + Math.min(0.12, p * 0.16), 0, 0.12);
  f += Math.round((60 / bpm) * FPS);
}
add(wind(sec(W(3.6) - W(2.5)), 150, 600), s(W(2.5)), 0.22, 0, 0.3);
add(pad([D - 12, F - 12, A - 12, D], sec(T.silenceStart - W(3.4)), { attack: 1.2, release: 0.1, bright: 0.25 }), s(W(3.4)), 0.7, 0, 0.5);
add(thunder(3.2), s(W(3.65)), 0.55, -0.3, 0.4);
add(thunder(2.6), s(W(4.1)), 0.4, 0.4, 0.4);
add(crackle(sec(W(4.5) - W(3.5))), s(W(3.5)), 0.35, 0.2, 0.2);

// TOMB — stone grinds, then the gate
add(rumble(sec(T.silenceStart - T.rumbleStart)), s(T.rumbleStart), 1.0, 0, 0.15);

// THE BREAK — choir swell in D major + sub + shimmer, upward rush, dawn chimes
add(boom(2.8, 80, 28), s(T.crack), 0.9, 0, 0.6);
add(pad([D - 12, D, Fs, A, D + 12, Fs + 12, A + 12], sec(TOTAL - T.crack), { attack: 0.35, release: 0.2, bright: 0.85 }), s(T.crack), 1.25, 0, 0.8);
add(bell(hz(86), 2.5), s(T.crack), 0.25, 0, 0.9);
add(rush(sec(T.ascentEnd - T.ascentStart + 6)), s(T.ascentStart), 0.55, 0, 0.35);
add(bell(hz(74), 3), s(T.ascentEnd), 0.32, -0.2, 0.9);
add(bell(hz(81), 3), s(T.titleIn), 0.3, 0.2, 0.9);
add(bell(hz(86), 3), s(T.titleIn + 6), 0.18, 0, 0.9);

/* ───────── reverb + master ───────── */
const freeverb = (x, off) => {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((l) => ({ b: new Float32Array(l + off), i: 0, s: 0 }));
  const aps = [556, 441, 341, 225].map((l) => ({ b: new Float32Array(l + off), i: 0 }));
  const out = new Float32Array(x.length);
  for (let n = 0; n < x.length; n++) {
    const inp = x[n] * 0.015;
    let y = 0;
    for (const c of combs) { const o = c.b[c.i]; c.s = o * 0.7 + c.s * 0.3; c.b[c.i] = inp + c.s * 0.88; c.i = (c.i + 1) % c.b.length; y += o; }
    for (const a of aps) { const o = a.b[a.i]; a.b[a.i] = y + o * 0.5; a.i = (a.i + 1) % a.b.length; y = o - y; }
    out[n] = y;
  }
  return out;
};
const wetL = freeverb(send, 0), wetR = freeverb(send, 23);

// hard gate: 0.4 s of true digital silence (dry AND reverb) before the break
const g0 = s(T.silenceStart), g1 = s(T.crack), ramp = len(0.01), fade = len(0.35);
const L = new Float32Array(N), R = new Float32Array(N);
let peak = 0;
for (let i = 0; i < N; i++) {
  let g = i > N - fade ? (N - i) / fade : 1;
  if (i >= g0 - ramp && i < g0) g *= 1 - (i - (g0 - ramp)) / ramp;
  else if (i >= g0 && i < g1) g = 0;
  L[i] = (dryL[i] + wetL[i] * 2.4) * g;
  R[i] = (dryR[i] + wetR[i] * 2.4) * g;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.9 / peak;
const pcm = Buffer.alloc(44 + N * 4);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + N * 4, 4); pcm.write("WAVE", 8); pcm.write("fmt ", 12);
pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22); pcm.writeUInt32LE(SR, 24);
pcm.writeUInt32LE(SR * 4, 28); pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  pcm.writeInt16LE(Math.round(Math.tanh(L[i] * norm * 1.1) * 32000), 44 + i * 4);
  pcm.writeInt16LE(Math.round(Math.tanh(R[i] * norm * 1.1) * 32000), 46 + i * 4);
}
mkdirSync(new URL("../public/audio/", import.meta.url), { recursive: true });
const raw = fileURLToPath(new URL("../public/audio/descent.raw.wav", import.meta.url));
const final = fileURLToPath(new URL("../public/audio/descent.wav", import.meta.url));
writeFileSync(raw, pcm);

// two-pass EBU R128 → −14 LUFS / −1 dBTP (linear gain, so the silence stays silent)
const measure = execFileSync("sh", ["-c", `ffmpeg -hide_banner -i "${raw}" -af loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json -f null - 2>&1`], { encoding: "utf8" });
const m = JSON.parse(measure.slice(measure.lastIndexOf("{"), measure.lastIndexOf("}") + 1));
execFileSync("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-y", "-i", raw,
  "-af", `loudnorm=I=-14:TP=-1.0:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=44100`,
  "-c:a", "pcm_s16le", final,
]);
rmSync(raw);
console.log(`descent.wav · ${(N / SR).toFixed(2)} s · worlds at F${[0, 1, 2, 3, 4, 5].map((k) => W(k)).join("/F")} · silence F${T.silenceStart}–F${T.crack} · ${m.input_i} → −14 LUFS`);
