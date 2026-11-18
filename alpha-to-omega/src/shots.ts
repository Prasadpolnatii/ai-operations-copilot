/**
 * ALPHA TO OMEGA — master shot list.
 *
 * Every shot is data: change `d` (frames) to re-time, set `src` to a file in
 * `public/` (e.g. "shots/a2-baptism.jpg") to swap the procedural placeholder
 * for real footage/stills. Keep subjects dead-center so the match cuts hold.
 *
 * 30 fps · 359 frames · 11.97 s. The total is asserted at the bottom.
 */

export type ArtName =
  | "sliver" | "flash" | "beam" | "starBurst" | "manger" | "bloom" | "sunrise" | "figure"
  | "planks" | "crib" | "ripples" | "mast" | "loaves" | "arch" | "thorns" | "nails"
  | "golgotha" | "tomb" | "roseWindow"
  | "waterWalk"
  | "icon"
  | "lightning" | "threeCrosses" | "armsGold"
  | "hands" | "stormPart" | "vortex" | "sinking" | "lamb" | "warp" | "reachHand"
  | "doveDescend" | "tombInterior" | "stoneRoll" | "sunburst"
  | "eye"
  | "eruption" | "clouds" | "doves" | "wings" | "title";

export type Strobe = { at: number; d: number; mode: "invert" | "duo"; color?: string };

export type Shot = {
  id: string;
  act: number;
  /** duration in frames */
  d: number;
  art: ArtName;
  /** art parameters */
  p?: Record<string, string | number | boolean>;
  /** optional real asset in /public — replaces the procedural art */
  src?: string;
  fx?: {
    invert?: boolean;
    /** 1-frame duotone colour flash (inverted + tinted) */
    duo?: string;
    /** local frames that get glitch blocks */
    glitch?: number[];
    strobes?: Strobe[];
  };
  /** punch-in amount over the shot (default 0.05) */
  zoom?: number;
};

export const ACTS = [
  { act: 1, name: "Creation & Birth" },
  { act: 2, name: "The Cross Overlay" },
  { act: 3, name: "Walking on Water" },
  { act: 4, name: "Sacred Symbols" },
  { act: 5, name: "The Drop (Calvary)" },
  { act: 6, name: "Miracles & Tomb" },
  { act: 7, name: "Every Eye Will See" },
  { act: 8, name: "Ascension & Title" },
] as const;

const EYES: [number, string, string, number, boolean?][] = [
  // [frames, inner colour, outer colour, pupil scale, tear?]
  [2, "#c7742a", "#2f5f8a", 1.0],
  [2, "#8a4b1c", "#3b2412", 0.85],
  [3, "#d9a04a", "#6b8f4e", 1.1, true],
  [2, "#5aa0c8", "#1d3d66", 0.9],
  [2, "#b5401f", "#5a1a0d", 1.0],
  [3, "#e0a243", "#3f7fa6", 1.2],
  [2, "#86b7d6", "#27507a", 0.8],
  [3, "#c9822f", "#7a4a18", 1.0, true],
  [2, "#3f9aa8", "#16384a", 1.05],
  [2, "#d06a2a", "#2c5c86", 0.9],
  [3, "#9c5a24", "#2a160a", 1.15],
  [2, "#e7b252", "#c0441e", 0.85],
  [3, "#a8361c", "#3c0f08", 1.0, true],
  [2, "#4d8fc0", "#e08a3a", 0.75],
  [2, "#b9502a", "#6a1c10", 1.1],
  [3, "#6aa4c4", "#1a3550", 0.7],
  [2, "#e09640", "#245a80", 0.6],
  [2, "#c14a20", "#f0b54e", 0.5],
];

export const SHOTS: Shot[] = [
  // ── ACT 1 · Creation & Birth (F000–F038) ─────────────────────────────
  { id: "a1-sliver", act: 1, d: 2, art: "sliver" },
  { id: "a1-flash1", act: 1, d: 1, art: "flash", p: { color: "#ffffff" } },
  { id: "a1-beam", act: 1, d: 3, art: "beam" },
  { id: "a1-star", act: 1, d: 3, art: "starBurst" },
  { id: "a1-star-inv", act: 1, d: 1, art: "starBurst", fx: { invert: true } },
  { id: "a1-manger", act: 1, d: 3, art: "manger" },
  { id: "a1-olive", act: 1, d: 3, art: "bloom", p: { variant: "olive" } },
  { id: "a1-crimson", act: 1, d: 2, art: "bloom", p: { variant: "crimson" } },
  { id: "a1-thorn", act: 1, d: 3, art: "bloom", p: { variant: "thorn" } },
  { id: "a1-flash2", act: 1, d: 1, art: "flash", p: { color: "#f6c56b" } },
  { id: "a1-sunrise", act: 1, d: 3, art: "sunrise" },
  { id: "a1-walk1", act: 1, d: 3, art: "figure", p: { pose: "walk", x: -220, s: 0.55 } },
  { id: "a1-walk1-inv", act: 1, d: 1, art: "figure", p: { pose: "walk", x: -120, s: 0.6 }, fx: { invert: true } },
  { id: "a1-walk2", act: 1, d: 3, art: "figure", p: { pose: "walk", x: 0, s: 0.7 } },
  { id: "a1-walk2-duo", act: 1, d: 1, art: "figure", p: { pose: "walk", x: 0, s: 0.75 }, fx: { duo: "#e0782a" } },
  { id: "a1-stand", act: 1, d: 3, art: "figure", p: { pose: "stand", x: 0, s: 0.9 } },
  { id: "a1-flash3", act: 1, d: 1, art: "flash", p: { color: "#ffffff" } },
  { id: "a1-arms", act: 1, d: 2, art: "figure", p: { pose: "raised", x: 0, s: 0.95 } },

  // ── ACT 2 · The Cross Overlay (F039–F071) — strict 3f under a locked cross
  { id: "a2-planks", act: 2, d: 3, art: "planks" },
  { id: "a2-crib", act: 2, d: 3, art: "crib" },
  { id: "a2-baptism", act: 2, d: 3, art: "ripples" },
  { id: "a2-mast", act: 2, d: 3, art: "mast" },
  { id: "a2-loaves", act: 2, d: 3, art: "loaves" },
  { id: "a2-arch", act: 2, d: 3, art: "arch" },
  { id: "a2-thorns", act: 2, d: 3, art: "thorns" },
  { id: "a2-nails", act: 2, d: 3, art: "nails" },
  { id: "a2-golgotha", act: 2, d: 3, art: "golgotha" },
  { id: "a2-tomb", act: 2, d: 3, art: "tomb" },
  { id: "a2-rose", act: 2, d: 3, art: "roseWindow" },

  // ── ACT 3 · Walking on Water (F072–F100) — 29f hold + off-beat strobes
  {
    id: "a3-water", act: 3, d: 29, art: "waterWalk", zoom: 0.12,
    fx: {
      strobes: [
        { at: 6, d: 2, mode: "duo", color: "#f6c56b" },
        { at: 10, d: 2, mode: "duo", color: "#c8102e" },
        { at: 14, d: 1, mode: "invert" },
      ],
    },
  },

  // ── ACT 4 · Sacred Symbols (F101–F147) — 15 dead-center icons × 3f + 2 × 1f
  { id: "a4-star", act: 4, d: 3, art: "icon", p: { name: "star" } },
  { id: "a4-dove", act: 4, d: 3, art: "icon", p: { name: "dove" } },
  { id: "a4-bread", act: 4, d: 3, art: "icon", p: { name: "bread" } },
  { id: "a4-chalice", act: 4, d: 3, art: "icon", p: { name: "chalice" } },
  { id: "a4-coins", act: 4, d: 3, art: "icon", p: { name: "coins" } },
  { id: "a4-lamp", act: 4, d: 3, art: "icon", p: { name: "lamp" } },
  { id: "a4-ichthys", act: 4, d: 3, art: "icon", p: { name: "ichthys" } },
  { id: "a4-alpha", act: 4, d: 3, art: "icon", p: { name: "alphaOmega" } },
  { id: "a4-crown", act: 4, d: 3, art: "icon", p: { name: "crown" } },
  { id: "a4-eclipse", act: 4, d: 3, art: "icon", p: { name: "eclipse" } },
  { id: "a4-veil", act: 4, d: 3, art: "icon", p: { name: "veil" } },
  { id: "a4-stone1", act: 4, d: 3, art: "icon", p: { name: "stone", stage: 1, plate: "#1f7a4d" } },
  { id: "a4-stone2", act: 4, d: 3, art: "icon", p: { name: "stone", stage: 2, plate: "#b3122e" } },
  { id: "a4-stone3", act: 4, d: 3, art: "icon", p: { name: "stone", stage: 3, plate: "#2438a8" } },
  { id: "a4-stone4", act: 4, d: 3, art: "icon", p: { name: "stone", stage: 4, plate: "#c98a2b" } },
  { id: "a4-globe", act: 4, d: 1, art: "icon", p: { name: "globe" } },
  { id: "a4-sun", act: 4, d: 1, art: "icon", p: { name: "sun" } },

  // ── ACT 5 · The Drop (F148–F189) — 5× slower on the music drop
  { id: "a5-lightning", act: 5, d: 13, art: "lightning", zoom: 0.08 },
  { id: "a5-crosses", act: 5, d: 19, art: "threeCrosses", zoom: 0.14 },
  { id: "a5-arms", act: 5, d: 10, art: "armsGold", zoom: 0.08 },

  // ── ACT 6 · Miracles & Tomb (F190–F264) — mid-tempo 4–14f
  { id: "a6-hands", act: 6, d: 5, art: "hands", fx: { glitch: [1, 2] } },
  { id: "a6-storm", act: 6, d: 4, art: "stormPart", fx: { glitch: [1] } },
  { id: "a6-vortex", act: 6, d: 4, art: "vortex", fx: { glitch: [1, 2] } },
  { id: "a6-sinking", act: 6, d: 6, art: "sinking" },
  { id: "a6-lamb", act: 6, d: 5, art: "lamb" },
  { id: "a6-warp", act: 6, d: 8, art: "warp", zoom: 0.15 },
  { id: "a6-reach", act: 6, d: 7, art: "reachHand" },
  { id: "a6-dove", act: 6, d: 7, art: "doveDescend" },
  { id: "a6-tomb-in", act: 6, d: 14, art: "tombInterior", zoom: 0.1 },
  { id: "a6-stone", act: 6, d: 7, art: "stoneRoll" },
  { id: "a6-sunburst", act: 6, d: 8, art: "sunburst", zoom: 0.12 },

  // ── ACT 7 · "Every Eye Will See" (F265–F306) — 18 pupil-locked irises
  ...EYES.map(([d, a, b, pupil, tear], i): Shot => ({
    id: `a7-eye${String(i + 1).padStart(2, "0")}`,
    act: 7,
    d,
    art: "eye",
    p: { a, b, pupil, tear: !!tear, seed: i },
    zoom: 0.03,
  })),

  // ── ACT 8 · Ascension & Title (F307–F358)
  { id: "a8-eruption", act: 8, d: 5, art: "eruption" },
  { id: "a8-clouds", act: 8, d: 9, art: "clouds" },
  { id: "a8-doves", act: 8, d: 14, art: "doves", zoom: 0.06 },
  { id: "a8-wings", act: 8, d: 8, art: "wings" },
  { id: "a8-title", act: 8, d: 16, art: "title", p: { line1: "HE IS", line2: "RISEN" }, zoom: 0.04 },
];

export const TOTAL_FRAMES = SHOTS.reduce((s, x) => s + x.d, 0);

/** start frame of every shot on the master timeline */
export const SHOT_STARTS = SHOTS.reduce<number[]>(
  (acc, s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + SHOTS[i - 1].d],
  [],
);

export const actRange = (act: number) => {
  const idx = SHOTS.map((s, i) => (s.act === act ? i : -1)).filter((i) => i >= 0);
  const from = SHOT_STARTS[idx[0]];
  const last = idx[idx.length - 1];
  return { from, durationInFrames: SHOT_STARTS[last] + SHOTS[last].d - from };
};

if (TOTAL_FRAMES !== 359) {
  // Not fatal — the composition length follows the data — but the concept is 359f.
  console.warn(`[alpha-to-omega] shot list is ${TOTAL_FRAMES} frames (concept: 359)`);
}
