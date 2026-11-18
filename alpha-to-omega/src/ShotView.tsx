import React from "react";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ARTS } from "./art";
import { SharedDefs } from "./art/common";
import type { Shot } from "./shots";

/** Renders one shot: real asset if `src` is set, otherwise the procedural art. Applies flash/strobe/glitch fx. */
export const ShotView: React.FC<{ shot: Shot }> = ({ shot }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const S = Math.min(W, H) / 1000;
  const t = shot.d > 1 ? f / (shot.d - 1) : 0;

  const strobe = shot.fx?.strobes?.find((s) => f >= s.at && f < s.at + s.d);
  const duo = shot.fx?.duo ?? (strobe?.mode === "duo" ? strobe.color : undefined);
  const invert = shot.fx?.invert || strobe?.mode === "invert" || Boolean(duo);
  const glitch = shot.fx?.glitch?.includes(f);
  const Art = ARTS[shot.art];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          filter: [invert ? "invert(1)" : "", duo ? "grayscale(1) contrast(1.35)" : ""].join(" ").trim() || undefined,
        }}
      >
        <AbsoluteFill style={{ scale: String(1 + (shot.zoom ?? 0.05) * t) }}>
          {shot.src ? (
            <Img src={staticFile(shot.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <svg width={W} height={H} viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`}>
              <SharedDefs />
              <g transform={`scale(${S})`}>
                <Art t={t} f={f} d={shot.d} vw={W / S} vh={H / S} p={shot.p ?? {}} />
              </g>
            </svg>
          )}
        </AbsoluteFill>
      </AbsoluteFill>
      {duo ? <AbsoluteFill style={{ backgroundColor: duo, mixBlendMode: "multiply" }} /> : null}
      {glitch
        ? [0, 1, 2].map((k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: `${random(`${shot.id}gx${f}${k}`) * 70}%`,
                top: `${random(`${shot.id}gy${f}${k}`) * 80}%`,
                width: `${15 + random(`${shot.id}gw${f}${k}`) * 30}%`,
                height: `${4 + random(`${shot.id}gh${f}${k}`) * 14}%`,
                backgroundColor: "#fff",
                mixBlendMode: "difference",
              }}
            />
          ))
        : null}
    </AbsoluteFill>
  );
};
