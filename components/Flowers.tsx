"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/**
 * Fleurs réutilisables, dans deux modes :
 * - "burst"   : explosion ponctuelle depuis le centre qui se dissipe
 *               (déclenchée par le passage de `active` à `true` ; pensée
 *               pour être posée dans un conteneur `relative`, ex. au-dessus
 *               d'un bouton).
 * - "ambient" : pluie de fleurs lente et légère en fond (position fixed),
 *               pour une scène calme (ex. le message final).
 */

const FLOWER_EMOJIS = ["🌸", "🌷", "💮", "🌼"];

type FlowersProps = {
  mode?: "burst" | "ambient";
  active?: boolean;
  count?: number;
};

type BurstPiece = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  emoji: string;
};

function makeBurstPieces(count: number): BurstPiece[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 70 + Math.random() * 110;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotate: (Math.random() - 0.5) * 220,
      emoji: FLOWER_EMOJIS[i % FLOWER_EMOJIS.length],
    };
  });
}

export default function Flowers({ mode = "ambient", active = true, count }: FlowersProps) {
  const burstCount = count ?? 14;

  // Génère une nouvelle explosion à chaque passage de `active` à `true`.
  // (ajustement de state pendant le rendu — pas besoin d'effet ici)
  const [prevActive, setPrevActive] = useState(active);
  const [pieces, setPieces] = useState<BurstPiece[]>([]);
  if (mode === "burst" && active !== prevActive) {
    setPrevActive(active);
    if (active) setPieces(makeBurstPieces(burstCount));
  }

  if (mode === "burst") {
    return (
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        {active &&
          pieces.map((p) => (
            <motion.span
              key={p.id}
              className="absolute select-none text-2xl"
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.5, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: 0,
                scale: 1.1,
                rotate: p.rotate,
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {p.emoji}
            </motion.span>
          ))}
      </div>
    );
  }

  return <AmbientFlowers active={active} count={count ?? 9} />;
}

function AmbientFlowers({ active, count }: { active: boolean; count: number }) {
  const [flowers] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 12 + Math.random() * 8,
      delay: Math.random() * 8,
      size: 14 + Math.random() * 10,
      drift: (Math.random() - 0.5) * 60,
      emoji: FLOWER_EMOJIS[i % FLOWER_EMOJIS.length],
    }))
  );

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {flowers.map((f) => (
        <motion.span
          key={f.id}
          className="absolute select-none"
          style={{ left: `${f.left}%`, top: "-8%", fontSize: f.size }}
          animate={{
            y: ["0vh", "112vh"],
            x: [0, f.drift, 0],
            opacity: [0, 0.85, 0.85, 0],
            rotate: [0, 25, -15, 0],
          }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {f.emoji}
        </motion.span>
      ))}
    </div>
  );
}
