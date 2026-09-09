/**
 * Petit coordinateur partagé : permet à n'importe quel média qui joue avec
 * son (vidéo via MediaRevealCard, musique via MusicCard) de prévenir la
 * musique de fond (BackgroundMusic) qu'elle doit se couper, puis reprendre
 * une fois que plus rien ne joue. Pas de Context React nécessaire pour un
 * besoin aussi ponctuel — un compteur partagé (plusieurs médias peuvent
 * jouer en même temps, ex. les deux vidéos de la scène séries) avec un petit
 * pub/sub suffit.
 */

type Listener = (activeCount: number) => void;

let activeMediaCount = 0;
const listeners = new Set<Listener>();

export function notifyMediaPlaying() {
  activeMediaCount += 1;
  listeners.forEach((listener) => listener(activeMediaCount));
}

export function notifyMediaStopped() {
  activeMediaCount = Math.max(0, activeMediaCount - 1);
  listeners.forEach((listener) => listener(activeMediaCount));
}

/** Retourne une fonction de désabonnement. Appelle le listener immédiatement avec l'état courant. */
export function subscribeMediaActivity(listener: Listener) {
  listener(activeMediaCount);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
