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

/** Robed figure, feet at y=+300, head at y≈-315 (600 units tall at s=1). */
export const Figure: React.FC<{
  pose?: "stand" | "walk" | "raised" | "arms";
  fill?: string;
  x?: number;
  y?: number;
  s?: number;
  glow?: boolean;
}> = ({ pose = "stand", fill = "#fff", x = 0, y = 0, s = 1, glow = true }) => {
  const robe =
    pose === "walk"
      ? "M -34 -235 C -66 -200 -88 -120 -96 0 L -150 300 L -20 300 L 0 230 L 30 300 L 120 300 L 96 0 C 92 -120 66 -200 34 -235 Z"
      : "M -38 -235 C -70 -200 -95 -120 -100 0 L -132 300 L 132 300 L 100 0 C 95 -120 70 -200 38 -235 Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} filter={glow ? "url(#glow-s)" : undefined} fill={fill}>
      <circle cx={pose === "walk" ? 6 : 0} cy={-278} r={40} />
      <path d={robe} />
      {pose === "arms" ? (
        <>
          <path d="M -40 -222 L -340 -236 L -340 -200 L -70 -170 Z" />
          <path d="M 40 -222 L 340 -236 L 340 -200 L 70 -170 Z" />
        </>
      ) : null}
      {pose === "raised" ? (
        <>
          <path d="M -36 -226 L -210 -470 L -178 -486 L -18 -250 Z" />
          <path d="M 36 -226 L 210 -470 L 178 -486 L 18 -250 Z" />
        </>
      ) : null}
      {pose === "walk" ? <rect x={118} y={-340} width={12} height={640} rx={6} transform="rotate(4 124 0)" /> : null}
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

/** Soft cloud mass made of blurred circles. */
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
  <g filter="url(#blur-l)" fill={fill} opacity={opacity}>
    {Array.from({ length: n * 2 }, (_, i) => (
      <circle
        key={i}
        cx={x + (random(`${seed}x${i}`) - 0.5) * w}
        cy={y + (random(`${seed}y${i}`) - 0.5) * h}
        r={110 + random(`${seed}r${i}`) * 170}
      />
    ))}
  </g>
);

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
