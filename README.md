# networkPOC

CourtReserve events-discovery prototype. HTML + JSX (Babel-standalone) — no build step.

## Run

```sh
python3 -m http.server 8080
```

Then open <http://localhost:8080/networkPOC.html>.

## Layout

- `networkPOC.html` — entry point; loads React/ReactDOM/Babel/Lucide from unpkg and stitches the JSX modules together.
- `*.jsx` — components (transformed in the browser by Babel-standalone).
- `colors_and_type.css` — design tokens + `@font-face` declarations.
- `fonts/` — Axiforma font files referenced by the CSS.

## Origin

Exported from Claude Design and dropped in as-is. See the design bundle's `chats/` for the iteration history.
