import React from "react";
import { random } from "remotion";
import { ArtProps, Bg, C, Cross, Dove, Orb, ThornRing } from "./common";

/** Act 4 — every icon is dead-center inside the same ring so the 3f barrage reads as one object morphing. */
export const Icon: React.FC<ArtProps> = ({ vw, vh, t, p }) => {
  const name = String(p.name);
  const plate = p.plate ? String(p.plate) : undefined;
  return (
    <>
      <Bg vw={vw} vh={vh} fill={plate ?? "#06080a"} />
      {plate ? <rect x={-vw / 2} y={-vh / 2} width={vw} height={vh} fill="url(#grid)" /> : <Orb r={560} opacity={0.08} />}
      <circle r={400} fill="none" stroke="#fff" strokeOpacity={plate ? 0.4 : 0.18} strokeWidth={3} />
      <g transform={`scale(${0.94 + t * 0.06})`}>{renderIcon(name, t, p)}</g>
    </>
  );
};

const renderIcon = (name: string, t: number, p: ArtProps["p"]) => {
  switch (name) {
    case "star":
      return (
        <g filter="url(#glow-l)" fill="#fff">
          <path d="M0 -330 L40 -40 L330 0 L40 40 L0 330 L-40 40 L-330 0 L-40 -40 Z" />
          <path d="M0 -200 L25 -25 L200 0 L25 25 L0 200 L-25 25 L-200 0 L-25 -25 Z" transform="rotate(45)" opacity={0.7} />
        </g>
      );
    case "dove":
      return (
        <g filter="url(#glow-s)">
          <Orb r={300} opacity={0.4} />
          <Dove s={1.5} x={-20} flap={t} fill="#f4f8fb" />
        </g>
      );
    case "bread":
      return (
        <g>
          <Orb r={360} color="gold" opacity={0.5} />
          <path d="M -12 -230 A 230 230 0 0 0 -12 230 L -40 120 L -5 40 L -45 -50 L -10 -130 Z" fill="#c98a4a" stroke="#6b3d14" strokeWidth={10} transform={`translate(${-t * 40} 0)`} />
          <path d="M 12 -230 A 230 230 0 0 1 12 230 L -16 120 L 19 40 L -21 -50 L 14 -130 Z" fill="#c98a4a" stroke="#6b3d14" strokeWidth={10} transform={`translate(${t * 40} 0)`} />
        </g>
      );
    case "chalice":
      return (
        <g>
          <Orb r={260} color="gold" y={-120} />
          <path d="M -200 -260 L 200 -260 Q 190 -40 30 20 L 30 200 Q 160 230 170 290 L -170 290 Q -160 230 -30 200 L -30 20 Q -190 -40 -200 -260 Z" fill={C.gold} stroke="#7a4f12" strokeWidth={10} />
          <ellipse cy={-260} rx={200} ry={36} fill="#5a0a14" stroke="#7a4f12" strokeWidth={8} />
        </g>
      );
    case "coins":
      return (
        <g>
          {Array.from({ length: 30 }, (_, i) => {
            const a = (i / 30) * Math.PI * 2 + t * 0.4;
            return (
              <g key={i} transform={`translate(${Math.cos(a) * 280} ${Math.sin(a) * 280})`}>
                <circle r={42} fill="#cfd3d6" stroke="#6b7074" strokeWidth={6} />
                <circle r={26} fill="none" stroke="#8a8f93" strokeWidth={3} />
              </g>
            );
          })}
          <text textAnchor="middle" y={45} fontSize={130} fontFamily="Cinzel, serif" fill="#cfd3d6">
            XXX
          </text>
        </g>
      );
    case "lamp":
      return (
        <g>
          <Orb r={220} color="gold" y={-170} />
          <path d="M 0 -300 Q 50 -210 0 -140 Q -50 -210 0 -300 Z" fill="#fff3c0" filter="url(#glow-s)" />
          <path d="M -260 40 Q -250 -80 -40 -110 L 40 -110 Q 230 -90 300 -20 L 340 -40 Q 320 40 240 80 Q 0 160 -260 40 Z" fill="#b5703a" stroke="#5a2f10" strokeWidth={10} />
          <rect x={-20} y={-140} width={40} height={40} fill="#5a2f10" />
        </g>
      );
    case "ichthys":
      return (
        <g fill="none" stroke="#fff" strokeWidth={22} strokeLinecap="round" filter="url(#glow-s)">
          <path d="M -280 -140 Q 40 -260 280 100" />
          <path d="M -280 140 Q 40 260 280 -100" />
        </g>
      );
    case "alphaOmega":
      return (
        <g filter="url(#glow-s)">
          <Cross h={560} fill="none" stroke={C.gold} sw={6} />
          <text textAnchor="middle" y={90} fontSize={280} fontFamily="EB Garamond, serif" fill="#fff">
            Α Ω
          </text>
        </g>
      );
    case "crown":
      return (
        <g transform={`rotate(${-8 + t * 10})`}>
          <Orb r={360} color="crimson" opacity={0.45} />
          <ThornRing r={290} color="#8c5b33" seed="crownIcon" />
        </g>
      );
    case "eclipse":
      return (
        <g>
          <circle r={280} fill="#ff7a2a" filter="url(#glow-l)" />
          <circle r={300} fill="none" stroke="#ffd27a" strokeWidth={20} filter="url(#blur-s)" />
          <circle r={272} cx={-40 + t * 40} fill="#020202" />
        </g>
      );
    case "veil": {
      const gap = 20 + t * 110;
      const jag = (side: 1 | -1) => {
        let d = `M ${side * 400} -400 L ${side * gap} -400`;
        for (let y = -400; y <= 400; y += 40) d += ` L ${side * (gap + random(`veil${side}${y}`) * 40)} ${y}`;
        return d + ` L ${side * 400} 400 Z`;
      };
      return (
        <g>
          <rect x={-80} y={-400} width={160} height={800} fill="#fff" filter="url(#glow-l)" />
          <path d={jag(-1)} fill="#7a0a1e" stroke="#c98a2b" strokeWidth={6} />
          <path d={jag(1)} fill="#7a0a1e" stroke="#c98a2b" strokeWidth={6} />
        </g>
      );
    }
    case "stone": {
      const stage = Number(p.stage ?? 1);
      const dx = [0, 0, 130, 270, 430][stage];
      return (
        <g>
          <circle r={220} fill="#000" />
          <Orb r={200 + stage * 40} color="gold" opacity={stage / 4} />
          <g transform={`translate(${dx} 0) rotate(${stage * 40 + t * 20})`}>
            <circle r={235} fill="#e8e4da" opacity={0.9} stroke="#fff" strokeWidth={6} />
            <path d="M -170 0 L 170 0 M 0 -170 L 0 170" stroke="#9a958a" strokeWidth={10} />
          </g>
          <text x={0} y={360} textAnchor="middle" fontSize={44} fontFamily="monospace" fill="#fff" opacity={0.85} letterSpacing={6}>
            {`STAGE 0${stage}`}
          </text>
        </g>
      );
    }
    case "globe":
      return (
        <g fill="none" stroke="#e8c27a" strokeWidth={6}>
          <circle r={300} fill="#3a2a10" />
          {[-200, -100, 0, 100, 200].map((y) => (
            <ellipse key={y} cy={y} rx={Math.sqrt(300 * 300 - y * y)} ry={18} />
          ))}
          {[60, 140, 220, 300].map((rx) => (
            <ellipse key={rx} rx={rx} ry={300} />
          ))}
        </g>
      );
    case "sun":
      return <circle r={300} fill="#f0a24a" filter="url(#glow-l)" />;
    default:
      return null;
  }
};
