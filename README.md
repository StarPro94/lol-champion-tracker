# LoL Champion Tracker

Application web statique pour suivre les champions League of Legends que vous avez déjà joués.

## Fonctionnalités

- Liste complète des champions via Riot Data Dragon API
- Marquer/démarquer chaque champion comme "joué"
- Barre de progression en temps réel
- Recherche instantanée par nom
- Filtres : Tous / Joués / Non joués
- Persistance locale (localStorage)
- Export/Import de progression (fichier JSON)

## Installation

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview
```

## Déploiement

### GitHub Pages

1. Build le projet : `npm run build`
2. Déployer le dossier `dist` sur la branche `gh-pages`

Ou utiliser gh-pages :
```bash
npm install -D gh-pages
# Ajouter dans package.json: "deploy": "gh-pages -d dist"
npm run deploy
```

### Vercel

```bash
npm install -g vercel
vercel
```

## Limitations

- **localStorage** : Les données sont stockées localement dans le navigateur. Si vous changez d'ordinateur ou de navigateur, vos données ne seront pas synchronisées automatiquement.
- **Conservation** : Les données peuvent être supprimées si l'utilisateur efface les données du site dans son navigateur.
- **Solution** : Utilisez la fonction "Exporter" régulièrement pour sauvegarder votre progression.

## Technologies

- React 18 + TypeScript
- Vite
- Riot Data Dragon API
