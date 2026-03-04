# GitHub Copilot Instructions

## Project Overview

`@tvaliasek/vue-datatable` is a Vue 3 + Bootstrap 5 data table component library published as an npm package. It is built with Vite (library mode), TypeScript, and Vue 3 Composition API. There is no dependency on bootstrap-vue-next.

## Tech Stack

- **Vue 3** (Composition API with `<script setup>`)
- **TypeScript** (strict, path alias `@` → `src/`)
- **Vite** (library build: ESM, UMD, CJS formats)
- **Bootstrap 5** (peer dependency, used for CSS classes only — no JS)
- **SCSS** (component styles)
- **@vueuse/core** (composables)
- **flat** (object flattening for nested row data)
- **Vitest** (unit testing)
- **ESLint + oxlint** (linting)
- **vite-plugin-dts** (TypeScript declaration generation)

## Project Structure

```
src/
  index.ts              # Public API: exports DataTable, DataTablePlugin, and all interfaces
  interfaces.ts         # Shared TypeScript interfaces (ColumnDefinition, ActionButtonDefinition, etc.)
  DataTable.vue         # Main component (entry point for consumers)
  Components/           # Internal sub-components (DataHeader, DataRow, DataRowButtons, etc.)
    ui/                 # Thin Bootstrap-compatible UI primitives (BDropdown, BPagination, BFormInput, etc.)
      Bootstrap/        # Bootstrap-specific input implementations
      Composables/      # Reusable Vue composables (useFormInput, useId, useAriaInvalid, etc.)
  Formatters/           # Value formatter utilities (currency, date, datetime)
  Sorters/              # Custom sort functions (naturalSort, dateSort)
  Langs/                # i18n translation objects (en_US, cs_CZ, sk_SK, hr_HR)
  Icons/                # Inline SVG icon components (Bootstrap Icons subset)
```

## Key Interfaces (src/interfaces.ts)

- **`ColumnDefinition<T>`** — defines a table column: `text`, `data`, `sortable`, `filterable`, `format`, `sortFn`, `filterFn`, `customComponent`, `cellStyle`, `aggregate`, etc.
- **`ActionButtonDefinition<TRowData>`** — defines a row action button: `text`, `event`, `variant`, `confirm`, `visibleIf`, `href`, `hrefCallback`, etc.
- **`ProcessedRowData<TRow>`** — internal row representation passed to custom components and slots.
- **`ProcessedCell`** — internal cell representation.
- **`DisplayConfig`** — pagination/sort/filter state.
- **`ButtonVariant`** — Bootstrap button variant type (e.g. `'primary'`, `'outline-danger'`).

## Coding Conventions

- Use `<script setup lang="ts">` for all Vue SFCs.
- Define props with `defineProps<{...}>()` using TypeScript generic syntax (no `withDefaults` unless defaults are needed).
- Emit events with `defineEmits<{...}>()` using TypeScript generics.
- Prefer `computed`, `ref`, and `watch` from Vue Composition API.
- Use `@vueuse/core` composables where applicable.
- All components are internal except `DataTable.vue`; do not export sub-components from `src/index.ts`.
- Interfaces and types live in `src/interfaces.ts`; add new ones there.
- Use the `@` path alias (resolves to `src/`) for all imports within the source.
- Format values using helpers in `src/Formatters/`; add new formatters there.
- Custom sort logic belongs in `src/Sorters/`.
- i18n strings are defined in `src/Langs/` — each lang file exports a plain object; `en_US` is the default.
- Always write `if`, `else`, `for`, `while`, and similar control-flow statements with a block body enclosed in braces `{}`. Never use single-line / braceless shorthand (e.g. `if (condition) doSomething()`).
- Use descriptive, full-word variable and parameter names. Single-character or very short names (e.g. `x`, `v`, `cb`, `fn`, `el`) are only acceptable in well-known, locally-scoped constructs such as `for` loop counters (`i`, `j`) or generic type parameters (`T`, `K`, `V`).

## Build & Development

```sh
npm run dev          # Start Vite dev server (uses src/main.ts + src/App.vue as playground)
npm run build        # Type-check + library build (outputs to dist/)
npm run type-check   # vue-tsc type checking only
npm run lint         # Run oxlint then ESLint (both with auto-fix)
npm run test         # Run Vitest
```

The library entry point is `src/index.ts`. The build produces:
- `dist/data-table.mjs` (ESM)
- `dist/data-table.umd.js` (UMD)
- `dist/data-table.cjs` (CJS)
- `dist/data-table.css` (styles)
- `dist/index.d.ts` (types)

## Consumer Usage Pattern

```ts
import { DataTablePlugin } from '@tvaliasek/vue-datatable'
import 'bootstrap/dist/css/bootstrap.css'
import '@tvaliasek/vue-datatable/dist/data-table.css'

app.use(DataTablePlugin)
```

```vue
<DataTable
  :header="columns"
  :data="rows"
  :buttons="actions"
  :paging="true"
  lang="en_US"
/>
```

## Adding New Features

- **New column formatter**: add to `src/Formatters/`, export from there, use via `ColumnDefinition.format`.
- **New language**: add a file to `src/Langs/`, export it from `src/Langs/index.ts`.
- **New icon**: add a `.vue` component to `src/Icons/` following the `bsIcon*.vue` naming pattern.
- **New UI primitive**: add to `src/Components/ui/` keeping Bootstrap class conventions.
- **New public interface**: add to `src/interfaces.ts` and re-export from `src/index.ts`.
- **New DataTable prop**: add to the props definition in `src/DataTable.vue`, update the `README.md` props table.

## Important Constraints

- `vue` and `bootstrap` are always **external** in the Vite build — never import Bootstrap JS.
- Do not add runtime dependencies without strong justification; keep the bundle small.
- The library must remain compatible with Bootstrap 5 CSS class conventions.
- Do not break the public API (`ColumnDefinition`, `ActionButtonDefinition`, `DataTablePlugin`, `DataTable`) without a major version bump.
- `src/App.vue`, `src/main.ts`, `src/CustomCell.vue`, and `src/CustomButton.vue` are playground/dev files and are excluded from the published package.
