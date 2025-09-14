# Echoes — GitHub Pages

This repository publishes a static site via GitHub Pages. The actual site files live in `web/`.

- Online site (after Pages is enabled): your GitHub Pages URL will serve the app.
- Local preview of the static site: `python3 -m http.server 8080 --bind 0.0.0.0 --directory web`

Notes
- A root `index.html` redirects browsers to `web/` so Pages can serve from the repository root without moving files.
- The original project documentation has been moved to `info.md`.

Repo quick links
- Web app sources: `web/`
- Project docs: `info.md`
- Rust library: `src/lib.rs`
- CLI preview: `src/bin/print_roads.rs`

GitHub Pages setup
1) In the repository settings → “Pages”, set Source to “Deploy from a branch” and select the default branch (e.g., `main`) and `/ (root)`.
2) Save. Pages will serve `index.html`, which redirects to `web/`.
