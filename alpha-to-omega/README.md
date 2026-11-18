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

**Drop-in, no code:** save an image as `public/shots/<shot-id>.png` (or `.jpg` / `.webp`), e.g.
`public/shots/a7-eye01.png`, and it replaces that shot's procedural art. Grade, grain, strobes, glitch
blocks and the Act 2 cross still apply on top. One-frame invert/duotone variants reuse their parent's image.

- Landscape versions for the 16:9 render can go in `public/shots-wide/` with the same name.
- To point a shot at any other file, set `src` in `src/shots.ts`. Re-time a shot with `d` (frames).
- **Keep the subject dead-centre:** the cross (Act 2), icons (Act 4) and pupil (Act 7) all hit the exact middle of the frame.

**[AI_PROMPTS.md](AI_PROMPTS.md)** has a ready-to-paste ChatGPT prompt for every shot (77 total, tiered by impact).

## Sound

`public/audio/score.wav` is an **original score + sound design generated in code** by `scripts/make-score.mjs`
(royalty-free, no samples). Every sound is placed from `src/shots.ts`, so after re-timing shots run
`npm run score` and the audio follows. ffmpeg is needed for the loudness pass.

| Where | Sound |
|---|---|
| F000 | sub impact + high bell ("Let there be light"), D-minor choir pad, ticks + snaps on every flash |
| Act 2 | bell as the cross draws on; one harp note per 3-frame cut (arpeggio), hats, kick every 4 cuts |
| Act 3 | wind, rain, B♭ choir; orchestral stab on each strobe (F078 / F082 / F086) |
| Act 4 | rising pitched tick per icon, pulse tightening, noise riser → **2-frame near-silence (F146–147)** |
| **F148 drop** | sub boom + thunder + full choir (+40 dB jump out of the gap); thunder on each lightning flash; death-toll bell on the three crosses |
| Act 6 | heartbeat pulse, glitch bursts on glitch frames, whoosh per cut, splash, wing flaps, stone grind → impact on the sunburst |
| Act 7 | tick per eye cut, heartbeat speeding up, A-major tension chord, riser |
| F307 → end | resolves to **D major** choir, doves flutter, wing whoosh, double bell chime on "HE IS RISEN" |

Master: Freeverb reverb send, soft clip, two-pass EBU R128 to **−14 LUFS / −1 dBTP**.

To use your own track instead, put it in `public/` and set `music` in `defaultProps` (`src/Root.tsx`);
line its biggest hit up with **F148 (4.93 s)**. Set `music: null` for a silent render.

## Commands

```bash
npm i
npm run score                                         # regenerate the audio (optional)
npx remotion studio                                   # preview + scrub
npx remotion render AlphaToOmega out/AlphaToOmega-9x16.mp4 --crf=16
npx remotion render AlphaToOmega-Wide out/AlphaToOmega-16x9.mp4 --crf=16
```

If Chrome can't be downloaded (offline or locked-down machine), add
`--browser-executable=/path/to/chrome-headless-shell`.
Fonts (Cinzel, EB Garamond — SIL OFL) are bundled in `public/fonts/`, so rendering doesn't need network access.
