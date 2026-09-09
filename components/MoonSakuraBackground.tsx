"use client";

import { motion } from "framer-motion";

/**
 * Décor de fond : une lune qui se couche derrière une branche de cerisier
 * japonais. Tout est dessiné en SVG (aucune image téléchargée) — purement
 * décoratif, toujours en fond, sous le contenu des scènes.
 *
 * Les positions ne sont jamais issues de Math.random() : le composant est
 * monté dès le premier rendu (donc côté serveur aussi), et des valeurs
 * aléatoires y produiraient un mismatch d'hydratation entre serveur et
 * client. `hash()` donne une variation "organique" mais déterministe —
 * en entiers uniquement (Math.imul, xor, décalages) : contrairement à
 * Math.sin/Math.cos, ces opérations sont garanties bit-à-bit identiques
 * entre le rendu serveur (Node) et le client (navigateur).
 */

function hash(i: number) {
  let x = Math.imul(i ^ 0x9e3779b9, 2654435761);
  x = (x ^ (x >>> 15)) >>> 0;
  return x / 4294967296;
}

// Points d'ancrage des bouquets de fleurs, le long des branches.
const BLOSSOM_ANCHORS = [
  { x: 560, y: 380, spread: 55, count: 9 },
  { x: 690, y: 330, spread: 45, count: 7 },
  { x: 780, y: 420, spread: 40, count: 6 },
  { x: 320, y: 560, spread: 50, count: 7 },
  { x: 420, y: 760, spread: 42, count: 6 },
  { x: 180, y: 780, spread: 34, count: 5 },
];

// Pétales qui se détachent doucement de quelques bouquets.
const PETAL_ORIGINS = [
  { x: 690, y: 330, fall: 420 },
  { x: 560, y: 380, fall: 460 },
  { x: 780, y: 420, fall: 400 },
  { x: 320, y: 560, fall: 300 },
];

export default function MoonSakuraBackground() {
  const blossoms = BLOSSOM_ANCHORS.flatMap((anchor, ai) =>
    Array.from({ length: anchor.count }, (_, i) => {
      const s = ai * 401 + i * 7;
      return {
        key: `${ai}-${i}`,
        cx: anchor.x + (hash(s) - 0.5) * 2 * anchor.spread,
        cy: anchor.y + (hash(s + 1) - 0.5) * 2 * anchor.spread * 0.6,
        r: 7 + hash(s + 2) * 7,
        pink: hash(s + 3) > 0.35,
      };
    })
  );

  return (
    <div
      // Une bande discrète en bas de l'écran, jamais tout l'écran : le décor
      // ne doit pas rivaliser avec le texte des scènes.
      className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[34vh] overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--moon-glow)" stopOpacity="0.55" />
            <stop offset="55%" stopColor="var(--violet-soft)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--violet-soft)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="moonBody" cx="38%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#fffdf6" />
            <stop offset="55%" stopColor="var(--moon-glow)" />
            <stop offset="100%" stopColor="var(--violet-soft)" />
          </radialGradient>
        </defs>

        {/* halo de la lune */}
        <circle cx="1080" cy="600" r="340" fill="url(#moonGlow)" />
        {/* lune */}
        <circle cx="1080" cy="600" r="165" fill="url(#moonBody)" opacity="0.95" />
        <circle cx="1035" cy="550" r="13" fill="#e4d3fb" opacity="0.35" />
        <circle cx="1120" cy="640" r="19" fill="#e4d3fb" opacity="0.3" />
        <circle cx="1065" cy="655" r="9" fill="#e4d3fb" opacity="0.3" />

        {/* branche de cerisier, silhouette */}
        <g
          stroke="var(--violet-deep)"
          strokeLinecap="round"
          fill="none"
          opacity="0.88"
        >
          <path
            d="M 10 900 C 90 720 180 640 300 560 C 400 495 470 460 560 380"
            strokeWidth="16"
          />
          <path d="M 300 560 C 380 520 460 500 560 460" strokeWidth="9" />
          <path d="M 560 380 C 610 355 650 345 690 330" strokeWidth="8" />
          <path d="M 560 460 C 640 450 720 440 780 420" strokeWidth="7" />
          <path d="M 210 630 C 290 645 360 695 420 760" strokeWidth="8" />
          <path d="M 120 760 C 170 770 205 800 240 850" strokeWidth="6" />
        </g>

        {/* fleurs de cerisier */}
        {blossoms.map((b) => (
          <circle
            key={b.key}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill={b.pink ? "var(--sakura-pink)" : "var(--sakura-pink-pale)"}
            opacity={0.88}
          />
        ))}

        {/* pétales qui tombent doucement (transform, pas de reflow) */}
        {PETAL_ORIGINS.map((p, i) => (
          <motion.g
            key={i}
            initial={{ x: p.x, y: p.y, opacity: 0 }}
            animate={{
              x: [p.x, p.x + (hash(i * 53 + 5) - 0.5) * 90, p.x - 20],
              y: [p.y, p.y + p.fall],
              opacity: [0, 0.85, 0.85, 0],
            }}
            transition={{
              duration: 9 + hash(i * 53 + 12) * 5,
              delay: hash(i * 53 + 20) * 6,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <ellipse
              cx={0}
              cy={0}
              rx={7}
              ry={4.5}
              fill="var(--sakura-pink)"
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
