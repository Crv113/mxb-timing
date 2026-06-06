# CLAUDE.md

Ce fichier fournit des instructions à Claude Code (claude.ai/code) pour travailler sur ce dépôt.

## Commandes

```bash
npm run dev       # Serveur de développement Vite
npm run build     # Build de production
npm run preview   # Prévisualisation du build de production
```

## Conventions non-obvieuses

### Appels API
- Les fonctions fetch sont définies **en dehors du composant**, avant sa déclaration — pas à l'intérieur
- Pattern établi : `const fetchX = async (id) => { const { data } = await axios.get(...); return data; }`
- Les appels `axios` se font uniquement dans ces fonctions fetch, jamais directement dans le JSX
- QueryKey naming : tableaux avec identifiant string puis params (`["event", id]`, `["track-results", id]`)

### Responsive
- Breakpoint : `useMediaQuery('(min-width: 1024px)')` — pas 768px
- Deux JSX distincts quand le layout est structurellement différent (ex: tableaux de laptimes)
- Classes `md:` acceptées pour des ajustements mineurs de taille (padding, font-size) uniquement

### Composants existants à réutiliser
- `<Loading>` — état de chargement (voir `components/Loading.jsx`)
- `<Modal>` — modale générique
- `<Button>` — bouton stylé
- `<EventCard>` — carte d'un event
- `<TrackCard>` — carte d'une piste
- Message état vide : `<p className='text-center mt-4'>No X yet.</p>` (voir TrackDetail.jsx)

### Formatage
- Temps : `convertTimeFromMillisecondsToFormatted()` depuis `utils/time.js` — ne pas réimplémenter
- Dates : `DateTime` Luxon avec `.toFormat("ccc dd LLL yyyy HH:mm")`
- Badge moto : `bg-${bike.name.split(' ')[0].toLowerCase()} text-white text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap`

### Auth
- `useAuth()` depuis `context/AuthContext.jsx` — expose `user`, `isUserAuthenticated`, `isAdmin`, `authToken`
- Discord OAuth est le seul moyen de connexion — pas de flux email/mot de passe

### Autres
- La variable CSS `--vh` est définie dynamiquement dans `App.jsx` pour contourner le bug de hauteur viewport sur mobile
- La locale Luxon est forcée à `'en'` globalement dans `App.jsx`
- L'UI est exclusivement en **anglais** — ne jamais écrire de chaînes en français
- Tailwind uniquement — pas de CSS inline ni fichiers CSS séparés (sauf `App.css` existant)
- Ne jamais importer `@anthropic-ai/sdk`, `openai` ou tout SDK IA/tiers payant dans le code applicatif
