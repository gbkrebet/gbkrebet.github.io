# Echoes — Λαϊκοί Δρόμοι

A tiny Rust + static web project that displays Greek λαϊκοί δρόμοι (roads) for any tonic, with fixed interval patterns.

## Quick Start (Static Site)
- Serve the site on port 8080:
  - `python3 -m http.server 8080 --bind 0.0.0.0 --directory web`
- Open in a browser:
  - Local: `http://127.0.0.1:8080/`
  - Another machine on your LAN: `http://<host-ip>:8080/` (allow TCP/8080 in firewall)

## Rust Dev Quick Start
- Build: `cargo build`
- Test: `cargo test`
- Print all roads for a tonic (example Mi):
  - `cargo run --bin print_roads Mi`

## Project Structure
- `web/` — static site: `index.html`, `style.css`, `app.js` (no backend required)
- `src/lib.rs` — core logic: `NOTES`, `ROADS`, `notes_for()`
- `src/bin/print_roads.rs` — CLI to preview notes per road

## Features
- Tonic selector renders all Roads with computed notes for the chosen tonic.
- Click a Road to open a modal with:
  - Minor/Major classification (from 1st→3rd interval) and calculation.
  - All valid decompositions into 4‑/5‑chords, with a left sidebar of units, colored note sequence, and tonal centers.
- “Βρες το δρόμο” finder: pick exactly 7 notes; the app finds all matching Roads and tonics and lets you open their details.

## Notes
- Notes (12‑TET): Do, Do#, Re, Re#, Mi, Fa, Fa#, Sol, Sol#, La, La#, Si
- Roads keep their distances (e.g., Νιαβέντ: `T-H-3H-H-H-3H-H`).
- Example (Νιαβέντ from Mi): Mi, Fa#, Sol, La#, Si, Do, Re#, Mi

Road distances (ordered)
- Ουσάκ: `H-T-T-T-H-T-T`
- Φυσικό Μινόρε: `T-H-T-T-H-T-T`
- Αρμονικό Μινόρε: `T-H-T-T-H-3H-H`
- Νιαβέντ: `T-H-3H-H-H-3H-H`
- Νικρίζ: `T-H-3H-H-T-T-H`
- Καρσιγάρ: `T-H-T-H-3H-H-T`
- Χιτζάζ: `H-3H-H-T-H-T-T`
- Χιτζασκιάρ: `H-3H-H-T-H-3H-H`
- Πειραιώτικος: `H-3H-T-H-H-3H-H`
- Ραστ: `T-T-H-T-T-T-H`
- Χουζάμ: `3H-H-H-T-H-3H-H`
- Σεγκιά: `3H-H-H-T-T-T-H`

### Units (4‑chord & 5‑chord)
- Each road decomposes into a tetrachord plus a pentachord (order varies).
- Click a road card to reveal its colored decomposition: notes, per‑step distances, and the tonal center of each unit.

Requirements: Rust (edition 2021) and Python 3. No external crates/dependencies are used (Rust std only; web is plain HTML/CSS/JS).
