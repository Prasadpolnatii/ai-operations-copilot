import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { CrossOverlay, GateWeave, RgbSplitDefs, VhsLayer } from "./overlays";
import { ShotView } from "./ShotView";
import { SHOTS, SHOT_STARTS, actRange } from "./shots";

// Fonts ship in /public so renders work offline (both are SIL OFL).
loadFont({ family: "Cinzel", url: staticFile("fonts/Cinzel-700.woff2"), weight: "700" });
loadFont({ family: "EB Garamond", url: staticFile("fonts/EBGaramond-greek.woff2"), weight: "400" });

export type AlphaToOmegaProps = {
  /** render a single act (1–8) as its own timeline; null = full film */
  act: number | null;
  /** file in /public, e.g. "music.mp3". Line the drop up with F148 (4.93 s). */
  music: string | null;
};

export const AlphaToOmega: React.FC<AlphaToOmegaProps> = ({ act, music }) => {
  const offset = act ? actRange(act).from : 0;
  const shots = SHOTS.map((s, i) => ({ s, from: SHOT_STARTS[i] - offset })).filter(({ s }) => !act || s.act === act);
  const cross = actRange(2);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <RgbSplitDefs />
      <GateWeave>
        {shots.map(({ s, from }) => (
          <Sequence key={s.id} name={s.id} from={from} durationInFrames={s.d} premountFor={0}>
            <ShotView shot={s} />
          </Sequence>
        ))}
        {!act || act === 2 ? (
          <Sequence name="cross-overlay" from={cross.from - offset} durationInFrames={cross.durationInFrames}>
            <CrossOverlay />
          </Sequence>
        ) : null}
      </GateWeave>
      <VhsLayer />
      {music && !act ? <Audio src={staticFile(music)} /> : null}
    </AbsoluteFill>
  );
};
