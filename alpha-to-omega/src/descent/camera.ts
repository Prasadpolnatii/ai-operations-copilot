/**
 * ABOVE EVERY NAME — one unbroken camera move (no cuts).
 *
 * The camera position `u` is measured in "worlds": u=0 is Heaven's centre,
 * u=5 is the sealed tomb. Every visual layer AND the audio script read this
 * file, so re-timing the camera moves picture and sound together.
 *
 * Pure TS (no Remotion imports) so `scripts/make-descent-score.mjs` can import it.
 */

export const FPS = 30;
export const TOTAL = 450; // 15 s
/** vertical distance between world centres, in art units (short side = 1000) */
export const D = 1900;

export const WORLDS = ["heaven", "bethlehem", "galilee", "gethsemane", "calvary", "tomb"] as const;
export type WorldKey = (typeof WORLDS)[number];

/** Story beats (frames). */
export const T = {
  descentEnd: 320, // settle in the tomb
  rumbleStart: 330, // stone grinds, camera shakes
  silenceStart: 352, // 0.4 s of total silence + darkness
  crack: 364, // light splits the stone, choir hits
  ascentStart: 368, // shoot straight up
  ascentEnd: 408, // arrive at dawn
  titleIn: 418,
} as const;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Camera position in worlds (before the "linger" warp). */
export const worldU = (f: number): number => {
  if (f <= 270) return lerp(-0.2, 4.55, f / 270); // steady glide down
  if (f <= T.descentEnd) return 4.55 + 0.45 * easeOutQuad((f - 270) / 50); // settle into the tomb (velocity-matched)
  if (f < T.ascentStart) return 5 + 0.004 * ((f - T.descentEnd) / (T.ascentStart - T.descentEnd)); // held breath
  if (f <= T.ascentEnd) return lerp(5.004, -0.12, easeInOutCubic((f - T.ascentStart) / (T.ascentEnd - T.ascentStart))); // ascent
  return -0.12 + 0.07 * easeOutQuad(clamp01((f - T.ascentEnd) / (TOTAL - T.ascentEnd))); // dawn drift
};

/**
 * Linger warp: speed dips to 35% at every world centre and peaks between
 * them, so each world reads without the camera ever stopping.
 */
const LINGER = 0.65;
export const warp = (u: number) => u - (LINGER * Math.sin(2 * Math.PI * u)) / (2 * Math.PI);

/** Camera Y in art units. */
export const camY = (f: number) => D * warp(worldU(f));
/** Units per frame (signed; negative = moving up). Drives motion blur. */
export const camVel = (f: number) => camY(f) - camY(f - 1);
/** Which world centre the camera is nearest, and how far (0..0.5) */
export const nearestWorld = (f: number) => {
  const u = warp(worldU(f));
  const i = Math.max(0, Math.min(WORLDS.length - 1, Math.round(u)));
  return { i, key: WORLDS[i], dist: Math.abs(u - i) };
};

/** First descent frame whose (warped) position reaches world index `u`. For audio cue placement. */
export const frameAtWorld = (u: number) => {
  for (let f = 0; f <= T.descentEnd; f++) if (warp(worldU(f)) >= u) return f;
  return T.descentEnd;
};
