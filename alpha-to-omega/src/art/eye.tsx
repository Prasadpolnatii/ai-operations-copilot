import React from "react";
import { random } from "remotion";
import { ArtProps, Bg } from "./common";

/**
 * Act 7 — macro iris, pupil locked at frame center so all 18 cuts share one anchor.
 * Layers: skin → wet sclera + veins → iris base → noise-warped stromal fibres → crypts →
 * collarette → micro-texture → limbal ring → pupil ruff → corneal shading → lid shadow →
 * wet highlights (window reflection, cross catchlight, tear line) → lashes.
 */
const LID = "M -760 0 Q 0 -520 760 0 Q 0 520 -760 0 Z";
const lidPoint = (u: number, upper: boolean): [number, number] => {
  const y1 = upper ? -520 : 520;
  const x = (1 - u) * (1 - u) * -760 + u * u * 760;
  const y = 2 * (1 - u) * u * y1;
  return [x, y];
};

export const Eye: React.FC<ArtProps> = ({ vw, vh, t, p }) => {
  const seed = Number(p.seed ?? 0);
  const a = String(p.a);
  const b = String(p.b);
  const R = 345;
  const pupil = 118 * Number(p.pupil ?? 1) * (1 - t * 0.06);
  const id = `iris${seed}`;
  const r = (k: string) => random(`${id}${k}`);
  const k = vh > vw ? 1.16 : 0.98;

  const fibers = Array.from({ length: 300 }, (_, i) => {
    const ang = (i / 300) * Math.PI * 2 + r(`j${i}`) * 0.03;
    const r0 = pupil + 2 + r(`s${i}`) * 26;
    const r1 = R * (0.55 + r(`l${i}`) * 0.47);
    const pick = r(`c${i}`);
    const c = pick > 0.85 ? "#f3e2c0" : pick > 0.45 ? a : b;
    return (
      <line
        key={i}
        x1={Math.cos(ang) * r0}
        y1={Math.sin(ang) * r0}
        x2={Math.cos(ang) * r1}
        y2={Math.sin(ang) * r1}
        stroke={c}
        strokeWidth={1.6 + r(`w${i}`) * 4.2}
        strokeOpacity={0.45 + r(`o${i}`) * 0.45}
        strokeLinecap="round"
      />
    );
  });
  const collR = pupil + (R - pupil) * 0.36;
  let coll = "";
  for (let i = 0; i <= 72; i++) {
    const ang = (i / 72) * Math.PI * 2;
    const rr = collR + (r(`co${i % 72}`) - 0.5) * 26;
    coll += `${i ? "L" : "M"} ${(Math.cos(ang) * rr).toFixed(1)} ${(Math.sin(ang) * rr).toFixed(1)} `;
  }
  let ruff = "";
  for (let i = 0; i <= 90; i++) {
    const ang = (i / 90) * Math.PI * 2;
    const rr = pupil + 4 + r(`ru${i % 90}`) * 7;
    ruff += `${i ? "L" : "M"} ${(Math.cos(ang) * rr).toFixed(1)} ${(Math.sin(ang) * rr).toFixed(1)} `;
  }

  return (
    <>
      <Bg vw={vw} vh={vh} fill="#3b2219" />
      <defs>
        <filter id={`${id}-skin`} x="0" y="0" width="1" height="1">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={4} seed={seed + 3} result="n" />
          <feDiffuseLighting in="n" surfaceScale="4" lightingColor="#d89b7e" result="l">
            <feDistantLight azimuth={240} elevation={50} />
          </feDiffuseLighting>
          <feBlend in="l" in2="SourceGraphic" mode="multiply" />
        </filter>
        <filter id={`${id}-warp`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves={2} seed={seed + 9} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={`${id}-tex`} x="0" y="0" width="1" height="1">
          <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves={3} seed={seed + 21} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.03  0 0 0 0 0.02  -1.4 0 0 0 0.85" />
        </filter>
        <radialGradient id={`${id}-base`}>
          <stop offset="0.25" stopColor={a} />
          <stop offset="0.7" stopColor={b} />
          <stop offset="1" stopColor={b} />
        </radialGradient>
        <radialGradient id={`${id}-limbal`}>
          <stop offset="0.78" stopColor="#0a0503" stopOpacity={0} />
          <stop offset="0.93" stopColor="#0a0503" stopOpacity={0.55} />
          <stop offset="1" stopColor="#060302" stopOpacity={0.95} />
        </radialGradient>
        <radialGradient id={`${id}-sclera`} cx="0.5" cy="0.45">
          <stop offset="0.35" stopColor="#f5efe6" />
          <stop offset="0.8" stopColor="#d8b7a6" />
          <stop offset="1" stopColor="#9b6a5c" />
        </radialGradient>
        <linearGradient id={`${id}-lidsh`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120806" stopOpacity={0.85} />
          <stop offset="0.38" stopColor="#120806" stopOpacity={0} />
        </linearGradient>
        <radialGradient id={`${id}-cornea`} cx="0.42" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.12} />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity={0} />
          <stop offset="1" stopColor="#000000" stopOpacity={0.35} />
        </radialGradient>
        <clipPath id={`${id}-lid`}>
          <path d={LID} />
        </clipPath>
      </defs>
      <rect x={-vw / 2 - 60} y={-vh / 2 - 60} width={vw + 120} height={vh + 120} fill="#8a5641" filter={`url(#${id}-skin)`} />
      <g transform={`scale(${k})`}>
        <ellipse rx={800} ry={420} fill="#1a0c08" opacity={0.55} filter="url(#blur-l)" />
        <g clipPath={`url(#${id}-lid)`}>
          <rect x={-800} y={-520} width={1600} height={1040} fill={`url(#${id}-sclera)`} />
          {Array.from({ length: 18 }, (_, i) => {
            const side = i % 2 ? 1 : -1;
            const y0 = (r(`v${i}`) - 0.5) * 360;
            return (
              <path
                key={i}
                d={`M ${side * 760} ${y0} Q ${side * (560 - r(`q${i}`) * 80)} ${y0 + (r(`qy${i}`) - 0.5) * 140} ${side * (370 + r(`e${i}`) * 60)} ${(r(`ey${i}`) - 0.5) * 260}`}
                stroke="#b02a32"
                strokeOpacity={0.25 + r(`vo${i}`) * 0.3}
                strokeWidth={1.2 + r(`vw${i}`) * 2.4}
                fill="none"
              />
            );
          })}
          <circle r={R + 6} fill="#1a0d08" opacity={0.6} filter="url(#blur-s)" />
          <circle r={R} fill={`url(#${id}-base)`} />
          <g filter={`url(#${id}-warp)`}>{fibers}</g>
          {Array.from({ length: 16 }, (_, i) => {
            const ang = (i / 16) * 360 + r(`ca${i}`) * 18;
            const rr = collR + 20 + r(`cr${i}`) * (R * 0.8 - collR);
            return (
              <ellipse
                key={i}
                cx={rr}
                cy={0}
                rx={14 + r(`cx${i}`) * 22}
                ry={6 + r(`cy${i}`) * 9}
                fill="#120804"
                opacity={0.35}
                transform={`rotate(${ang})`}
                filter="url(#blur-s)"
              />
            );
          })}
          <path d={coll} fill="none" stroke="#f0dcb4" strokeOpacity={0.45} strokeWidth={9} filter="url(#blur-s)" />
          <circle r={R} fill="#000" filter={`url(#${id}-tex)`} opacity={0.6} />
          <circle r={R} fill={`url(#${id}-limbal)`} />
          <path d={ruff} fill="#2a140a" />
          <circle r={pupil} fill="#030303" />
          <circle r={R + 4} fill={`url(#${id}-cornea)`} />
          <rect x={-800} y={-520} width={1600} height={1040} fill={`url(#${id}-lidsh)`} />
          {/* wet highlights: soft window reflection, cross catchlight, tear-line glint */}
          <rect x={-215} y={-205} width={150} height={95} rx={26} fill="#fff" opacity={0.22} transform="rotate(-8)" filter="url(#blur-s)" />
          <g transform="translate(-118 -140)" fill="#fff" opacity={0.95} filter="url(#glow-s)">
            <rect x={-7} y={-44} width={14} height={88} rx={3} />
            <rect x={-30} y={-22} width={60} height={14} rx={3} />
          </g>
          <circle cx={150} cy={130} r={9} fill="#fff" opacity={0.7} />
          <path d="M -560 175 Q 0 395 560 175" stroke="#fff" strokeOpacity={0.35} strokeWidth={5} fill="none" filter="url(#blur-s)" />
        </g>
        {/* lid margins + lashes */}
        <path d="M -760 0 Q 0 -520 760 0" stroke="#1a0b07" strokeWidth={26} fill="none" />
        <path d="M -760 0 Q 0 520 760 0" stroke="#6b3a2c" strokeWidth={10} fill="none" opacity={0.8} />
        <g stroke="#0b0504" fill="none" strokeLinecap="round">
          {Array.from({ length: 110 }, (_, i) => {
            const u = 0.05 + r(`lu${i}`) * 0.9;
            const [x0, y0] = lidPoint(u, true);
            const out = (u - 0.5) * 2; // −1 … 1 across the lid
            const L = 55 + Math.sin(u * Math.PI) * 85 + r(`la${i}`) * 40;
            const lean = out * 0.9 + (r(`ln${i}`) - 0.5) * 0.5;
            const x1 = x0 + lean * L * 0.75;
            const y1 = y0 - L * (0.75 + r(`lc${i}`) * 0.2);
            return (
              <path
                key={i}
                d={`M ${x0.toFixed(1)} ${y0.toFixed(1)} Q ${(x0 + lean * L * 0.05).toFixed(1)} ${(y0 - L * 0.8).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`}
                strokeWidth={1.4 + r(`lw${i}`) * 2.6}
                opacity={0.75 + r(`lo${i}`) * 0.25}
              />
            );
          })}
          {Array.from({ length: 30 }, (_, i) => {
            const u = 0.15 + (i / 29) * 0.7;
            const [x0, y0] = lidPoint(u, false);
            const out = (u - 0.5) * 2;
            const L = 30 + r(`lb${i}`) * 25;
            return <path key={`b${i}`} d={`M ${x0} ${y0 + 6} Q ${x0 + out * 6} ${y0 + L * 0.7} ${x0 + out * L * 0.5} ${y0 + L}`} strokeWidth={2} opacity={0.7} />;
          })}
        </g>
        {p.tear ? (
          <g filter="url(#glow-s)">
            <path d="M 236 300 Q 256 345 249 370 Q 236 394 220 371 Q 216 345 236 300 Z" fill="#dff4ff" opacity={0.6} />
            <ellipse cx={231} cy={352} rx={4} ry={8} fill="#fff" />
          </g>
        ) : null}
      </g>
    </>
  );
};
