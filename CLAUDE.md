# CLAUDE.md

Ce fichier fournit des instructions à Claude Code (claude.ai/code) pour travailler sur ce dépôt.

## Commandes

```bash
npm run dev       # Serveur de développement Vite
npm run build     # Build de production
npm run preview   # Prévisualisation du build de production
```

## Conventions non-obvieuses

- Les appels `axios` se font uniquement dans les fonctions de query TanStack Query, jamais directement dans les composants
- Responsive via `useMediaQuery('(min-width: 768px)')` avec deux JSX distincts — pas de classes `md:` pour les changements structurels majeurs (ex: tableaux avec layouts complètement différents entre mobile et desktop)
- La variable CSS `--vh` est définie dynamiquement dans `App.jsx` pour contourner le bug de hauteur viewport sur mobile
- La locale Luxon est forcée à `'en'` globalement dans `App.jsx`
- L'UI est exclusivement en **anglais** — ne jamais écrire de chaînes en français
- Discord OAuth est le seul moyen de connexion — pas de flux email/mot de passe
