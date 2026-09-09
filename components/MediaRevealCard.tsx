"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { notifyMediaPlaying, notifyMediaStopped } from "@/lib/audioDucking";

/**
 * Carte média réutilisable : apparaît avec un léger zoom, flotte doucement,
 * glow violet en fond. Affiche une image ou une vidéo locale (avec son, en
 * boucle) ; si le fichier est absent, un fallback propre (emoji + texte)
 * s'affiche à la place — le site ne casse jamais.
 *
 * La boîte s'ajuste au format réel du média (largeur fixe, hauteur dérivée
 * de son ratio naturel) au lieu d'un carré fixe qui rognait les images/
 * vidéos qui ne sont pas carrées — carrée par défaut tant que le ratio n'est
 * pas encore connu, `object-contain` en secours pour ne jamais rogner.
 *
 * Le son : on ne met pas `muted` sur la balise — ces cartes n'apparaissent
 * qu'après une interaction (le clic sur "Découvrir" de l'intro, ou le tap
 * sur la vidéo elle-même en mode `autoPlay={false}`), donc les navigateurs
 * autorisent normalement la lecture avec son. On lance la lecture nous-mêmes
 * pour pouvoir réagir si elle est refusée : fichier manquant → fallback ;
 * lecture avec son bloquée pour une autre raison → on retente en muet
 * plutôt que de ne rien montrer du tout.
 *
 * `autoPlay` (vidéo uniquement) :
 * - `true` (défaut) : démarre seule à l'apparition (ex. la vidéo anime).
 * - `false` : n'affiche qu'un bouton "▶️" tant que `playing` (contrôlé par
 *   le parent) n'est pas vrai — utile quand plusieurs vidéos partagent une
 *   même scène et ne doivent jamais jouer en même temps (ex. les deux clips
 *   de la scène séries) : le parent gère laquelle est active.
 */
const WIDTH_CLASSES = {
  md: "w-56 sm:w-64",
  // Pour poser deux cartes côte à côte sans déborder sur mobile.
  sm: "w-40 sm:w-56",
};
// Garde-fou pour les formats extrêmes (ex. une image très haute) : la boîte
// s'ajuste au ratio réel, mais jamais au point de casser la mise en page.
const MAX_HEIGHT_CLASSES = "max-h-[26rem] sm:max-h-[30rem]";

export default function MediaRevealCard({
  type,
  src,
  alt,
  fallbackEmoji,
  fallbackLabel,
  visible,
  size = "md",
  autoPlay = true,
  playing = false,
  onRequestPlay,
}: {
  type: "image" | "video";
  src: string;
  alt?: string;
  fallbackEmoji: string;
  fallbackLabel: string;
  visible: boolean;
  size?: "md" | "sm";
  autoPlay?: boolean;
  /** Mode `autoPlay={false}` uniquement : contrôlé par le parent. */
  playing?: boolean;
  /** Mode `autoPlay={false}` uniquement : appelé quand on tape sur la vidéo à l'arrêt. */
  onRequestPlay?: () => void;
}) {
  const [error, setError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  function handlePlayRejection(err: unknown, video: HTMLVideoElement) {
    if (err instanceof DOMException && err.name === "NotSupportedError") {
      // Fichier absent ou format invalide.
      setError(true);
      return;
    }
    // Lecture avec son refusée pour une autre raison (rare) : on retente en
    // muet plutôt que de n'afficher rien du tout.
    video.muted = true;
    video.play().catch(() => {});
  }

  // Notifie la musique de fond (ducking) dès que cette vidéo joue avec du
  // son, et quand elle s'arrête — indépendant du mode autoPlay.
  useEffect(() => {
    if (type !== "video") return;
    const video = videoRef.current;
    if (!video) return;

    let notifiedPlaying = false;
    const handlePlaying = () => {
      if (!video.muted && !notifiedPlaying) {
        notifiedPlaying = true;
        notifyMediaPlaying();
      }
    };
    const handleStopped = () => {
      if (notifiedPlaying) {
        notifiedPlaying = false;
        notifyMediaStopped();
      }
    };
    const handleMetadata = () => {
      if (video.videoWidth && video.videoHeight) {
        setAspectRatio(video.videoWidth / video.videoHeight);
      }
    };

    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handleStopped);
    video.addEventListener("ended", handleStopped);
    video.addEventListener("loadedmetadata", handleMetadata);

    return () => {
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handleStopped);
      video.removeEventListener("ended", handleStopped);
      video.removeEventListener("loadedmetadata", handleMetadata);
      // Le composant disparaît (changement de scène) : la vidéo s'arrête.
      handleStopped();
    };
  }, [type]);

  // Mode autoPlay : démarre seule dès l'apparition.
  useEffect(() => {
    if (type !== "video" || !autoPlay) return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch((err) => handlePlayRejection(err, video));
  }, [type, src, autoPlay]);

  // Mode contrôlé (autoPlay={false}) : suit le prop `playing` du parent.
  useEffect(() => {
    if (type !== "video" || autoPlay) return;
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.play().catch((err) => handlePlayRejection(err, video));
    } else {
      video.pause();
    }
  }, [type, autoPlay, playing]);

  const showPlayOverlay = type === "video" && !autoPlay && !playing && !error;

  return (
    <motion.div
      className={`relative ${WIDTH_CLASSES[size]} ${MAX_HEIGHT_CLASSES}`}
      style={{ aspectRatio: aspectRatio ?? 1 }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={
        visible
          ? { opacity: 1, scale: 1, y: [0, -10, 0] }
          : { opacity: 0, scale: 0.85 }
      }
      transition={
        visible
          ? {
              opacity: { duration: 0.8 },
              scale: { duration: 0.8 },
              y: {
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              },
            }
          : { duration: 0.4 }
      }
    >
      {/* Glow violet derrière le visuel */}
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ background: "var(--glow)" }}
        aria-hidden="true"
      />

      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/50 bg-white/30 shadow-xl backdrop-blur-sm">
        {!error ? (
          type === "video" ? (
            <>
              <video
                ref={videoRef}
                src={src}
                loop
                playsInline
                preload={autoPlay ? undefined : "metadata"}
                className="h-full w-full object-contain"
                onError={() => setError(true)}
              />
              {showPlayOverlay && (
                <button
                  onClick={onRequestPlay}
                  aria-label="Lire la vidéo"
                  className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/35"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/85 text-2xl shadow-lg">
                    ▶️
                  </span>
                </button>
              )}
            </>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt ?? ""}
              className="h-full w-full object-contain"
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth && img.naturalHeight) {
                  setAspectRatio(img.naturalWidth / img.naturalHeight);
                }
              }}
              onError={() => setError(true)}
            />
          )
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
            <span className="text-4xl">{fallbackEmoji}</span>
            <span className="px-4 text-sm" style={{ color: "var(--violet-mid)" }}>
              {fallbackLabel}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
