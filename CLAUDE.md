# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for Leno Borges (Software Developer & Tech Educator), built with Angular 20 + Tailwind CSS v4 and hosted on Firebase Hosting. All user-facing copy is in Brazilian Portuguese.

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
- **Shared UI** lives in `src/app/shared/` (`header`, `links`, `owner`, `experience-card`, `section-heading`, `skill-group`, `education-item`). Pages compose these; Home page content data is defined in `src/app/pages/home/home.data.ts` (with typed interfaces) and imported into `Home`.
- **Styling** follows an editorial dark palette defined via `@theme` tokens in `src/styles.css` (`--color-ink`, `--color-paper`, `--color-accent`, etc.) with Google Fonts (`Instrument Serif`, `Manrope`, `JetBrains Mono`). Tailwind v4 is wired through PostCSS (`.postcssrc.json`) and `@import "tailwindcss"`. Static assets are served from `public/`.
- Component file naming follows Angular 20 conventions: `foo.ts` / `foo.html` / `foo.css`, class name without a `Component` suffix (e.g. `ExperienceCard`).

## Notes

- `src/app/app.spec.ts` checks for `<router-outlet>` presence under `provideZonelessChangeDetection()`.
- Home templates use theme tokens (`bg-ink`, `text-paper`, `text-accent`, `font-display`). `gradient-text` was removed from Home templates and remains only on `Bfacademy`.

[REGRAS](./.claude/RULES.md)