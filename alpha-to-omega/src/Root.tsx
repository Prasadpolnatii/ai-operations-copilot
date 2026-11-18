import React from "react";
import { Composition, Folder } from "remotion";
import { AlphaToOmega, AlphaToOmegaProps } from "./AlphaToOmega";
import { ACTS, TOTAL_FRAMES, actRange } from "./shots";

const base: AlphaToOmegaProps = { act: null, music: null };

export const RemotionRoot: React.FC = () => (
  <>
    {/* 9:16 master — Reels / Shorts / TikTok */}
    <Composition
      id="AlphaToOmega"
      component={AlphaToOmega}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={base}
    />
    {/* 16:9 version — same shots, art re-flows around the locked center */}
    <Composition
      id="AlphaToOmega-Wide"
      component={AlphaToOmega}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={base}
    />
    <Folder name="Acts">
      {ACTS.map(({ act }) => (
        <Composition
          key={act}
          id={`Act${act}`}
          component={AlphaToOmega}
          durationInFrames={actRange(act).durationInFrames}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ ...base, act }}
        />
      ))}
    </Folder>
  </>
);
