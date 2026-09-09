"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Particles from "@/components/Particles";
import MoonSakuraBackground from "@/components/MoonSakuraBackground";
import BackgroundMusic from "@/components/BackgroundMusic";
import Intro from "@/components/Intro";
import AnimeSection from "@/components/AnimeSection";
import SeriesSection from "@/components/SeriesSection";
import MusicSection from "@/components/MusicSection";
import BTSSection from "@/components/BTSSection";
import DiscoverySection from "@/components/DiscoverySection";
import FunnyButton from "@/components/FunnyButton";
import FinalMessage from "@/components/FinalMessage";

export default function Home() {
  const [currentScene, setCurrentScene] = useState(1);

  // Pendant la transition de sortie (AnimatePresence mode="wait"), la scène
  // qui disparaît reste montée et cliquable pendant ~0.6s : un double-clic
  // rapide sur son bouton "Continuer" pourrait sinon appeler nextScene()
  // deux fois et sauter toute une scène. On verrouille le temps de la sortie.
  const isTransitioning = useRef(false);

  // useCallback : identité stable, pour que les scènes qui l'utilisent dans
  // un effet (ex. FunnyButton après "OUI") n'aient pas à relancer leur minuteur
  // à chaque re-render du parent.
  const nextScene = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentScene((scene) => scene + 1);
    setTimeout(() => {
      isTransitioning.current = false;
    }, 700);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <MoonSakuraBackground />
      <Particles />
      <BackgroundMusic />

      <AnimatePresence mode="wait">
        {currentScene === 1 && <Intro key="scene-1" onNext={nextScene} />}
        {currentScene === 2 && (
          <AnimeSection key="scene-2" onNext={nextScene} />
        )}
        {currentScene === 3 && (
          <SeriesSection key="scene-3" onNext={nextScene} />
        )}
        {currentScene === 4 && (
          <MusicSection key="scene-4" onNext={nextScene} />
        )}
        {currentScene === 5 && <BTSSection key="scene-5" onNext={nextScene} />}
        {currentScene === 6 && (
          <DiscoverySection key="scene-6" onNext={nextScene} />
        )}
        {currentScene === 7 && (
          <FunnyButton key="scene-7" onNext={nextScene} />
        )}
        {currentScene === 8 && <FinalMessage key="scene-8" />}
      </AnimatePresence>
    </div>
  );
}
