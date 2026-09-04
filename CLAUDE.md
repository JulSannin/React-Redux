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

A `.env` with `VITE_API_URL` (base URL of a mockapi.io project, no trailing `/tasks`) is required — without it every request goes to `undefined/tasks` and the list never loads. The variable is declared on `ImportMetaEnv` in `src/vite-env.d.ts`.

## Architecture

Vite + React 18 + TypeScript, no router, no state library. UI text is Russian; source comments are Russian and deliberately explain _why_, not _what_.

### Feature-Sliced Design

`src/` follows FSD and the layout is enforced by **steiger** (`steiger.config.ts`). Run `npx steiger ./src` after any structural change — it catches misplaced files, missing public APIs, and cross-layer import violations that ESLint does not.

Layers, import direction strictly downward (`app → pages → widgets → features → entities → shared`):

- `app/` — `main.tsx` entry, `App.tsx`, global styles (`reset`, `fonts`, `App.scss`)
- `pages/tasks/` — thin page shell, renders the widget
- `widgets/TodoList/` — `model/useTasks.ts` (all task data and server calls), `ui/TodoList.tsx` (which dialog is open + markup)
- `features/task-form/`, `features/delete-task/` — the add/edit modal and the delete-confirm modal; both are pure UI and know nothing about the server
- `entities/task/` — `model/types.ts` (`Task`, `Priority`, `Status`), `model/labels.ts` (display text + progress table), `api/api.ts` (REST client), `ui/TaskCard`
- `shared/ui` (barrel at `shared/ui/index.ts`), `shared/styles`, `shared/assets`

**Public API rule**: every slice exposes a root `index.ts`; import across slices through the slice root (`import { TaskCard, getTasks, type Task } from '@/entities/task'`), never a deep path. Inside a slice, use relative imports (`../model/useTasks`). `shared/assets` and `shared/styles` are exempted from the public-api rule in `steiger.config.ts` since they have no TS API.

### Data flow

Understanding this requires `useTasks.ts` and `TodoList.tsx` together:

- **`useTasks` owns the state and every transition of it.** It exposes `tasks`, four flags, and `addTask`/`editTask`/`removeTask` — never a raw `setTasks`. The component owns only _which dialog is open_ (`addEditTask: 'newTask' | Task | null`, `taskToDelete: Task | null` — the "open but nothing selected" state is unrepresentable by design).
- **Server first, screen second.** A mutation awaits the request, then updates `tasks` from the server's response, so a failed request never leaves the UI lying.
- **Mutations return `Promise<boolean>`.** Errors are caught inside the hook; the boolean tells the widget whether to close the modal. A failed save deliberately keeps the modal open with the typed-in text so the user can retry.
- **Two separate error slots.** `error` = the list failed to load, so there is nothing to show and it replaces the content area. `actionError` = the list is intact but one action failed, so it renders inside the modal. Merging them would wipe the list off screen on a failed save. Opening any modal calls `clearActionError()` so a stale message from a previous action doesn't appear in a fresh dialog.
- **`isSaving`** disables submit buttons for the duration of a request (double-click would otherwise create two tasks). It is reset in `finally`, never at the end of `try`.
- **`AddEditTaskModal` is one component for both modes**, distinguished solely by whether the `task` prop is present: it drives the heading, the submit label, and whether the status block renders at all (a new task is always "Сделать").

### Conventions

- **`@/*` alias → `./src`**, declared in _both_ `vite.config.ts` (`resolve.alias`) and `tsconfig.json` (`paths`). Changing one without the other breaks either the build or the editor.
- **Enum values are wire format _and_ CSS class names.** `Priority.HIGH = 'high'` is sent to the server and used as `className`. Never change a value. Russian display text lives only in `entities/task/model/labels.ts` as `Record<Priority | Status, string>`, so adding an enum member fails the typecheck until a label is added.
- **`progress` is derived, not entered.** It is recomputed from `status` via `STATUS_PROGRESS` on every edit; the form never asks for it.
- **`PRIORITY_ORDER` / `STATUS_ORDER`** at the top of `AddEditTaskModal.tsx` are hand-maintained display orders. TypeScript will _not_ flag a missing entry when an enum grows — update them manually.
- **SVGs as components**: `import Add from '@/shared/assets/icons/add.svg?react'` via `vite-plugin-svgr`; the `*.svg?react` module is declared in `src/vite-env.d.ts`.
- **Styles**: plain SCSS with global class names (no CSS Modules). Each component has a co-located `style.scss` imported at the top of its `.tsx`. Pull shared tokens with `@use '@/shared/styles/theme.scss' as *;` and media queries with `@use '@/shared/styles/breakpoints.scss' as breakpoints;` (`@include breakpoints.devices(sm)`). Vite is pinned to the modern Sass API. Vite resolves `@/` inside SCSS; VS Code's built-in SCSS service does not, so alias jumps look broken in the editor while the build is fine.
- TS is `strict` with `noUnusedLocals`/`noUnusedParameters`, so unused props must be left out of the destructuring, not just ignored.

## Known rough edges

Pre-existing, deliberately left alone unless the task touches them:

- `.env` is **not** in `.gitignore` and has been committed and pushed; there is no `.env.example`.
- `entities/task/api/taskList.ts` is the old in-memory seed data — unused by the app but still re-exported from the slice root.
- `editTask` spreads `id` into the PUT body even though `TaskDraft` is `Omit<Task, 'id'>`, and merges the server response with `{ ...item, ...editingTask }` instead of replacing.
- The `(prevTasks ?? [])` guards in `useTasks` are dead — the state is typed `Task[]` and initialised to `[]`.
- The priority and status choice lists in `AddEditTaskModal` are near-identical JSX; a generic `ChoiceList<T extends string>` was discussed but not extracted.
- Choices are `<li onClick>`, so they are not keyboard reachable; `Input` renders a `<label>` with an empty `htmlFor`.
- `README.md` is still the original Russian assignment spec, not documentation of the finished project.

Despite the repository name, **Redux is not installed**. State lives in the hand-rolled `useTasks` hook; a store or TanStack Query would only be warranted once a second screen or entity needs the same data.
