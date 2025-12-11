# Copilot Instructions for rita-work.jp_2604

## Project Snapshot

- Next.js 15.5 App Router project (React 19, TS strict) configured for static export (`output: 'export'`, `images.unoptimized`), see `next.config.ts`.
- Global layout `src/app/layout.tsx` loads fonts (`Noto Sans JP`, `Roboto`, `Archivo Black`), injects `<SvgDefs />`, and wraps content with `Header`/`Footer`; honor this structure when adding pages.
- Follow `.github/instructions/ken-inst.instructions.md`: `generateMetadata`/`generateStaticParams` must stay synchronous, page `params` should not be `Promise`s.

## Routing & Pages

- `src/app/page.tsx` renders the marketing top page composed of containers under `src/components/Top`; keep the order (Hero → Search → PickUp → Conditions → Tips → Message).
- `src/app/details/page.tsx` is a Suspense wrapper around `JobDetailsClientWrapper` that expects a `?id=` query (with or without `job_` prefix); keep data fetching client-side from static JSON.

## Data Flow & Sources

- Runtime job data lives in `public/db/`: `details_list.json` maps `jobId` to facility + JSON path, detailed job JSON sits under `public/db/facilities/<fac_id>/jobs`, facility info under `public/db/facilities/<fac_id>/facility.json`, and shared masters reside in `public/db/master/*.json`.
- `JobDetailsClient` (`src/components/details/JobDetailsClient.tsx`) orchestrates all fetches in a single `useEffect` (details_list → job JSON → facility → corporations & masters → optional content like videos/free space/benefits/interviews); keep this order and reuse the provided state setters.
- `public/db/config/job_common.json` provides `newIconPeriodDays` for the NEW badge; update this file rather than hardcoding.
- When adding new job attributes, update both the JSON schema and the types in `src/types/*` (`Job`, `Facility`, `Corporation`, etc.) so downstream containers receive typed props.

## Detail Page Composition

- `JobDetailContent` receives every dataset and simply coordinates child containers (Hero, WorkEnvironmentStats, Interview, Videos, BenefitsDetail, FreeSpace, DailySchedule, JobRequirements, FacilityInfo); keep this component pure/presentational.
- Plan-specific visual treatments rely on `contractPlanId` (e.g., `ContainerInterview` applies `plan-${contractPlanId}`), so pass the plan down anytime you add plan-aware sections.

## Styling & Assets

- SCSS modules live next to their components (e.g., `ContainerJobHero.module.scss`); shared mixins/variables are defined in `src/styles/_variable.scss` and injected via `@use "variable" as *;` thanks to `sassOptions.includePaths`.
- Global styles (`src/styles/globals.scss`) set responsive typography via mixins like `SunSerif`, so favor mixins over raw media queries for consistency.
- SVG symbols are bundled in `public/svg/object.svg` and injected once via `SvgDefs`; reference them with `<use href="#symbol_id" />` rather than duplicating SVG markup.
- Carousel/slider experiences rely on `@splidejs/react-splide`; import its CSS inside the component as done in `ContainerJobHero` to keep bundle scope tight.

## Tooling & Workflows

- Scripts: `npm run dev`, `npm run lint`, `npm run lint:style`, `npm run build` (runs `next build` then deletes `out/404*` before export upload). Static export lives in `out/`.
- Linting: ESLint config is in `eslint.config.mjs` (flat config extending `next/core-web-vitals`), Stylelint rules in `stylelint.config.js` allow Next.js `:global`.
- Path alias `@/*` is defined in `tsconfig.json`; prefer it over deep relative paths.
- No backend ships with this repo; "API" access is just `fetch`ing files from `public/`, so ensure new assets live under `public/` and are referenced with absolute `/` paths so they survive the export.

## Environment & Metadata

- `src/lib/env.ts` exposes `isRealProduction` via `NEXT_PUBLIC_IS_REAL_PROD`; RootLayout only configures `metadataBase`, OG tags, and robots when this flag is true. Keep metadata-generating code synchronous per repo rules.
- `NEXT_PUBLIC_METADATA_BASE` should match the canonical origin when `isRealProduction` is true; document any new environment flags here before using them.

## Practical Tips

- Reuse helper utilities like `isNewByPublishedPeriod` (`src/lib/newIcon.ts`) when determining NEW badges instead of duplicating date math.
- When extending navigation or footer content, update the corresponding data files under `src/data/` (e.g., `navMenuData.ts`) so common components stay data-driven.
- Components that use hooks (`'use client'`) follow the pattern of early guarding after hooks run; keep conditional returns below hook declarations to satisfy the Rules of Hooks.
