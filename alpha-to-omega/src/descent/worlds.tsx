import React from "react";
import { random } from "remotion";
import { CloudLayer, Cross, Figure, Mist, Orb, wavePath } from "../art/common";
import type { WorldKey } from "./camera";

/**
 * Each world is a stack of depth layers drawn in world-local coordinates
 * (origin = world centre, short side of the frame = 1000 units).
 * z < 1 = far (moves slower than the camera), z = 1 = subject plane,
 * z > 1 = foreground (moves faster, gets depth-of-field blur).
 */
export type Layer = { key: string; z: number; dof?: "far" | "near"; el: React.ReactNode };
export type WorldCtx = {
  f: number;
  vw: number;
  vh: number;
  /** 0..1 — dawn grade on Heaven during the ascent/arrival */
  dawn: number;
  /** 0..1 — light splitting the tomb stone */
  crack: number;
};

/** [top, bottom] sky colours per world (dawn variant for Heaven). */
export const PALETTE: Record<WorldKey | "dawn", [string, string]> = {
  heaven: ["#fbf4e6", "#e8d2a6"],
  bethlehem: ["#040a1c", "#172649"],
  galilee: ["#03121a", "#0b3542"],
  gethsemane: ["#030806", "#0f1e16"],
  calvary: ["#110203", "#5b0c11"],
  tomb: ["#020303", "#090c0c"],
  dawn: ["#ffe0a6", "#f0894a"],
};

/** Scripture (Philippians 2:6–9, KJV — public domain), one phrase per world. */
export const CAPTIONS: Record<WorldKey, string> = {
  heaven: "Who, being in the form of God,",
  bethlehem: "was made in the likeness of men",
  galilee: "and took upon him the form of a servant",
  gethsemane: "he humbled himself",
  calvary: "obedient unto death, even the death of the cross",
  tomb: "",
};

const caption = (text: string, color: string, y = 560): Layer => ({
  key: "caption",
  z: 1,
  el: (
    <text
      y={y}
      textAnchor="middle"
      fontFamily="Cormorant Garamond, serif"
      fontStyle="italic"
      fontWeight={500}
      fontSize={text.length > 34 ? 54 : 66}
      fill={color}
      letterSpacing={0.5}
    >
      {text}
    </text>
  ),
});

const transitionMist = (id: string, f: number, vw: number, color: string, opacity = 0.85): Layer => ({
  key: `mist-${id}`,
  z: 1.3,
  dof: "near",
  el: <Mist id={`tm-${id}`} y={950} vw={vw} h={520} f={f * 0.15} color={color} opacity={opacity} />,
});

/* ───────────────────────── helpers ───────────────────────── */

const OliveTree: React.FC<{ x: number; y: number; s: number; seed: string; fill: string; moon: string }> = ({ x, y, s, seed, fill, moon }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -26 0 C -44 -80 12 -140 -14 -220 C -26 -262 22 -300 -4 -350 L 16 -352 C 40 -292 14 -252 28 -210 C 48 -150 4 -80 30 0 Z"
      fill={fill}
    />
    <path d="M 0 -230 C -60 -260 -120 -270 -170 -320 M 10 -280 C 60 -300 110 -330 150 -380 M 4 -320 C -10 -360 -30 -400 -20 -440" stroke={fill} strokeWidth={14} fill="none" strokeLinecap="round" />
    {Array.from({ length: 46 }, (_, i) => {
      const a = random(`${seed}a${i}`) * Math.PI * 2;
      const rr = Math.sqrt(random(`${seed}r${i}`));
      const cx = Math.cos(a) * rr * 250;
      const cy = -390 + Math.sin(a) * rr * 120;
      return (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx={34 + random(`${seed}w${i}`) * 34} ry={18 + random(`${seed}h${i}`) * 14} fill={fill} transform={`rotate(${(random(`${seed}t${i}`) - 0.5) * 40} ${cx} ${cy})`} />
          {i % 3 === 0 ? <ellipse cx={cx - 8} cy={cy - 8} rx={16} ry={5} fill={moon} opacity={0.18} /> : null}
        </g>
      );
    })}
  </g>
);

/** Kneeling, praying figure facing right; ground at y = 0. */
const Kneeling: React.FC<{ x: number; y: number; s: number; rim: string }> = ({ x, y, s, rim }) => {
  const body =
    "M 6 -205 C 40 -200 58 -180 66 -160 L 116 -152 L 122 -136 L 70 -126 C 64 -100 58 -80 70 -50 L 110 -10 L 104 0 L -110 0 C -112 -30 -96 -52 -70 -70 C -52 -100 -40 -160 -24 -190 C -14 -202 -4 -206 6 -205 Z";
  const head = "M 6 -258 Q 12 -286 36 -282 Q 60 -276 58 -248 Q 56 -222 34 -216 Q 14 -214 6 -230 Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g filter="url(#blur-l)" opacity={0.6}>
        <path d={body} fill={rim} />
        <path d={head} fill={rim} />
      </g>
      <g filter="url(#blur-s)">
        <path d={body} fill="none" stroke={rim} strokeWidth={8} />
        <path d={head} fill="none" stroke={rim} strokeWidth={8} />
      </g>
      <g filter="url(#paint)" fill="#050806">
        <path d={body} />
        <path d={head} />
      </g>
      <path d="M 96 0 C 100 -60 118 -118 166 -126 C 226 -132 266 -80 276 0 Z" fill="#070a08" />
    </g>
  );
};

const stars = (seed: string, n: number, vw: number) =>
  Array.from({ length: n }, (_, i) => (
    <circle
      key={i}
      cx={(random(`${seed}x${i}`) - 0.5) * vw * 1.3}
      cy={-950 + random(`${seed}y${i}`) * 1250}
      r={1.2 + random(`${seed}r${i}`) * 2.8}
      fill="#fff"
      opacity={0.35 + random(`${seed}o${i}`) * 0.6}
    />
  ));

/* ───────────────────────── worlds ───────────────────────── */

const heaven = ({ f, vw, dawn }: WorldCtx): Layer[] => {
  const warm = (a: string, b: string) => (dawn > 0.5 ? b : a);
  return [
    {
      key: "rays",
      z: 0.35,
      dof: "far",
      el: (
        <g>
          <Orb r={620} y={-760} color={dawn > 0.5 ? "gold" : "white"} opacity={0.95} />
          <circle cy={-760} r={120} fill="#fffdf6" filter="url(#glow-l)" opacity={1 - dawn} />
          <g opacity={0.22 + dawn * 0.2} filter="url(#blur-m)">
            {Array.from({ length: 16 }, (_, i) => (
              <polygon key={i} points="-14,0 14,0 110,2100 -110,2100" fill={warm("#ffffff", "#ffe2a0")} transform={`translate(0 -760) rotate(${(i - 7.5) * 10 + Math.sin(f / 40) * 2})`} />
            ))}
          </g>
          {dawn > 0 ? (
            <g opacity={dawn}>
              <circle cx={0} cy={-600 + (1 - dawn) * 160} r={150} fill="#fff4d2" filter="url(#glow-l)" />
              <Orb r={560} y={-600} color="gold" />
            </g>
          ) : null}
        </g>
      ),
    },
    {
      key: "cloud-far",
      z: 0.55,
      el: <CloudLayer id={`hv-far-${dawn > 0.5 ? "d" : "n"}`} x={0} y={-120} w={1700} h={900} fill={warm("#b9a789", "#c97a3e")} hi="#fffaf0" seed={5} density={0.52} light={1} azimuth={90} elevation={22} />,
    },
    {
      key: "cloud-mid",
      z: 0.85,
      el: <CloudLayer id={`hv-mid-${dawn > 0.5 ? "d" : "n"}`} x={0} y={480} w={1800} h={760} fill={warm("#a8946f", "#b05f2c")} hi="#fffaf0" seed={9} density={0.64} light={1} azimuth={90} elevation={20} />,
    },
    ...(dawn > 0 ? [] : [caption(CAPTIONS.heaven, "#3a2a18", 300)]),
    transitionMist("heaven", f, vw, "#cfc5b6", 0.9),
  ];
};

const bethlehem = ({ f, vw }: WorldCtx): Layer[] => [
  { key: "stars", z: 0.25, dof: "far", el: <g>{stars("bt", 90, vw)}</g> },
  {
    key: "star",
    z: 0.35,
    el: (
      <g transform="translate(0 -430)">
        <Orb r={260} opacity={0.55} />
        <g filter="url(#glow-l)" fill="#fff">
          <path d="M0 -260 L10 -10 L150 0 L10 10 L0 320 L-10 10 L-150 0 L-10 -10 Z" />
        </g>
        <line x1={0} y1={30} x2={0} y2={560} stroke="#fff6dc" strokeOpacity={0.25} strokeWidth={30} filter="url(#blur-m)" />
      </g>
    ),
  },
  {
    key: "hills-far",
    z: 0.6,
    el: <path d={`M ${-vw} 900 L ${-vw} 230 Q -300 120 0 210 Q 300 290 ${vw} 160 L ${vw} 900 Z`} fill="#0d1836" mask="url(#fb)" />,
  },
  {
    key: "town",
    z: 0.85,
    el: (
      <g>
        <path d={`M ${-vw} 900 L ${-vw} 360 Q -200 270 0 330 Q 250 390 ${vw} 300 L ${vw} 900 Z`} fill="#060b1a" mask="url(#fb)" />
        {Array.from({ length: 16 }, (_, i) => {
          const x = -560 + i * 72 + (random(`hx${i}`) - 0.5) * 20;
          if (Math.abs(x) < 110) return null;
          const h = 60 + random(`hh${i}`) * 70;
          const w = 56 + random(`hw${i}`) * 30;
          const base = 330 + Math.abs(x) * -0.05 + (x > 0 ? -20 : 0);
          return (
            <g key={i}>
              <rect x={x} y={base - h} width={w} height={h + 40} fill="#060b1a" />
              {random(`hl${i}`) > 0.45 ? <rect x={x + w * 0.35} y={base - h * 0.6} width={10} height={14} fill="#f6c56b" opacity={0.85} /> : null}
            </g>
          );
        })}
        {/* the stable, centred under the star */}
        <polygon points="0,170 -120,250 120,250" fill="#060b1a" />
        <rect x={-100} y={248} width={200} height={140} fill="#060b1a" />
        <path d="M -42 388 L -42 300 Q 0 268 42 300 L 42 388 Z" fill="#f6c56b" filter="url(#glow-s)" />
        <Orb r={170} y={330} color="gold" opacity={0.6} />
      </g>
    ),
  },
  caption(CAPTIONS.bethlehem, "#e9e4d6"),
  {
    key: "fireflies",
    z: 1.15,
    el: (
      <g>
        {Array.from({ length: 26 }, (_, i) => (
          <circle
            key={i}
            cx={(random(`ff${i}`) - 0.5) * vw + Math.sin(f / 9 + i) * 12}
            cy={380 + random(`fy${i}`) * 420 + Math.cos(f / 11 + i) * 10}
            r={3}
            fill="#ffd98a"
            opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 7 + i * 1.7))}
            filter="url(#glow-s)"
          />
        ))}
      </g>
    ),
  },
  {
    key: "foreground",
    z: 1.45,
    dof: "near",
    el: <path d={`M ${-vw} 1000 L ${-vw} 640 Q -350 560 -120 700 Q 120 820 ${vw} 600 L ${vw} 1000 Z`} fill="#02040a" mask="url(#fb)" />,
  },
  transitionMist("bethlehem", f, vw, "#1f3352", 0.75),
];

const galilee = ({ f, vw, vh }: WorldCtx): Layer[] => [
  {
    key: "moon",
    z: 0.3,
    dof: "far",
    el: (
      <g>
        <Orb r={420} x={190} y={-520} opacity={0.4} />
        <circle cx={190} cy={-520} r={80} fill="#eef6f8" filter="url(#glow-s)" />
      </g>
    ),
  },
  {
    key: "clouds",
    z: 0.45,
    el: <CloudLayer id="gl-cl" x={0} y={-430} w={1800} h={700} fill="#0b2430" hi="#9cc4d2" seed={21} density={0.55} light={0.6} />,
  },
  { key: "shore", z: 0.6, el: <path d={`M ${-vw} -40 Q -400 -110 -160 -70 Q 120 -30 ${vw} -100 L ${vw} -20 L ${-vw} -20 Z`} fill="#03111a" /> },
  {
    key: "sea",
    z: 0.85,
    el: (
      <g>
        <g mask="url(#fb)">
          <rect x={-vw} y={-30} width={vw * 2} height={1000} fill="#05202b" />
          <path d={wavePath(vw * 1.2, vh, 40, 14, 260, f * 0.12)} fill="#082b38" />
          <path d={wavePath(vw * 1.2, vh, 120, 22, 340, -f * 0.1)} fill="#06222d" />
        </g>
        {/* boat on the left */}
        <g transform={`translate(-300 70) rotate(${Math.sin(f / 12) * 3})`}>
          <path d="M -110 0 L 110 0 L 80 40 L -80 40 Z" fill="#020a0e" />
          <rect x={-5} y={-190} width={8} height={190} fill="#020a0e" />
          <path d="M 4 -180 L 90 -20 L 4 -14 Z" fill="#1b3c47" />
        </g>
      </g>
    ),
  },
  {
    key: "figure",
    z: 1,
    el: (
      <g>
        <Orb r={260} y={-40} opacity={0.35} />
        <Figure variant="backlit" rim="#dff2ff" pose="stand" s={0.52} y={-70} />
        <ellipse cx={0} cy={92} rx={170} ry={14} fill="#dff4ff" opacity={0.35} filter="url(#blur-m)" />
      </g>
    ),
  },
  caption(CAPTIONS.galilee, "#dcecef"),
  {
    key: "swell",
    z: 1.45,
    dof: "near",
    el: (
      <g>
        <path d={wavePath(vw * 1.4, vh, 620, 60, 520, f * 0.18)} fill="#021219" mask="url(#fb)" />
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={i} cx={(random(`sp${i}`) - 0.5) * vw * 1.2} cy={560 + random(`sq${i}`) * 120 - ((f * 2 + i * 13) % 80)} r={2 + random(`sr${i}`) * 3} fill="#cfeaf2" opacity={0.5} />
        ))}
      </g>
    ),
  },
  transitionMist("galilee", f, vw, "#163a40", 0.8),
];

const gethsemane = ({ f, vw }: WorldCtx): Layer[] => [
  {
    key: "moon",
    z: 0.3,
    dof: "far",
    el: (
      <g>
        <Orb r={480} x={-220} y={-560} opacity={0.35} />
        <circle cx={-220} cy={-560} r={70} fill="#f0f4e8" filter="url(#glow-s)" />
      </g>
    ),
  },
  {
    key: "city",
    z: 0.5,
    el: (
      <path
        d={`M ${-vw} 0 L ${-vw} -180 ${Array.from({ length: 30 }, (_, i) => {
          const x = -vw + i * (vw / 14);
          const h = i % 2 ? -180 : -205;
          return `L ${x.toFixed(0)} ${h} L ${(x + vw / 28).toFixed(0)} ${h}`;
        }).join(" ")} L ${vw} -180 L ${vw} 0 Z`}
        fill="#0b1712"
      />
    ),
  },
  {
    key: "olives",
    z: 0.85,
    el: (
      <g>
        <rect x={-vw} y={0} width={vw * 2} height={900} fill="#040805" mask="url(#fb)" />
        <OliveTree x={-330} y={320} s={1.05} seed="o1" fill="#030504" moon="#c8d8c0" />
        <OliveTree x={360} y={300} s={0.95} seed="o2" fill="#030504" moon="#c8d8c0" />
        <OliveTree x={20} y={170} s={0.7} seed="o3" fill="#081009" moon="#c8d8c0" />
      </g>
    ),
  },
  { key: "garden-mist", z: 0.95, el: <Mist id="gt-low" y={330} vw={vw} h={260} f={f * 0.15} color="#8fa596" opacity={0.45} /> },
  { key: "kneeling", z: 1, el: <Kneeling x={-40} y={360} s={0.8} rim="#d9e6d6" /> },
  caption(CAPTIONS.gethsemane, "#e3ebdf"),
  {
    key: "branch",
    z: 1.6,
    dof: "near",
    el: (
      <g transform="translate(-560 -760) rotate(14)">
        <path d="M 0 0 C 160 10 330 80 470 200 C 520 240 560 300 590 360" stroke="#010201" strokeWidth={20} fill="none" strokeLinecap="round" />
        <path d="M 230 50 C 290 0 340 -20 400 -30" stroke="#010201" strokeWidth={10} fill="none" strokeLinecap="round" />
        {Array.from({ length: 34 }, (_, i) => {
          const tt = i / 33;
          const x = 20 + tt * 560 + (random(`lfx${i}`) - 0.5) * 30;
          const y = 4 + tt * tt * 330 + (random(`lfy${i}`) - 0.5) * 24;
          const ang = (i % 2 ? -1 : 1) * (25 + random(`lfa${i}`) * 35) + tt * 30;
          const L = 34 + random(`lfl${i}`) * 26;
          return <ellipse key={i} cx={x} cy={y} rx={L} ry={7 + random(`lfw${i}`) * 5} fill="#010201" transform={`rotate(${ang} ${x} ${y}) translate(${L * 0.8} 0)`} />;
        })}
      </g>
    ),
  },
  transitionMist("gethsemane", f, vw, "#2a1310", 0.8),
];

const calvary = ({ f, vw }: WorldCtx): Layer[] => [
  {
    key: "storm",
    z: 0.3,
    el: <CloudLayer id="cv-cl" x={0} y={-330} w={1900} h={1300} fill="#3a0608" hi="#ff8a5a" seed={33} density={0.62} light={0.7} />,
  },
  {
    key: "eclipse",
    z: 0.35,
    dof: "far",
    el: (
      <g transform="translate(0 -560)">
        <circle r={150} fill="#ff6a2a" filter="url(#glow-l)" />
        <circle r={142} cx={8} fill="#050101" />
      </g>
    ),
  },
  {
    key: "hill",
    z: 0.85,
    el: (
      <g>
        <path d={`M ${-vw} 900 L ${-vw} 330 Q 0 60 ${vw} 330 L ${vw} 900 Z`} fill="#050101" mask="url(#fb)" />
        <Cross x={-250} y={130} h={300} />
        <Cross x={0} y={-30} h={470} />
        <Cross x={250} y={130} h={300} />
      </g>
    ),
  },
  caption(CAPTIONS.calvary, "#f2d9cf"),
  {
    key: "embers",
    z: 1.25,
    el: (
      <g>
        {Array.from({ length: 50 }, (_, i) => {
          const y = 700 - ((f * (2 + random(`es${i}`) * 3) + random(`ey${i}`) * 1500) % 1500);
          return (
            <circle key={i} cx={(random(`ex${i}`) - 0.5) * vw * 1.2 + Math.sin(f / 10 + i) * 18} cy={y} r={2 + random(`er${i}`) * 3} fill="#ffb060" opacity={0.75} filter="url(#glow-s)" />
          );
        })}
      </g>
    ),
  },
  {
    key: "brush",
    z: 1.5,
    dof: "near",
    el: (
      <g stroke="#020000" strokeWidth={8} strokeLinecap="round">
        {Array.from({ length: 40 }, (_, i) => {
          const x = (random(`bx${i}`) - 0.5) * vw * 1.4;
          const h = 120 + random(`bh${i}`) * 260;
          return <line key={i} x1={x} y1={900} x2={x + (random(`bl${i}`) - 0.5) * 140} y2={900 - h} />;
        })}

      </g>
    ),
  },
  transitionMist("calvary", f, vw, "#0d0808", 0.9),
];

const tomb = ({ f, vw, crack }: WorldCtx): Layer[] => [
  {
    key: "rock",
    z: 0.5,
    el: (
      <g>
        <defs>
          <filter id="rock-tex" x="0" y="0" width="1" height="1">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves={5} seed={4} result="n" />
            <feDiffuseLighting in="n" surfaceScale="7" lightingColor="#232a2b" result="l">
              <feDistantLight azimuth={260} elevation={38} />
            </feDiffuseLighting>
            <feComposite in="l" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <rect x={-vw} y={-1100} width={vw * 2} height={2200} fill="#111" filter="url(#rock-tex)" mask="url(#fy)" />
      </g>
    ),
  },
  {
    key: "chamber",
    z: 0.85,
    el: (
      <g>
        <path d="M -300 600 L -300 -120 A 300 300 0 0 1 300 -120 L 300 600 Z" fill="#020303" />
        <Orb r={360 + crack * 600} color="gold" opacity={0.15 + crack * 0.85} />
        {/* faint light seeping around the seal — hope before the break */}
        <circle cx={crack * 40} cy={40} r={262} fill="none" stroke="#f6c56b" strokeWidth={10} opacity={0.18 + Math.abs(Math.sin(f / 9)) * 0.12 + crack * 0.7} filter="url(#glow-l)" />
        <g transform={`translate(${crack * 40} 40)`}>
          <circle r={250} fill="#1b1f1f" stroke="#070909" strokeWidth={14} />
          <circle r={250} fill="#111" filter="url(#rock-tex)" opacity={0.9} />
        </g>
      </g>
    ),
  },
  ...(crack > 0
    ? [
        {
          key: "crack",
          z: 1,
          el: (
            <g filter="url(#glow-l)">
              <path
                d="M 4 -210 L -10 -120 L 12 -40 L -8 40 L 14 130 L 0 210"
                stroke="#fff3c8"
                strokeWidth={4 + crack * 26}
                fill="none"
                transform={`scale(1 ${0.3 + crack * 0.7}) translate(0 40)`}
              />
            </g>
          ),
        } as Layer,
      ]
    : []),
  {
    key: "dust",
    z: 1.2,
    el: (
      <g>
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={(random(`td${i}`) - 0.5) * vw + Math.sin(f / 20 + i) * 20} cy={(random(`tdy${i}`) - 0.5) * 1400 + Math.cos(f / 25 + i) * 20} r={1.5 + random(`tdr${i}`) * 2} fill="#b9c4c2" opacity={0.25} />
        ))}
      </g>
    ),
  },
  {
    key: "edges",
    z: 1.5,
    dof: "near",
    el: (
      <g fill="#010101">
        <path d={`M ${-vw} -1000 L -380 -900 L -420 -500 L -360 -100 L -440 300 L -380 700 L -420 1000 L ${-vw} 1000 Z`} />
        <path d={`M ${vw} -1000 L 400 -880 L 360 -420 L 430 0 L 370 420 L 420 1000 L ${vw} 1000 Z`} />
      </g>
    ),
  },
];

export const WORLD_LAYERS: Record<WorldKey, (ctx: WorldCtx) => Layer[]> = {
  heaven,
  bethlehem,
  galilee,
  gethsemane,
  calvary,
  tomb,
};
