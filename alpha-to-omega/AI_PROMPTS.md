# ALPHA TO OMEGA — ChatGPT image prompt pack

77 copy-paste prompts, one per shot, written for ChatGPT image generation (GPT Image).
Every prompt is named after the shot it replaces. Save the result with that name and it appears in the video automatically.

---

## How to use (read once)

1. **Open a new ChatGPT chat and paste the MASTER RULES block below first.** ChatGPT keeps them for the whole chat, so each shot prompt stays short and every image shares one look.
2. Paste one shot prompt at a time. One image per message.
3. Download the image and rename it to the shot ID, e.g. `a7-eye01.png`. Put it in `alpha-to-omega/public/shots/`. That's all: no code changes. Anything you don't replace keeps its current procedural version.
4. Render or preview as usual (`npx remotion studio`).

**Size.** ChatGPT's tall size is 1024×1536 (2:3). The 9:16 video crops about **8% off the left and right**, so the master rules keep the sides free.

**16:9 version (optional).** For hero shots, ask *"Now give me the same image as a wide landscape 1536×1024, same subject, same lighting, subject exactly centred"*. Save it with the **same filename** in `public/shots-wide/`; the 16:9 render prefers that folder. Without it, the 16:9 render center-crops the tall image, which cuts off heads and feet on figures.

**Priority.** Do **Tier 1** first: 26 images that give the biggest visual jump. Tiers 2 and 3 are polish.

**Not needed:** the one-frame flash and invert variants (`a1-flash*`, `a1-star-inv`, `a1-walk1-inv`, `a1-walk2-duo`) reuse their parent's image. The title (`a8-title`) stays as real typography in code.

**If ChatGPT refuses or drifts:** reply *"Keep everything the same but fix: …"* rather than re-pasting. If it adds text, a border or a collage, reply *"Regenerate with no text, no border, a single full-bleed photograph."*

---

## MASTER RULES (paste first, once per chat)

```
For every image in this chat, follow these rules unless I say otherwise:

FORMAT: one single tall portrait image, 1024×1536. Full-bleed, no borders, no frames, no collage, no split panels, no variations grid.

COMPOSITION: the main subject sits exactly at the horizontal centre and vertical centre of the frame. Keep the outer 10% on the left and right free of important detail, because the image will be cropped to 9:16. Symmetrical, centre-locked framing like a match-cut montage.

LOOK: cinematic film still, photographic realism, shot on 35mm film. Rich chiaroscuro with deep true blacks. Teal-cyan shadows and warm amber-gold highlights. Soft halation glow around bright light sources, fine natural film grain, subtle lens vignette. Moody, reverent, epic but intimate.

NEVER INCLUDE: text, letters, numbers, captions, signatures, logos, watermarks, UI, modern objects.

Reply only with the image.
```

---

# TIER 1 — the 26 that matter most

## Act 7 · "Every Eye Will See" — 18 macro irises (F265–F306)

These cut every 2–3 frames, so they must line up: **same framing, same crop, pupil dead-centre, same cross reflection**. Generate `a7-eye01` with the full prompt. For `a7-eye02` to `a7-eye18`, use the short follow-up in the **same chat**, which keeps the framing locked.

**`a7-eye01`** (full prompt):

```
Extreme macro photograph of a single human eye, straight-on. The pupil is a perfect circle exactly at the centre of the frame. The iris fills about 85% of the frame width; the upper and lower eyelids with eyelashes curve into the top and bottom of the frame.

Iris: vivid amber-orange inner ring around the pupil fading into a steel-blue outer iris (central heterochromia), with sharply detailed radial stromal fibres, dark crypts, a lighter collarette ring and a dark limbal ring at the edge. Medium-sized pupil.

The cornea is wet and glossy. In the upper-left of the iris there is one small, crisp reflection of a glowing cross-shaped window (a bright white cross of light), plus a soft secondary highlight. Fine red capillaries in the white of the eye. Natural skin texture on the lids, light skin tone.

Lighting: soft studio key light from the upper left, dark falloff around the edges. Ultra-sharp focus on the iris, shallow depth of field on the lashes.
```

**`a7-eye02` → `a7-eye18`** (paste in the same chat, filling the bracketed line from the table):

```
Same exact framing, crop, scale, lighting, pupil position (dead centre) and the same small glowing cross-shaped reflection in the upper-left of the iris as the previous eye image. Change only: [CHANGES].
```

| File | `[CHANGES]` |
|---|---|
| `a7-eye02` | iris deep chestnut brown with darker espresso outer ring; slightly small pupil; olive skin tone |
| `a7-eye03` | hazel iris: golden-amber inner ring fading to olive-green outer; slightly large pupil; one clear tear welling on the lower eyelid; light-brown skin tone |
| `a7-eye04` | bright sky-blue iris fading to a navy limbal ring; slightly small pupil; fair skin tone |
| `a7-eye05` | rare rust-red copper-brown iris with near-black outer ring; medium pupil; dark-brown skin tone |
| `a7-eye06` | gold sunburst pattern around the pupil radiating into a blue outer iris; large pupil; light skin tone |
| `a7-eye07` | pale ice-blue iris with grey-blue outer ring; small pupil; fair freckled skin tone |
| `a7-eye08` | honey-amber iris with warm brown outer ring; medium pupil; one tear running from the lower lid; brown skin tone |
| `a7-eye09` | teal-turquoise iris with deep petrol-blue outer ring; medium pupil; olive skin tone |
| `a7-eye10` | orange-amber centre with blue-grey outer iris; slightly small pupil; light skin tone |
| `a7-eye11` | very dark espresso-brown iris, almost black at the edge; large pupil; deep dark-brown skin tone |
| `a7-eye12` | fiery iris: bright gold inner ring blending into copper-red outer; small pupil; tan skin tone |
| `a7-eye13` | deep mahogany red-brown iris; medium pupil; eye glistening with tears, one tear on the lower lid; brown skin tone |
| `a7-eye14` | blue iris with a large amber sector flecked through it (sectoral heterochromia); small pupil; fair skin tone |
| `a7-eye15` | burnt-sienna iris with dark brown limbal ring; slightly large pupil; olive skin tone |
| `a7-eye16` | grey-blue iris; small pupil; light skin tone |
| `a7-eye17` | amber centre with a blue outer iris; very small constricted pupil (bright light hitting it); brown skin tone |
| `a7-eye18` | copper iris with a glowing gold outer ring; tiny pinpoint pupil; the cross reflection noticeably brighter; dark-brown skin tone |

> Tip: if ChatGPT starts drifting (zooming in or out, moving the pupil), upload `a7-eye01.png` again and say *"Use this image as the exact template"* before the change.

## Robed figure — Acts 1, 3 and 5

Same figure across all six shots. Generate `a1-stand` first, then for the rest say **"Same man, same robe and hair, same rim-lit backlit style as before"** in front of each prompt.

**`a1-stand`** (F33–35):
```
Backlit silhouette of Jesus of Nazareth standing still and facing the camera, full body, exactly centred, occupying the middle 55% of the frame height. Shoulder-length hair, long flowing linen robe with a draped mantle over one shoulder. A bright pale-gold light source directly behind him creates a crisp glowing rim light around his hair, shoulders and robe edges; his front is almost black. Pre-dawn haze, low drifting mist covering his feet, dark empty landscape. Painterly chiaroscuro like a Caravaggio painting, photographic realism.
```

**`a1-walk1`** (F25–28):
```
Same man, same robe and hair, same rim-lit backlit style as before. Now walking slowly from left to right holding a tall wooden shepherd's staff, seen in profile at three-quarter view. Place him slightly left of centre (about 40% from the left edge), small in frame, occupying 40% of the frame height. Cool pre-dawn haze, mist at his feet, a soft glow on the horizon behind him.
```

**`a1-walk2`** (F29–32):
```
Same man, same robe, hair and staff, same rim-lit backlit style. Walking toward the camera, now exactly centred and larger, occupying 50% of the frame height. Mist swirling around his feet, glow behind his head and shoulders.
```

**`a1-arms`** (F37–38):
```
Same man, same robe and hair, same rim-lit backlit style. Standing exactly centred, both arms raised high above his head in praise, sleeves falling back from the wrists. Brilliant white light directly behind him, light rays bursting outward, mist at his feet.
```

**`a3-water`** (F72–100, 29-frame hold, the Act 3 anchor):
```
Same man, same robe and hair. Jesus standing calmly on the surface of a stormy sea at night, full body, exactly centred, occupying the middle 50% of the frame height. Dark churning waves all around, wind-blown spray, diagonal rain streaks. A break in the heavy storm clouds directly behind him pours cold silver-white moonlight, so he is a near-black silhouette with a strong luminous rim light on his hair, shoulders and robe. A soft ring of light glows on the water where he stands; low sea mist drifts across the waves. Deep teal and steel-blue palette, epic and serene.
```

**`a5-arms`** (F180–189, the pose match out of the three crosses):
```
Same man, same robe and hair. Standing exactly centred with both arms stretched straight out to the sides in the shape of a cross, wide sleeves draping down from his arms. He is a dark silhouette against an overwhelming blaze of golden light directly behind him, with god rays radiating outward in every direction. Strong gold rim light outlining his hair, arms and robe. Warm golden mist at his feet. Majestic, sacrificial, triumphant.
```

## Act 8 · the payoff

**`a8-clouds`** (F312–320):
```
Looking up into a sky of massive, dark, billowing storm clouds that are parting exactly at the centre of the frame. Through the opening, brilliant warm white-gold light breaks through, with volumetric god rays fanning downward toward the viewer. The edges of the clouds around the opening are rim-lit gold and silver; the cloud bodies are deep charcoal and slate blue with rich 3D volume. Epic scale, awe and release.
```

**`a8-wings`** (F335–342):
```
An enormous pair of feathered wings spreading wide and upward, backlit by intense white light directly behind them. Individual primary, secondary and covert feathers are clearly visible and translucent at the tips, glowing at the edges. Exactly centred between the wings stands a small robed figure seen from behind in silhouette, as if the wings are rising from his shoulders. Dark stormy grey sky, soft mist below, a radiant glow behind the figure. Ethereal, majestic, photographic realism.
```

---

# TIER 2 — the drop and the climax

**`a5-lightning`** (F148–160, on the music drop):
```
A single massive jagged lightning bolt splitting a black night sky, striking downward exactly through the vertical centre of the frame. Heavy roiling storm clouds lit violet-white from inside by the flash. A dark rolling hill silhouette at the bottom. Raw, violent, overwhelming.
```

**`a5-crosses`** (F161–179, the longest shot):
```
Three wooden crosses on the hill of Golgotha in silhouette, low-angle view. The centre cross is tallest and exactly centred; the two smaller crosses stand left and right, lower on the slope. Behind them a blood-crimson storm sky with swirling dark clouds and a glowing red-orange light low behind the centre cross. The hill and crosses are pure black silhouettes. Solemn, tragic, monumental.
```

**`a8-eruption`** (F307–311):
```
Night scene: a carved stone tomb entrance exactly at the centre, empty, with brilliant blue-white light erupting straight upward out of it in five vertical columns of light shooting into the dark sky. The ground in front is a dark plain with faint glowing blue perspective grid lines running toward the tomb, like a sacred digital floor. Deep navy and electric blue palette.
```

**`a8-doves`** (F320–333):
```
A flock of dozens of white doves bursting outward from the centre of the frame in every direction, wings mid-flap, some motion blur. Behind them a deep blue sky with a bright patch of soft white cloud and light exactly at the centre. Joyful, liberating, uplifting.
```

**`a6-tomb-in`** (F236–249):
```
Inside a dark rock-cut tomb, POV looking at the sealed entrance. A thin, perfectly vertical crack of blinding white light runs through the exact centre of the frame, spilling teal-white glow onto the rough wet rock walls. Dust particles floating in the light. Deep teal-black palette, anticipation.
```

**`a6-stone`** (F250–256):
```
POV from inside a tomb: a huge round stone disc being rolled aside to the right, revealing an opening filled with blinding warm gold-white light at the exact centre of the frame. Light floods in and almost whites out the frame; dust and haze glow in the beams. The stone is rough, grey and weathered.
```

**`a6-sunburst`** (F257–264; its dark centre match-cuts into the first eye's pupil):
```
A radiant golden sunburst halo: dozens of sharp gold and white rays radiating evenly outward from the exact centre, with three thin concentric rings of light around the middle. At the exact centre is a perfect solid black circle about 22% of the frame width, like a pupil. Dark amber background. Symmetrical, sacred, hypnotic.
```

---

# TIER 3 — polish (Acts 1, 2, 4 and 6)

## Act 1 · Creation & Birth

**`a1-sliver`**:
```
Pure black void with a single razor-thin horizontal line of white light across the exact centre, glowing softly at the middle and fading toward the ends. Minimal, primordial: "let there be light".
```

**`a1-beam`**:
```
A single vertical beam of pure white light falling from the top of the frame straight down through the exact centre into total darkness, widening slightly as it falls, with a soft glowing pool of light where it lands. Dust particles drifting in the beam.
```

**`a1-star`**:
```
The Star of Bethlehem: one brilliant four-pointed star with long sharp vertical and horizontal light spikes, exactly centred in a deep navy night sky full of faint stars. Fine radiating light streaks and a soft glow. Awe and wonder.
```

**`a1-manger`**:
```
A humble stone-and-wood stable at night, exactly centred, seen from the front. Warm golden light glowing from the open doorway, the silhouettes of Mary and Joseph kneeling inside. Above the roof, a brilliant star shines directly overhead with a long beam of light. Deep blue night sky, quiet and holy.
```

**`a1-olive`**:
```
Top-down macro of an olive branch blossoming: silver-green olive leaves arranged in a radial circle around a tiny cluster of glowing golden-cream blossoms at the exact centre. Dark background, soft warm rim light.
```

**`a1-crimson`**:
```
Top-down macro of a single blood-crimson anemone flower in full bloom, petals open in a perfect circle, glowing golden centre exactly at the middle of the frame. Black background, dramatic side light.
```

**`a1-thorn`**:
```
Top-down macro of a ring of dark thorny branches radiating from the centre like a starburst, long sharp thorns pointing outward, with a single glowing red bead of light exactly at the centre. Black background, warm low light catching the thorn tips.
```

**`a1-sunrise`**:
```
Sunrise over the hills of Judea: the sun's disc rising exactly at the horizontal centre, half above a dark ridge line, with golden rays spreading upward through a teal-to-amber sky. The lower half of the frame is the dark silhouetted landscape.
```

## Act 2 · under the gold cross (F39–71)

A thin gold cross is drawn **on top of these in code**. Don't put a cross in these images (Golgotha is the exception), and keep each subject centred so the cross sits on it.

**`a2-planks`**:
```
Close-up of rough hand-planed wooden beams in a Nazareth carpenter's workshop, warm wood grain, wood shavings, one heavy beam running diagonally across the centre. Warm lamplight from above, dust in the air.
```

**`a2-crib`**:
```
A simple wooden manger filled with straw, exactly centred, glowing with warm golden light from within as if a newborn lies there, unseen. Dark stable interior around it.
```

**`a2-baptism`**:
```
The Jordan River surface from a low angle: concentric ripples spreading out from the exact centre of the frame, a shaft of light falling from above onto the water, and a white dove descending in the light at the top centre. Deep teal water.
```

**`a2-mast`**:
```
A small wooden fishing boat on the Sea of Galilee in a violent storm, its single mast standing exactly on the vertical centre line, a torn pale sail, huge dark waves around it, lightning-lit clouds. Night, steel-blue palette.
```

**`a2-loaves`**:
```
Five round rustic barley loaves arranged in an arc above two small silver fish on a rough wooden table, all centred, warm golden light from above, dark background. Still-life realism.
```

**`a2-arch`**:
```
An ancient Jerusalem limestone archway gate, perfectly centred and symmetrical, with blinding warm light pouring through the opening from the city beyond. Weathered stone blocks, golden dust in the air.
```

**`a2-thorns`**:
```
A crown of thorns resting on dark stone, seen from slightly above, exactly centred, long sharp thorns, faint red glow around it, a few drops of red on the stone. Low, solemn light.
```

**`a2-nails`**:
```
Three large hand-forged iron nails, crude and rusted, pointing down and converging toward the exact centre of the frame on a black background, cold rim light glinting along their shafts.
```

**`a2-golgotha`**:
```
Distant view of the hill of Golgotha with three small crosses on its top centre, silhouetted against a dark crimson storm sky with swirling clouds. The hill is a black silhouette filling the lower part of the frame.
```

**`a2-tomb`**:
```
A garden tomb carved into a rock face: a dark circular entrance exactly centred, the large round stone already rolled to the right side, warm light glowing from inside the empty tomb. Early dawn, grey stone.
```

**`a2-rose`**:
```
A circular Gothic rose window in stained glass seen straight-on from inside a dark cathedral, perfectly centred and symmetrical, deep ruby, sapphire, emerald and gold glass glowing with light from behind, black stone tracery.
```

## Act 4 · Sacred Symbols (F101–147): 3-frame barrage

These must feel like **one object morphing**: same scale, same centre. Prefix every Act 4 prompt with:

```
Museum still-life photograph: a single object exactly centred on a pure near-black background, occupying about 55% of the frame width, lit by one soft warm key light from the upper left with a faint glow behind it. Thin faint circle of light around the object.
```

| File | Then add |
|---|---|
| `a4-star` | `Object: a radiant eight-pointed star of pure white light.` |
| `a4-dove` | `Object: a white dove with wings raised, seen from the side, softly glowing.` |
| `a4-bread` | `Object: a round flat loaf of unleavened bread being broken in two halves, crumbs falling.` |
| `a4-chalice` | `Object: an ancient golden chalice filled with dark red wine.` |
| `a4-coins` | `Object: thirty tarnished silver coins arranged in a perfect ring.` |
| `a4-lamp` | `Object: an ancient clay oil lamp with a single small flame burning.` |
| `a4-ichthys` | `Object: the ichthys fish symbol formed by two curved lines of glowing white light.` |
| `a4-alpha` | `Object: the Greek letters Alpha and Omega carved in gleaming gold side by side, with a thin gold cross between them. (These two Greek letters are the only exception to the no-text rule.)` |
| `a4-crown` | `Object: a crown of thorns seen at a slight angle, a faint crimson glow behind it.` |
| `a4-eclipse` | `Object: a total solar eclipse: a black disc with a blazing orange-gold corona ring.` |
| `a4-veil` | `Object: a heavy crimson temple curtain torn from top to bottom down the middle, white light blazing through the tear.` |
| `a4-globe` | `Object: an antique hand-drawn globe of the world in sepia and gold.` |
| `a4-sun` | `Object: a glowing orange sun disc.` |

**Tomb-stone stages** (`a4-stone1`–`a4-stone4`). These replace the plain black background; keep them identical except for the stage:

```
Graphic blueprint style: a flat [COLOUR] background covered with a faint white technical grid. Exactly centred: a dark circular tomb opening, with a round carved stone disc [POSITION]. Small white monospace label "STAGE 0[N]" centred near the bottom (the only text allowed).
```

| File | `[COLOUR]` | `[POSITION]` | N |
|---|---|---|---|
| `a4-stone1` | emerald green | completely covering the opening | 1 |
| `a4-stone2` | crimson red | rolled a quarter to the right, a sliver of gold light showing | 2 |
| `a4-stone3` | royal blue | rolled halfway to the right, half the opening glowing gold | 3 |
| `a4-stone4` | amber gold | rolled almost fully aside, the opening blazing with light | 4 |

## Act 6 · Miracles & Tomb

**`a6-hands`**:
```
Two human hands in fine black-and-white stipple-engraving style, one reaching down from the top of the frame and one reaching up from the bottom, fingertips almost touching exactly at the centre, a small spark of light between them. Dark background.
```

**`a6-storm`**:
```
Dark storm clouds splitting apart down the middle, revealing a vertical band of warm golden light exactly in the centre of the frame, as if the storm is being commanded to part.
```

**`a6-vortex`**:
```
A huge swirling spiral vortex of storm clouds seen from above, grey and white bands spiralling inward to the exact centre, where a tiny human figure with outstretched arms floats. Monochrome, dramatic.
```

**`a6-sinking`**:
```
Top-down view of dark blue-green water: concentric ripples spreading from the exact centre, where a man in a robe is sinking with one arm raised toward the light above. Underwater light shafts.
```

**`a6-lamb`**:
```
A single white lamb standing on a dark hilltop at dusk, exactly centred, soft rim light on its wool, overcast grey-blue sky, quiet and pure.
```

**`a6-warp`**:
```
A burst of streaking light: hundreds of white and gold light trails rushing outward from a bright glowing point at the exact centre, like travelling at light speed through stars.
```

**`a6-reach`**:
```
POV underwater looking up: a drowning man's hand reaching up from the bottom of the frame toward a strong hand reaching down through the bright water surface from above, meeting near the centre. Teal water, brilliant light breaking through the surface.
```

**`a6-dove`**:
```
A white dove descending with wings spread, exactly centred, inside a vertical column of soft white light, on a pale misty background. Graceful, peaceful.
```

---

## Checklist before you drop an image in

- [ ] Subject exactly centred (match cuts depend on it)
- [ ] No text, borders, frames or watermark (except Alpha and Omega and the STAGE labels)
- [ ] Left and right 10% free of important detail
- [ ] Saved as `<shot-id>.png`, `.jpg` or `.webp` in `public/shots/` (landscape copies optional in `public/shots-wide/`)
- [ ] Act 7: pupil centre lines up with the previous eye (flip between them, there should be no jump)
