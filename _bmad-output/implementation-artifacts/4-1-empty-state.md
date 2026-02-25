# Story 4.1: Empty state

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to see a clear message when there are no posts,
So that I know the blog is working and there is simply no content yet.

## Acceptance Criteria

1. **Given** the blog API returns successfully with an empty list (success === true, data array empty), **when** the blog section renders, **then** I see a clear empty-state message (e.g. "No posts yet") (FR7). **And** the rest of the page (nav, other content) remains usable (FR9). **And** the empty state is announced to screen readers (e.g. live region or heading) (NFR-A2).

## Tasks / Subtasks

- [x] Task 1 (AC: 1) — Verify empty-state message and placement
  - [x] Confirm the blog section shows a clear empty-state message (e.g. "No posts yet") when the API returns success with an empty data array. Current implementation already has `blog-section__empty` with "No posts yet"; ensure copy matches UX spec and is not hidden by loading/error UI order.
  - [x] Ensure empty state is rendered inside the blog section only; nav and rest of page (e.g. Home content) remain visible and usable (no full-page takeover or layout collapse).
- [x] Task 2 (AC: 1) — Accessibility for empty state
  - [x] Ensure empty state is announced to screen readers: either a visible heading (e.g. `h2` or `h3`) for "No posts yet" or an `aria-live` region (section already has `aria-live="polite"`; confirm empty message is in the same section so it is announced when it appears).
  - [x] If UX/design prefers a dedicated live region for empty, add `aria-live="polite"` on the empty message container and ensure no duplicate announcements with section-level aria-live.
- [x] Task 3 (AC: 1) — No regressions
  - [x] Run `pnpm build` and `pnpm tsc --noEmit`; fix any type or lint issues.
  - [x] Existing BlogSection tests (loading, error, list, pagination) still pass. Add or extend tests: when API returns success with empty array, empty message is shown and list/pagination are not shown; rest of section does not show error or loading; when API returns error, empty message is not shown; when API returns posts, empty message is not shown.

## Dev Notes

- **Current state:** `BlogSection.tsx` already computes `isEmpty = data?.ok === true && posts.length === 0` and renders `<p className="blog-section__empty">No posts yet</p>` when `isEmpty && !isError`. Section has `aria-label="Blog"`, `aria-busy={isLoading}`, `aria-live="polite"`. This story is to **verify and harden** against AC (copy, a11y, rest of page usable), not to reimplement from scratch.
- **Empty vs error:** Empty = API success with empty `data` array; error = network/timeout/non-2xx. Do not show empty state when in error state; do not show error state when list is legitimately empty.
- **Design:** Use existing design tokens (App.css variables, `.blog-section__empty` in BlogSection.css). No new UI framework or section layout change.

### Project Structure Notes

- **Modify only:** `src/components/BlogSection.tsx` (if a11y or copy changes needed), `src/components/BlogSection.css` (empty state styles if needed), `src/components/BlogSection.test.tsx` (empty-state tests).
- **Do not:** Add a new component for empty state unless architecture explicitly recommends it; in-section message is sufficient per architecture and UX. [Source: architecture.md – Error and empty states; ux-design-specification.md – Empty state component]

### References

- [Source: _bmad-output/planning-artifacts/epics.md – Epic 4, Story 4.1]
- [Source: _bmad-output/planning-artifacts/architecture.md – Error and empty states (empty list → empty state, not error)]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md – Empty state: "No posts yet", in-section, announced]

## Developer Context (for Dev Agent)

### Technical requirements

- **Empty condition:** Empty state when `data?.ok === true` and `data.data` (or posts array) has length 0. Do not show empty when `isError` is true; do not show error when list is empty (success with empty array).
- **Copy:** Empty message must be "No posts yet" or equivalent per UX spec (FR7). Current implementation uses "No posts yet"; verify it is visible and not overridden by loading/error in render order.
- **Rest of page usable:** Blog section must not block or hide nav and other content. Empty state is in-section only; no full-page overlay or layout break (FR9).
- **Render order:** Ensure loading → then either list, empty, or error. When empty, do not show list or pagination; do show empty message inside the same `<section aria-label="Blog">`.

### Architecture compliance

- All blog HTTP remains in `src/utils/blogApi.ts`; no API changes. BlogSection already handles success/empty/error from `fetchBlogPosts` result. Empty = success with empty array per architecture: "Empty list: data array empty and success === true → empty state (e.g. 'No posts yet'), not error state." [Source: architecture.md – Format Patterns, Error handling (blog)]
- BlogSection continues to own blog state (loading, empty, error, posts, pagination); use existing design tokens and layout (App.css, blog-section classes).

### Library / framework requirements

- **React Query:** Already in use. Empty state is derived from `data?.ok === true` and `posts.length === 0`; no query API changes.
- **React:** No new libraries. Ensure conditional render order: loading first, then success path (list or empty), then error, so only one content type shows at a time.

### File structure requirements

- **Modify:** `src/components/BlogSection.tsx` only if copy or a11y need adjustment; `src/components/BlogSection.css` if empty state styling needs refinement; `src/components/BlogSection.test.tsx` for empty-state tests.
- **Do not:** Create a new EmptyState component unless architecture specifies it; current in-section `<p>` is acceptable. Do not change blogApi or add new API calls.

### Testing requirements

- **Unit:** (1) BlogSection: when mocked `fetchBlogPosts` returns `{ ok: true, data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }`, assert empty message ("No posts yet") is present and list/pagination are not rendered. (2) Assert when API returns error, empty message is not shown. (3) Assert when API returns posts, empty message is not shown. Use Vitest and React Testing Library; wrap in QueryClientProvider as in existing BlogSection tests.
- **No regression:** Existing BlogSection tests (loading, error, list, pagination) pass; build and tsc pass.

### Previous story intelligence (Epic 3)

- **Story 3.2:** Pagination in BlogSection: page state, queryKey with page/limit, pagination UI (First, Previous, page numbers, Next, Last). Loading/empty/error states unchanged. Empty state already rendered when `isEmpty && !isError`; ensure pagination is hidden when empty (no pages to show).
- **Patterns:** React Query for server state; co-located CSS; BlogSection owns all blog UI states. Use same test pattern (QueryClientProvider, mock blogApi) for empty-state tests.

### Git intelligence summary

- Recent work: Story 3.2 (pagination), 3.1 (post page, DOMPurify). BlogSection has loading, list, pagination, empty ("No posts yet"), and error. This story verifies empty state meets FR7/FR9/NFR-A2 and adds tests; minimal code change expected.

### Latest tech information

- No new dependencies. React Query and React versions unchanged. Ensure empty state is accessible (heading or live region) per NFR-A2.

### Project context reference

- **AGENTS.md:** React 19, Vite 7, TypeScript, Vitest, Playwright; blog section on home route; loading/empty/error in-section.
- **Architecture:** Empty list (success, data empty) → empty state only; error path separate. BlogSection owns state; single blog API module in blogApi.ts.

### Story completion status

- **Status:** done
- **Completion note:** Code review (2026-02-25): empty state verified; a11y locked in with heading assertion in tests; story docs updated. Verify and harden empty state (copy, a11y, rest of page usable); add tests for empty-state branch; do not reinvent existing "No posts yet" implementation.

## Change Log

- 2026-02-25: Implemented empty state verification and a11y (Task 1–3). Empty state rendered as `<h2>` for screen readers; extended BlogSection tests for empty/error/success-with-posts; all tests and build pass.
- 2026-02-25: Code review: added test assertion that empty state is a heading (a11y); updated File List (BlogSection.css noted as reviewed, no change); fixed stale Story completion status and Dev Agent Record; story status → done.

## Dev Agent Record

### Agent Model Used

Not recorded

### Debug Log References

### Completion Notes List

- **Behavioral:** When the blog API returns success with an empty data array, the blog section shows a clear empty-state message "No posts yet" inside the section only; list and pagination are not rendered. Nav and rest of page remain usable. Empty state is implemented as a visible `<h2>` so screen readers announce it (NFR-A2); section already has `aria-live="polite"` so no duplicate live region added.
- **Tests:** Extended empty-state coverage: (1) when API returns success with empty array, assert empty message present (as heading for a11y) and list/pagination/loading/error absent; (2) when API returns error, empty message not shown; (3) when API returns posts, empty message not shown. Full project test suite (69 tests) passes; build and `tsc --noEmit` pass.

### File List

- src/components/BlogSection.tsx (modified: empty state from `<p>` to `<h2>` for a11y)
- src/components/BlogSection.css (reviewed; no change — existing `.blog-section__empty` used)
- src/components/BlogSection.test.tsx (modified: added 3 empty-state tests; added heading assertion for a11y)
