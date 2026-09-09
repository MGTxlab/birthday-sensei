"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Flowers from "@/components/Flowers";
import MusicCard from "@/components/MusicCard";
import { asset } from "@/lib/assetPath";

// 🎂 Dépose une musique finale ici (optionnel) : public/music/final.mp3
const FINAL_AUDIO_SRC = asset("/music/final.mp3");

export default function FinalMessage() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 500), // "Et finalement…"
      setTimeout(() => setStep(2), 2600), // "Je voulais simplement te souhaiter…"
      setTimeout(() => setStep(3), 4800), // titre principal
      setTimeout(() => setStep(4), 6600), // "Joyeux anniversaire Najwa Niaré."
      setTimeout(() => setStep(5), 8200), // musique finale (optionnelle)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.section
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Fleurs et étoiles lentes, mouvements réduits */}
      <Flowers mode="ambient" active count={7} />

      {/* Lumière violette douce, pulsation lente derrière le titre */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, var(--glow), transparent 60%)",
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <motion.p
        className="relative text-lg font-medium"
        style={{ color: "var(--violet-mid)" }}
        initial={{ opacity: 0 }}
        animate={step >= 1 ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
      >
        Et finalement…
      </motion.p>

      <motion.p
        className="relative text-lg font-medium"
        style={{ color: "var(--violet-mid)" }}
        initial={{ opacity: 0 }}
        animate={step >= 2 ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
      >
        Je voulais simplement te souhaiter…
      </motion.p>

      <motion.h1
        className="relative text-3xl font-bold leading-tight sm:text-5xl"
        style={{ color: "var(--violet-deep)", textShadow: "0 0 30px var(--glow)" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={step >= 3 ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        Joyeux anniversaire Sensei 💜
      </motion.h1>

      <motion.p
        className="relative max-w-md text-lg font-medium leading-relaxed sm:text-xl"
        style={{ color: "var(--violet-deep)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={step >= 4 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
      >
        Joyeux anniversaire Najwa Niaré. 🎂✨
      </motion.p>

      <motion.div
        className="relative mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={step >= 5 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
      >
        <MusicCard src={FINAL_AUDIO_SRC} label="Musique" />
      </motion.div>
    </motion.section>
  );
}
