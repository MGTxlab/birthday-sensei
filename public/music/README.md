Dépose ici tes fichiers audio locaux (non fournis) :

- `background.mp3` — utilisé par `components/BackgroundMusic.tsx` : musique
  de fond discrète, présente sur tout le site (bouton 🔇/🔊 en haut à droite
  pour la couper). Démarre au premier clic sur le site (contrainte des
  navigateurs : pas de son sans interaction).
- `opening.mp3` — utilisé par `components/MusicSection.tsx`
- `bts.mp3` — utilisé par `components/BTSSection.tsx`
- `final.mp3` — utilisé par `components/FinalMessage.tsx` (optionnel)

Les chemins sont définis en constante en haut de chaque composant. Tant qu'un
fichier est absent, la carte musicale (ou le bouton de musique de fond)
disparaît/affiche un état « à venir » propre au lieu de casser.
