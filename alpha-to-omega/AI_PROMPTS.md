# Photoreal swap-in prompts (highest-ROI shots)

Generate at **9:16, 2K**, then save into `public/shots/` and set `src` on the matching shot in
`src/shots.ts`. The procedural layer stays as a fallback, and grade, grain, RGB split, strobes and
glitch blocks are still applied on top.

**Subject dead-center, every time.** The match cuts depend on it: pupil center (Act 7), figure's
vertical axis (Acts 1, 3, 5), light source (Act 8).

Shared style suffix (append to every prompt):
> cinematic still, 35mm film, subtle halation, teal shadows and warm highlights, deep blacks,
> shallow depth of field, no text, no watermark, perfectly centered composition

## 1 · Act 7 irises — `a7-eye01` … `a7-eye18` (F265–F306)

> extreme macro photograph of a human eye, iris fills 85% of frame width, pupil exactly at frame
> center, **{IRIS}** iris with visible stromal fibres, crypts and collarette, wet glossy cornea, a
> small sharp **cross-shaped window reflection** in the upper-left of the iris, soft rim of eyelashes
> at top, faint red capillaries in the sclera

Use the shot's colours from `EYES` in `shots.ts` for `{IRIS}`, e.g. `amber-gold inner, steel-blue
outer`. Add `a single tear on the lower lash line` for shots 3, 8 and 13.
Fix the seed and change only `{IRIS}`, so all 18 share framing and lighting.

## 2 · Robed silhouettes — `a1-walk*`, `a1-stand`, `a1-arms`, `a3-water`, `a5-arms`

> backlit silhouette of a robed man with shoulder-length hair, long flowing robe and mantle,
> **{POSE}**, standing at exact frame center, strong rim light outlining hair and shoulders, light
> source directly behind him, drifting low mist at his feet, painterly, Caravaggio chiaroscuro

| Shot | `{POSE}` + setting |
|---|---|
| `a1-walk1/2` | walking left-to-right with a shepherd's staff, dawn haze |
| `a1-stand` | standing still, facing camera, dawn haze |
| `a1-arms` | both arms raised high, dawn haze |
| `a3-water` | standing calmly on dark storm waves at night, rain streaks, moonlight behind |
| `a5-arms` | arms stretched straight out to the sides (cross pose), wide sleeves, blazing gold backlight and god rays |

## 3 · Act 8 payoff — `a8-clouds` (F312–F320) and `a8-wings` (F335–F342)

**Clouds:**
> massive dark billowing storm clouds parting at frame center, brilliant warm light breaking through
> the gap, volumetric god rays fanning downward, cloud edges rim-lit gold, epic scale

**Wings:**
> enormous feathered angel wings spread wide and backlit, individual primary and secondary feathers
> translucent at the tips, small robed silhouette at frame center between the wings, dark storm
> sky, soft mist below, ethereal light behind

## After swapping

Run `npm run score` only if you changed any `d` durations, then render as in the README.
