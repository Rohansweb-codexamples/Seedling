# Seedling

A portrait 3D idle game about planting seeds and growing them into flowers.
Built with React + Vite and three.js (via `@react-three/fiber`).

## Running it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

The dev server is served on host port 3000. Dependencies are installed into the
`seedling-node-modules` named volume on startup, so `node_modules` never lands in
the checkout.

## How the game is put together

- `src/game/plants.js` — the plant catalogue (cost, growth time, oxygen rate,
  unlock level), shelf/pot layout, boosters, shop upgrades and every balance
  formula (growth, output, upgrade cost).
- `src/game/useGame.js` — the whole game loop: passive oxygen production, saving
  to `localStorage`, offline earnings, planting/upgrading/boosting actions.
- `src/components/Scene.jsx` — the three.js room: wall, window, shelves, lighting
  and a camera rig that reframes itself for the viewport aspect ratio.
- `src/components/Plant.jsx` / `PottedPlant.jsx` — procedural plants (no external
  3D assets) that grow through seed → sprout → bud → bloom.
- `src/components/*Panel.jsx` — the wooden sheets behind the bottom navigation.

## Deploying to GitHub Pages

The game is a plain static site once built, so Pages can host it:

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main` (or run *Deploy to GitHub Pages* from the Actions tab).

`.github/workflows/deploy-pages.yml` runs `npm ci && npm run build` and publishes
`dist/`. `vite.config.js` builds with a relative `base`, so the bundle resolves
its assets under `/<repo-name>/`. Opening `index.html` straight from the repo
will always be blank — it points at `/src/main.jsx`, which only a dev server can
transform.

## Notes

- No backend, no external services, no credentials: the save lives in the
  browser's `localStorage` under `seedling.save.v1`.
- `vite.config.js` allows the sandbox wildcard host only when
  `BASE44_PREVIEW_MODE` is exactly `"1"`, so the shared config keeps normal
  host checking everywhere else.
- Reset the garden from the gear button in the top right.
