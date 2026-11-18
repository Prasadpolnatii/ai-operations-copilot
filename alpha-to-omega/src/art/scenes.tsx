import React from "react";
import { interpolate, random } from "remotion";
import {
  ArtProps,
  Bg,
  C,
  CloudMass,
  Cross,
  Dove,
  Figure,
  Hand,
  Orb,
  SkyBg,
  ThornRing,
  wavePath,
} from "./common";

type Art = React.FC<ArtProps>;
const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

/* ───────────────────────── ACT 1 ───────────────────────── */

export const Sliver: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#000" />
    <g filter="url(#glow-l)">
      <line x1={-lerp(t, 40, 420)} x2={lerp(t, 40, 420)} y1={0} y2={0} stroke="#fff" strokeWidth={4} />
    </g>
    <Orb r={lerp(t, 40, 160)} opacity={0.6} />
  </>
);

export const Flash: Art = ({ vw, vh, p }) => <Bg vw={vw} vh={vh} fill={String(p.color ?? "#fff")} />;

export const Beam: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#020304" />
    <defs>
      <linearGradient id="beam-g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity={1} />
        <stop offset="1" stopColor="#fff" stopOpacity={0.05} />
      </linearGradient>
    </defs>
    <polygon
      points={`-30,${-vh / 2 - 50} 30,${-vh / 2 - 50} ${lerp(t, 160, 260)},${vh / 2} ${-lerp(t, 160, 260)},${vh / 2}`}
      fill="url(#beam-g)"
      filter="url(#blur-m)"
    />
    <rect x={-6} y={-vh / 2 - 50} width={12} height={vh + 100} fill="#fff" filter="url(#glow-s)" />
    <Orb r={lerp(t, 260, 420)} opacity={0.8} />
  </>
);

export const StarBurst: Art = ({ vw, vh, t }) => {
  const s = lerp(t, 0.75, 1.1);
  return (
    <>
      <Bg vw={vw} vh={vh} fill={C.navy} />
      <Orb r={700} color="teal" opacity={0.15} />
      <g transform={`scale(${s}) rotate(${t * 6})`}>
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i / 36) * 360;
          const len = 180 + random(`ray${i}`) * 420;
          return (
            <line key={i} x1={0} y1={0} x2={0} y2={-len} stroke="#fff" strokeOpacity={0.45} strokeWidth={3} transform={`rotate(${a})`} />
          );
        })}
        <g filter="url(#glow-l)" fill="#fff">
          <path d="M0 -620 L22 -22 L300 0 L22 22 L0 520 L-22 22 L-300 0 L-22 -22 Z" />
          <path d="M0 -180 L10 -10 L180 0 L10 10 L0 180 L-10 10 L-180 0 L-10 -10 Z" transform="rotate(45)" opacity={0.8} />
        </g>
        <Orb r={180} />
      </g>
      {Array.from({ length: 70 }, (_, i) => (
        <circle key={i} cx={(random(`sx${i}`) - 0.5) * vw} cy={(random(`sy${i}`) - 0.5) * vh} r={1.5 + random(`sr${i}`) * 3} fill="#fff" opacity={0.7} />
      ))}
    </>
  );
};

export const Manger: Art = ({ vw, vh, t }) => (
  <>
    <SkyBg vw={vw} vh={vh} id="manger-sky" stops={[[0, "#050a1c"], [0.6, "#14254a"], [1, "#2a1e2a"]]} />
    <g filter="url(#glow-l)">
      <path d="M0 -560 L8 -380 L0 -200 L-8 -380 Z" fill="#fff" />
    </g>
    <Orb y={-380} r={140} />
    <polygon points={`0,${lerp(t, 360, 380) - 600} -470,${-90} 470,${-90}`} fill="#000" />
    <rect x={-380} y={-100} width={760} height={vh} fill="#000" />
    <Orb y={90} r={lerp(t, 300, 380)} color="gold" />
    <path d="M-110 260 L-110 40 Q0 -60 110 40 L110 260 Z" fill={C.gold} filter="url(#glow-l)" />
    <Figure pose="stand" s={0.28} y={170} x={-40} fill="#000" glow={false} />
    <Figure pose="stand" s={0.24} y={180} x={50} fill="#000" glow={false} />
  </>
);

export const Bloom: Art = ({ vw, vh, t, p }) => {
  const v = String(p.variant);
  const pal =
    v === "olive"
      ? { bg: "#0d1610", petal: "#9db35a", edge: "#f6c56b", core: C.gold, n: 9 }
      : v === "crimson"
        ? { bg: "#140608", petal: "#c8102e", edge: "#ff7a5a", core: "#ffd27a", n: 7 }
        : { bg: "#0a0806", petal: "#3a2a1c", edge: "#8c5b33", core: "#c8102e", n: 13 };
  const open = lerp(t, 0.55, 1);
  return (
    <>
      <Bg vw={vw} vh={vh} fill={pal.bg} />
      <Orb r={520} color={v === "olive" ? "gold" : "crimson"} opacity={0.25} />
      {Array.from({ length: pal.n }, (_, i) => {
        const a = (i / pal.n) * 360 + t * 10;
        return (
          <g key={i} transform={`rotate(${a}) scale(${open})`}>
            {v === "thorn" ? (
              <path d="M -18 0 L 0 -520 L 18 0 Z" fill={pal.petal} stroke={pal.edge} strokeWidth={4} />
            ) : (
              <ellipse cx={0} cy={-230} rx={v === "olive" ? 62 : 120} ry={240} fill={pal.petal} stroke={pal.edge} strokeWidth={6} opacity={0.92} />
            )}
          </g>
        );
      })}
      <circle r={lerp(t, 70, 110)} fill={pal.core} filter="url(#glow-l)" />
    </>
  );
};

export const Sunrise: Art = ({ vw, vh, t }) => {
  const sy = lerp(t, 120, 40);
  return (
    <>
      <SkyBg vw={vw} vh={vh} id="sunrise-sky" stops={[[0, "#0c1b21"], [0.45, "#7a3b22"], [0.6, "#f0a24a"], [1, "#1a0e08"]]} />
      {Array.from({ length: 24 }, (_, i) => (
        <line key={i} x1={0} y1={sy} x2={0} y2={sy - 1400} stroke={C.gold} strokeOpacity={0.18} strokeWidth={30} transform={`rotate(${(i / 24) * 180 - 90} 0 ${sy})`} />
      ))}
      <circle cx={0} cy={sy} r={170} fill="#ffe2a0" filter="url(#glow-l)" />
      <rect x={-vw / 2 - 60} y={150} width={vw + 120} height={vh} fill="#0a0604" />
    </>
  );
};

export const FigureScene: Art = ({ vw, vh, t, p }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#050607" />
    <Orb r={620} opacity={0.12} />
    <Figure
      pose={(p.pose as "walk") ?? "stand"}
      x={Number(p.x ?? 0) + (p.pose === "walk" ? t * 40 : 0)}
      s={Number(p.s ?? 0.8)}
      y={40}
    />
  </>
);

/* ───────────────────────── ACT 2 (under the locked cross) ───────────────────────── */

export const Planks: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#3a2414" />
    {Array.from({ length: 16 }, (_, i) => {
      const y = -vh / 2 + i * (vh / 15);
      return (
        <g key={i}>
          <rect x={-vw / 2 - 60} y={y} width={vw + 120} height={vh / 15 - 6} fill={i % 2 ? "#5b3a1f" : "#6e4627"} />
          {Array.from({ length: 4 }, (_, k) => (
            <path
              key={k}
              d={`M ${-vw / 2} ${y + 14 + k * 18} Q 0 ${y + 4 + k * 18 + random(`pl${i}${k}`) * 20} ${vw / 2} ${y + 16 + k * 18}`}
              stroke="#2a180c"
              strokeOpacity={0.5}
              strokeWidth={3}
              fill="none"
            />
          ))}
        </g>
      );
    })}
    <rect x={-70} y={-vh / 2} width={140} height={vh} fill="#7a5130" stroke="#2a180c" strokeWidth={6} transform={`rotate(${lerp(t, -18, -14)})`} />
    <Orb r={500} color="gold" opacity={0.35} />
  </>
);

export const Crib: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#120a05" />
    <Orb r={lerp(t, 520, 620)} color="gold" />
    <Orb r={200} />
    <path d="M -320 60 L 320 60 L 250 260 L -250 260 Z" fill="#2a1608" />
    <path d="M -300 260 L -180 520 M 300 260 L 180 520 M -260 260 L -340 520 M 260 260 L 340 520" stroke="#2a1608" strokeWidth={34} />
    {Array.from({ length: 40 }, (_, i) => (
      <line key={i} x1={-300 + i * 15} y1={60} x2={-290 + i * 15 + (random(`hay${i}`) - 0.5) * 80} y2={-10 - random(`hh${i}`) * 50} stroke={C.gold} strokeWidth={4} />
    ))}
  </>
);

export const Ripples: Art = ({ vw, vh, t }) => (
  <>
    <SkyBg vw={vw} vh={vh} id="rip-bg" stops={[[0, "#05232c"], [1, "#0a3d4a"]]} />
    {Array.from({ length: 9 }, (_, i) => {
      const r = 60 + i * 110 + t * 110;
      return <ellipse key={i} rx={r} ry={r * 0.38} cy={140} fill="none" stroke="#bff3ff" strokeOpacity={1 - i / 9} strokeWidth={6} />;
    })}
    <rect x={-120} y={-vh / 2} width={240} height={vh / 2 + 140} fill="url(#rg-white)" opacity={0.5} filter="url(#blur-m)" />
    <Dove y={-420} s={0.9} flap={t} />
  </>
);

export const Mast: Art = ({ vw, vh, t, f }) => {
  const tilt = Math.sin(f * 0.9) * 6;
  return (
    <>
      <SkyBg vw={vw} vh={vh} id="mast-sky" stops={[[0, "#0a0f14"], [1, "#2b3a44"]]} />
      <CloudMass seed="mast" x={0} y={-vh / 3} w={vw * 1.3} h={400} fill="#3a4a55" />
      <g transform={`rotate(${tilt} 0 380)`}>
        <rect x={-10} y={-620} width={20} height={1000} fill="#0b0d0e" />
        <path d="M 15 -560 L 300 200 L 15 220 Z" fill="#c9c2ae" opacity={0.85} />
        <path d="M -380 320 L 380 320 L 290 470 L -290 470 Z" fill="#0b0d0e" />
      </g>
      <path d={wavePath(vw, vh, 400, 50, 420, f * 0.7 + t)} fill="#11202a" />
      <path d={wavePath(vw, vh, 470, 40, 300, -f * 0.8)} fill="#07131a" />
    </>
  );
};

export const Loaves: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#1a0f07" />
    <Orb r={600} color="gold" opacity={0.35} />
    {[0, 1, 2, 3, 4].map((i) => {
      const a = ((i - 2) * 30 - 90) * (Math.PI / 180);
      return (
        <g key={i} transform={`translate(${Math.cos(a) * 300} ${Math.sin(a) * 300 + 120}) scale(${lerp(t, 0.9, 1)})`}>
          <ellipse rx={110} ry={70} fill="#c98a4a" stroke="#6b3d14" strokeWidth={6} />
          <path d="M -60 -20 Q -40 -40 -20 -20 M -10 -24 Q 10 -44 30 -24 M 40 -20 Q 60 -40 80 -20" stroke="#6b3d14" strokeWidth={5} fill="none" />
        </g>
      );
    })}
    {[-1, 1].map((k) => (
      <path key={k} transform={`translate(${k * 120} 230) scale(${k} 1)`} d="M -110 0 Q 0 -70 90 0 L 140 -40 L 140 40 L 90 0 Q 0 70 -110 0 Z" fill="#9ab0b8" stroke="#3a4a50" strokeWidth={5} />
    ))}
  </>
);

export const Arch: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#b08a5a" />
    {Array.from({ length: 30 }, (_, i) => (
      <rect key={i} x={-vw / 2 + (i % 5) * (vw / 5)} y={-vh / 2 + Math.floor(i / 5) * (vh / 6)} width={vw / 5 - 8} height={vh / 6 - 8} fill="#c9a26e" opacity={0.5 + random(`st${i}`) * 0.4} />
    ))}
    <path d="M -260 600 L -260 -160 A 260 260 0 0 1 260 -160 L 260 600 Z" fill="#ffe7b0" />
    <path d="M -260 600 L -260 -160 A 260 260 0 0 1 260 -160 L 260 600 Z" fill="url(#rg-white)" />
    <path d="M -260 600 L -260 -160 A 260 260 0 0 1 260 -160 L 260 600" fill="none" stroke="#5a3d1c" strokeWidth={30} />
    <Orb r={lerp(t, 300, 360)} color="gold" />
  </>
);

export const Thorns: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#0a0303" />
    <Orb r={560} color="crimson" opacity={0.5} />
    <g transform={`scale(${lerp(t, 1.1, 1.2)}) rotate(${t * 4})`}>
      <ThornRing r={330} color="#1c0f08" />
    </g>
    {[0, 1, 2, 3].map((i) => (
      <ellipse key={i} cx={-160 + i * 110} cy={200 + i * 10} rx={10} ry={18} fill="#c8102e" />
    ))}
  </>
);

export const Nails: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#0b0b0c" />
    <Orb r={500} opacity={0.12} />
    {[-28, 0, 28].map((a, i) => (
      <g key={i} transform={`rotate(${a + 180}) translate(0 ${lerp(t, 40, 0)})`}>
        <path d="M -12 -40 L 12 -40 L 8 520 L 0 580 L -8 520 Z" fill="#6c6a66" stroke="#2a2a2a" strokeWidth={3} />
        <rect x={-42} y={-60} width={84} height={26} rx={6} fill="#4a4844" />
        <line x1={4} y1={-20} x2={2} y2={500} stroke="#e8e4da" strokeWidth={3} opacity={0.6} />
      </g>
    ))}
  </>
);

export const Golgotha: Art = ({ vw, vh, t }) => (
  <>
    <SkyBg vw={vw} vh={vh} id="gol-sky" stops={[[0, "#120808"], [0.6, "#5a1414"], [1, "#1a0606"]]} />
    <CloudMass seed="gol" x={0} y={-vh / 4} w={vw * 1.4} h={500} fill="#2a0c0c" />
    <path d={`M ${-vw / 2 - 60} ${vh / 2 + 60} Q 0 ${-20 - t * 10} ${vw / 2 + 60} ${vh / 2 + 60} Z`} fill="#060303" />
    <Cross x={-190} y={-40} h={240} />
    <Cross x={0} y={-150} h={320} />
    <Cross x={190} y={-40} h={240} />
  </>
);

export const Tomb: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#4a4640" />
    {Array.from({ length: 18 }, (_, i) => (
      <ellipse key={i} cx={(random(`tr${i}`) - 0.5) * vw} cy={(random(`tq${i}`) - 0.5) * vh} rx={120 + random(`tw${i}`) * 200} ry={60 + random(`th${i}`) * 120} fill="#2e2b27" opacity={0.5} />
    ))}
    <circle r={250} fill="#000" />
    <Orb r={lerp(t, 180, 240)} color="gold" />
    <g transform={`translate(${lerp(t, 360, 400)} 60)`}>
      <circle r={270} fill="#6b665e" stroke="#2a2724" strokeWidth={16} />
      <circle r={200} fill="none" stroke="#2a2724" strokeWidth={6} opacity={0.5} />
    </g>
  </>
);

export const RoseWindow: Art = ({ vw, vh, t }) => {
  const cols = ["#b3122e", "#2438a8", "#f6c56b", "#1f7a4d", "#7a2aa8", "#e0782a"];
  const rings = [
    [0, 110, 6],
    [110, 230, 12],
    [230, 360, 18],
    [360, 470, 24],
  ];
  return (
    <>
      <Bg vw={vw} vh={vh} fill="#050505" />
      <g transform={`rotate(${t * 6})`}>
        {rings.map(([r0, r1, n], ri) =>
          Array.from({ length: n }, (_, i) => {
            const a0 = (i / n) * Math.PI * 2;
            const a1 = ((i + 1) / n) * Math.PI * 2;
            const pt = (r: number, a: number) => `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
            return (
              <path
                key={`${ri}-${i}`}
                d={`M ${pt(r0, a0)} L ${pt(r1, a0)} A ${r1} ${r1} 0 0 1 ${pt(r1, a1)} L ${pt(r0, a1)} A ${r0} ${r0} 0 0 0 ${pt(r0, a0)} Z`}
                fill={cols[(i + ri * 2) % cols.length]}
                stroke="#0a0a0a"
                strokeWidth={10}
                opacity={0.9}
              />
            );
          }),
        )}
      </g>
      <Orb r={260} opacity={0.6} />
    </>
  );
};

/* ───────────────────────── ACT 3 ───────────────────────── */

export const WaterWalk: Art = ({ vw, vh, t, f }) => (
  <>
    <SkyBg vw={vw} vh={vh} id="ww-sky" stops={[[0, "#03070c"], [0.55, "#0e2433"], [1, "#03070c"]]} />
    <CloudMass seed="ww" x={0} y={-vh / 3} w={vw * 1.4} h={500} fill="#1b3444" opacity={0.8} />
    {Array.from({ length: 50 }, (_, i) => {
      const x = (random(`rx${i}`) - 0.5) * vw * 1.3;
      const y = ((random(`ry${i}`) * vh + f * 70) % vh) - vh / 2;
      return <line key={i} x1={x} y1={y} x2={x - 30} y2={y + 110} stroke="#9fc4d6" strokeOpacity={0.35} strokeWidth={3} />;
    })}
    <Orb r={lerp(t, 380, 460)} opacity={0.35} y={20} />
    <Figure pose="stand" s={0.78} y={40} />
    <ellipse cx={0} cy={300} rx={lerp(t, 160, 260)} ry={30} fill="#cfefff" opacity={0.45} filter="url(#blur-s)" />
    <path d={wavePath(vw, vh, 290, 26, 300, f * 0.35)} fill="#0b2230" opacity={0.85} />
    <path d={wavePath(vw, vh, 360, 55, 460, -f * 0.3 + 1)} fill="#081923" />
    <path d={wavePath(vw, vh, 470, 70, 380, f * 0.25 + 2)} fill="#040e14" />
  </>
);

/* ───────────────────────── ACT 5 ───────────────────────── */

export const Lightning: Art = ({ vw, vh, f }) => {
  const on = [0, 1, 2, 6, 7, 10].includes(f);
  let x = 0;
  let pts = `0 ${-vh / 2 - 40}`;
  for (let y = -vh / 2; y < 250; y += 70) {
    x += (random(`bolt${y}`) - 0.5) * 150;
    pts += ` L ${x.toFixed(0)} ${y}`;
  }
  return (
    <>
      <Bg vw={vw} vh={vh} fill={on ? "#1c1f2e" : "#05060a"} />
      <CloudMass seed="lt" x={0} y={-vh / 3} w={vw * 1.5} h={600} fill={on ? "#59607a" : "#141725"} />
      {on ? (
        <>
          <path d={`M ${pts}`} stroke="#fff" strokeWidth={10} fill="none" filter="url(#glow-l)" />
          <path d={`M ${pts}`} stroke="#d8e4ff" strokeWidth={22} strokeOpacity={0.4} fill="none" filter="url(#blur-s)" />
          <Orb r={500} opacity={0.25} y={-vh / 4} />
        </>
      ) : null}
      <path d={`M ${-vw / 2 - 60} ${vh / 2 + 60} L ${-vw / 2 - 60} 380 Q 0 260 ${vw / 2 + 60} 380 L ${vw / 2 + 60} ${vh / 2 + 60} Z`} fill="#000" />
    </>
  );
};

export const ThreeCrosses: Art = ({ vw, vh, t, f }) => (
  <>
    <SkyBg vw={vw} vh={vh} id="tc-sky" stops={[[0, "#050101"], [0.45, "#3a0606"], [0.7, "#a3121e"], [1, "#120202"]]} />
    <g transform={`rotate(${f * 0.6})`}>
      <CloudMass seed="tc1" x={0} y={-vh / 4} w={vw * 1.6} h={700} fill="#1a0303" />
    </g>
    <Orb r={lerp(t, 360, 460)} color="crimson" y={-120} opacity={0.75} />
    <path d={`M ${-vw / 2 - 60} ${vh / 2 + 60} L ${-vw / 2 - 60} 420 Q 0 140 ${vw / 2 + 60} 420 L ${vw / 2 + 60} ${vh / 2 + 60} Z`} fill="#000" />
    <Cross x={-260} y={60} h={360} />
    <Cross x={0} y={-90} h={560} />
    <Cross x={260} y={60} h={360} />
  </>
);

export const ArmsGold: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#2a1604" />
    <Orb r={lerp(t, 700, 900)} color="gold" />
    <Orb r={lerp(t, 260, 380)} y={-180} />
    {Array.from({ length: 28 }, (_, i) => (
      <line key={i} x1={0} y1={-180} x2={0} y2={-1500} stroke="#fff3cf" strokeOpacity={0.22} strokeWidth={24} transform={`rotate(${(i / 28) * 360 + t * 8} 0 -180)`} />
    ))}
    <Figure pose="arms" s={1.05} y={40} fill="#0a0602" glow={false} />
  </>
);

/* ───────────────────────── ACT 6 ───────────────────────── */

export const Hands: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#0f1513" />
    <Orb r={lerp(t, 260, 380)} opacity={0.5} />
    {/* healer's hand from above meets a reaching hand from below — fingertips at center */}
    <Hand x={lerp(t, 40, 25)} y={lerp(t, -400, -370)} s={1.15} rot={180} fill="url(#dots)" />
    <Hand x={-lerp(t, 40, 25)} y={lerp(t, 400, 370)} s={1.15} rot={0} fill="url(#dots)" />
    <Orb r={lerp(t, 70, 130)} />
  </>
);

export const StormPart: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#f4e7c4" />
    <Orb r={700} color="gold" />
    <g transform={`translate(${-lerp(t, 80, 380)} 0)`}>
      <CloudMass seed="spl" x={-vw / 2} y={0} w={vw * 0.9} h={vh} fill="#1a1d22" n={22} />
    </g>
    <g transform={`translate(${lerp(t, 80, 380)} 0)`}>
      <CloudMass seed="spr" x={vw / 2} y={0} w={vw * 0.9} h={vh} fill="#1a1d22" n={22} />
    </g>
  </>
);

export const Vortex: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#121416" />
    <g transform={`rotate(${t * 70})`}>
      {Array.from({ length: 7 }, (_, k) => {
        let d = "";
        for (let i = 0; i <= 120; i++) {
          const a = (i / 120) * Math.PI * 5 + (k / 7) * Math.PI * 2;
          const r = 20 + i * 6.2;
          d += `${i ? "L" : "M"} ${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)} `;
        }
        return <path key={k} d={d} fill="none" stroke={k % 2 ? "#d8d4ca" : "#7c7a74"} strokeWidth={28 - k * 2} strokeLinecap="round" />;
      })}
    </g>
    <Figure pose="arms" s={0.12} />
  </>
);

export const Sinking: Art = ({ vw, vh, t }) => (
  <>
    <SkyBg vw={vw} vh={vh} id="sink-bg" stops={[[0, "#0a2a40"], [1, "#03111c"]]} />
    {Array.from({ length: 7 }, (_, i) => {
      const r = 50 + i * 120 + t * 120;
      return <circle key={i} r={r} fill="none" stroke="#7fd0f0" strokeOpacity={0.7 - i * 0.09} strokeWidth={8} />;
    })}
    <Figure pose="raised" s={0.42} y={lerp(t, 40, 90)} fill="#e8f6ff" />
  </>
);

export const Lamb: Art = ({ vw, vh, t }) => (
  <>
    <SkyBg vw={vw} vh={vh} id="lamb-sky" stops={[[0, "#20262c"], [0.7, "#4a5056"], [1, "#15181b"]]} />
    <path d={`M ${-vw / 2 - 60} ${vh / 2 + 60} L ${-vw / 2 - 60} 200 Q 0 120 ${vw / 2 + 60} 200 L ${vw / 2 + 60} ${vh / 2 + 60} Z`} fill="#0d0f10" />
    <path d="M -520 120 Q -380 -40 -260 110 Z" fill="#0d0f10" />
    <g transform={`translate(${lerp(t, -30, 30)} 60)`} fill="#f2f0ea">
      {[[-60, 0], [0, -20], [60, 0], [-30, 30], [30, 30], [-80, 30], [80, 25]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={48} />
      ))}
      <ellipse cx={135} cy={-35} rx={42} ry={30} />
      {[-70, -30, 40, 80].map((x) => (
        <rect key={x} x={x - 8} y={50} width={16} height={90} />
      ))}
    </g>
  </>
);

export const Warp: Art = ({ vw, vh, t, f }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#050a10" />
    {Array.from({ length: 140 }, (_, i) => {
      const a = random(`wa${i}`) * Math.PI * 2;
      const base = random(`wb${i}`) * 700;
      const r0 = (base + f * 60) % 1100;
      const len = 30 + r0 * 0.25;
      const gold = random(`wc${i}`) > 0.5;
      return (
        <line
          key={i}
          x1={Math.cos(a) * r0}
          y1={Math.sin(a) * r0}
          x2={Math.cos(a) * (r0 + len)}
          y2={Math.sin(a) * (r0 + len)}
          stroke={gold ? C.gold : "#cfe8ff"}
          strokeWidth={2 + r0 / 250}
          strokeLinecap="round"
        />
      );
    })}
    <Orb r={lerp(t, 120, 260)} />
  </>
);

export const ReachHand: Art = ({ vw, vh, t, f }) => (
  <>
    <SkyBg vw={vw} vh={vh} id="reach-bg" stops={[[0, "#bfeee6"], [0.35, "#2f8f8a"], [1, "#04191b"]]} />
    <Orb r={300} y={-vh / 3} />
    <path d={wavePath(vw, vh, 80, 60, 380, f * 0.5)} fill="#0b3f42" opacity={0.85} />
    <Hand x={40} y={lerp(t, 520, 380)} s={1.0} rot={-12} fill="#06231f" />
    <Hand x={-20} y={lerp(t, -620, -520)} s={0.7} rot={168} fill="#fff7e0" />
    <path d={wavePath(vw, vh, 300, 40, 300, -f * 0.6)} fill="#03181a" opacity={0.8} />
  </>
);

export const DoveDescend: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#e8ece8" />
    <polygon points={`-60,${-vh / 2 - 40} 60,${-vh / 2 - 40} 340,${vh / 2} -340,${vh / 2}`} fill="#fff" filter="url(#blur-m)" />
    <Dove y={lerp(t, -260, 40)} s={2.3} fill="#20262a" flap={t} />
  </>
);

export const TombInterior: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#041214" />
    {Array.from({ length: 22 }, (_, i) => (
      <ellipse key={i} cx={(random(`ti${i}`) - 0.5) * vw * 1.2} cy={(random(`tj${i}`) - 0.5) * vh * 1.2} rx={140 + random(`tk${i}`) * 240} ry={80 + random(`tl${i}`) * 160} fill="#0c2e30" opacity={0.6} filter="url(#blur-m)" />
    ))}
    <Orb r={lerp(t, 220, 520)} color="teal" />
    <Orb r={lerp(t, 90, 260)} />
    <path d="M -6 -360 L 14 -120 L -10 40 L 12 260" stroke="#fff" strokeWidth={lerp(t, 4, 14)} fill="none" filter="url(#glow-l)" />
  </>
);

export const StoneRoll: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#2a2620" />
    <circle r={300} fill="#fff4d0" />
    <Orb r={lerp(t, 400, 1400)} color="gold" />
    <g transform={`translate(${lerp(t * t, 0, 720)} 0) rotate(${t * 120})`}>
      <circle r={330} fill="#5e5850" stroke="#1e1b17" strokeWidth={20} />
      <path d="M -200 -40 L 200 40 M -60 -220 L 40 230" stroke="#3a3530" strokeWidth={12} />
    </g>
    <Bg vw={vw} vh={vh} fill="#fff" opacity={interpolate(t, [0.6, 1], [0, 0.85], { extrapolateLeft: "clamp" })} />
  </>
);

export const Sunburst: Art = ({ vw, vh, t }) => (
  <>
    <Bg vw={vw} vh={vh} fill="#1c0e02" />
    <g transform={`rotate(${t * 45})`}>
      {Array.from({ length: 48 }, (_, i) => (
        <path key={i} d="M -18 -110 L 0 -1300 L 18 -110 Z" fill={i % 2 ? C.gold : "#fff1c8"} opacity={0.75} transform={`rotate(${(i / 48) * 360})`} />
      ))}
    </g>
    {[140, 220, 330].map((r, i) => (
      <circle key={r} r={r * lerp(t, 1, 0.8)} fill="none" stroke="#fff6dc" strokeWidth={10 - i * 2} opacity={0.9} />
    ))}
    {/* pupil-sized dark core: match-cuts into the first iris */}
    <circle r={lerp(t, 40, 110)} fill="#000" />
  </>
);

/* ───────────────────────── ACT 8 ───────────────────────── */

export const Eruption: Art = ({ vw, vh, t }) => {
  const hz = 140;
  return (
    <>
      <Bg vw={vw} vh={vh} fill="#020616" />
      <g stroke="#3f7bff" strokeWidth={4} opacity={0.8}>
        {Array.from({ length: 21 }, (_, i) => (
          <line key={`v${i}`} x1={(i - 10) * 60} y1={hz} x2={(i - 10) * 260} y2={vh / 2 + 60} />
        ))}
        {Array.from({ length: 9 }, (_, i) => {
          const y = hz + Math.pow(i / 8, 2) * (vh / 2 - hz + 60);
          return <line key={`h${i}`} x1={-vw / 2 - 60} x2={vw / 2 + 60} y1={y} y2={y} />;
        })}
      </g>
      <rect x={-200} y={hz - 40} width={400} height={80} rx={20} fill="#bfe6ff" filter="url(#glow-l)" />
      {[-140, -60, 0, 60, 140].map((x, i) => (
        <rect key={x} x={x - 14} y={hz - lerp(t, 40, 900 - i * 40)} width={28} height={lerp(t, 40, 900 - i * 40)} fill="#e8f6ff" filter="url(#glow-l)" />
      ))}
    </>
  );
};

export const Clouds: Art = ({ vw, vh, t }) => (
  <>
    <SkyBg vw={vw} vh={vh} id="cl-sky" stops={[[0, "#c9d2d6"], [1, "#4a5560"]]} />
    <Orb r={lerp(t, 300, 600)} />
    <g transform={`translate(${-lerp(t, 0, 260)} ${-lerp(t, 0, 80)})`}>
      <CloudMass seed="cla" x={-vw / 3} y={-vh / 6} w={vw * 0.8} h={vh * 0.8} fill="#2a3036" n={20} />
    </g>
    <g transform={`translate(${lerp(t, 0, 260)} ${lerp(t, 0, 80)})`}>
      <CloudMass seed="clb" x={vw / 3} y={vh / 6} w={vw * 0.8} h={vh * 0.8} fill="#1c2024" n={20} />
    </g>
  </>
);

export const Doves: Art = ({ vw, vh, t, f }) => (
  <>
    <SkyBg vw={vw} vh={vh} id="dv-sky" stops={[[0, "#0a1f3a"], [1, "#1d4f7a"]]} />
    <CloudMass seed="dvc" x={0} y={0} w={vw * 0.7} h={vh * 0.5} fill="#bcd7ea" n={16} opacity={lerp(t, 0.4, 0.9)} />
    {Array.from({ length: 34 }, (_, i) => {
      const a = random(`da${i}`) * Math.PI * 2;
      const dist = (0.15 + random(`dd${i}`) * 0.85) * lerp(t, 80, 900);
      return (
        <Dove
          key={i}
          x={Math.cos(a) * dist}
          y={Math.sin(a) * dist * 0.9}
          s={0.12 + random(`ds${i}`) * 0.2 + t * 0.15}
          flap={(Math.sin(f * 1.4 + i) + 1) / 2}
          rot={Math.cos(a) < 0 ? 0 : 0}
          fill="#f4f8fb"
        />
      );
    })}
  </>
);

export const Wings: Art = ({ vw, vh, t }) => {
  const spread = lerp(t, 0.85, 1);
  const feathers = (side: 1 | -1) =>
    Array.from({ length: 16 }, (_, i) => {
      const a = 8 + i * 6.5; // degrees above horizontal → up
      const len = 380 + i * 22;
      return (
        <ellipse
          key={i}
          cx={len / 2}
          cy={0}
          rx={len / 2}
          ry={20}
          fill="#f2f0ea"
          opacity={0.7}
          transform={`scale(${side} 1) translate(40 -150) rotate(${-a * spread})`}
        />
      );
    });
  return (
    <>
      <SkyBg vw={vw} vh={vh} id="wg-sky" stops={[[0, "#3c4046"], [1, "#16181b"]]} />
      <CloudMass seed="wgc" x={0} y={-vh / 4} w={vw} h={400} fill="#8a9096" opacity={0.6} />
      <g filter="url(#glow-s)" transform="translate(0 -40)">
        <g>{feathers(1)}</g>
        <g>{feathers(-1)}</g>
      </g>
      <Orb r={180} y={-40} />
      <Figure pose="stand" s={0.42} y={10} fill="#fff" />
    </>
  );
};

export const Title: Art = ({ vw, vh, t, f, p }) => {
  const flicker = 0.88 + random(`fl${f}`) * 0.12;
  return (
    <>
      <Bg vw={vw} vh={vh} fill="#0c1a1e" />
      <Orb r={520} opacity={0.08} />
      <g fontFamily="Cinzel, serif" fontWeight={700} textAnchor="middle" fill="#dfeee6" opacity={flicker} filter="url(#glow-s)">
        <text y={-80} fontSize={128} letterSpacing={10}>
          {String(p.line1)}
        </text>
        <text y={130} fontSize={205} letterSpacing={8}>
          {String(p.line2)}
        </text>
      </g>
      <line x1={-lerp(t, 60, 260)} x2={lerp(t, 60, 260)} y1={200} y2={200} stroke={C.gold} strokeWidth={3} opacity={0.7} />
    </>
  );
};
