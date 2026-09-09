"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INTRO_MESSAGE = "Sensei… j'ai quelque chose à te montrer.";
const BURST_EMOJIS = ["✨", "🌸", "💜", "⭐"];

type BurstPiece = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  emoji: string;
};

export default function Intro({ onNext }: { onNext: () => void }) {
  const [typed, setTyped] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [burst, setBurst] = useState<BurstPiece[]>([]);

  // Effet machine à écrire.
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setTyped(INTRO_MESSAGE.slice(0, index));
      if (index >= INTRO_MESSAGE.length) {
        clearInterval(interval);
        setTimeout(() => setShowButton(true), 600);
      }
    }, 55);
    return () => clearInterval(interval);
  }, []);

  function handleDiscover() {
    if (isExploding) return;
    setIsExploding(true);

    const pieces: BurstPiece[] = Array.from({ length: 16 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.3;
      const distance = 90 + Math.random() * 70;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotate: (Math.random() - 0.5) * 180,
        emoji: BURST_EMOJIS[i % BURST_EMOJIS.length],
      };
    });
    setBurst(pieces);

    setTimeout(() => {
      onNext();
    }, 700);
  }

  return (
    <motion.section
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.8 }}
    >
      <p
        className="max-w-md text-xl font-medium leading-relaxed sm:text-2xl"
        style={{ color: "var(--violet-deep)" }}
      >
        {typed}
        <span className="ml-0.5 inline-block w-[1px] animate-pulse border-r-2 border-current align-middle" />
      </p>

      <div className="relative mt-12 h-14">
        <AnimatePresence>
          {showButton && !isExploding && (
            <motion.button
              key="discover-button"
              onClick={handleDiscover}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -6, 0],
              }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
              transition={{
                opacity: { duration: 0.6 },
                scale: { duration: 0.6 },
                y: {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                },
              }}
              whileTap={{ scale: 0.94 }}
              className="rounded-full px-8 py-3 text-base font-semibold text-white shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--violet-mid), var(--violet-deep))",
                boxShadow: "0 0 24px var(--glow)",
              }}
            >
              Découvrir ✨
            </motion.button>
          )}
        </AnimatePresence>

        {/* Explosion de particules/fleurs au clic */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <AnimatePresence>
            {burst.map((piece) => (
              <motion.span
                key={piece.id}
                className="absolute select-none text-xl"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
                animate={{
                  x: piece.x,
                  y: piece.y,
                  opacity: 0,
                  scale: 1.1,
                  rotate: piece.rotate,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {piece.emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
