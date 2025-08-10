# Content Guide (Non‑Developer Friendly)

Your app reads content from `public/content/tracks.v1.json`.

## What you can safely edit
- Track titles (`tracks[].name`)
- Chapter titles (`tracks[].chapters[].title`)
- Lesson titles (`tracks[].chapters[].lessons[].title`)
- Lesson sections (`sections` array): 
  - Use types: `hook`, `what`, and `h5` with a `label` (e.g., "Why it matters", "How to apply", "Example")
  - Edit the `text` value for each section
- Quiz: two True/False questions per lesson (UI is designed for 2‑option checks)
  - `quiz: [{ "q": "question", "labels": ["True","False"] }, ...]`
- XP per lesson (`xp`): numeric value used by the gamification tracker
- Takeaways and Learn More (`takeaways`, `learnMore`)

## How to update content
1. Open `public/content/tracks.v1.json` in any text editor.
2. Make your edits (keep the JSON structure intact).
3. Save and commit your changes.
4. Vercel will redeploy automatically (if connected to your repo).

## Tips
- Keep each lesson concise but actionable: Hook → What → Why → How → Example → Takeaways.
- The app awards XP when a lesson is completed. Higher XP near the end encourages completion.
- True/False quizzes should reinforce the one key action and challenge a common misconception.

## Backup
A copy of the original (previous) content was kept when we integrated the new curriculum.


## New features in this build
- **Config toggles:** `public/app.config.json` (enable/disable analytics, certificates, PWA, search, bookmarks; set badge thresholds).
- **PWA:** installable app + basic offline cache.
- **Certificates:** `/cert` page to print or save PDF (pass `?name=Your+Name&track=Track+Title`).
- **Search:** `/search` page to quickly find lessons.
- **Content validation:** `npm run validate:content` runs on build via JSON Schema.
