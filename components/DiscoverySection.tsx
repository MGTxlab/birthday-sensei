"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiscoveryCard from "@/components/DiscoveryCard";
import Flowers from "@/components/Flowers";

// SCÈNE 6 — trois petites cartes découverte, réutilisant DiscoveryCard.
export default function DiscoverySection({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0); // apparition progressive des cartes
  const [animeRevealed, setAnimeRevealed] = useState(false);
  const [animeBurst, setAnimeBurst] = useState(false);

  function handleFirstCardReveal() {
    setAnimeRevealed(true);
    // L'élément anime apparaît, puis se disperse en particules après un instant.
    setTimeout(() => setAnimeBurst(true), 1500);
    setTimeout(() => {
      setAnimeBurst(false);
      setAnimeRevealed(false);
    }, 2100);
  }

  return (
    <motion.section
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-10 px-6 py-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      transition={{ duration: 0.8 }}
      onAnimationComplete={() => setStep(1)}
    >
      <div className="flex flex-col flex-wrap items-center justify-center gap-8 sm:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <DiscoveryCard
            front="Une chose que j'ai remarquée…"
            onReveal={handleFirstCardReveal}
            back={
              <>
                <p style={{ color: "var(--violet-deep)" }}>
                  Tu as tes propres univers dans lesquels tu peux disparaître.
                </p>
                <div className="relative h-10 w-10">
                  <AnimatePresence>
                    {animeRevealed && !animeBurst && (
                      <motion.span
                        className="absolute inset-0 flex items-center justify-center text-3xl"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        🎌
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <Flowers mode="burst" active={animeBurst} count={8} />
                </div>
              </>
            }
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <DiscoveryCard
            front="Une autre…"
            back={
              <p style={{ color: "var(--violet-deep)" }}>
                Tu peux passer d&apos;un opening d&apos;anime à de la musique
                sans transition. 😂
              </p>
            }
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <DiscoveryCard
            calm
            front="Et surtout…"
            back={
              <p
                className="text-lg font-light italic leading-relaxed"
                style={{ color: "var(--violet-deep)" }}
              >
                Tu es devenue quelqu&apos;un que j&apos;avais envie de mieux
                connaître.
              </p>
            }
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <DiscoveryCard
            calm
            size="tall"
            front="Et pour finir…"
            back={
              <p
                className="text-sm font-light italic leading-snug sm:text-base"
                style={{ color: "var(--violet-deep)" }}
              >
                En apprenant à te connaître, j&apos;ai vu que tu étais
                quelqu&apos;un de véridique, avec des valeurs et surtout des
                principes. Reste comme tu es, avec cette personnalité
                magnifique. Et je ne sais pas pourquoi, mais j&apos;adore
                discuter avec toi — ces petits moments me font souvent
                oublier beaucoup de choses.
              </p>
            }
          />
        </motion.div>
      </div>

      <motion.button
        onClick={onNext}
        initial={{ opacity: 0 }}
        animate={step >= 1 ? { opacity: 0.75 } : { opacity: 0 }}
        whileHover={{ opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="rounded-full px-5 py-2 text-sm font-medium"
        style={{ color: "var(--violet-deep)" }}
      >
        Continuer →
      </motion.button>
    </motion.section>
  );
}
