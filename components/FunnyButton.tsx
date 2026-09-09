"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Flowers from "@/components/Flowers";

const QUESTION = "Alors Sensei… tu penses que j'ai bien deviné ?";
const FINAL_LINE =
  "Même quand tu essaies de dire non, le site n'est pas vraiment d'accord avec toi. 😂";

const NON_LABELS = [
  "NON",
  "Non ?",
  "Vraiment ?",
  "Tu es sûre ?",
  "Essaie encore 😏",
  "Presque…",
  "Dernière chance…",
];
const NON_SCALES = [1, 0.75, 1.35, 0.85, 1.25, 0.9, 1.1];
const EXPLODE_THRESHOLD = NON_LABELS.length; // le dernier essai fait éclater le bouton
const ARENA_PADDING = 16;
const NON_SIZE = 110;

export default function FunnyButton({ onNext }: { onNext: () => void }) {
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const nonRef = useRef<HTMLButtonElement | null>(null);
  const justTouchedRef = useRef(false);

  const [attempts, setAttempts] = useState(0);
  const [nonPos, setNonPos] = useState<{ left: number; top: number } | null>(
    null
  );
  const [exploded, setExploded] = useState(false);
  const [showFinalLine, setShowFinalLine] = useState(false);
  const [yesClicked, setYesClicked] = useState(false);

  useEffect(() => {
    if (!yesClicked) return;
    const t = setTimeout(onNext, 1300);
    return () => clearTimeout(t);
  }, [yesClicked, onNext]);

  function randomPosition(width: number, height: number) {
    const maxLeft = Math.max(width - NON_SIZE - ARENA_PADDING, ARENA_PADDING);
    const maxTop = Math.max(height - NON_SIZE - ARENA_PADDING, ARENA_PADDING);
    return {
      left: ARENA_PADDING + Math.random() * (maxLeft - ARENA_PADDING),
      top: ARENA_PADDING + Math.random() * (maxTop - ARENA_PADDING),
    };
  }

  function dodge() {
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    setNonPos(randomPosition(rect.width, rect.height));
  }

  function explode() {
    setExploded(true);
    setTimeout(() => setShowFinalLine(true), 500);
  }

  function registerNonAttempt() {
    if (exploded || yesClicked) return;
    setAttempts((a) => {
      const next = a + 1;
      if (next >= EXPLODE_THRESHOLD) {
        explode();
      } else {
        dodge();
      }
      return next;
    });
  }

  function handleNonMouseEnter() {
    // Le curseur doit vraiment arriver sur le bouton (pas juste s'en
    // approcher) pour déclencher l'esquive — c'est ce contact précis qui
    // rend le "presque attrapé" crédible.
    registerNonAttempt();
  }

  function handleNonTouchStart() {
    // Pas de preventDefault ici : le listener tactile est passif, l'appel
    // serait ignoré (et bruyant en console). Le garde-fou justTouchedRef
    // suffit à éviter un double comptage avec le clic de secours.
    justTouchedRef.current = true;
    registerNonAttempt();
    setTimeout(() => {
      justTouchedRef.current = false;
    }, 500);
  }

  function handleNonClick() {
    if (justTouchedRef.current) return; // évite le double-comptage tactile
    registerNonAttempt();
  }

  const label = NON_LABELS[Math.min(attempts, NON_LABELS.length - 1)];
  const scale = NON_SCALES[Math.min(attempts, NON_SCALES.length - 1)];

  return (
    <motion.section
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-8 px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      transition={{ duration: 0.8 }}
    >
      <AnimatePresence mode="wait">
        {!showFinalLine && !yesClicked && (
          <motion.p
            key="question"
            className="max-w-md text-lg font-medium leading-relaxed sm:text-xl"
            style={{ color: "var(--violet-deep)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.8 }}
          >
            {QUESTION}
          </motion.p>
        )}

        {yesClicked && (
          <motion.p
            key="yes-response"
            className="max-w-md text-lg font-medium leading-relaxed sm:text-xl"
            style={{ color: "var(--violet-deep)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Je savais que j&apos;avais bien deviné 😄
          </motion.p>
        )}

        {showFinalLine && (
          <motion.p
            key="final-line"
            className="max-w-md text-lg font-medium leading-relaxed sm:text-xl"
            style={{ color: "var(--violet-deep)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {FINAL_LINE}
          </motion.p>
        )}
      </AnimatePresence>

      {!yesClicked && !showFinalLine && (
        <div
          ref={arenaRef}
          className="relative flex h-64 w-full max-w-sm items-center justify-center gap-6"
        >
          <motion.button
            onClick={() => setYesClicked(true)}
            whileTap={{ scale: 0.92 }}
            className="rounded-full px-8 py-3 text-base font-semibold text-white shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, var(--violet-mid), var(--violet-deep))",
              boxShadow: "0 0 20px var(--glow)",
            }}
          >
            OUI
          </motion.button>

          {!exploded && (
            <motion.button
              ref={nonRef}
              onMouseEnter={handleNonMouseEnter}
              onClick={handleNonClick}
              onTouchStart={handleNonTouchStart}
              className="rounded-full border px-6 py-3 text-base font-semibold select-none"
              style={
                nonPos
                  ? {
                      position: "absolute",
                      left: 0,
                      top: 0,
                      borderColor: "var(--violet-mid)",
                      color: "var(--violet-deep)",
                      background: "rgba(255,255,255,0.6)",
                    }
                  : {
                      borderColor: "var(--violet-mid)",
                      color: "var(--violet-deep)",
                      background: "rgba(255,255,255,0.6)",
                    }
              }
              // Une fois en fuite, on anime x/y (transform) plutôt que left/top
              // (pas de reflow à chaque esquive).
              animate={
                nonPos
                  ? { x: nonPos.left, y: nonPos.top, scale }
                  : { scale }
              }
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {label}
            </motion.button>
          )}

          <Flowers mode="burst" active={exploded} count={18} />
        </div>
      )}

      {showFinalLine && (
        <motion.button
          onClick={onNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          whileHover={{ opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="rounded-full px-5 py-2 text-sm font-medium"
          style={{ color: "var(--violet-deep)" }}
        >
          Continuer →
        </motion.button>
      )}
    </motion.section>
  );
}
