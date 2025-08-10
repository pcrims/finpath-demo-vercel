# Deploying to Vercel (2 minutes)

1) Create a new GitHub repo and upload all files in this folder.
2) Go to Vercel → New Project → Import your repo.
3) Framework is auto-detected: **Next.js**. Build command: `npm run build` (default). Output: `.next` (default).
4) Click **Deploy**.

You’ll land on `/mvp` (the new curriculum) by default thanks to `middleware.ts`.
Your original routes remain available (e.g., `/your-existing-paths`).

## Where is the content?
All curriculum lives in `data/content.json` (and a namespaced copy under `content_mvp/data/content.json`).

- Edit it any time and redeploy.
- No code changes required for content updates.

## Preview locally
```bash
npm install
npm run dev
# then visit http://localhost:3000
```
