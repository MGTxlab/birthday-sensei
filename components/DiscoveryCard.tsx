"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Carte réutilisable qui se retourne au clic/tap pour révéler son contenu.
 */
const SIZE_CLASSES = {
  normal: "h-48 w-64 sm:h-52 sm:w-72",
  // Pour un texte plus long au dos — même largeur, plus de hauteur.
  tall: "h-64 w-64 sm:h-72 sm:w-72",
};

export default function DiscoveryCard({
  front,
  back,
  calm = false,
  size = "normal",
  onReveal,
}: {
  front: string;
  back: ReactNode;
  calm?: boolean;
  size?: "normal" | "tall";
  onReveal?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  function handleToggle() {
    if (!flipped) onReveal?.();
    setFlipped((f) => !f);
  }

  return (
    <div
      className={`cursor-pointer ${SIZE_CLASSES[size]}`}
      style={{ perspective: "1200px" }}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleToggle();
      }}
      aria-pressed={flipped}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Face avant */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/50 bg-white/40 px-6 text-center shadow-xl backdrop-blur-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p
            className="text-lg font-medium"
            style={{ color: "var(--violet-deep)" }}
          >
            {front}
          </p>
          {!flipped && (
            <motion.span
              className="pointer-events-none select-none text-xs font-medium"
              style={{ color: "var(--violet-mid)" }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            >
              👆 Clique
            </motion.span>
          )}
        </div>

        {/* Face arrière */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-3xl border border-white/50 px-6 text-center shadow-xl backdrop-blur-sm ${
            calm ? "bg-white/60" : "bg-white/40"
          }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: calm ? undefined : "0 0 24px var(--glow)",
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
