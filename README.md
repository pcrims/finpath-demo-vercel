# FinPath Demo (Full)
Tracks 1–3, onboarding quiz, gamification (streaks + weekly tiers), and local progress.

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy to Netlify
1. Create a new site from this folder.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Ensure SPA fallback is enabled (we included `netlify.toml` and `_redirects`).

## Deploy to Vercel
1. Import the project in Vercel.
2. It will read `vercel.json` with:
   - buildCommand: `npm run build`
   - outputDirectory: `dist`
   - SPA rewrite to `/index.html`

## Notes
- Tailwind via CDN (no PostCSS required).
- No auth; progress is stored in `localStorage` under key `finpath:v5`.
- Education-only; not financial advice.
