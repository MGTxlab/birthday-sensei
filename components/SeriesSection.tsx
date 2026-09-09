"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MediaRevealCard from "@/components/MediaRevealCard";
import { asset } from "@/lib/assetPath";

// 📺 Dépose tes deux vidéos ici : public/videos/series/clip1.mp4 et clip2.mp4
// (change juste ces chemins si les fichiers ont un autre nom — un seul endroit à modifier)
const SERIES_CLIP_1_SRC = asset("/videos/series/clip1.mp4");
const SERIES_CLIP_2_SRC = asset("/videos/series/clip2.mp4");

const LINE_1 = "Et ça ne s'arrête pas aux animés…";
const LINE_2 = "Tu es aussi complètement fan de séries.";

export default function SeriesSection({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);
  // Laquelle des deux vidéos joue actuellement — jamais les deux en même
  // temps : en sélectionner une met l'autre en pause automatiquement.
  const [activeClip, setActiveClip] = useState<1 | 2 | null>(null);

  // Apparitions progressives, avec des pauses entre chaque étape.
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400), // ligne 1
      setTimeout(() => setStep(2), 2600), // ligne 2
      setTimeout(() => setStep(3), 4600), // vidéos
      setTimeout(() => setStep(4), 5900), // bouton discret
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.section
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex max-w-md flex-col gap-4">
        <motion.p
          className="text-lg font-medium leading-relaxed sm:text-xl"
          style={{ color: "var(--violet-deep)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          {LINE_1}
        </motion.p>

        <motion.p
          className="text-lg font-medium leading-relaxed sm:text-xl"
          style={{ color: "var(--violet-mid)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={step >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          {LINE_2}
        </motion.p>
      </div>

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <MediaRevealCard
          type="video"
          size="sm"
          src={SERIES_CLIP_1_SRC}
          fallbackEmoji="📺"
          fallbackLabel="Vidéo à venir"
          visible={step >= 3}
          autoPlay={false}
          playing={activeClip === 1}
          onRequestPlay={() => setActiveClip(1)}
        />
        <MediaRevealCard
          type="video"
          size="sm"
          src={SERIES_CLIP_2_SRC}
          fallbackEmoji="📺"
          fallbackLabel="Vidéo à venir"
          visible={step >= 3}
          autoPlay={false}
          playing={activeClip === 2}
          onRequestPlay={() => setActiveClip(2)}
        />
      </div>

      <motion.button
        onClick={onNext}
        initial={{ opacity: 0 }}
        animate={step >= 4 ? { opacity: 0.75 } : { opacity: 0 }}
        whileHover={{ opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.6 }}
        className="mt-6 rounded-full px-5 py-2 text-sm font-medium"
        style={{ color: "var(--violet-deep)" }}
      >
        Continuer →
      </motion.button>
    </motion.section>
  );
}
