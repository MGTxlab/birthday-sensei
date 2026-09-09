"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MusicCard from "@/components/MusicCard";
import { asset } from "@/lib/assetPath";

// 💜 Dépose ton morceau ici : public/music/bts.mp3
const BTS_AUDIO_SRC = asset("/music/bts.mp3");

const LINE_1 = "Et puis il y avait cette autre chose impossible à manquer…";
const LINE_3 = "Parce que oui… je l'ai remarqué aussi. 😂";

export default function BTSSection({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400), // ligne 1
      setTimeout(() => setStep(2), 2400), // "Musique 💜"
      setTimeout(() => setStep(3), 4200), // ligne 3
      setTimeout(() => setStep(4), 5400), // carte
      setTimeout(() => setStep(5), 6800), // bouton continuer
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.section
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      transition={{ duration: 0.8 }}
    >
      {/* Le violet devient plus présent dans cette scène */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, var(--violet-soft), transparent 65%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.4 }}
        aria-hidden="true"
      />

      <motion.p
        className="relative max-w-md text-lg font-medium leading-relaxed sm:text-xl"
        style={{ color: "var(--violet-deep)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {LINE_1}
      </motion.p>

      <motion.p
        className="relative text-4xl font-bold sm:text-5xl"
        style={{ color: "var(--violet-deep)", textShadow: "0 0 24px var(--glow)" }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={step >= 2 ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Musique 💜
      </motion.p>

      <motion.p
        className="relative max-w-md text-lg font-medium leading-relaxed sm:text-xl"
        style={{ color: "var(--violet-mid)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={step >= 3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {LINE_3}
      </motion.p>

      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={step >= 4 ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <MusicCard src={BTS_AUDIO_SRC} label="Musique" />
      </motion.div>

      <motion.button
        onClick={onNext}
        initial={{ opacity: 0 }}
        animate={step >= 5 ? { opacity: 0.75 } : { opacity: 0 }}
        whileHover={{ opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-full px-5 py-2 text-sm font-medium"
        style={{ color: "var(--violet-deep)" }}
      >
        Continuer →
      </motion.button>
    </motion.section>
  );
}
