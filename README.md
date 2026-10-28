# TaskBoard — CRA → Vite Migration

A real React app migrated from Create React App to Vite, with **measured** before/after
numbers rather than marketing claims.

The point of this repo is honesty: I measured everything on one machine, twice, and I report
the parts where the migration *didn't* help as prominently as the parts where it did.

## Results (measured, Intel Mac, macOS 13.7, Node 24.15.0)

| Metric | CRA 5.0.1 | Vite 6.4.5 | Change |
|---|---|---|---|
| **Dev server start** | 8.6 s (median of 3) | **1.1 s** | **~7.8x faster** |
| Production build | 20.3 s (22.6 / 18.1) | 7.3 s (3.8 / 7.3 / 12.8) | ~2.8x faster ⚠️ noisy |
| Dependencies installed | 1,291 | 6 direct | — |
| Install time | 5 m 37 s (npm) | 7.4 s (pnpm) | ~45x |
| JS bundle (gzip) | 76.4 kB | 80.5 kB | **+5% larger** |
| CSS bundle (gzip) | 1.81 kB | 1.73 kB | ~same |

### What this honestly shows

**The real win is dev server start: 8.6s → 1.1s.** That's the number a developer feels twice an
hour, every hour. It's the strongest and most defensible result here.

**Production build time is the weakest result, and I'm not going to dress it up.** 18s → 7s
looks good, but for an app this small the Vite build times were noisy (3.75s, 7.3s, 12.8s
across three runs on a machine under load). On a small app, CRA's build wasn't actually
painful. The build-time gap widens substantially with app size — but I have not measured that
here, so I'm not claiming it.

**Bundle size did not improve — it got 5% bigger.** Vite does not tree-shake `lodash` any
better than CRA's webpack config did. Anyone selling a migration on "smaller bundles" is
usually measuring a different app. The honest claim is: *same size, but you can actually
configure it.*

### Measurement methodology

- Dev server start = wall clock from process spawn until `curl http://localhost:PORT/`
  returns HTTP 200. Each run on a fresh port with no pre-existing listener.
- Production build = `/usr/bin/time -p` around a clean build (`rm -rf dist build` first).
- Medians reported, not best-case.
- CRA measured with npm (its canonical installer). Vite measured with pnpm.
  **Installer is orthogonal to the bundler** — it's varied because pnpm is the better default
  on the Vite side, not to flatter the numbers.

## What the migration actually involved

This is the part clients care about: not "it's faster," but "how risky is the switch."

**6 kinds of change across ~15 files, ~40 lines, no component logic rewritten.** Most of the
file count is renames. The app's behaviour is identical; only the build system and module
boundaries changed.

**Verify this yourself.** Diffing the two `src` trees:

```bash
diff before-cra/src/App.js after-vite/src/App.jsx
# 15c15
# < const BOARD_TITLE = process.env.REACT_APP_BOARD_TITLE || 'TaskBoard';
# > const BOARD_TITLE = import.meta.env.VITE_BOARD_TITLE || 'TaskBoard';

for c in Header Card Board Column StatsBar Modal CardForm FilterBar EmptyState ActivityFeed; do
  diff before-cra/src/components/$c.js after-vite/src/components/$c.jsx
done
# (no output — all 10 components are byte-identical)
```

Exactly **one line of application logic** differs. All 16 non-component source files (CSS,
`theme.js`, `useLocalStorage`, `format.js`, `seed.js`) are byte-identical.

1. **`package.json`** — swap `react-scripts` for `vite` + `@vitejs/plugin-react`; move
   `react`/`react-dom` to plain deps; add `"type": "module"`; replace scripts.
2. **`index.html`** — move from `public/` to project root; drop `%PUBLIC_URL%`; add
   `<script type="module" src="/src/main.jsx">`.
3. **`src/index.js` → `src/main.jsx`** — rename only.
4. **`App.js` → `App.jsx` and all 10 components `.js` → `.jsx`** — required. See gotcha #1.
5. **`process.env.REACT_APP_X` → `import.meta.env.VITE_X`** — CRA's env mechanism doesn't
   exist in Vite. Rename `.env` keys from `REACT_APP_` to `VITE_`.
6. **`vite.config.js`** — new, 8 lines.

**Kept as-is:** every component, all CSS, `lodash` and `date-fns` usage, the custom
`useLocalStorage` hook, and all state logic. No rewrite, no "while we're in here" scope creep.

### Gotchas I hit (and fixed) — the useful part

1. **JSX in `.js` files breaks Vite.** Vite only parses JSX in `.jsx`/`.tsx`. CRA allowed
   JSX in `.js`. Result: `Failed to parse source for import analysis`. Fix: rename every
   file containing JSX. This is the most common CRA→Vite failure and the one most likely to
   bite during an incremental migration.
2. **`process.env` is undefined.** CRA injects `process`; Vite does not. Any `process.env`
   reference becomes a runtime crash.
3. **`PORT` env var is ignored by Vite.** CRA reads `PORT`; Vite needs `--port`. Scripts and
   CI configs that set `PORT` must change.
4. **pnpm 12 blocks postinstall scripts.** `esbuild` needs one. Requires
   `allowBuilds: { esbuild: true }` in `pnpm-workspace.yaml` — note this setting moved out of
   `package.json` in pnpm 10+, and the older `onlyBuiltDependencies` key is ignored.
5. **`pnpm dev -- --port X` silently doesn't work.** pnpm passes the literal `--` through to
   Vite, which ignores it. Use `pnpm exec vite --port X` in scripts that need an explicit port.

## Running it

```bash
# Before (CRA)
cd before-cra && npm install && npm start

# After (Vite)
cd after-vite && pnpm install && pnpm dev
```

Both apps are functionally identical: a task board with four columns, create/move/delete,
search and priority filtering, an activity feed, and `localStorage` persistence.

## Honest scope note

This is a **portfolio demonstration of a migration process**, built so that the claims in it
can be checked. It is not a benchmark of your app — migration outcomes depend heavily on app
size, custom webpack config, and dependency surface. If your CRA app has `eject`-ed webpack
config or CRA overrides (`craco`, `react-app-rewired`), the work is meaningfully larger than
what's shown here, and I'd say so before quoting.
