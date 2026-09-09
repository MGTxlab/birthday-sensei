import { BASE_PATH } from "./basePath";

/**
 * Le site est déployé sous /birthday-sensei/ (GitHub Pages, cf. `basePath`
 * dans next.config.ts). Next.js applique automatiquement ce basePath aux
 * pages et à next/link, mais PAS aux balises <img>/<video>/<audio>
 * classiques ni à `new Image().src` — utilisées partout dans ce projet pour
 * les médias locaux (musique, vidéos, images).
 *
 * Important : contrairement à d'anciennes versions de Next.js, le serveur
 * de dev applique lui aussi le basePath (vérifié : `/music/x.mp3` répond
 * 404, seul `/birthday-sensei/music/x.mp3` fonctionne). Le préfixe est donc
 * ajouté systématiquement, pas seulement en production.
 *
 * `asset('/music/opening.mp3')` renvoie '/birthday-sensei/music/opening.mp3'
 * aussi bien en dev qu'en build — un seul endroit à changer si le nom du
 * dépôt (et donc le basePath) change : `lib/basePath.ts`.
 */
export const asset = (path: string) => `${BASE_PATH}${path}`;
