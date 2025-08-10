
# FinPath — v1.10 (Vercel-ready, progressive tracks, external content)

- Professional tone microcopy
- 25 lessons per track (demo text for now)
- Mobile-safe circular progress
- Externalised content at `/public/content/tracks.v1.json` (fetched at runtime)
- Progressive track locking by stage
- 10-question swipe questionnaire
- LocalStorage progress (no auth)

## Run locally
```bash
npm install
npm run dev
```

## Deploy to Vercel
```bash
npm install
npm run build
npx vercel --prod
# Framework: Vite | Build: npm run build | Output: dist
```
