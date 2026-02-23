# Story 2.2: Display blog posts in the section

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to see a list (or cards) of blog posts from SonicJS (title, link, optional excerpt),
so that I can skim the latest content.

## Acceptance Criteria

1. **Given** the blog section exists and the API client is configured, **when** the home page loads, **then** the blog section requests posts from the SonicJS API (e.g. `GET {API_BASE}/api/blog/posts?limit=20&page=1`) and does not block initial paint of the shell and nav (NFR-P1, FR2).

2. **Given** the API returns a successful response with posts, **when** the blog section renders, **then** I see a list or card set of posts, each with at least title and link, and optionally excerpt/commentary when the API provides it (FR2, FR3). **And** the content reflects the current state of SonicJS at load time (FR12).

3. **Given** the blog list is rendered, **when** I use a keyboard or screen reader, **then** the list has semantic structure (e.g. list or list-like) and one focusable link per post (NFR-A1, NFR-A2).

## Tasks / Subtasks

- [x] Task 1 (AC: 1) — Wire fetch in BlogSection without blocking paint
    - [x] In `BlogSection.tsx`, call `fetchBlogPosts({ page: 1, limit: 20 })` from `src/utils/blogApi` via **React Query** (`useQuery`); do not block initial render of shell/nav (request after mount).
    - [x] Manage loading state: show existing "Loading…" (or skeleton) while request is in flight; set `aria-busy` from actual loading state.
    - [x] Ensure no hardcoded API URLs; API base is derived from host via blogApi (getBlogApiBaseUrl) only.
    - [x] Use **@tanstack/react-query**: app wrapped in `QueryClientProvider` (e.g. in `main.tsx`); BlogSection uses `useQuery` with a query key and a query function that calls `fetchBlogPosts` and throws on `!result.ok` so React Query handles loading/error/success.
- [x] Task 2 (AC: 2) — Render list/cards of posts
    - [x] On success with `data` array: map to UI model (already provided by blogApi mapping) and render a list or card set.
    - [x] Create or reuse `PostCard` (or equivalent) in `src/components/`: each item shows at least title and link (derived from slug); optionally excerpt when API provides it.
    - [x] Use semantic list structure (e.g. `<ul>`/`<li>` or list-like with `role="list"` if needed) and one focusable link per post.
- [x] Task 3 (AC: 2, 3) — Accessibility and edge states
    - [x] Semantic structure: section, heading, list; one focusable link per post; focus order logical (heading → list → links).
    - [x] For empty list (success with empty `data`): show a minimal empty message (e.g. "No posts yet") so section is never blank; Epic 4 will refine copy and a11y.
    - [x] For API error (network/timeout/non-2xx): show a minimal error message (e.g. "Couldn't load posts") in-section so rest of page stays usable; Epic 4 will refine.
- [x] Task 4 (AC: 1–3) — No regressions
    - [x] Run `pnpm build` and `pnpm tsc --noEmit`; fix any type or lint issues.
    - [x] Existing BlogSection tests still pass; add or extend tests for "renders list when posts returned" and optionally loading/empty/error.

## Dev Notes

- **Prerequisite:** Story 2.1 (Environment and API client) must be implemented first: `src/utils/blogApi.ts` with `fetchBlogPosts`, types (`BlogPost`, `BlogPagination`), and mapping from SonicJS response. If 2.1 is not yet implemented, implement it before wiring BlogSection.
- **Single source of truth:** All blog HTTP calls go through `src/utils/blogApi.ts`. BlogSection only imports and calls `fetchBlogPosts`; it does not call the API directly. [Source: architecture.md – API boundaries]
- **State:** BlogSection uses **React Query** (`useQuery`) for server state (loading, posts, error); QueryClientProvider wraps the app in `main.tsx`. No global store beyond React Query cache. [Source: architecture.md – Frontend Architecture]
- **Non-blocking load:** Request posts after mount via React Query; do not block first paint of shell and nav (NFR-P1). [Source: epics.md – Story 2.2 AC1; architecture.md – Performance]
- **List vs cards:** Architecture allows "list or card set"; use existing design tokens (App.css, outer-container, inner-container) and optional PostCard component. [Source: architecture.md – Component structure]

### Project Structure Notes

- **Existing:** `BlogSection.tsx`, `BlogSection.css` (Story 1.1); currently shows loading only. Extend BlogSection to call blogApi and render list/cards; do not remove or break existing semantic structure (section, aria-label, heading).
- **New/optional:** `PostCard.tsx`, `PostCard.css` in `src/components/` for a single post (title, link, optional excerpt). Architecture specifies PostCard as presentational; receives UI model props only.
- **Existing:** `src/utils/blogApi.ts` (from Story 2.1) — use `fetchBlogPosts`, `BlogPost`, `BlogPagination` types. Do not duplicate fetch or mapping logic.
- **Alignment:** Same patterns as 1.1 and 2.1: components in `src/components/`, co-located CSS, utils in `src/utils/`. [Source: architecture.md – Structure Patterns]

### References

- [Source: _bmad-output/planning-artifacts/epics.md – Epic 2, Story 2.2]
- [Source: _bmad-output/planning-artifacts/architecture.md – API & Communication Patterns, SonicJS API response schemas, Frontend Architecture, Component boundaries]
- [Source: _bmad-output/planning-artifacts/architecture.md – Implementation Handoff, Loading state, Error and empty states]

## Developer Context (for Dev Agent)

### Technical requirements

- **Data source:** Call `fetchBlogPosts({ page: 1, limit: 20 })` from `blogApi.ts` in BlogSection via **React Query** `useQuery` (queryFn calls fetchBlogPosts and throws on `!result.ok`). Use the returned UI model (`BlogPost[]`, `BlogPagination`); do not re-map or touch raw SonicJS types in the component.
- **Non-blocking:** Do not block initial paint: React Query runs the query after mount. Shell and nav must render first; blog section can show loading then replace with content/empty/error.
- **Loading state:** While request is in flight, show in-section loading (existing "Loading…" or minimal skeleton); set `aria-busy={isLoading}` and `aria-live="polite"` so screen readers get updates.
- **Success path:** When `success === true` and `data` is a non-empty array, render list/cards: each item has at least title and link. Use link href `/blog/{slug}` for the post URL; do not add a `/blog` route in this story (Epic 3 will implement the post page). Optionally show excerpt when present on `BlogPost`.
- **Edge states:** Empty list (success, `data.length === 0`) → show "No posts yet" (or equivalent) in-section. Error (network/timeout/non-2xx) → show "Couldn't load posts" (or equivalent) in-section. Do not break shell or nav; Epic 4 will refine copy and a11y.
- **Accessibility:** Semantic structure (section, heading, list or list-like); one focusable link per post; logical focus order; visible focus indicators (existing site baseline).

### Architecture compliance

- Use only `blogApi.fetchBlogPosts`; no direct fetch or API base usage in components. All blog HTTP via `src/utils/blogApi.ts`.
- Use existing design tokens and layout (App.css variables, outer-container, inner-container); no new design system or UI framework.
- BlogSection uses React Query for blog server state (loading, posts, empty/error); Home composes BlogSection and does not own blog data. QueryClientProvider is provided at app root (main.tsx).
- PostCard (if created) is presentational only: receives `BlogPost` (or subset) as props; no fetch.

### File structure requirements

- **Modify:** `src/components/BlogSection.tsx` (use `useQuery` for fetch, conditional render: loading / list / empty / error). **Add:** `QueryClientProvider` in `main.tsx`. Optionally `BlogSection.css` for list/card layout.
- **Create (optional):** `src/components/PostCard.tsx`, `PostCard.css` for single post (title, link, optional excerpt). If inlined in BlogSection, ensure same semantics (list, one link per post).
- **Do not create:** New routes, new global state, or duplicate blog API logic. Do not modify blogApi.ts contract unless 2.1 is being implemented in same pass.

### Testing requirements

- **Unit:** BlogSection: (1) shows loading state initially or while fetching; (2) renders list of posts when fetch returns success with data (mock `fetchBlogPosts` to return mock posts); (3) shows empty message when data is empty; (4) shows error message when fetch fails or returns error. Use Vitest and React Testing Library; co-locate `BlogSection.test.tsx`. Mock at module boundary (e.g. `vi.mock('../utils/blogApi')`) so BlogSection receives controlled success/empty/error.
- **E2E (optional for 2.2):** Add or extend Playwright test: home page loads, blog section eventually shows posts (or empty/error) without breaking page. Can be minimal (e.g. "blog section has heading and either list or message").
- **No regression:** Existing App and Home tests still pass; existing BlogSection tests updated for new behavior.

### Previous story intelligence (Epic 2)

- **Story 2.1** (ready-for-dev): Delivers `src/utils/blogApi.ts` with `getBlogApiBaseUrl()`, `fetchBlogPosts(params?)`, types `SonicJSPost`, `SonicJSPostsResponse`, `BlogPost`, `BlogPagination`, and mapping. Contract: success → `{ ok: true, data: BlogPost[], pagination }`; error → `{ ok: false, error }`. Timeout 10s; API base from `getBlogApiBaseUrl()` (host-derived).
- **Story 1.1:** BlogSection already exists with section, aria-label "Blog", heading "Blog", and loading copy "Loading…". Do not remove semantic structure or a11y attributes; extend with real loading state and list/empty/error content.
- **Patterns:** Co-located CSS; components in `src/components/`; utils in `src/utils/`; tests next to component or in same folder.

### Git intelligence summary

- Repo has BlogSection (1.1) and planning for blogApi (2.1). No blogApi.ts in tree yet if 2.1 not implemented; story 2.2 assumes 2.1 is done. If implementing both in one pass: implement 2.1 first (blogApi.ts, host-derived base, types, mapping), then wire BlogSection in 2.2.

### Project context reference

- **AGENTS.md:** React 19, Vite 7, TypeScript, Vitest, Playwright; `src/components/`, `src/utils/`; styling via App.css variables and component CSS. Blog is an extension of the existing SPA.
- **Architecture:** Single blog API module (`blogApi.ts`), component-level state in BlogSection, PostCard presentational, loading/empty/error in-section only, semantic list and one focusable link per post.

### Completion status

- **Status:** done
- **Completion note:** Story context prepared. Implement: wire BlogSection to fetchBlogPosts; render list/cards with title, link, optional excerpt; semantic structure and a11y; minimal empty/error so section never breaks. Ensure 2.1 (blogApi) is implemented before or with this story.

## Dev Agent Record

### Agent Model Used

(To be filled by dev agent)

### Debug Log References

### Completion Notes List

- Implemented BlogSection fetch via **React Query** `useQuery`: queryFn calls `fetchBlogPosts({ page: 1, limit: 20 })`, throws on `!result.ok`; loading/error/success from `useQuery`. App wrapped in `QueryClientProvider` in `main.tsx` (default `staleTime: 60_000`). `aria-busy`/`aria-live` driven by query loading state. No hardcoded API URLs.
- Added PostCard presentational component (title, link, optional excerpt); BlogSection renders `<ul>` with PostCard items; one focusable link per post; semantic section/heading/list.
- Empty state: "No posts yet"; error state: in-section message from API error string (e.g. "Couldn't load posts"). Shell/nav unchanged.
- Unit tests: BlogSection and App tests wrap with `QueryClientProvider` (tests use `retry: false`). BlogSection mocked blogApi; tests for loading, list when data returned, empty message, error message (including custom API error string), aria-busy, one focusable link per post. All tests pass; `pnpm build` and `pnpm tsc --noEmit` pass; `eslint src/` pass.
- Code review (2026-02-23): Fixed refetch-error UX (no stale list when isError); slug sanitization in blogApi for safe links; Dev Agent Record note for 2.1 files in branch; story Completion status aligned to review; added test for custom error message in UI.

### File List

**Branch scope:** This branch also includes Story 2.1 deliverables: `src/utils/blogApi.ts`, `src/utils/blogApi.test.ts`, `pnpm-lock.yaml`. Listed below are 2.2-only changes.

- src/components/BlogSection.tsx (modified — useQuery, fetchBlogPosts via queryFn, conditional render)
- src/main.tsx (modified — QueryClientProvider wrapping App)
- package.json (modified — added @tanstack/react-query)
- src/components/BlogSection.css (modified — list, empty, error styles)
- src/components/BlogSection.test.tsx (modified — QueryClientProvider wrapper, mock blogApi, tests for list/empty/error/aria-busy)
- src/components/PostCard.tsx (new)
- src/components/PostCard.css (new)
- src/App.test.tsx (modified — QueryClientProvider wrapper, mock blogApi for BlogSection)
- README.md (modified — blog/API or environment documentation, if updated in this branch)

## Change Log

- 2026-02-23: Story 2.2 implemented. BlogSection wired to fetchBlogPosts; PostCard added; loading/empty/error states and a11y in place; tests extended; all ACs satisfied.
- 2026-02-23: React Query added: BlogSection uses useQuery; QueryClientProvider in main.tsx; story and dev notes updated to describe React Query implementation.
- 2026-02-23: Code review fixes: error-only state when isError (no stale list + error); slug sanitization in blogApi; branch/File List note; Completion status; custom error message test.
