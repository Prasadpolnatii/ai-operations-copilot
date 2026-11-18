# ALPHA TO OMEGA — 12-second hyper-cut (Remotion)

359 frames · 30 fps · 11.97 s. Built from a frame-by-frame breakdown of a reference montage:
3-frame center-locked cuts, one persistent geometry overlay, a 5× slowdown on the drop,
and an 18-cut pupil-locked climax.

| Composition | Size | Use |
|---|---|---|
| `AlphaToOmega` | 1080×1920 | Reels / Shorts / TikTok master |
| `AlphaToOmega-Wide` | 1920×1080 | YouTube / widescreen |
| `Acts/Act1` … `Act8` | 1080×1920 | each act on its own timeline for fine-tuning |

## Timeline

| Act | Frames | Cadence | Mechanic |
|---|---|---|---|
| 1 Creation & Birth | F000–038 | 1–4f + 1f invert/duotone flashes | light → star → manger → olive/crimson/thorn bloom → walking silhouette |
| 2 The Cross Overlay | F039–071 | strict 3f ×11 | gold cross locked to center (`CrossOverlay`) while scenes swap underneath |
| 3 Walking on Water | F072–100 | 29f hold | gold / crimson duotone + white invert strobes at local f6, f10, f14 |
| 4 Sacred Symbols | F101–147 | 3f ×15 + 1f ×2 | dead-center icons in one ring; 4-stage tomb stone on colored blueprint plates |
| 5 The Drop | F148–189 | 13f / 19f / 10f | lightning → three crosses (longest shot) → pose match into arms outstretched |
| 6 Miracles & Tomb | F190–264 | 4–14f | glitch blocks on f190–202, stone rolls away to white, sunburst core = pupil |
| 7 Every Eye Will See | F265–306 | 2–3f ×18 | procedural irises, pupil locked to center, cross in the catchlight |
| 8 Ascension & Title | F307–358 | 5–16f | light eruption → clouds part → doves → wings → "HE IS RISEN" (16f) |

Finish layer (`overlays.tsx`): RGB split, film grain, scanlines, vignette, teal/orange grade,
lifted blacks, gate weave, brightness flicker.

## Swap in real footage / AI stills

Everything is data in `src/shots.ts`. To replace a placeholder:

1. Drop the file in `public/shots/`, e.g. `public/shots/a2-baptism.jpg`.
2. Add `src` to that shot: `{ id: "a2-baptism", ..., src: "shots/a2-baptism.jpg" }`.
3. **Keep the subject dead-center.** The cross (Act 2), icons (Act 4) and pupil (Act 7) all hit the exact middle of the frame.

Re-time a shot by changing `d` (frames). Flash, strobe and glitch effects stay attached through `fx`.

## Music

Put a track at `public/music.mp3` and set `music: "music.mp3"` in `defaultProps` (`src/Root.tsx`).
Line the biggest hit up with **F148 (4.93 s)**, where Act 5 drops. Master to around −14 LUFS / −1 dBTP.

## Commands

```bash
npm i
npx remotion studio                                   # preview + scrub
npx remotion render AlphaToOmega out/AlphaToOmega-9x16.mp4 --crf=16
npx remotion render AlphaToOmega-Wide out/AlphaToOmega-16x9.mp4 --crf=16
```

If Chrome can't be downloaded (offline or locked-down machine), add
`--browser-executable=/path/to/chrome-headless-shell`.
Fonts (Cinzel, EB Garamond — SIL OFL) are bundled in `public/fonts/`, so rendering doesn't need network access.
