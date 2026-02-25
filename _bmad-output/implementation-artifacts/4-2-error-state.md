# Story 4.2: Error state

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to see a clear message when the blog API fails,
So that I know what happened and can still use the rest of the site.

## Acceptance Criteria

1. **Given** the blog API request fails (network error, timeout, or non-2xx response), **when** the blog section handles the failure, **then** I see a clear error/fallback message (e.g. "Couldn't load posts") (FR8, NFR-I2). **And** the rest of the page (nav, other content) remains usable (FR9). **And** the error state is announced to screen readers (NFR-A2). **And** optional: a retry control (e.g. link or button) is available and focusable.

## Tasks / Subtasks

- [x] Task 1 (AC: 1) — Verify error-state message and placement
  - [x] Confirm the blog section shows a clear error message (e.g. "Couldn't load posts") when the API fails (network error, timeout, or non-2xx). Current implementation already has `blog-section__error` with BLOG_ERROR_MESSAGE; ensure copy matches UX spec and is not hidden by loading/empty UI order.
  - [x] Ensure error state is rendered inside the blog section only; nav and rest of page remain visible and usable (no full-page takeover or layout collapse).
- [x] Task 2 (AC: 1) — Accessibility for error state
  - [x] Ensure error state is announced to screen readers: either a visible heading (e.g. `h2` or `h3`) for the error message or an `aria-live` region. Section already has `aria-live="polite"`; confirm error message is in the same section so it is announced when it appears. Align with empty-state pattern (Story 4.1 used `<h2>` for "No posts yet").
  - [x] If adding a retry control, ensure it is focusable and clearly labeled (e.g. "Try again" or "Retry").
- [x] Task 3 (AC: 1) — Optional retry control
  - [x] If implementing retry: add a focusable link or button that refetches posts (e.g. invalidate query or call fetch again). Wire to React Query refetch or equivalent; no new API layer. Optional per AC; can be deferred if time-boxed.
- [x] Task 4 (AC: 1) — No regressions
  - [x] Run `pnpm build` and `pnpm tsc --noEmit`; fix any type or lint issues.
  - [x] Existing BlogSection tests (loading, empty, list, pagination) still pass. Add or extend tests: when API fails (mock rejection or non-ok result), error message is shown and list/pagination/empty are not shown; rest of section does not show loading or empty; when API returns success with posts, error message is not shown; when API returns success with empty array, error message is not shown; when API returns success with posts, error message is not shown; when API returns success with empty array, error message is not shown; retry control present and focusable; retry triggers refetch.

## Dev Notes

- **Current state:** `BlogSection.tsx` already shows error via `isError && <p className="blog-section__error">{errorMessage}</p>` with `BLOG_ERROR_MESSAGE = "Couldn't load posts"`. `blogApi.ts` returns `{ ok: false, error }` for network/timeout/non-2xx and invalid response. Upgrade the error message element from `<p>` to `<h2 className="blog-section__error">` for a11y parity with empty state (Story 4.1). This story is to **verify and harden** against AC (copy, a11y, rest of page usable, optional retry), not to reimplement from scratch.
- **Error vs empty:** Error = request failed (network, timeout, non-2xx); empty = API success with empty `data` array. Do not show error state when list is legitimately empty; do not show empty state when in error state.
- **Design:** Use existing design tokens (App.css variables, `.blog-section__error` in BlogSection.css). No new UI framework or section layout change.

### Project Structure Notes

- **Modify only:** `src/components/BlogSection.tsx` (error message element for a11y, optional retry), `src/components/BlogSection.css` (error state styles if needed), `src/components/BlogSection.test.tsx` (error-state tests).
- **Do not:** Add a new component for error state unless architecture explicitly recommends it; in-section message (and optional retry) is sufficient per architecture and UX. [Source: architecture.md – Error and empty states; ux-design-specification.md – Error state component]

### References

- [Source: _bmad-output/planning-artifacts/epics.md – Epic 4, Story 4.2]
- [Source: _bmad-output/planning-artifacts/architecture.md – Error handling (blog): in-section only, clear message, rest of page usable]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md – Error state: "Couldn't load posts", optional retry, announced]

## Developer Context (for Dev Agent)

### Technical requirements

- **Error condition:** Error state when `isError === true` (React Query) or when `fetchBlogPosts` returns `{ ok: false, error }` (network, timeout, non-2xx, invalid response, unknown host). Do not show error when `data?.ok === true` (even if posts array is empty—that is empty state).
- **Copy:** Error message must be "Couldn't load posts" or equivalent per UX spec (FR8). Already in `blogApi.ts` as `BLOG_LOAD_ERROR_MESSAGE` and in BlogSection as `BLOG_ERROR_MESSAGE`; verify it is visible and not overridden by loading/empty in render order.
- **A11y:** Use `<h2 className="blog-section__error">` for the error message (not `<p>`) so screen readers announce it, matching the empty-state pattern in Story 4.1.
- **Rest of page usable:** Blog section must not block or hide nav and other content. Error state is in-section only; no full-page overlay or layout break (FR9).
- **Render order:** Ensure loading → then either list, empty, or error. When error, do not show list, pagination, or empty message; do show error message inside the same `<section aria-label="Blog">`.
- **Optional retry:** If implemented, trigger React Query refetch (e.g. `refetch()` from `useQuery`) so the same query runs again; no new API function. Button/link label e.g. "Try again" or "Retry"; focusable and inside the blog section.

### Architecture compliance

- All blog HTTP remains in `src/utils/blogApi.ts`; no API changes. BlogSection already receives error via `isError` and `error` from `useQuery`; `blogApi` returns `{ ok: false, error }` for all failure cases. Architecture: "Network/timeout/non-2xx: surface in the blog section only (error state UI). Message text: clear and user-facing (e.g. 'Couldn't load posts')." [Source: architecture.md – Error handling (blog), Format Patterns]
- BlogSection continues to own blog state (loading, empty, error, posts, pagination); use existing design tokens and layout (App.css, blog-section classes).

### Library / framework requirements

- **React Query:** Already in use. Error state is derived from `isError` and `error`; optional retry uses `refetch()` from `useQuery`. No query API changes beyond possibly exposing refetch for a retry button.
- **React:** No new libraries. Ensure conditional render order: loading first, then success path (list or empty), then error, so only one content type shows at a time.

### File structure requirements

- **Modify:** `src/components/BlogSection.tsx` only if error message element needs a11y upgrade (e.g. to `<h2>` like empty state) or retry control added; `src/components/BlogSection.css` if error state styling needs refinement; `src/components/BlogSection.test.tsx` for error-state tests.
- **Do not:** Create a new ErrorState component unless architecture specifies it; current in-section `<p>` (or heading) is acceptable. Do not change blogApi error contract or add new API calls.

### Testing requirements

- **Unit:** (1) BlogSection: when mocked `fetchBlogPosts` rejects or returns `{ ok: false, error: "Couldn't load posts" }`, assert error message is present and list/pagination/empty are not rendered. (2) Assert when API returns success with posts, error message is not shown. (3) Assert when API returns success with empty array, error message is not shown. (4) If retry is implemented, assert retry control is present and focusable/callable. Use Vitest and React Testing Library; wrap in QueryClientProvider as in existing BlogSection tests.
- **No regression:** Existing BlogSection tests (loading, empty, list, pagination) pass; build and tsc pass.

### Previous story intelligence (Epic 4)

- **Story 4.1 (Empty state):** Empty state verified with `<h2 className="blog-section__empty">No posts yet</h2>` for a11y; section has `aria-live="polite"`, `aria-busy`, `aria-label="Blog"`. Tests assert empty message as heading and empty/error/success-with-posts branches. Apply same pattern for error: use `<h2>` (or equivalent) for error message so screen readers announce it; keep single content type visible (loading → list | empty | error).
- **Patterns:** React Query for server state; co-located CSS; BlogSection owns all blog UI states. Use same test pattern (QueryClientProvider, mock blogApi) for error-state tests.

### Git intelligence summary

- Recent work: Story 4.1 (empty state), 3.2 (pagination), 3.1 (post page, DOMPurify). BlogSection has loading, list, pagination, empty ("No posts yet"), and error ("Couldn't load posts"). This story verifies error state meets FR8/FR9/NFR-A2 and adds tests; optional retry can be added; minimal code change expected for verification, slightly more if retry is implemented.

### Latest tech information

- No new dependencies. React Query and React versions unchanged. Ensure error state is accessible (heading or live region) per NFR-A2; optional retry control must be focusable.

### Project context reference

- **AGENTS.md:** React 19, Vite 7, TypeScript, Vitest, Playwright; blog section on home route; loading/empty/error in-section.
- **Architecture:** Error path (network/timeout/non-2xx) → error state only; empty path separate. BlogSection owns state; single blog API module in blogApi.ts.

### Story completion status

- **Status:** done
- **Completion note:** Code review fixes applied: retry touch target (44px) on mobile, Layout.css added to File List, commented CSS removed, retry aria-label, rejection test added; story marked done.

## Change Log

- Error state hardened: error message upgraded to `<h2>` for a11y, optional "Try again" retry button added, error-state tests added (2026-02-25).
- Code review fixes: retry button 44px touch target on mobile, Layout.css in File List, commented CSS removed, retry aria-label "Retry loading posts", test for fetch rejection path (2026-02-25).

## Dev Agent Record

### Agent Model Used

Code review (Cursor)

### Debug Log References

### Completion Notes List

- **Behavioral:** When the blog API fails (network, timeout, or non-2xx), the blog section shows "Couldn't load posts" as an `<h2>` (announced to screen readers via existing `aria-live="polite"`). A "Try again" button calls React Query `refetch()` to retry the request. On error, list, pagination, and empty message are not shown; only the error heading and retry button are visible. Rest of page (nav, other content) remains usable.
- **Layout/UX:** Error state is inside the blog section only (`.blog-section__error-wrapper` with heading + retry button). Retry button uses existing design tokens (border, hover) and is focusable. No full-page overlay or layout collapse.
- **Code review fixes (2026-02-25):** Retry button given 44×44px min touch target on small viewports; retry button given aria-label "Retry loading posts"; commented-out CSS removed; test added for fetch rejection path; Layout.css (footer margin) added to File List.

### File List

- src/components/BlogSection.tsx (modified)
- src/components/BlogSection.css (modified)
- src/components/BlogSection.test.tsx (modified)
- src/components/Layout.css (modified — footer margin; documented in code review)
- _bmad-output/implementation-artifacts/sprint-status.yaml (modified)
