# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for Leno Borges (SWE & Tech Educator), built with Angular 20 + Tailwind CSS v4 and hosted on Firebase Hosting. All user-facing copy is in Brazilian Portuguese.

## Commands

- `npm start` — dev server at http://localhost:4200
- `npm run build` — production build to `dist/leno-borges/browser`
- `npm test` — Karma/Jasmine unit tests (Chrome)
- Single spec: `npx ng test --include src/app/app.spec.ts`
- Deploy: `npm run build && firebase deploy` (Firebase project `leno-borges`; SPA rewrite of `**` → `/index.html`)

No linter is configured; formatting follows the Prettier config in `package.json` (printWidth 100, single quotes, Angular parser for HTML).

## Architecture

- **Standalone components, zoneless.** `app.config.ts` uses `provideZonelessChangeDetection()` and `provideRouter(routes, withViewTransitions())`. There are no NgModules and no zone.js — use signals (`signal`, `input()`, `input.required()`) for reactive state so change detection triggers. Test beds must also provide `provideZonelessChangeDetection()`.
- **Routing** (`src/app/app.routes.ts`): `pages/` holds routed pages — `''` → `Home`, `bfacademy` → `Bfacademy` (a case-study page with an embedded YouTube iframe built via `DomSanitizer`).
- **Shared UI** lives in `src/app/shared/` (`header`, `links`, `owner`, `experience-card`). Pages compose these; content data (e.g. the `experiences` array in `pages/home/home.ts`) is defined inline in the page component and passed down through signal inputs.
- **Styling** is Tailwind utility classes directly in templates (dark slate/violet palette). Tailwind v4 is wired through PostCSS (`.postcssrc.json`) and `@import "tailwindcss"` in `src/styles.css`; there is no `tailwind.config.js`. Static assets are served from `public/`.
- Component file naming follows Angular 20 conventions: `foo.ts` / `foo.html` / `foo.css`, class name without a `Component` suffix (e.g. `ExperienceCard`).

## Notes

- `src/app/app.spec.ts` is the CLI-generated spec and expects an `h1` containing "Hello, leno-borges", which `App` (just a `<router-outlet>`) does not render — that test currently fails.
- Templates use a `gradient-text` class that is not defined in any stylesheet.

[REGRAS](./.claude/RULES.md)