import React from "react";
import { random } from "remotion";
import { ArtProps, Bg } from "./common";

/** Act 7 — procedural iris, pupil locked at frame center so all 18 cuts share one anchor. */
export const Eye: React.FC<ArtProps> = ({ vw, vh, t, p }) => {
  const seed = Number(p.seed ?? 0);
  const a = String(p.a);
  const b = String(p.b);
  const pupil = 118 * Number(p.pupil ?? 1) * (1 - t * 0.06);
  const id = `iris${seed}`;
  const fibers = Array.from({ length: 160 }, (_, i) => {
    const ang = (i / 160) * Math.PI * 2 + random(`${id}j${i}`) * 0.04;
    const r0 = pupil + 4;
    const r1 = 250 + random(`${id}l${i}`) * 90;
    const c = random(`${id}c${i}`) > 0.45 ? a : b;
    return (
      <line
        key={i}
        x1={Math.cos(ang) * r0}
        y1={Math.sin(ang) * r0}
        x2={Math.cos(ang) * r1}
        y2={Math.sin(ang) * r1}
        stroke={c}
        strokeWidth={4 + random(`${id}w${i}`) * 7}
        strokeOpacity={0.85}
      />
    );
  });
  return (
    <>
      <Bg vw={vw} vh={vh} fill="#2a1712" />
      <defs>
        <radialGradient id={`${id}-base`}>
          <stop offset="0.3" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </radialGradient>
        <radialGradient id={`${id}-sclera`}>
          <stop offset="0.5" stopColor="#f3ece2" />
          <stop offset="1" stopColor="#b88a7a" />
        </radialGradient>
        <clipPath id={`${id}-lid`}>
          <path d="M -760 0 Q 0 -520 760 0 Q 0 520 -760 0 Z" />
        </clipPath>
      </defs>
      <g transform={`scale(${vh > vw ? 1.3 : 1})`}>
      <g clipPath={`url(#${id}-lid)`}>
        <rect x={-800} y={-500} width={1600} height={1000} fill={`url(#${id}-sclera)`} />
        {Array.from({ length: 10 }, (_, i) => (
          <path
            key={i}
            d={`M ${(i % 2 ? 1 : -1) * 760} ${(random(`${id}v${i}`) - 0.5) * 300} Q ${(i % 2 ? 1 : -1) * 520} ${(random(`${id}q${i}`) - 0.5) * 200} ${(i % 2 ? 1 : -1) * 380} ${(random(`${id}e${i}`) - 0.5) * 200}`}
            stroke="#b8323a"
            strokeOpacity={0.35}
            strokeWidth={3}
            fill="none"
          />
        ))}
        <circle r={345} fill={`url(#${id}-base)`} />
        {fibers}
        <circle r={345} fill="none" stroke="#120806" strokeWidth={34} strokeOpacity={0.75} filter="url(#blur-s)" />
        <circle r={pupil} fill="#020202" />
        {/* catchlight reflecting a small cross */}
        <g transform="translate(-95 -120)" fill="#fff" opacity={0.9} filter="url(#glow-s)">
          <rect x={-7} y={-42} width={14} height={84} rx={3} />
          <rect x={-28} y={-22} width={56} height={14} rx={3} />
        </g>
        <ellipse cx={120} cy={110} rx={30} ry={18} fill="#fff" opacity={0.25} />
      </g>
      <path d="M -760 0 Q 0 -520 760 0" stroke="#160a07" strokeWidth={40} fill="none" />
      {p.tear ? <path d="M 230 300 Q 260 360 250 400 Q 230 440 205 400 Q 200 360 230 300 Z" fill="#cfefff" opacity={0.85} filter="url(#glow-s)" /> : null}
      </g>
    </>
  );
};
