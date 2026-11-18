import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, interpolateColors, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../fonts";
import { SharedDefs } from "../art/common";
import { D, T, WORLDS, camVel, camY, warp, worldU } from "./camera";
import { Layer, PALETTE, WORLD_LAYERS } from "./worlds";

export type AboveEveryNameProps = {
  /** file in /public; default is the generated score (`npm run score:descent`) */
  music: string | null;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pal = (i: number, dawn: number): [string, string] => {
  const k = WORLDS[Math.max(0, Math.min(WORLDS.length - 1, i))];
  if (k !== "heaven" || dawn <= 0) return PALETTE[k];
  return [
    interpolateColors(dawn, [0, 1], [PALETTE.heaven[0], PALETTE.dawn[0]]),
    interpolateColors(dawn, [0, 1], [PALETTE.heaven[1], PALETTE.dawn[1]]),
  ];
};

/** Screen-space particles at three depths (dust → fireflies → spray → embers → dust, tinted by world). */
const Particles: React.FC<{ cy: number; vw: number; vh: number; color: string; z: number; n: number; f: number }> = ({ cy, vw, vh, color, z, n, f }) => {
  const span = vh + 400;
  return (
    <g filter={z > 1.4 ? "url(#dof-near)" : undefined}>
      {Array.from({ length: n }, (_, i) => {
        const base = random(`p${z}y${i}`) * span;
        let y = (base - cy * z * 0.9 - f * (4 + z * 3)) % span;
        if (y < 0) y += span;
        return (
          <circle
            key={i}
            cx={(random(`p${z}x${i}`) - 0.5) * vw * 1.1 + Math.sin(f / 18 + i) * 10 * z}
            cy={y - span / 2}
            r={(1.2 + random(`p${z}r${i}`) * 2.2) * z * 1.4}
            fill={color}
            opacity={0.25 + random(`p${z}o${i}`) * 0.45}
          />
        );
      })}
    </g>
  );
};

export const AboveEveryName: React.FC<AboveEveryNameProps> = ({ music }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const S = Math.min(W, H) / 1000;
  const vw = W / S;
  const vh = H / S;

  const u = warp(worldU(f));
  const dawn = interpolate(f, [T.ascentStart + 18, T.ascentEnd], [0, 1], clamp);
  const crack = interpolate(f, [T.crack, T.crack + 8], [0, 1], clamp);

  // camera (+ shake while the stone grinds)
  const shakeAmp = f >= T.rumbleStart && f < T.silenceStart ? interpolate(f, [T.rumbleStart, T.silenceStart], [2, 16]) : 0;
  const cy = camY(f) + (random(`shy${f}`) - 0.5) * shakeAmp;
  const sx = (random(`shx${f}`) - 0.5) * shakeAmp;
  const motionBlur = Math.min(48, Math.abs(camVel(f)) * 0.085);

  // continuous sky: cross-fade palettes between world centres
  const i0 = Math.floor(Math.max(0, u));
  const tt = Math.max(0, Math.min(1, u - i0));
  const [a0, b0] = pal(i0, dawn);
  const [a1, b1] = pal(i0 + 1, dawn);
  const skyTop = interpolateColors(tt, [0, 1], [a0, a1]);
  const skyBot = interpolateColors(tt, [0, 1], [b0, b1]);
  const lightWorld = u < 0.5 || dawn > 0;
  const particleColor = lightWorld ? (dawn > 0 ? "#fff1c8" : "#fffaf0") : u > 3.6 && u < 4.5 ? "#ffb070" : "#cfe2ea";

  // gather visible world layers, sort by depth
  const layers: (Layer & { o: number; fade: number })[] = [];
  WORLDS.forEach((key, k) => {
    const o = k * D - cy;
    if (Math.abs(o) > 1.5 * D) return;
    const fade = Math.max(0, Math.min(1, 1.4 - Math.abs(o) / D));
    for (const L of WORLD_LAYERS[key]({ f, vw, vh, dawn: key === "heaven" ? dawn : 0, crack: key === "tomb" ? crack : 0 })) {
      layers.push({ ...L, key: `${key}-${L.key}`, o, fade: L.z < 0.7 ? fade : 1 });
    }
  });
  layers.sort((p, q) => p.z - q.z);

  const darkness = interpolate(f, [290, 340, T.silenceStart, T.crack, T.crack + 3], [0, 0.45, 0.97, 0.97, 0], clamp);
  const flash = interpolate(f, [T.crack, T.crack + 4, T.crack + 16], [0, 0.9, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg width={W} height={H} viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`}>
        <SharedDefs />
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={skyTop} />
            <stop offset="1" stopColor={skyBot} />
          </linearGradient>
          {/* feathered masks so solid world fills dissolve instead of leaving seams */}
          <linearGradient id="fb-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.62" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id="fb" maskContentUnits="objectBoundingBox">
            <rect width="1" height="1" fill="url(#fb-g)" />
          </mask>
          <linearGradient id="fy-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.18" stopColor="#fff" />
            <stop offset="0.82" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id="fy" maskContentUnits="objectBoundingBox">
            <rect width="1" height="1" fill="url(#fy-g)" />
          </mask>
          <filter id="cap-shadow" x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.55" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dof-far" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id="dof-near" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="mblur" x="-5%" y="-25%" width="110%" height="150%">
            <feGaussianBlur stdDeviation={`0 ${motionBlur.toFixed(1)}`} />
          </filter>
        </defs>
        <g filter={motionBlur > 0.6 ? "url(#mblur)" : undefined}>
          <g transform={`scale(${S})`}>
            <rect x={-vw / 2 - 40} y={-vh / 2 - 300} width={vw + 80} height={vh + 600} fill="url(#sky)" />
            <Particles cy={cy} vw={vw} vh={vh} color={particleColor} z={0.6} n={50} f={f} />
            {layers.filter((L) => !L.key.endsWith("-caption")).map((L) => (
              <g
                key={L.key}
                transform={`translate(${(sx * L.z).toFixed(1)} ${(L.o * L.z).toFixed(1)})`}
                opacity={L.fade}
                filter={L.dof ? `url(#dof-${L.dof})` : undefined}
              >
                {L.el}
              </g>
            ))}
            <Particles cy={cy} vw={vw} vh={vh} color={particleColor} z={1.1} n={36} f={f} />
            <Particles cy={cy} vw={vw} vh={vh} color={particleColor} z={1.8} n={12} f={f} />
            {/* scripture rides with its world (z = 1) but is drawn above every layer so nothing crosses it */}
            {layers
              .filter((L) => L.key.endsWith("-caption"))
              .map((L) => (
                <g key={L.key} transform={`translate(0 ${L.o.toFixed(1)})`} opacity={Math.max(0, 1 - Math.abs(L.o) / (D * 0.55))}>
                  <g filter="url(#cap-shadow)">{L.el}</g>
                </g>
              ))}
          </g>
        </g>
      </svg>

      {/* tomb darkness → 0.4 s of black silence → light breaks */}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: darkness }} />
      <AbsoluteFill style={{ backgroundColor: "#fff3d6", opacity: flash, mixBlendMode: "screen" }} />

      {/* dawn: scripture + title */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingLeft: 80, paddingRight: 80, top: -60 }}>
        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 56,
            color: "#4a2a10",
            textAlign: "center",
            opacity: interpolate(f, [T.ascentEnd - 4, T.ascentEnd + 10], [0, 1], clamp),
            translate: `0 ${interpolate(f, [T.ascentEnd - 4, T.ascentEnd + 14], [20, 0], clamp)}px`,
            marginBottom: 36,
          }}
        >
          Wherefore God also hath highly exalted him
        </div>
        <div
          style={{
            fontFamily: "Cinzel, serif",
            fontWeight: 700,
            fontSize: 118,
            lineHeight: 1.05,
            letterSpacing: 6,
            color: "#3a1f0a",
            textAlign: "center",
            textShadow: "0 0 40px rgba(255,248,225,0.9)",
            opacity: interpolate(f, [T.titleIn, T.titleIn + 12], [0, 1], clamp),
            scale: String(interpolate(f, [T.titleIn, T.titleIn + 30], [1.06, 1], clamp)),
          }}
        >
          ABOVE
          <br />
          EVERY NAME
        </div>
        <div
          style={{
            fontFamily: "Cinzel, serif",
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: 10,
            color: "#5a3414",
            marginTop: 40,
            opacity: interpolate(f, [T.titleIn + 10, T.titleIn + 22], [0, 0.85], clamp),
          }}
        >
          PHILIPPIANS 2:6–11
        </div>
      </AbsoluteFill>

      {/* clean film finish: fine grain + vignette (no VHS this time) */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <filter id="dgrain" x="0" y="0" width="1" height="1">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={f} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#dgrain)" opacity={0.06} />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />

      {music ? <Audio src={staticFile(music)} /> : null}
    </AbsoluteFill>
  );
};
