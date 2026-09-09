"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeMediaActivity } from "@/lib/audioDucking";
import { asset } from "@/lib/assetPath";

// 🎵 Dépose une petite musique de fond ici : public/music/background.mp3
const BACKGROUND_MUSIC_SRC = asset("/music/background.mp3");
const VOLUME = 0.35; // discrète, ne doit jamais couvrir le contenu

/**
 * Musique de fond, présente sur tout le site (montée une seule fois dans
 * page.tsx, indépendamment de la scène affichée). Les navigateurs bloquant
 * l'autoplay avec son sans geste utilisateur, elle démarre au tout premier
 * clic/tap sur le site. Bouton discret pour couper le son à tout moment —
 * ne jamais imposer du son à quelqu'un qui n'en veut pas.
 *
 * Détection d'un fichier manquant : on se base sur le rejet de la promesse
 * de `play()`, pas sur l'évènement `error` de <audio> — ce dernier ne se
 * déclenche pas de façon fiable ici (constaté aussi sur MusicCard).
 * `NotSupportedError` = fichier absent/format invalide → on masque le
 * bouton. Les autres rejets (ex. `NotAllowedError`, autoplay bloqué) ne
 * veulent pas dire que le fichier est absent : on retentera au prochain clic.
 *
 * Ducking : dès qu'un autre média avec son se met à jouer (une vidéo anime/
 * séries, ou un morceau lancé depuis une MusicCard), la musique de fond se
 * coupe ; elle reprend automatiquement quand plus rien ne joue — mais
 * seulement si elle jouait déjà avant (on ne relance jamais le son si
 * l'utilisateur l'avait coupé lui-même).
 */
export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [available, setAvailable] = useState(true);
  const resumeAfterDuckRef = useRef(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = VOLUME;
  }, []);

  function attemptPlay(onFail?: () => void) {
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err: unknown) => {
        setIsPlaying(false);
        if (err instanceof DOMException && err.name === "NotSupportedError") {
          setAvailable(false);
        }
        onFail?.();
      });
  }

  useEffect(() => {
    function startOnFirstInteraction() {
      attemptPlay();
    }
    window.addEventListener("pointerdown", startOnFirstInteraction, {
      once: true,
    });
    return () =>
      window.removeEventListener("pointerdown", startOnFirstInteraction);
  }, []);

  useEffect(() => {
    return subscribeMediaActivity((activeCount) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (activeCount > 0) {
        if (!audio.paused) {
          resumeAfterDuckRef.current = true;
          audio.pause();
          setIsPlaying(false);
        }
      } else if (resumeAfterDuckRef.current) {
        resumeAfterDuckRef.current = false;
        attemptPlay();
      }
    });
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio || !available) return;
    // Une action manuelle annule toute reprise automatique en attente.
    resumeAfterDuckRef.current = false;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      attemptPlay();
    }
  }

  if (!available) return null;

  return (
    <>
      <audio ref={audioRef} src={BACKGROUND_MUSIC_SRC} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={isPlaying ? "Couper la musique de fond" : "Activer la musique de fond"}
        className="fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full text-lg shadow-md backdrop-blur-sm"
        style={{
          background: "rgba(255,255,255,0.55)",
          color: "var(--violet-deep)",
          border: "1px solid rgba(255,255,255,0.6)",
        }}
      >
        {isPlaying ? "🔊" : "🔇"}
      </button>
    </>
  );
}
