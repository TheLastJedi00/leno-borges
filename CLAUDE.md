# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for Leno Borges (Full-Stack Software Developer & Tech Educator), built with Angular 20 + Tailwind CSS v4 and hosted on Firebase Hosting. The site is trilingual — English (default), Canadian French (`fr-CA`) and Brazilian Portuguese — targeting the Barrie / GTA (Ontario) market.

## Commands

- `npm start` — dev server at http://localhost:4200
- `npm run build` — production build to `dist/leno-borges/browser`
- `npm test` — Karma/Jasmine unit tests (Chrome)
- Single spec: `npx ng test --include src/app/app.spec.ts`
- Deploy: `npm run build && firebase deploy` (Firebase project `leno-borges`; SPA rewrite of `**` → `/index.html`)

No linter is configured; formatting follows the Prettier config in `package.json` (printWidth 100, single quotes, Angular parser for HTML).

## Architecture

- **Standalone components, zoneless.** `app.config.ts` uses `provideZonelessChangeDetection()` and `provideRouter(routes, withViewTransitions())`. There are no NgModules and no zone.js — use signals (`signal`, `computed`, `input()`, `input.required()`) for reactive state so change detection triggers. Test beds must also provide `provideZonelessChangeDetection()`.
- **Routing** (`src/app/app.routes.ts`): single page — `''` → `Home`. The old `/bfacademy` case study was removed; `bfacademy` and `**` redirect to `''`.
- **i18n** (`src/app/i18n/`): runtime, no library. `I18n` service (`providedIn: 'root'`) exposes `lang` (signal), `t` (computed dictionary) and `setLang()`; the choice persists in `localStorage` (`lang`) and defaults to `en`. An `effect` syncs `<html lang>`, `<title>` and `meta description`. `en.ts`, `fr.ts` and `pt.ts` implement the `Dictionary` interface (`dictionary.ts`) — a missing key is a build error. **All user-facing text (including `alt`, `aria-label`, `sr-only`) must come from the dictionaries.** French follows Canadian usage (`courriel`, `infonuagique`, OQLF punctuation); EN/FR copy uses Barrie/GTA market keywords mapped to résumé facts (see `.specs/002 - Ajustes/context.md`).
- **Home data**: `src/app/pages/home/home.data.ts` holds the typed interfaces and language-neutral data (`contactInfo`, `whatsappUrl()`); translatable content lives in the dictionaries. Section anchors are language-neutral: `#about`, `#experience`, `#skills`, `#education`, `#contact`.
- **Shared UI** lives in `src/app/shared/` (`header` with the `EN | FR | PT` toggle, `links`, `owner`, `experience-card`, `section-heading`, `skill-group`, `education-item`, `tech-icon`).
- **Tech logos**: `tech-icon` renders a chip with a `simple-icons` logo (imported per icon for tree-shaking) mapped by display name in `tech-icons.ts`; names not in the map (concepts like SOLID, CQRS) render as text-only chips. Icons are monochrome and take the brand colour on hover (near-black brands fall back to `paper`). To add a tech, add its exact display name to the map.
- **Styling**: graphite + logo-blue palette with light neumorphism, defined via `@theme` tokens in `src/styles.css` — colours `ink`, `surface`, `raised`, `line`, `paper`, `muted`, `faint`, `accent`, `accent-soft`, `accent-deep` (button background for white text) and shadows `shadow-raised`, `shadow-raised-lg`, `shadow-inset`. Fonts (Google Fonts): `Outfit` (`font-display`), `DM Sans` (`font-sans`), `JetBrains Mono` (`font-mono`). Tailwind v4 is wired through PostCSS (`.postcssrc.json`) and `@import "tailwindcss"`. Static assets are served from `public/` (logo at `public/images/logo.svg`; favicons `favicon.svg` (square viewBox), `favicon.ico` and `apple-touch-icon.png` are generated from it).
- Component file naming follows Angular 20 conventions: `foo.ts` / `foo.html` / `foo.css`, class name without a `Component` suffix (e.g. `ExperienceCard`).

## Notes

- `src/app/app.spec.ts` checks for `<router-outlet>` presence under `provideZonelessChangeDetection()`.
- Keep small accent text on `accent-soft` (plain `accent` sits at the 4.5:1 AA limit on `surface`).

[REGRAS](./.claude/RULES.md)
