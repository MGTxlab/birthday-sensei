"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MediaRevealCard from "@/components/MediaRevealCard";
import RandomImageBox from "@/components/RandomImageBox";
import { asset } from "@/lib/assetPath";

// 🎬 Dépose ta vidéo ici : public/videos/anime/clip.mp4
// (change juste ce chemin si le fichier a un autre nom — un seul endroit à modifier)
const ANIME_CLIP_SRC = asset("/videos/anime/clip.mp4");

// 🖼️ Dépose autant d'images que tu veux ici : public/images/anime-random/1.jpg, 2.jpg, 3.jpg…
// Une seule s'affiche à la fois, au hasard, apparaît puis disparaît en boucle.
// Une image absente est simplement ignorée (aucune casse).
const ANIME_RANDOM_IMAGES = [
  asset("/images/anime-random/1.jpg"),
  asset("/images/anime-random/2.jpg"),
  asset("/images/anime-random/3.jpg"),
  asset("/images/anime-random/4.jpg"),
  asset("/images/anime-random/5.jpg"),
];

const LINE_1 = "En apprenant à te connaître, j'ai commencé à remarquer certaines choses…";
const LINE_2 = "Par exemple… j'ai découvert que tu avais un petit faible pour les animés.";

export default function AnimeSection({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);

  // Apparitions progressives, avec des pauses entre chaque étape.
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400), // ligne 1
      setTimeout(() => setStep(2), 2600), // ligne 2
      setTimeout(() => setStep(3), 4600), // vidéo + boîte aléatoire
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
      {/* Boîte surprise qui surgit ailleurs sur l'écran à chaque apparition */}
      <RandomImageBox images={ANIME_RANDOM_IMAGES} visible={step >= 3} />

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

      <div className="mt-4">
        <MediaRevealCard
          type="video"
          src={ANIME_CLIP_SRC}
          fallbackEmoji="🎬"
          fallbackLabel="Vidéo à venir"
          visible={step >= 3}
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
