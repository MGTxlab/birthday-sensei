"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const WIDTH_CLASSES = "w-56 sm:w-64";
// Garde-fou pour les formats extrêmes : la boîte s'ajuste au ratio réel de
// chaque image (plus de recadrage), mais jamais au point de casser la mise
// en page.
const MAX_HEIGHT_CLASSES = "max-h-[26rem] sm:max-h-[30rem]";
const VISIBLE_DURATION_MS = 3000; // combien de temps une image reste affichée
const HIDDEN_DURATION_MS = 1800; // pause avant la prochaine apparition

function randomPosition() {
  // Zone raisonnable pour rester à l'écran (marge de sécurité sur les bords).
  return {
    top: `${15 + Math.random() * 45}%`,
    left: `${15 + Math.random() * 55}%`,
  };
}

/**
 * Boîte (même habillage que MediaRevealCard) qui surgit à un endroit
 * aléatoire de la scène, affiche une image au hasard parmi plusieurs, puis
 * disparaît entièrement — jamais deux fois au même endroit ni avec la même
 * image d'affilée. Vérifie d'abord quelles images se chargent vraiment (et
 * retient leur format réel, pour que la boîte s'y ajuste sans rogner) ; si
 * aucune n'est disponible, n'affiche rien (le site ne casse jamais).
 */
export default function RandomImageBox({
  images,
  visible,
}: {
  images: string[];
  visible: boolean;
}) {
  const [validImages, setValidImages] = useState<string[] | null>(null);
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState<string | null>(null);
  const [position, setPosition] = useState(() => randomPosition());
  const lastRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const ratios: Record<string, number> = {};
    Promise.all(
      images.map(
        (src) =>
          new Promise<string | null>((resolve) => {
            const img = new window.Image();
            img.onload = () => {
              if (img.naturalWidth && img.naturalHeight) {
                ratios[src] = img.naturalWidth / img.naturalHeight;
              }
              resolve(src);
            };
            img.onerror = () => resolve(null);
            img.src = src;
          })
      )
    ).then((results) => {
      if (cancelled) return;
      setAspectRatios(ratios);
      setValidImages(results.filter((r): r is string => r !== null));
    });
    return () => {
      cancelled = true;
    };
  }, [images]);

  useEffect(() => {
    if (!visible || !validImages || validImages.length === 0) return;

    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    function pickNext() {
      const pool = validImages as string[];
      // Évite de répéter deux fois de suite la même image quand on a le choix.
      let next = pool[Math.floor(Math.random() * pool.length)];
      if (pool.length > 1) {
        while (next === lastRef.current) {
          next = pool[Math.floor(Math.random() * pool.length)];
        }
      }
      lastRef.current = next;
      setPosition(randomPosition());
      setCurrent(next);

      timeout = setTimeout(() => {
        if (cancelled) return;
        setCurrent(null);
        timeout = setTimeout(() => {
          if (!cancelled) pickNext();
        }, HIDDEN_DURATION_MS);
      }, VISIBLE_DURATION_MS);
    }

    pickNext();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [visible, validImages]);

  if (!validImages || validImages.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <AnimatePresence>
        {visible && current && (
          <motion.div
            key={current}
            className={`absolute ${WIDTH_CLASSES} ${MAX_HEIGHT_CLASSES}`}
            style={{
              top: position.top,
              left: position.left,
              aspectRatio: aspectRatios[current] ?? 1,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{ background: "var(--glow)" }}
            />
            <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/50 bg-white/30 shadow-xl backdrop-blur-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current}
                alt=""
                className="absolute inset-0 h-full w-full object-contain object-center"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
