import React from "react";
import { random } from "remotion";

/**
 * Art coordinate system: origin = frame center, the SHORT side of the frame is
 * 1000 units. `vw`/`vh` are the visible extents (1000×1778 in 9:16,
 * 1778×1000 in 16:9) so backgrounds can always cover the frame.
 */
export type ArtProps = {
  t: number; // 0 → 1 across the shot
  f: number; // local frame
  d: number; // shot duration
  vw: number;
  vh: number;
  p: Record<string, string | number | boolean>;
};

export const C = {
  gold: "#f6c56b",
  goldDeep: "#c98a2b",
  crimson: "#b3122e",
  ivory: "#f4ecd8",
  ink: "#05080b",
  teal: "#0c1b21",
  navy: "#08122b",
};

const blur = (id: string, sd: number, glow = false) => (
  <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation={sd} result="b" />
    {glow ? (
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    ) : null}
  </filter>
);

const radial = (id: string, color: string, mid = 0.35) => (
  <radialGradient id={id}>
    <stop offset="0" stopColor={color} stopOpacity={1} />
    <stop offset={mid} stopColor={color} stopOpacity={0.55} />
    <stop offset="1" stopColor={color} stopOpacity={0} />
  </radialGradient>
);

export const SharedDefs: React.FC = () => (
  <defs>
    {blur("glow-s", 6, true)}
    {blur("glow-l", 22, true)}
    {blur("blur-s", 5)}
    {blur("blur-m", 16)}
    {blur("blur-l", 45)}
    {radial("rg-white", "#ffffff")}
    {radial("rg-gold", C.gold)}
    {radial("rg-crimson", "#e0283e")}
    {radial("rg-teal", "#5fe0d2")}
    <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="2.6" fill="#e8efe8" />
    </pattern>
    {/* painterly edge: organic wobble on silhouettes */}
    <filter id="paint" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={11} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    {/* feathered edges for cloud / mist layers */}
    <radialGradient id="soft-edge-g">
      <stop offset="0.55" stopColor="#fff" />
      <stop offset="1" stopColor="#000" />
    </radialGradient>
    <mask id="soft-edge" maskContentUnits="objectBoundingBox">
      <rect width="1" height="1" fill="url(#soft-edge-g)" />
    </mask>
    <linearGradient id="soft-edge-vg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#000" />
      <stop offset="0.4" stopColor="#fff" />
      <stop offset="0.7" stopColor="#fff" />
      <stop offset="1" stopColor="#000" />
    </linearGradient>
    <mask id="soft-edge-v" maskContentUnits="objectBoundingBox">
      <rect width="1" height="1" fill="url(#soft-edge-vg)" />
    </mask>
    <linearGradient id="feather-g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fffaf0" stopOpacity={0.25} />
      <stop offset="0.7" stopColor="#fffaf0" stopOpacity={0.75} />
      <stop offset="1" stopColor="#ffffff" stopOpacity={1} />
    </linearGradient>
    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M50 0H0V50" fill="none" stroke="#ffffff" strokeOpacity={0.18} strokeWidth={2} />
    </pattern>
  </defs>
);

export const Bg: React.FC<{ vw: number; vh: number; fill: string; opacity?: number }> = ({
  vw,
  vh,
  fill,
  opacity,
}) => <rect x={-vw / 2 - 60} y={-vh / 2 - 60} width={vw + 120} height={vh + 120} fill={fill} opacity={opacity} />;

/** vertical gradient background */
export const SkyBg: React.FC<{ vw: number; vh: number; id: string; stops: [number, string][] }> = ({
  vw,
  vh,
  id,
  stops,
}) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        {stops.map(([o, c]) => (
          <stop key={o} offset={o} stopColor={c} />
        ))}
      </linearGradient>
    </defs>
    <Bg vw={vw} vh={vh} fill={`url(#${id})`} />
  </>
);

export const Orb: React.FC<{ r: number; x?: number; y?: number; color?: "white" | "gold" | "crimson" | "teal"; opacity?: number }> = ({
  r,
  x = 0,
  y = 0,
  color = "white",
  opacity = 1,
}) => <circle cx={x} cy={y} r={r} fill={`url(#rg-${color})`} opacity={opacity} />;

/* ───────── Robed figure (painterly, rim-lit) ─────────
 * Feet at y=+300, crown at y≈-326 at s=1. Variants:
 *  - "backlit": dark body, bright rim stroke, halo, faint rim-lit cloth folds
 *  - "glow":    luminous body (Act 1 / reference-style glowing figure)
 *  - "solid":   flat fill, no effects (small background figures)
 */
const ROBE =
  "M -14 -244 L -18 -232 C -52 -228 -82 -214 -90 -192 C -100 -150 -101 -80 -103 0 C -108 100 -128 220 -152 300 Q -70 314 0 306 Q 70 314 152 300 C 128 220 108 100 103 0 C 101 -80 100 -150 90 -192 C 82 -214 52 -228 18 -232 L 14 -244 Z";
const ROBE_WALK =
  "M -20 -232 C -52 -228 -82 -214 -90 -192 C -100 -150 -101 -80 -104 0 C -112 100 -150 220 -178 300 Q -96 312 -14 300 L 8 258 L 38 302 Q 100 310 140 300 C 120 220 106 100 102 0 C 101 -80 100 -150 90 -192 C 82 -214 52 -228 20 -232 Z";
const HAIR = "M -30 -292 Q -33 -334 0 -334 Q 33 -334 30 -292 Q 30 -262 22 -246 L 14 -244 L -14 -244 L -22 -246 Q -30 -262 -30 -292 Z";
const SLEEVE_OUT =
  "M -82 -208 C -170 -216 -270 -222 -352 -226 L -356 -198 C -322 -178 -282 -146 -232 -112 C -182 -88 -120 -96 -92 -132 Z";
const SLEEVE_UP =
  "M -72 -210 C -116 -280 -164 -380 -200 -470 L -176 -484 C -146 -420 -108 -340 -40 -240 Z M -72 -210 C -116 -262 -146 -330 -168 -396 L -142 -300 Q -106 -220 -80 -170 Z";
const FOLDS = [
  "M -40 -150 C -55 -40 -70 120 -98 296",
  "M 8 -120 C 4 0 0 150 -4 300",
  "M 52 -170 C 70 -40 82 120 104 296",
  "M -88 -190 C -40 -120 40 -60 98 -20",
];

export const Figure: React.FC<{
  pose?: "stand" | "walk" | "raised" | "arms";
  fill?: string;
  x?: number;
  y?: number;
  s?: number;
  glow?: boolean;
  variant?: "backlit" | "glow" | "solid";
  rim?: string;
}> = ({ pose = "stand", fill, x = 0, y = 0, s = 1, glow = true, variant, rim = "#fff4dc" }) => {
  const v = variant ?? (glow ? "glow" : "solid");
  const shape = (p: React.SVGProps<SVGPathElement>) => (
    <>
      <path d={HAIR} {...p} />
      <ellipse cx={pose === "walk" ? 4 : 0} cy={-276} rx={27} ry={37} {...(p as React.SVGProps<SVGEllipseElement>)} />
      <path d={pose === "walk" ? ROBE_WALK : ROBE} {...p} />
      {pose === "arms" ? (
        <>
          <path d={SLEEVE_OUT} {...p} />
          <path d={SLEEVE_OUT} transform="scale(-1 1)" {...p} />
          <ellipse cx={-370} cy={-212} rx={20} ry={13} {...(p as React.SVGProps<SVGEllipseElement>)} />
          <ellipse cx={370} cy={-212} rx={20} ry={13} {...(p as React.SVGProps<SVGEllipseElement>)} />
        </>
      ) : null}
      {pose === "raised" ? (
        <>
          <path d={SLEEVE_UP} {...p} />
          <path d={SLEEVE_UP} transform="scale(-1 1)" {...p} />
        </>
      ) : null}
      {pose === "walk" ? <path d="M 122 -350 L 134 -350 L 160 300 L 148 300 Z" {...p} /> : null}
    </>
  );
  const tf = `translate(${x} ${y}) scale(${s})`;
  if (v === "solid") return <g transform={tf}>{shape({ fill: fill ?? "#000" })}</g>;
  if (v === "glow")
    return (
      <g transform={tf}>
        <g filter="url(#blur-l)" opacity={0.55}>{shape({ fill: rim })}</g>
        <g filter="url(#paint)">{shape({ fill: fill ?? "#fdfbf4" })}</g>
        <g stroke="#c9d6dc" strokeOpacity={0.35} strokeWidth={5} fill="none" filter="url(#blur-s)">
          {FOLDS.map((d) => <path key={d} d={d} />)}
        </g>
      </g>
    );
  // backlit
  return (
    <g transform={tf}>
      <g filter="url(#blur-l)" opacity={0.7}>{shape({ fill: rim })}</g>
      <g filter="url(#blur-s)">{shape({ fill: "none", stroke: rim, strokeWidth: 10 })}</g>
      <g filter="url(#paint)">{shape({ fill: fill ?? "#07090b" })}</g>
      <g stroke={rim} strokeOpacity={0.16} strokeWidth={4} fill="none" filter="url(#blur-s)">
        {FOLDS.map((d) => <path key={d} d={d} />)}
      </g>
    </g>
  );
};

export const Dove: React.FC<{ x?: number; y?: number; s?: number; fill?: string; flap?: number; rot?: number }> = ({
  x = 0,
  y = 0,
  s = 1,
  fill = "#fff",
  flap = 0,
  rot = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} fill={fill}>
    <ellipse cx={0} cy={0} rx={95} ry={40} transform="rotate(-10)" />
    <circle cx={88} cy={-30} r={28} />
    <path d="M 112 -36 L 140 -28 L 112 -20 Z" />
    <path d="M -85 5 L -185 -25 L -175 45 Z" />
    <path d={`M -15 -25 Q -90 ${-190 + flap * 160} -230 ${-230 + flap * 260} Q -120 ${-110 + flap * 80} -40 10 Z`} />
    <path d={`M 15 -28 Q 60 ${-220 + flap * 180} 170 ${-265 + flap * 280} Q 95 ${-120 + flap * 80} 40 5 Z`} opacity={0.85} />
  </g>
);

/** Open hand, palm center at origin, fingers up (~560 units tall). */
export const Hand: React.FC<{ x?: number; y?: number; s?: number; rot?: number; fill?: string }> = ({
  x = 0,
  y = 0,
  s = 1,
  rot = 0,
  fill = "#fff",
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} fill={fill}>
    <rect x={-115} y={-60} width={230} height={250} rx={80} />
    <rect x={-112} y={-280} width={50} height={270} rx={25} />
    <rect x={-54} y={-325} width={52} height={310} rx={26} />
    <rect x={6} y={-305} width={52} height={290} rx={26} />
    <rect x={64} y={-240} width={46} height={230} rx={23} />
    <rect x={-60} y={-40} width={52} height={210} rx={26} transform="rotate(-52 -60 120)" />
    <rect x={-70} y={170} width={150} height={400} rx={40} />
  </g>
);

export const Cross: React.FC<{ x?: number; y?: number; h: number; fill?: string; stroke?: string; sw?: number }> = ({
  x = 0,
  y = 0,
  h,
  fill = "#000",
  stroke,
  sw,
}) => {
  const w = h * 0.07;
  const arm = h * 0.56;
  return (
    <g transform={`translate(${x} ${y})`} fill={fill} stroke={stroke} strokeWidth={sw}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} />
      <rect x={-arm / 2} y={-h / 2 + h * 0.24} width={arm} height={w} />
    </g>
  );
};

/** Filled wave band from y down to bottom of frame. */
export const wavePath = (vw: number, vh: number, y: number, amp: number, len: number, phase: number) => {
  let d = `M ${-vw / 2 - 80} ${vh / 2 + 80} L ${-vw / 2 - 80} ${y}`;
  for (let x = -vw / 2 - 80; x <= vw / 2 + 80; x += 16) {
    const yy = y + Math.sin((x / len) * Math.PI * 2 + phase) * amp + Math.sin((x / (len * 0.37)) * Math.PI * 2 - phase * 1.7) * amp * 0.3;
    d += ` L ${x} ${yy.toFixed(1)}`;
  }
  return d + ` L ${vw / 2 + 80} ${vh / 2 + 80} Z`;
};

/** Volumetric-looking cloud layer: fractal noise → density mask + diffuse lighting, feathered edges. */
export const CloudLayer: React.FC<{
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  hi?: string;
  freq?: number | string;
  seed?: number;
  density?: number; // 0..1
  opacity?: number;
  azimuth?: number;
  elevation?: number;
  /** how much the lit side brightens the cloud body (0..1) */
  light?: number;
}> = ({ id, x, y, w, h, fill, hi = "#ffffff", freq = 0.0045, seed = 3, density = 0.5, opacity = 1, azimuth = 235, elevation = 28, light = 0.6 }) => (
  <g opacity={opacity}>
    <defs>
      <filter id={`cl-${id}`} x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={5} seed={seed} result="n" />
        <feColorMatrix in="n" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 ${(-1.9 + density * 1.4).toFixed(2)}`} result="mask" />
        <feGaussianBlur in="mask" stdDeviation="2" result="maskS" />
        <feDiffuseLighting in="n" surfaceScale="9" diffuseConstant="1.15" lightingColor={hi} result="light">
          <feDistantLight azimuth={azimuth} elevation={elevation} />
        </feDiffuseLighting>
        <feComponentTransfer in="light" result="light">
          <feFuncR type="gamma" amplitude={light} exponent="1.8" offset="0" />
          <feFuncG type="gamma" amplitude={light} exponent="1.8" offset="0" />
          <feFuncB type="gamma" amplitude={light} exponent="1.8" offset="0" />
        </feComponentTransfer>
        <feFlood floodColor={fill} result="col" />
        <feBlend in="light" in2="col" mode="screen" result="lit" />
        <feBlend in="col" in2="lit" mode="multiply" result="shaded" />
        <feComposite in="lit" in2="maskS" operator="in" />
      </filter>
    </defs>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} filter={`url(#cl-${id})`} mask="url(#soft-edge)" />
  </g>
);

/** Back-compat wrapper used across scenes. */
export const CloudMass: React.FC<{ seed: string; x: number; y: number; w: number; h: number; fill: string; n?: number; opacity?: number }> = ({
  seed,
  x,
  y,
  w,
  h,
  fill,
  n = 14,
  opacity = 1,
}) => (
  <CloudLayer
    id={seed}
    x={x}
    y={y}
    w={w * 1.25}
    h={h * 1.35}
    fill={fill}
    hi="#9aa6b2"
    seed={Math.floor(random(seed) * 1000)}
    density={Math.min(0.85, 0.35 + n / 50)}
    opacity={opacity}
  />
);

/** Low ground/water mist band that drifts with the frame. */
export const Mist: React.FC<{ id: string; y: number; vw: number; h?: number; f: number; color?: string; opacity?: number }> = ({
  id,
  y,
  vw,
  h = 260,
  f,
  color = "#cfe3ea",
  opacity = 0.7,
}) => (
  <g opacity={opacity} transform={`translate(${-f * 4} 0)`}>
    <defs>
      <filter id={`mist-${id}`} x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.012" numOctaves={4} seed={7} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.4 0 0 0 -0.95" result="m" />
        <feFlood floodColor={color} />
        <feComposite in2="m" operator="in" />
      </filter>
    </defs>
    <rect x={-vw / 2 - 120} y={y - h / 2} width={vw + 300} height={h} filter={`url(#mist-${id})`} mask="url(#soft-edge-v)" />
  </g>
);

/** One feathered, backlit wing (right side; mirror with side=-1). Shoulder at origin. */
export const Wing: React.FC<{ side?: 1 | -1; spread?: number; color?: string }> = ({ side = 1, spread = 1, color = "#fffaf0" }) => {
  const edge = (u: number): [number, number] => {
    const p0 = [0, 0], p1 = [170, -360 * spread], p2 = [600, -400 * spread];
    const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
    return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
  };
  const feather = (L: number) => {
    const w = L * 0.12;
    return `M 0 0 C ${L * 0.25} ${-w} ${L * 0.75} ${-w * 0.85} ${L} 0 C ${L * 0.75} ${w * 0.55} ${L * 0.25} ${w * 0.9} 0 0 Z`;
  };
  const row = (n: number, lenA: number, lenB: number, angA: number, angB: number, op: number, from = 0, to = 1) =>
    Array.from({ length: n }, (_, i) => {
      const u = from + ((to - from) * i) / (n - 1);
      const [ex, ey] = edge(u);
      const L = lenA + (lenB - lenA) * Math.pow(u, 1.4);
      const ang = angA + (angB - angA) * u;
      return (
        <g key={`${lenA}-${i}`} transform={`translate(${ex.toFixed(1)} ${ey.toFixed(1)}) rotate(${ang.toFixed(1)})`}>
          <path d={feather(L)} fill="url(#feather-g)" opacity={op} />
          <line x1={0} y1={0} x2={L * 0.92} y2={0} stroke={color} strokeOpacity={0.5} strokeWidth={2} />
        </g>
      );
    });
  return (
    <g transform={`scale(${side} 1)`}>
      {row(26, 300, 560, 96, -8, 0.55)}
      {row(22, 170, 300, 92, 10, 0.7, 0, 0.85)}
      {row(16, 80, 140, 80, 30, 0.85, 0, 0.7)}
      <path d={`M 0 0 Q 170 ${-360 * spread} 600 ${-400 * spread}`} stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.9} />
    </g>
  );
};

/** Thorn ring (crown of thorns) centered at origin. */
export const ThornRing: React.FC<{ r: number; color?: string; spikes?: number; seed?: string }> = ({
  r,
  color = "#3a2a1c",
  spikes = 46,
  seed = "thorn",
}) => (
  <g stroke={color} strokeLinecap="round" fill="none">
    {[0, 1, 2].map((k) => (
      <ellipse key={k} rx={r + k * 10} ry={r * 0.42 + k * 6} strokeWidth={14} transform={`rotate(${k * 4 - 4})`} />
    ))}
    {Array.from({ length: spikes }, (_, i) => {
      const a = (i / spikes) * Math.PI * 2;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r * 0.42;
      const len = 40 + random(`${seed}${i}`) * 60;
      const da = a + (random(`${seed}a${i}`) - 0.5) * 1.6;
      return <line key={i} x1={px} y1={py} x2={px + Math.cos(da) * len} y2={py + Math.sin(da) * len} strokeWidth={6} />;
    })}
  </g>
);
