# meyela.tv

Official website of **Meyela**, a Turkish animated series for children aged 3–7.

A static site with no build step: `index.html`, `css/`, `js/` and `assets/`.

## Deploying on Vercel
- Framework preset: **Other**
- Build command: *(empty)*
- Output directory: `.` (root)
- Headers, caching and clean URLs are configured in `vercel.json`.

## Running locally
```
python3 -m http.server 8787
```
Then open http://localhost:8787.

## Structure
- `index.html`: home page (hero, Meyela TV, characters, episodes, for families, shop teaser)
- `404.html`: error page
- `assets/video`: web versions of the episodes and shorts
- `assets/img`: logo, character portraits, covers, icons
- `js/main.js`: TV channel switching, episode shelf, menu, shutter animation
