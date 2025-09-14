# Repository Guidelines

## Project Structure & Module Organization
- Core library: `src/lib.rs` exposes `NOTES`, `ROADS`, and `notes_for()`.
- Binary: `src/bin/print_roads.rs` (CLI preview). Legacy entry: `src/main.rs`.
- Web UI: `web/` with `index.html`, `style.css`, `app.js`.
- Add modules under `src/` using snake_case (e.g., `src/parser.rs`) and declare with `mod parser;`.
- Prefer small modules grouped by responsibility. Place domain types in `src/<area>/mod.rs` when a folder grows.
- Integration tests go in `tests/` (e.g., `tests/cli_test.rs`). Example programs belong in `examples/`. Optional assets in `assets/`.

## Build, Test, and Development Commands
- Build: `cargo build` — compiles the project in debug mode.
- Run: `cargo run -- <args>` — runs the binary with arguments.
- Test: `cargo test` — runs unit and integration tests.
- Lint: `cargo clippy -- -D warnings` — static analysis; treat warnings as errors.
- Format: `cargo fmt --all` — formats codebase using rustfmt. Use `--check` in CI.

### Serve the Static Site (port 8080)
- One-liner: `python3 -m http.server 8080 --bind 0.0.0.0 --directory web`
- Browse locally: `http://127.0.0.1:8080/`
- From another machine: `http://<host-ip>:8080/` (ensure firewall allows TCP/8080)

### CLI Preview
- Print all roads for a tonic: `cargo run --bin print_roads Mi`

## Coding Style & Naming Conventions
- Rust 2021 edition; 4‑space indentation; no tabs.
- Naming: modules/files `snake_case`; functions/vars `snake_case`; types/traits `CamelCase`; constants/statics `SCREAMING_SNAKE_CASE`.
- Keep functions small and pure when possible; prefer `Result<T, E>` over panics for recoverable errors.
- Public API: document with `///` rustdoc comments and clear examples.

## Testing Guidelines
- Unit tests live alongside code in `#[cfg(test)] mod tests { ... }` blocks.
- Integration tests in `tests/` named `*_test.rs`. Example: `tests/cli_test.rs` with `Command::cargo_bin("echoes")` if using `assert_cmd`.
- Aim to cover edge cases and error paths. Run `cargo test` locally before pushing.

## Web UI Overview
- `index.html` provides the layout; `style.css` styles a responsive grid; `app.js` renders logic.
- Tonic selector: renders all Roads with computed notes for the chosen tonic.
- Road modal (on click): shows distances, notes, Minor/Major classification (1st→3rd interval), and all valid 4‑/5‑chord decompositions with a left unit sidebar, colored note sequence, and unit tonal centers.
- Finder (“Βρες το δρόμο”): modal to pick exactly 7 notes; matches Roads across tonics and links to their details.
- The site is fully static; serve with Python as shown above (no Rust server included).

## Library API & Data
- Notes (12-TET): `NOTES = [Do, Do#, Re, Re#, Mi, Fa, Fa#, Sol, Sol#, La, La#, Si]`.
- Roads: `ROADS` holds Greek names, fixed distance strings, and semitone step arrays.
- Example: Νιαβέντ from Mi → `Mi, Fa#, Sol, La#, Si, Do, Re#, Mi`.
- Naming note: Distances are implemented under the name “Χουζάμ”.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, `ci:`.
- Commits should be small, scoped, and contain imperative subject lines (≤72 chars).
- PRs: include a summary, rationale, and any linked issues. Add examples of input/output for behavior changes.

## Security & Configuration Tips
- Do not commit secrets. Use environment variables for local config; document required vars in the PR.
- Run `cargo update -p <crate>` when addressing dependency advisories and note the change in the PR.

## Dependencies
- No external crates/dependencies are used. Stick to Rust std, and plain HTML/CSS/JS for the web.
- Do not add new crates or third‑party JS without prior discussion/approval.

## Agent-Specific Instructions
- Keep patches minimal and focused; do not reorganize directories without discussion.
- Follow these guidelines for any code you touch and update this document if conventions evolve.
