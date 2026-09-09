"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MusicCard from "@/components/MusicCard";
import { asset } from "@/lib/assetPath";

// 🎵 Dépose ton opening ici : public/music/opening.mp3
const OPENING_AUDIO_SRC = asset("/music/opening.mp3");

const MESSAGE =
  "Parce qu'un anime sans son opening… ce n'est pas vraiment pareil.";

export default function MusicSection({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400), // texte
      setTimeout(() => setStep(2), 2000), // carte
      setTimeout(() => setStep(3), 3400), // bouton continuer
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.section
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-8 px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      transition={{ duration: 0.8 }}
    >
      <motion.p
        className="max-w-md text-lg font-medium leading-relaxed sm:text-xl"
        style={{ color: "var(--violet-deep)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {MESSAGE}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={step >= 2 ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <MusicCard src={OPENING_AUDIO_SRC} label="Opening" showHint />
      </motion.div>

      <motion.button
        onClick={onNext}
        initial={{ opacity: 0 }}
        animate={step >= 3 ? { opacity: 0.75 } : { opacity: 0 }}
        whileHover={{ opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.6 }}
        className="rounded-full px-5 py-2 text-sm font-medium"
        style={{ color: "var(--violet-deep)" }}
      >
        Continuer →
      </motion.button>
    </motion.section>
  );
}
