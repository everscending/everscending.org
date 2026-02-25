# Story 2.1: Environment and API client for blog

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor (via correct deployment),
I want the app to use the correct SonicJS API base for the current environment,
so that the blog can load real content in local, develop, and production without hardcoded URLs.

## Acceptance Criteria

1. **Given** the app is built for an environment (local, develop, production), **when** the blog needs to request posts, **then** the request uses the API base derived from the current frontend host via `getBlogApiBaseUrl()` (no hardcoded production URLs in code) (FR5, FR6, NFR-I1). **And** host-to-API-base mapping is documented (e.g. in README).

2. **Given** the SonicJS API is available, **when** the app fetches the posts list, **then** it uses a single blog API module (e.g. `src/utils/blogApi.ts`) that performs fetch with a reasonable timeout (e.g. 10s), checks success and data, and maps the response to a UI model (NFR-I3). **And** types align with the Architecture-documented SonicJS response shape (e.g. `SonicJSPost`, `SonicJSPostsResponse`, `BlogPost`, `BlogPagination`).

## Tasks / Subtasks

- [x] Task 1 (AC: 1) — Host-derived API base and documentation
  - [x] Implement `getBlogApiBaseUrl()` in `blogApi.ts` that returns the blog API base URL (including `/api/blog`) from the current frontend host (`window.location.host`) using a defined host → URL mapping.
  - [x] Document the full host → API base mapping in README (localhost:5173, develop.everscending-org.pages.dev, everscending-org.pages.dev, everscending.org, everscending-web.everscending.workers.dev, everscending.ai); no hardcoded production URLs in source.
  - [x] Ensure `blogApi.ts` uses only `getBlogApiBaseUrl()` for the base URL (no env variable).
- [x] Task 2 (AC: 2) — Blog API module and types
  - [x] Create `src/utils/blogApi.ts`: export `getBlogApiBaseUrl()` and `fetchBlogPosts(params?: { page?: number; limit?: number })` (and optionally `fetchBlogPostBySlug(slug: string)` if needed for future stories).
  - [x] Use native `fetch` with timeout (e.g. 10s); on network error or timeout or non-2xx, treat as error (throw or return error result per chosen contract).
  - [x] Define types: `SonicJSPost`, `SonicJSPostsResponse`, `SonicJSPagination` for raw API; `BlogPost`, `BlogPagination` for UI model after mapping. Align with architecture schemas (id, slug, title, excerpt, content, featuredImage, author, publishedAt, status, tags; pagination: page, limit, total, totalPages).
  - [x] Implement mapping: check `success === true` and presence of `data`; map API response to UI model in one place (e.g. `mapSonicJSPostToBlogPost`); return typed result or error.
- [x] Task 3 (AC: 1, 2) — No regressions
  - [x] Do not change BlogSection or Home behavior for end users; BlogSection may continue to show loading state only until Story 2.2 wires the API.
  - [x] Run `pnpm build` and `pnpm tsc --noEmit`; fix any type or lint issues.

## Dev Notes

- **Scope:** This story is API client and env config only. Story 2.2 will call `fetchBlogPosts` from `BlogSection` and render posts. Do not wire fetch into BlogSection in this story unless it is a trivial call that still shows loading until 2.2; prefer leaving BlogSection as-is and only adding the module.
- **Single source of truth:** All blog HTTP calls must go through `src/utils/blogApi.ts`; no other module should call the blog API directly. [Source: architecture.md – API boundaries]
- **Env:** One env variable only: `VITE_BLOG_API_BASE`. Mapping: local, develop, production → corresponding API base; document in README or architecture. [Source: architecture.md – Environment configuration]
- **Response handling:** Expect `{ success: boolean, data: T, pagination?: Pagination }`. Always check `success === true` and presence of `data` before using; treat non-success or missing `data` as error path. [Source: architecture.md – API response handling]
- **Naming:** Types `SonicJSPost`, `SonicJSPostsResponse`, `SonicJSPagination` (raw API); `BlogPost`, `BlogPagination` (UI model). Functions e.g. `fetchBlogPosts`, `mapSonicJSPostToBlogPost`. [Source: architecture.md – Naming patterns]

### Project Structure Notes

- **New file:** `src/utils/blogApi.ts` (API client, types, and mapping in one module). Optional: `src/types/blog.ts` if you prefer separate types file; architecture allows types in same file or `src/blog/` – project currently uses `src/utils/` for utilities, so `blogApi.ts` in `src/utils/` is the specified choice.
- **Existing:** `BlogSection.tsx` already exists (Story 1.1); it shows a loading state and does not fetch yet. Do not scatter fetch logic; when 2.2 wires fetch, it will call only `blogApi.fetchBlogPosts` from BlogSection.
- **Config:** Optional `.env.example` (comment only; no blog env var). Document full host → API base mapping in README. No new top-level config files. [Source: architecture.md – File structure]

### References

- [Source: _bmad-output/planning-artifacts/epics.md – Epic 2, Story 2.1]
- [Source: _bmad-output/planning-artifacts/architecture.md – API & Communication Patterns, SonicJS API response schemas, Naming, Structure, Format patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md – Implementation Handoff, First implementation priority]

## Developer Context (for Dev Agent)

### Technical requirements

- **Runtime:** Use native `fetch`; no extra HTTP client library. Timeout: implement with `AbortController` + `setTimeout` (e.g. 10s) so that slow or hanging requests do not block indefinitely.
- **API base:** Implement `getBlogApiBaseUrl()` that returns the blog API base URL (including `/api/blog`) based on `window.location.host`. Mapping: localhost:5173 → http://localhost:8787/api/blog; develop.everscending-org.pages.dev → https://develop-everscending-blog.everscending.workers.dev/api/blog; everscending-org.pages.dev, everscending.org, everscending-web.everscending.workers.dev, everscending.ai → https://everscending-blog.everscending.workers.dev/api/blog. Unknown host returns empty string; fetchBlogPosts then returns `{ ok: false, error: "Unknown host for blog API" }`. No env variable.
- **API contract:** `GET {getBlogApiBaseUrl()}/posts` with limit and page query params. Response: `{ success: boolean, data: Post[], pagination: { page, limit, total, totalPages } }`. Post fields: id, slug, title, excerpt, content, featuredImage, author, publishedAt, status, tags (see architecture for full shape). Map to UI model with at least id, slug, title, excerpt, and link derived from slug (or API contract).
- **Error handling:** Non-2xx, network error, or timeout → treat as error; do not throw unhandled into UI in this story (Story 2.2 will consume and show error state in BlogSection). **Return contract:** `Promise<{ ok: true; data: BlogPost[]; pagination: BlogPagination } | { ok: false; error: string }>`. Do not throw; 2.2 will branch on `ok`.

### Architecture compliance

- Put blog API client and mapping in one module (`src/utils/blogApi.ts`); do not duplicate fetch logic.
- Use the SonicJS response schema and type names from architecture; extend only if API contract changes and update architecture.
- Resolve API base from `getBlogApiBaseUrl()` (host-derived); no hardcoded production URLs anywhere in code.
- Existing design tokens and layout unchanged; this story does not add UI.

### File structure requirements

- Create: `src/utils/blogApi.ts` (required) with `getBlogApiBaseUrl()` and host mapping. Optional: `.env.example` at project root (comment only; no blog env var).
- Do not create: new routes, new components, or new design system. Do not modify BlogSection behavior for users (can add an unused import of `fetchBlogPosts` for 2.2 if helpful, but do not wire yet if scope says leave wiring to 2.2).

### Testing requirements

- Unit test the API module: mock `window.location` (host) and `fetch`; assert `getBlogApiBaseUrl()` returns correct URL for each supported host and empty for unknown host; assert fetch uses correct URL, mapping (success response → UI shape), and error paths (non-success, missing data, non-2xx, unknown host, network error). Use Vitest and project’s existing test setup (`src/test/`). Co-locate test as `blogApi.test.ts` in `src/utils/` or next to `blogApi.ts`.
- No E2E required for this story (no UI change). E2E for “posts load” belongs in 2.2.

### Previous story intelligence (Epic 1)

- **Story 1.1** added `BlogSection.tsx` and `BlogSection.css`; `Home.tsx` composes `BlogSection`. BlogSection currently shows an in-place “Loading…” state and does not perform any fetch. So this story (2.1) only adds the API client and host-derived base URL; BlogSection continues to show loading until 2.2 wires `fetchBlogPosts`.
- **Patterns from 1.1:** Components in `src/components/` with co-located CSS; utils in `src/utils/`; tests co-located (e.g. `BlogSection.test.tsx`). Use same patterns for `blogApi.ts` and `blogApi.test.ts`.
- **Files touched in 1.1:** `Home.tsx`, `BlogSection.tsx`, `BlogSection.css`, `App.tsx`, `App.test.tsx`, `tests/main.spec.ts`. Do not remove or break BlogSection; 2.2 will integrate with it.

### Git intelligence summary

- Recent commit: “blog, epic 1” (Story 1.1 delivery). Before that: Home logos, CSS transitions, index.html paths, AGENTS.md. No new dependencies needed for 2.1; use existing stack (Vite, React, TypeScript, native fetch).

### Project context reference

- **AGENTS.md:** Project reference; tech stack (React 19, Vite 7, TypeScript, Vitest, Playwright), structure (`src/components/`, `src/utils/`), styling (App.css variables, outer-container, inner-container). Blog is an extension of the existing SPA; no new framework.
- **Architecture:** Single blog API module, host-derived API base via `getBlogApiBaseUrl()`, mapping layer, types from SonicJS schema. First implementation priority: host mapping and `blogApi.ts`.

### Completion status

- **Status:** done
- **Completion note:** Implementation complete. Code review fixes applied: user-facing error message in catch block (HIGH), pagination fallbacks and number coercion (MEDIUM), tests for non-array data, timeout/network message, and fetch not called when host unknown (LOW).

## Dev Agent Record

### Agent Model Used

(To be filled by dev agent)

### Debug Log References

### Completion Notes List

- Task 1: Implemented `getBlogApiBaseUrl()` in `blogApi.ts` with host → API base mapping (localhost:5173, develop.everscending-org.pages.dev, everscending-org.pages.dev, everscending.org, everscending-web.everscending.workers.dev, everscending.ai). README documents full mapping. Optional `.env.example` (comment only; no blog env var). No `VITE_BLOG_API_BASE` or vite-env.d.ts changes.
- Task 2: Created `src/utils/blogApi.ts` with `getBlogApiBaseUrl()`, SonicJS raw types, `BlogPost`/`BlogPagination` UI types, `fetchBlogPosts()` (return contract `{ ok, data?, pagination? } | { ok: false, error }`), `mapSonicJSPostToBlogPost`, and 10s timeout via AbortController. No `fetchBlogPostBySlug` (deferred to future story).
- Task 3: BlogSection and Home unchanged. Unit tests in `blogApi.test.ts` (getBlogApiBaseUrl per host, fetch URL, mapping, success/error paths). All tests pass; `pnpm build` and `pnpm tsc --noEmit` pass.

### File List

- .env.example (new — comment only; no blog env var)
- README.md (modified — Blog API host-derived URL and full host mapping table)
- src/utils/blogApi.ts (new — getBlogApiBaseUrl, fetchBlogPosts, types, mapping)
- src/utils/blogApi.test.ts (new)

### Senior Developer Review (AI)

**Reviewer:** Jordan (adversarial code review)  
**Date:** 2026-02-20

**Git vs Story:** Application files in story File List match git (README modified; .env.example, blogApi.ts, blogApi.test.ts new/untracked). No application-file discrepancies. _bmad-output/ and planning-artifacts/ changes excluded per workflow.

**AC validation:** AC1 (host-derived API base, README mapping, no hardcoded URLs) — IMPLEMENTED. AC2 (single blogApi module, timeout, success/data check, UI mapping, types) — IMPLEMENTED.

**Task audit:** All tasks marked [x] verified: getBlogApiBaseUrl and README table present; fetchBlogPosts with 10s timeout and return contract; types and mapping align with architecture; build and tsc pass.

**Findings:** 3 Medium, 5 Low (see below). No CRITICAL or HIGH. Status set to in-progress until MEDIUM items are addressed or accepted as action items.

**Follow-up (2026-02-23):** Fixes applied automatically. 1 HIGH (user-facing error in catch — use BLOG_LOAD_ERROR_MESSAGE), 1 MEDIUM (pagination fallbacks + Number coercion), 3 LOW (test: non-array data; timeout/network expect user-facing message; unknown-host assert fetch not called). All tests and build pass. Status → done.

---

### Change Log

- 2026-02-23: Code review fixes applied (1 HIGH, 1 MEDIUM, 3 LOW). Status → done.
- 2026-02-20: Code review (adversarial). 3 Medium, 5 Low findings. Status → in-progress until fixes or action items.
- 2026-02-20: Implemented host-derived API base via getBlogApiBaseUrl(), blog API module (fetch, timeout, types, mapping), README host mapping, and unit tests. Story ready for code review.
- 2026-02-20: Switched from VITE_BLOG_API_BASE to host-derived URL (getBlogApiBaseUrl). Added mappings for everscending-web.everscending.workers.dev and everscending.ai. Removed vite-env.d.ts and env var from scope.
