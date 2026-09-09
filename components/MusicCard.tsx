"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { notifyMediaPlaying, notifyMediaStopped } from "@/lib/audioDucking";

/**
 * Carte musicale réutilisable : bouton play/pause, ondes sonores animées,
 * petites notes qui flottent pendant la lecture. Pointe vers un fichier
 * audio local optionnel — si le fichier est absent, affiche un état
 * "à venir" propre au lieu de casser.
 *
 * Pendant la lecture, prévient la musique de fond (ducking) qu'elle doit se
 * couper — même logique que pour les vidéos (MediaRevealCard).
 */

const WAVE_BARS = [0, 1, 2, 3, 4];
const FLOATING_NOTES = ["🎵", "✨", "🎶"];

export default function MusicCard({
  src,
  label,
  showHint = false,
}: {
  src: string;
  label: string;
  /** Petite flèche animée qui invite à appuyer sur play (tant que ce n'est pas encore fait). */
  showHint?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    notifyMediaPlaying();
    return () => notifyMediaStopped();
  }, [isPlaying]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !available) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setAvailable(false);
          setIsPlaying(false);
        });
    }
  }

  return (
    <div
      className="relative flex w-full max-w-xs flex-col items-center gap-4 rounded-3xl border border-white/50 bg-white/30 px-6 py-6 shadow-xl backdrop-blur-sm"
      style={{ boxShadow: "0 0 30px var(--glow)" }}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onError={() => setAvailable(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Petites notes flottantes pendant la lecture */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
        aria-hidden="true"
      >
        {isPlaying &&
          FLOATING_NOTES.map((note, i) => (
            <motion.span
              key={note + i}
              className="absolute select-none text-sm"
              style={{ left: `${20 + i * 28}%`, bottom: "10%" }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.8, 0], y: -70 }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut",
              }}
            >
              {note}
            </motion.span>
          ))}
      </div>

      <div className="relative flex flex-col items-center">
        {showHint && available && !isPlaying && (
          <motion.span
            className="pointer-events-none select-none text-2xl"
            aria-hidden="true"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            👇
          </motion.span>
        )}
        <button
          onClick={togglePlay}
          disabled={!available}
          aria-label={isPlaying ? "Mettre en pause" : "Lire"}
          className="flex h-14 w-14 items-center justify-center rounded-full text-xl text-white shadow-md transition-opacity disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, var(--violet-mid), var(--violet-deep))",
          }}
        >
          {isPlaying ? "⏸" : "▶️"}
        </button>
      </div>

      <div className="flex h-8 items-end gap-1" aria-hidden="true">
        {WAVE_BARS.map((i) => (
          <motion.span
            key={i}
            className="h-6 w-1.5 rounded-full"
            style={{ background: "var(--violet-mid)", transformOrigin: "bottom" }}
            animate={
              isPlaying
                ? { scaleY: [0.25, 0.9, 0.4, 1, 0.25] }
                : { scaleY: 0.25 }
            }
            transition={
              isPlaying
                ? {
                    duration: 0.9 + i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : { duration: 0.3 }
            }
          />
        ))}
      </div>

      {available ? (
        <p className="text-xs opacity-60" style={{ color: "var(--violet-deep)" }}>
          {label}
        </p>
      ) : (
        <p className="text-xs opacity-70" style={{ color: "var(--violet-mid)" }}>
          🎵 {label} à venir
        </p>
      )}
    </div>
  );
}
