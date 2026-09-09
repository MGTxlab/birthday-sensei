Dépose ici les deux vidéos de la série préférée de Sensei : `clip1.mp4` et `clip2.mp4`
(les chemins sont définis dans `components/SeriesSection.tsx`, constantes `SERIES_CLIP_1_SRC` et `SERIES_CLIP_2_SRC`).

Chaque vidéo se lance automatiquement en boucle, muette (`autoplay`, `loop`, `muted`).
Tant qu'un fichier est absent, sa carte affiche un joli placeholder 📺 au lieu de casser.
