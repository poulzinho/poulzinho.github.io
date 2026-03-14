# AGENTS.md

## Architecture

This project follows [Feature-Sliced Design](https://feature-sliced.design/) (FSD).

### Layers

All source code lives under `src/` and is organised into the following FSD layers, ordered from highest (most app-specific) to lowest (most reusable):

```
src/
├── app/        # App entry, providers, global styles, routing
├── pages/      # Full page compositions
├── widgets/    # Large self-contained UI blocks (e.g. a complete profile card)
├── features/   # Reusable product-level actions that deliver business value
├── entities/   # Business domain objects (e.g. user, profile)
└── shared/     # Reusable utilities, UI primitives, config, i18n — detached from business logic
```

Not every layer needs to exist. Only create a layer when there is code that belongs in it.

### Import Rule

A module may only import from layers **strictly below** it:

```
app → pages → widgets → features → entities → shared
```

Never import sideways (between slices on the same layer) or upward.

### Slices & Segments

Layers other than `app/` and `shared/` are divided into **slices** (by business domain), then into **segments** (by technical purpose):

| Segment  | Purpose                                        |
| -------- | ---------------------------------------------- |
| `ui`     | Components, styles, formatters                 |
| `model`  | Types, interfaces, stores, business logic      |
| `api`    | Backend calls, request functions, data mappers |
| `lib`    | Helpers and utilities scoped to the slice      |
| `config` | Slice-specific configuration and feature flags |

Each slice exposes a **public API** via an `index.ts` barrel file at the slice root. All imports from outside the slice must go through this barrel — never reach into a segment directly.

### Conventions

- **File naming:** kebab-case for files and directories (e.g. `profile-card.tsx`, `profile-card.test.tsx`).
- **Tests:** co-locate test files next to the source file they test (`*.test.tsx` / `*.test.ts`).
- **Barrel exports:** every slice must have an `index.ts` that explicitly exports the slice's public API.
- **No circular dependencies:** enforce via the layer import rule above.

### Architectural Linting

The FSD import rule is enforced at lint time by [`eslint-plugin-boundaries`](https://github.com/javierbrea/eslint-plugin-boundaries). The plugin is configured in `eslint.config.js` with the project's FSD layers and prevents:

- **Upward imports** — e.g. `shared/` importing from `widgets/`
- **Sideways imports** — e.g. one slice in `widgets/` importing from another slice in `widgets/`
- **Bypassing public APIs** — e.g. importing from `widgets/profile-card/ui/profile-card.tsx` instead of `widgets/profile-card`

If `npm run lint` passes, the architecture is sound.

### Technology

- **Language:** TypeScript (strict mode)
- **UI:** React (functional components only)
- **Styling:** Tailwind CSS
- **Internationalisation:** i18next / react-i18next
- **Build:** Vite
- **Test:** Vitest + Testing Library
- **Lint:** ESLint (flat config) + Prettier
- **Deploy:** GitHub Actions → GitHub Pages
