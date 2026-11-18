import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Act 2 anchor: a thin glowing gold cross locked to frame center while 11
 * scenes swap underneath (the reference's golden-spiral trick).
 * Draws on in 3 frames, then holds with a faint pulse.
 */
export const CrossOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const S = Math.min(W, H) / 1000;
  const draw = interpolate(f, [0, 3], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 0.85 + Math.sin(f * 1.3) * 0.15;
  // fits portrait and landscape: cross spans ~86% of the frame height
  const k = Math.min(1, ((H / S) * 0.86) / 1080);
  const vLen = 1080 * k;
  const hLen = 600 * k;
  const top = -vLen / 2;
  const armY = top + vLen * 0.26;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={W} height={H} viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`}>
        <defs>
          <filter id="cross-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform={`scale(${S})`} stroke="#ffd98a" strokeWidth={9} strokeLinecap="round" filter="url(#cross-glow)" opacity={pulse}>
          <line x1={0} y1={top} x2={0} y2={top + vLen * draw} />
          <line x1={-hLen / 2} y1={armY} x2={-hLen / 2 + hLen * draw} y2={armY} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Full-frame analog finish: RGB split, grain, scanlines, vignette, teal/orange grade, gate weave, flicker. */
export const RgbSplitDefs: React.FC = () => {
  const f = useCurrentFrame();
  const amt = 3 + random(`ca${f}`) * 4;
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <filter id="rgb-split" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
        <feOffset in="r" dx={-amt} dy={0} result="r2" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
        <feOffset in="b" dx={amt} dy={0} result="b2" />
        <feBlend in="r2" in2="g" mode="screen" result="rg" />
        <feBlend in="rg" in2="b2" mode="screen" />
      </filter>
    </svg>
  );
};

export const GateWeave: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        filter: "url(#rgb-split) contrast(1.08) saturate(1.12)",
        translate: `${((random(`wx${f}`) - 0.5) * 3).toFixed(2)}px ${((random(`wy${f}`) - 0.5) * 3).toFixed(2)}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const VhsLayer: React.FC = () => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* teal shadows / warm highlights grade */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(20,90,100,0.35), rgba(200,110,40,0.25))",
          mixBlendMode: "soft-light",
        }}
      />
      {/* lifted blacks */}
      <AbsoluteFill style={{ backgroundColor: "rgba(12,24,28,0.12)", mixBlendMode: "lighten" }} />
      {/* grain */}
      <svg width={W} height={H} style={{ position: "absolute", opacity: 0.16, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      {/* scanlines */}
      <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 2px, transparent 4px)",
        }}
      />
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)" }} />
      {/* brightness flicker */}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: random(`flk${f}`) * 0.07 }} />
    </AbsoluteFill>
  );
};
