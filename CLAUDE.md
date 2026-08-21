# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Vite dev server
npm run build          # tsc (typecheck, noEmit) && vite build — the only typecheck entry point
npm run lint           # ESLint over ts/tsx, --max-warnings 0 (Prettier runs as an ESLint rule)
npm run format         # prettier --write .   (format:check for CI-style verification)
npx steiger ./src      # Feature-Sliced Design architecture linter — no npm script for it
npm run preview        # serve the built dist/
```

There is no test runner configured in this project.

## Architecture

Vite + React 18 + TypeScript, no router, no state library. UI text is Russian; source comments are mixed Russian/English.

### Feature-Sliced Design

`src/` follows FSD and the layout is enforced by **steiger** (`steiger.config.ts`). Run `npx steiger ./src` after any structural change — it catches misplaced files, missing public APIs, and cross-layer import violations that ESLint does not.

Layers, import direction strictly downward (`app → pages → widgets → features → entities → shared`):

- `app/` — `main.tsx` entry, `App.tsx`, global styles (`reset`, `fonts`, `App.scss`)
- `pages/tasks/` — thin page shell, renders the widget
- `widgets/TodoList/` — composes the task list, the "add task" button, and both modals; this is where task state belongs
- `features/task-form/`, `features/delete-task/` — the add/edit modal and the delete-confirm modal
- `entities/task/` — `model/types.ts` (`Task`, `Priority`, `Status` enums), `api/taskList.ts` (in-memory seed data), `ui/TaskCard`
- `shared/ui` (barrel at `shared/ui/index.ts`), `shared/styles`, `shared/assets`

**Public API rule**: every slice exposes a root `index.ts`; import across slices through the slice root (`import { TaskCard, taskList } from '@/entities/task'`), never a deep path. Inside a slice, use relative imports (`../../model/types`). `shared/assets` and `shared/styles` are exempted from the public-api rule in `steiger.config.ts` since they have no TS API.

### Conventions

- **`@/*` alias → `./src`**, declared in _both_ `vite.config.ts` (`resolve.alias`) and `tsconfig.json` (`paths`). Changing one without the other breaks either the build or the editor.
- **SVGs as components**: `import Add from '@/shared/assets/icons/add.svg?react'` via `vite-plugin-svgr`; the `*.svg?react` module is declared in `src/vite-env.d.ts`.
- **Styles**: plain SCSS with global class names (no CSS Modules). Each component has a co-located `style.scss` imported at the top of its `.tsx`. Pull shared tokens with `@use '@/shared/styles/theme.scss' as *;` and media queries with `@use '@/shared/styles/breakpoints.scss' as breakpoints;` (`@include breakpoints.devices(sm)`). Vite is pinned to the modern Sass API.
- TS is `strict` with `noUnusedLocals`/`noUnusedParameters`, so unused props must be left out of the destructuring, not just ignored.

## Current state of the work

The repo is an assignment (spec in `README.md`, in Russian): the markup is complete but **the app is a static mock and wiring up state is the task**.

- `widgets/TodoList/ui/TodoList.tsx` hardcodes `showAddEditModal`/`showDeleteModal` to `false` and every `onClick` is a no-op; the list renders the `taskList` seed array directly.
- `shared/ui/Button` deliberately drops `onClick`/`disabled` (see the comment in the file) — restoring them is part of making the app work.
- `TaskCard` and `AddEditTaskModal` render raw enum values (`high`, `todo`, …). The spec requires Russian labels ("Высокий", "Сделано", …) — the intended home for that mapping is `entities/task`, re-exported from its `index.ts`.
- The add/edit modal is one component for both modes; the title and the submit-button label switch between "Добавить задачу"/"Редактировать задачу".

Despite the repository name, **Redux is not installed** — nothing currently prescribes a state library.

`public/index.html` and `public/manifest.json` are create-react-app leftovers; the real HTML entry is the root `index.html`, which loads `/src/app/main.tsx`.
