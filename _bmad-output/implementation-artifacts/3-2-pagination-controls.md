# Story 3.2: Pagination controls

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to move between pages of posts (First, Previous, page numbers, Next, Last),
so that I can browse when there are more than one page.

## Acceptance Criteria

1. **Given** the blog displays a list of posts and the API returns pagination info, **when** there are multiple pages, **then** I see pagination controls: First, Previous, up to 5 linkable page numbers (with the current page highlighted), Next, and Last (FR4a). **And** when I use any control, the list updates to the requested page (using limit and page per API contract). **And** First and Previous are disabled on the first page and Next and Last on the last page (using pagination.totalPages or equivalent). **And** pagination controls are keyboard operable and clearly labeled (e.g. "First page", "Previous page", "Page N", "Next page", "Last page") (NFR-A1).

## Tasks / Subtasks

- [x] Task 1 (AC: 1) — Add page state and wire API to current page
  - [x] In `BlogSection.tsx`, add component state for current page (e.g. `useState(1)`). Keep using the same limit the section already uses (no prescribed page size); pass that limit together with current page so pagination reflects the configured page size.
  - [x] Pass `{ page: currentPage, limit }` to `fetchBlogPosts` (reuse the limit already used by the section) and include `page` in the React Query `queryKey` (e.g. `['blog','posts', { page, limit }]`) so changing page triggers a refetch. Use the `pagination` from the API result (BlogPagination: page, limit, total, totalPages).
  - [x] Ensure loading/empty/error states still work when switching pages (React Query will refetch per queryKey).
- [x] Task 2 (AC: 1) — Pagination UI
  - [x] Add a pagination controls block below the post list (inside the blog section): "Previous" and "Next" buttons (or links styled as buttons). Only show pagination when `data?.ok === true` and `pagination.totalPages > 1` (or equivalent).
  - [x] Disable "Previous" when `page === 1`; disable "Next" when `page >= pagination.totalPages`. Use `disabled` and/or `aria-disabled` and style disabled state so it's clear (e.g. reduced opacity, not clickable).
  - [x] Label controls for accessibility: e.g. "Previous page", "Next page" (visible text or aria-label). Ensure buttons/links are keyboard focusable and activatable (NFR-A1).
  - [x] On "Next", set page to `currentPage + 1`; on "Previous", set page to `currentPage - 1`. Optionally scroll blog section into view or keep scroll position per product preference.
- [x] Task 2b (AC: 1) — First/Last and page number links
  - [x] Add "First" and "Last" buttons; disable First when on first page, Last when on last page. Label e.g. "First page", "Last page".
  - [x] Add up to 5 linkable page number buttons in the middle (between Previous and Next). Compute a window of page numbers (e.g. centered on current when possible); current page should be visually highlighted (e.g. class and/or aria-current="page").
  - [x] Clicking a page number sets page to that number and triggers refetch. Ensure page number controls are keyboard operable and labeled (e.g. "Page 1", "Page 2").
- [x] Task 3 (AC: 1) — No regressions
  - [x] Run `pnpm build` and `pnpm tsc --noEmit`; fix any type or lint issues.
  - [x] Existing BlogSection, PostCard, and BlogPostPage tests still pass. Add or update tests for BlogSection: when pagination exists, Previous/Next behavior (disabled states, page change and refetch); optionally test that query uses page in queryKey.

## Dev Notes

- **Existing API:** `fetchBlogPosts({ page?, limit? })` already exists in `blogApi.ts` and returns `FetchBlogPostsResult` with `pagination: BlogPagination` (page, limit, total, totalPages). No API changes required; only BlogSection state and UI.
- **Current BlogSection:** Uses `useQuery` with a fixed page and limit for the initial list. Story 3.2: add page state and keep using the same limit the section already uses; queryKey must include current page so React Query refetches when page changes.
- **Single page:** When `pagination.totalPages <= 1` (or no pagination), do not show pagination controls (or show nothing). Empty list and error states unchanged.
- **Design:** Use existing design tokens (App.css variables, blog-section classes). Pagination can be a simple row of buttons/links below the list; match existing link/button styles (e.g. accent color, focus-visible).

### Project Structure Notes

- **Modify only:** `src/components/BlogSection.tsx`, `src/components/BlogSection.css` (pagination styles). Optionally `BlogSection.test.tsx` for new behavior.
- **No new files required** for pagination logic; blogApi already supports page/limit and returns pagination.
- **Alignment:** Same patterns as 2.2 and 3.1: component-level state in BlogSection, React Query for fetch, co-located CSS. [Source: architecture.md – Process Patterns, Pagination]

### References

- [Source: _bmad-output/planning-artifacts/epics.md – Epic 3, Story 3.2]
- [Source: _bmad-output/planning-artifacts/architecture.md – Pagination (limit and page; UI Next/Previous; disable rules), SonicJS API response schemas]
- [Source: _bmad-output/planning-artifacts/architecture.md – Component boundaries (BlogSection owns blog state), Data boundaries]

## Developer Context (for Dev Agent)

### Technical requirements

- **Page state:** Add `const [page, setPage] = useState(1)` (or equivalent) in BlogSection. Use `page` and the same `limit` the section already uses in the `useQuery` queryKey and in the `fetchBlogPosts({ page, limit })` call so that when the user clicks Next/Previous, updating `page` triggers a new request and the list updates.
- **Pagination from API:** Result type is `FetchBlogPostsResult`; when `result.ok === true`, `result.pagination` is `BlogPagination` (page, limit, total, totalPages). Use `result.pagination.totalPages` to decide whether to show controls and to disable Next when `page >= result.pagination.totalPages`; disable Previous when `page === 1`.
- **UI:** Render pagination only when `data?.ok === true && (data.pagination?.totalPages ?? 0) > 1`. Two controls: "Previous page" and "Next page". On click: Previous → `setPage(p => Math.max(1, p - 1))`, Next → `setPage(p => Math.min(data.pagination.totalPages, p + 1))`. Use `<button>` or `<a>` with appropriate semantics; ensure `disabled` when applicable and visible focus styles (e.g. `.blog-section button:focus-visible` or existing link focus in BlogSection.css).
- **Page size:** Do not prescribe a specific page size in this story. Use whatever limit the blog section already uses (e.g. a constant or config); the final page size can be decided later.

### Architecture compliance

- All blog HTTP remains in `src/utils/blogApi.ts`; no new API calls. BlogSection already uses `fetchBlogPosts`; only the arguments (page, limit) and consumption of `pagination` change.
- BlogSection continues to own blog list state (loading, empty, error, posts, and now current page); no global store. Use existing design tokens and layout (App.css, outer-container, inner-container as applicable).
- Pagination: request uses `limit` and `page` per architecture; UI shows Next/Previous; disable Previous on first page and Next on last page using `pagination.totalPages`. [Source: architecture.md – Process Patterns, Pagination]

### Library / framework requirements

- **React Query:** Already in use. Include `page` (and limit) in `queryKey` so that when `page` changes, React Query treats it as a new query and refetches. Example: `queryKey: ['blog', 'posts', { page, limit }]`.
- **React:** Use `useState` for current page; no new libraries. No router change (blog remains on home route).

### File structure requirements

- **Modify:** `src/components/BlogSection.tsx` (page state, query params, pagination UI), `src/components/BlogSection.css` (pagination control styles).
- **Optional:** `src/components/BlogSection.test.tsx` — add or extend tests for pagination (e.g. when totalPages > 1, buttons disabled correctly, page change triggers refetch).
- **Do not:** Add new API modules; change blogApi.ts signature for fetchBlogPosts; break existing loading/empty/error behavior.

### Testing requirements

- **Unit:** (1) BlogSection: with mocked fetchBlogPosts returning multiple pages, assert pagination controls appear when totalPages > 1 and are hidden when totalPages <= 1; assert Previous disabled when page === 1 and Next disabled when page >= totalPages; assert clicking Next/Previous updates page and triggers a new fetch (queryKey includes page). Use Vitest and React Testing Library; wrap in QueryClientProvider as in existing BlogSection tests. (2) Optional: test that fetchBlogPosts is called with correct page/limit when state changes.
- **E2E (optional):** Playwright: on home, if API returns multiple pages, click Next and assert list updates and URL or state reflects page; click Previous and assert same. Can be added in this story or later.
- **No regression:** Existing BlogSection, PostCard, and BlogPostPage tests pass; build and tsc pass.

### Previous story intelligence (Epic 3)

- **Story 3.1:** Added in-app post view: `fetchBlogPostBySlug`, route `/blog/:slug`, `BlogPostPage` with useQuery, loading/error/not-found, HTML content sanitized with DOMPurify. BlogSection still uses a fixed page and limit and has no pagination UI. PostCard and BlogSection unchanged for link behavior. Implement pagination in BlogSection only; no changes to BlogPostPage or post detail.
- **Patterns:** React Query for server state; queryKey drives refetch (include page in key for list). Co-located CSS; components in `src/components/`; blogApi in `src/utils/blogApi.ts`. Use same testing pattern (QueryClientProvider, mock blogApi) for new BlogSection pagination tests.

### Git intelligence summary

- Recent commit (3.1): BlogPostPage, fetchBlogPostBySlug, DOMPurify, new route and tests. BlogSection and blogApi already have fetchBlogPosts with page/limit and pagination in the result; BlogSection currently ignores pagination and uses a fixed page and limit. This story adds page state and pagination UI to BlogSection; keep using the same limit the section already uses.

### Latest tech information

- React Query and React versions unchanged. No new dependencies. Use existing useQuery + queryKey pattern; include page in queryKey for correct cache and refetch behavior.

### Project context reference

- **AGENTS.md:** React 19, Vite 7, TypeScript, Vitest, Playwright; `src/components/`, `src/utils/`; blog is a front-page section and in-app post viewing. Pagination is on the home route blog section only.
- **Architecture:** BlogSection owns blog state; fetchBlogPosts accepts page and limit and returns pagination; UI: Next/Previous, disable Previous on first page and Next on last page using pagination.totalPages.

### Story completion status

- **Status:** ready-for-dev
- **Completion note:** Ultimate context engine analysis completed—comprehensive developer guide created. Add page state and pagination UI to BlogSection; use the section’s existing limit and page from state in query; show Previous/Next with correct disable rules and a11y labels; no regressions.

## Dev Agent Record

### Agent Model Used

(To be filled by dev agent)

### Debug Log References

### Completion Notes List

- Pagination implemented in BlogSection: page state (`useState(1)`), queryKey `['blog','posts', { page, limit }]`, queryFn reads page/limit from queryKey and calls `fetchBlogPosts({ page, limit })`. Pagination UI: nav with "First", "Previous", up to 5 page number buttons (current highlighted via aria-current and .blog-section__pagination-page--current), "Next", "Last"; First/Previous disabled on first page, Next/Last on last page; aria-labels for all controls. Tests added for pagination visibility, First/Last/Previous/Next (including last-page disabled state and First/Last refetch), page number links and current-page highlight, and refetch on page number click. Build and tsc pass; all unit tests pass.

### File List

- src/components/BlogSection.tsx (modified)
- src/components/BlogSection.css (modified)
- src/components/BlogSection.test.tsx (modified)
- src/App.test.tsx (modified)
- src/utils/blogApi.ts (modified)
- _bmad-output/planning-artifacts/epics.md (modified)
- _bmad-output/planning-artifacts/ux-design-specification.md (modified)
- _bmad-output/implementation-artifacts/sprint-status.yaml (modified)
- _bmad-output/implementation-artifacts/3-2-pagination-controls.md (modified)

## Change Log

- 2026-02-25: Code review complete; story status set to done; sprint-status synced.
- 2026-02-25: Code review fixes: File List updated (blogApi.ts, ux-design-specification.md); showPagination excludes error state to avoid stale totalPages; page clamped to valid range when totalPages shrinks; removed dead .blog-section:focus-visible CSS; touch targets (min 44px) on small viewports; tests for "up to 5" page window (totalPages=10) and loading state on page change.
- 2026-02-25: Implemented pagination controls (Story 3.2): page state and API wiring in BlogSection, Previous/Next UI with a11y labels and disabled states, tests for pagination visibility and refetch; all AC satisfied, no regressions.
- 2026-02-25: Extended pagination: First and Last buttons; up to 5 linkable page numbers (centered window, current page highlighted with aria-current and CSS); updated epics.md and story AC/tasks; added tests for First/Last, page links, and current-page highlight.
