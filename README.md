# CRNetwork

CourtReserve network prototype. Vite + React app at the root, with the
original Babel-standalone prototype preserved alongside it.

## Run

```sh
npm install   # needs .npmrc — see Auth below
npm run dev   # http://localhost:5173/CRNetwork/
```

`npm run build` outputs to `dist/`. `npm run preview` serves the built site.

## Layout

- `src/` — new Vite + React app (`main.jsx`, `App.jsx`).
- `index.html` — Vite entry; mounts `src/main.jsx` into `#root`.
- `vite.config.js` — `base: '/CRNetwork/'` for GitHub Pages.
- `public/` — the original prototype (HTML + JSX + fonts). Served verbatim
  by Vite at `/CRNetwork/networkPOC.html` etc.
- `.github/workflows/deploy.yml` — builds and deploys to Pages on every
  push to `main`.

## Auth (private npm registry)

`@courtreserve` packages live on a private Azure DevOps Artifacts feed.
`.npmrc` is gitignored because it contains a PAT.

- **Local:** put a `.npmrc` with the registry block at the repo root.
- **CI:** the `AZURE_DEVOPS_PAT` repo secret is templated into a CI-only
  `.npmrc` by the deploy workflow.

## Origin

Imported from a Claude Design handoff. The original chats live with the
design bundle, not in this repo.
