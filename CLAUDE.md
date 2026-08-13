# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

PolarLab — a virtual physics lab for the Física II course (UTN FRRe) covering electromagnetic wave polarization. It is not meant to be a calculator: each guide problem becomes an interactive module with theory, live simulation, and validation. Every change updates in real time — no "Calcular" buttons.

The repo root is documentation-only (Markdown specs, the course PDF); all application code lives in `frontend/`.

## Commands

Run from `frontend/`:

```bash
npm install       # install dependencies
npm run dev       # start Vite dev server on 0.0.0.0:5173
npm run build     # production build
npm run preview   # preview the production build
```

There are no lint or test scripts configured yet.

## Architecture

**Stack**: React 18 + Vite + `react-router-dom` v7, plain JavaScript/JSX (no TypeScript, no Tailwind — despite what some root-level docs describe; see "Docs vs. code" below). Styling is a single global stylesheet, `frontend/src/styles.css`.

**Routing** (`frontend/src/App.jsx`): a `BrowserRouter` with a persistent header/footer shell wrapping three routes:
- `/` → `pages/HomePage.jsx` — landing page with theory summaries and links to practice problems.
- `/simulador` → `pages/SimulatorIndexPage.jsx` — index card list of problems.
- `/simulador/:problemId` → `pages/ProblemPage.jsx` — looks up the problem by id in a local `problemData` object and renders theory + equations + steps + the interactive simulator for it.

**Simulation pattern**: Both `HomePage.jsx` and `ProblemPage.jsx` independently implement the same polarization simulator (duplicated, not shared): four `useState` slider values (amplitude Ex, amplitude Ey, phase δ, rotation), a `requestAnimationFrame` loop advancing `time`, a Lissajous-curve point set computed each render for the SVG trace path, and threshold-based classification into Lineal / Circular / Elíptica. Rendering is inline SVG (`<path>`, `<line>`, `<circle>`), not Canvas.

**Adding a new problem**: add an entry to the `problemData` object in `ProblemPage.jsx` (title, subtitle, statement, theory, equations, steps) and a matching card entry in `SimulatorIndexPage.jsx`'s `problems` array — routing and rendering are driven entirely by these data objects, no new route wiring needed.

### Documentation — read before implementing anything

Required reading before any change: `docs/arq.md`, `docs/ROADMAP.md`, `docs/STYLE_GUIDE.md`, `docs/teoria/`, `docs/formulas/`. Do not implement functionality without first understanding the existing architecture (`Arquitectura modulo1.md`) described there.

Every change must:
- keep the design responsive (`docs/arq.md`);
- respect the existing architecture;
- reuse components instead of duplicating them;
- document any new functionality (update `docs/ROADMAP.md` and/or the relevant doc);
- avoid breaking existing functionality.

### Docs vs. code — read before trusting root-level Markdown

The root-level docs describe a *planned* architecture that the current code has not caught up to. Notably `Arquitectura modulo1.md` specifies a TypeScript + Tailwind + Canvas structure under `src/components/polarization/`, `src/hooks/`, `src/utils/`, `src/types/` (e.g. `usePolarization.ts`, `polarizationMath.ts`, `polarizationDetector.ts`) — none of that exists yet. The real `frontend/src/` currently only has `main.jsx`, `App.jsx`, `pages/`, and `styles.css`, with simulation math and SVG rendering inlined directly in the page components. When asked to build out module features, treat these docs as the target design to migrate toward, not a description of what's there today — check the actual files first, and see `docs/ROADMAP.md` for the incremental migration plan.

Doc locations:
- `docs/arq.md` — mobile-first responsive requirements (breakpoints to check: 360/390/768/1024/1440px; no desktop-only components; no horizontal scroll).
- `docs/ROADMAP.md` — current state, pending work per module, and the incremental architecture-migration plan.
- `docs/STYLE_GUIDE.md` — code and CSS conventions actually in use (component patterns, color palette, responsive breakpoint, content-as-data pattern).
- `docs/teoria/TeoriaModulo1.md`, `docs/teoria/TeoriaMetodosdePolarizacion.md` — theory content for Module 1 that any new simulator logic should stay consistent with.
- `docs/formulas/Formulas-modulo1.md` — math expressions and simplifications used by the simulator.
- `PROJECT_CONTEXT.md` (root) — project philosophy: prioritize visualization over formulas-only screens; base all physics content on the professor's video and the official problem guide, not external sources.
- `MODULO_1_POLARIZACION.md` (root) — functional spec and acceptance criteria for Module 1.
