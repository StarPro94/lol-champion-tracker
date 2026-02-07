# LoL Champion Tracker

Application web statique pour suivre votre progression sur les champions de League of Legends. Marquez les champions que vous avez déjà joués et visualisez votre progression pour compléter tous les champions du jeu.

## Fonctionnalités

- **Visualisation complète** : Tous les champions de LoL avec icônes officielles Data Dragon
- **Tracking en 1 clic** : Marquez un champion comme "joué" en un seul clic
- **Persistance locale** : Vos données sont stockées dans votre navigateur (localStorage)
- **Filtres avancés** :
  - Par statut : Tous / Joués / Non joués
  - Par classe (tags officiels) : Mage, Assassin, Tank, etc.
  - Par ressource : Mana, Énergie, Aucune, etc.
  - Par rôle lane (custom) : TOP, JUNGLE, MID, BOT, SUPPORT, FLEX
- **Tri** : Alphabétique, difficulté, non joués d'abord, dernier joué
- **Statistiques détaillées** : Progression globale, par classe, par rôle lane
- **Champion aléatoire** : Suggestions de champions non joués selon vos filtres
- **Import/Export** : Sauvegardez et restaurez votre progression (format JSON)

## Aperçu

![LoL Champion Tracker](https://img.shields.io/badge/League%20of%20Legends-Champion%20Tracker-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9InVybCgjbG9nby1ncmFkKSIvPjxwYXRoIGQ9Ik0xMCA4TDIyIDhMMjIgMTRMMjggMTRMMjggMjRMNCAyNEM0IDE0TDEwIDE0WiIgZmlsbD0iIzA5MTQyOCIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjUiIGZpbGw9IiNDODlCM0MiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImxvZ28tZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0M4OUIzQyIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzBBQzhCOUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=)

## Installation locale

### Prérequis

- Node.js 18+ ou supérieur
- npm ou yarn

### Étapes

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/StarPro94/lol-champion-tracker.git
   cd lol-champion-tracker
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir votre navigateur**
   L'application sera disponible sur `http://localhost:3000`

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Crée un build de production |
| `npm run preview` | Prévisualise le build de production localement |
| `npm run lint` | Exécute le linter ESLint |
| `npm run type-check` | Vérifie les types TypeScript |

## Build pour production

```bash
npm run build
```

Le build générera un dossier `dist/` contenant tous les fichiers statiques prêts à être déployés.

## Déploiement sur Vercel

### Méthode recommandée : Importer le dépôt GitHub

1. **Créer un compte Vercel**
   - Allez sur [vercel.com](https://vercel.com) et créez un compte (gratuit)

2. **Importer le dépôt**
   - Cliquez sur "Add New Project"
   - Sélectionnez "Import Git Repository"
   - Entrez : `https://github.com/StarPro94/lol-champion-tracker`
   - Cliquez sur "Import"

3. **Configurer le projet**
   Vercel devrait détecter automatiquement les paramètres suivants :
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install`

   Si la détection automatique échoue, entrez ces valeurs manuellement.

4. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez quelques secondes...
   - Votre site sera disponible à une URL comme `https://lol-champion-tracker.vercel.app`

5. **Déploiements automatiques**
   - À chaque push sur la branche `main`, Vercel redéploiera automatiquement
   - Vous pouvez aussi activer les déploiements de preview pour les pull requests

### Personnalisation (optionnel)

Pour personnaliser l'URL de votre projet :
1. Allez dans "Settings" de votre projet sur Vercel
2. Section "Domains"
3. Ajoutez votre domaine personnalisé

## Données et Stockage

### Source des données

Les champions sont récupérés depuis [Data Dragon](https://developer.riotgames.com/docs/ddragon), l'API officielle de Riot Games :
- Versions : `https://ddragon.leagueoflegends.com/api/versions.json`
- Champions : `https://ddragon.leagueoflegends.com/cdn/{version}/data/fr_FR/champion.json`

### Stockage local

Toutes vos données sont stockées localement dans votre navigateur via localStorage :
- **Clé** : `lol-champion-tracker:v1`
- **Contenu** : liste des champions joués, rôles lanes assignés, dates de jeu

### Export/Import

Pour sauvegarder votre progression :
1. Cliquez sur "Exporter" pour télécharger un fichier JSON
2. Gardez ce fichier en sécurité (cloud, clé USB, etc.)

Pour restaurer votre progression :
1. Cliquez sur "Importer"
2. Choisissez "Fusionner" pour ajouter aux données existantes
3. Ou choisissez "Remplacer" pour écraser les données existantes

## Stack Technique

- **Framework** : React 18 avec TypeScript
- **Build tool** : Vite 6
- **Styling** : CSS vanilla avec variables CSS
- **Données** : Riot Games Data Dragon API
- **Persistance** : localStorage (pas de backend)
- **Hébergement** : Vercel

## Structure du projet

```
src/
├── components/       # Composants React
│   ├── ChampionCard.tsx
│   ├── ChampionGrid.tsx
│   ├── FilterPanel.tsx
│   ├── ImportExport.tsx
│   ├── ProgressBar.tsx
│   ├── SearchBar.tsx
│   └── StatsPanel.tsx
├── hooks/           # Hooks personnalisés
│   ├── useChampions.ts
│   ├── useFilters.ts
│   └── useLocalStorage.ts
├── types/           # Types TypeScript
│   └── champion.ts
├── utils/           # Utilitaires
│   ├── ddragon.ts    # Data Dragon API
│   ├── filters.ts    # Logique de filtrage
│   └── storage.ts    # localStorage
├── App.tsx          # Composant principal
├── main.tsx         # Point d'entrée
└── index.css        # Styles globaux
```

## Notes importantes

- **Pas de synchronisation multi-appareils** en V1 : les données sont locales à chaque navigateur
- **Rôles lanes** sont **custom** et non officiels : Riot ne fournit pas ces informations via Data Dragon
- **Offline** : L'application nécessite une connexion internet pour charger les champions la première fois

## Roadmap (V2 potentielle)

- [ ] Synchronisation multi-appareils (via Convex)
- [ ] Comptes utilisateurs avec authentification
- [ ] Historique complet des parties
- [ ] Statistiques avancées (winrate, KDA, etc.)
- [ ] Thèmes clairs/sombres
- [ ] PWA pour installation mobile

## Licence

MIT

## Crédits

- Données champions fournies par [Riot Games](https://www.riotgames.com/)
- Icônes et ressources via [Data Dragon](https://developer.riotgames.com/docs/ddragon)
- Design inspiré de l'interface de League of Legends

---

## Definition of Done ✅

- [x] Tous les champions de LoL sont affichés avec icône + nom
- [x] Marquer un champion comme "joué" en 1 clic
- [x] Persistance des données entre sessions (localStorage)
- [x] Filtre par statut (Tous/Joués/Non joués)
- [x] Filtre par classe (tags officiels Data Dragon)
- [x] Filtre par ressource (partype)
- [x] Filtre par rôle lane custom (TOP/JUNGLE/MID/BOT/SUPPORT/FLEX)
- [x] Tri alphabétique
- [x] Tri par difficulté
- [x] Tri "non joués d'abord"
- [x] Tri "dernier joué"
- [x] Recherche instantanée par nom
- [x] Barre de progression (X/Total + %)
- [x] Stats globales (% complété, restants)
- [x] Stats par classe
- [x] Stats par rôle custom
- [x] Bouton "Random champion non joué"
- [x] Export JSON de la progression
- [x] Import JSON avec choix merge/overwrite
- [x] Réinitialisation avec confirmation
- [x] Mode dégradé si localStorage indisponible
- [x] Fallback langue (fr_FR → en_US)
- [x] Placeholder si image ne charge pas
- [x] Design responsive (mobile, tablette, desktop)
- [x] Accessibilité clavier (tab, enter, escape)
- [x] ARIA labels pour screen readers
- [x] Build production fonctionne (`npm run build`)
- [x] README avec instructions locales complètes
- [x] README avec instructions Vercel détaillées
- [x] Code pushé sur GitHub
