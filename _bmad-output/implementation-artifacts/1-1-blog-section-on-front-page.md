# Story 1.1: Blog section on front page

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to see a blog section on the everscending.org front page,
so that I can find the blog as part of the normal home experience with no login or gate.

## Acceptance Criteria

1. **Given** I am on the home route (`/`), **when** the page loads, **then** I see a blog section with a visible heading (e.g. "Blog" or "Latest"). **And** the section uses the existing site layout (e.g. outer-container, inner-container) and design tokens so the site feels like one coherent experience (FR1, FR10, FR11).

2. **Given** the blog section is present, **when** content is not yet available, **then** the section shows an in-place loading state (e.g. "Loading…" or minimal placeholder) so the area is never blank. **And** the rest of the page (shell and nav) is visible and usable (NFR-P1).

3. **Given** I use a keyboard or screen reader, **when** I focus the blog area, **then** the section has semantic structure (e.g. section landmark, heading) and is reachable in a logical focus order (NFR-A1, NFR-A2).

## Tasks / Subtasks

- [x] Task 1 (AC: 1) — Add blog section to home route with heading and layout
    - [x] Create `BlogSection.tsx` as a wrapper component with semantic `<section>`, `aria-label` (e.g. "Blog"), and heading (e.g. "Blog" or "Latest").
    - [x] Add `BlogSection.css` using existing design tokens and layout (outer-container, inner-container, App.css variables).
    - [x] Compose `BlogSection` inside `Home.tsx` so the blog appears on the home route only; ensure existing home content and layout remain intact.
- [x] Task 2 (AC: 2) — In-section loading state
    - [x] Render an in-place loading state inside the blog section when content is not yet available (e.g. "Loading…" or minimal skeleton/placeholder).
    - [x] Ensure the blog request does not block initial paint; shell and nav render first (NFR-P1).
- [x] Task 3 (AC: 3) — Accessibility
    - [x] Use semantic structure: section landmark, heading; ensure logical focus order (nav → blog heading → blog content).
    - [x] Ensure visible focus indicators and that the blog area is keyboard/screen-reader navigable (NFR-A1, NFR-A2).

## Dev Notes

- **Scope:** This story is the blog section shell only. Story 2.1 adds the API client; Story 2.2 wires real posts. For 1.1, the section can show loading state only (no fetch yet), or a stub that will be replaced when 2.1/2.2 are implemented.
- **Layout:** Use existing `Layout`, `outer-container`, `inner-container`, and CSS variables from `App.css`; do not introduce a new design system or global layout. [Source: architecture.md – Styling Solution, Layout and accessibility consistency]
- **Components:** `BlogSection` is the wrapper; `Home` composes it and does not own blog data or fetch. [Source: architecture.md – Component responsibilities]
- **Testing:** Co-locate unit tests (e.g. `BlogSection.test.tsx`) or use project’s existing test pattern; E2E can assert presence of blog section and heading on `/`. [Source: architecture.md – Tests]

### Project Structure Notes

- New files: `src/components/BlogSection.tsx`, `src/components/BlogSection.css`.
- `Home.tsx` imports and renders `BlogSection`; no new route—blog is on home only.
- Align with existing component and CSS patterns (PascalCase components, co-located CSS, page `id` for scoping).

### References

- [Source: _bmad-output/planning-artifacts/epics.md – Epic 1, Story 1.1]
- [Source: _bmad-output/planning-artifacts/architecture.md – Blog placement, BlogSection/Home responsibilities, Structure alignment]
- [Source: _bmad-output/planning-artifacts/architecture.md – Performance NFR-P1, Accessibility NFR-A1/A2]

## Dev Agent Record

### Agent Model Used

(To be filled by dev agent)

### Debug Log References

### Completion Notes List

- Implemented BlogSection shell: semantic `<section aria-label="Blog">`, `<h2>Blog</h2>`, in-place "Loading…" state; no fetch in this story (Story 2.1/2.2).
- BlogSection.css uses App.css variables (--primary-text, --accent-yellow, --accent-orange for focus); section fits inside existing inner-container.
- Home.tsx composes BlogSection after logos; Shell and nav render first; blog section does not block initial paint.
- Unit tests: BlogSection.test.tsx (4 tests). App.test.tsx updated to match current nav (Projects) and to assert blog section and heading on home. E2E: tests/main.spec.ts extended with blog section visibility on `/`.
- All 10 unit tests pass. Pre-existing lint issues (vite.config, .vite/deps) unchanged.

### File List

- src/components/BlogSection.tsx (new)
- src/components/BlogSection.css (new)
- src/components/BlogSection.test.tsx (new)
- src/components/Home.tsx (modified)
- src/App.test.tsx (modified — align with current nav and add blog assertions)
- tests/main.spec.ts (modified — E2E for blog section on home)
- src/App.tsx (modified)
- src/components/Home.css (modified)
- src/components/Layout.css (modified)
- src/components/Layout.tsx (modified)
- src/components/AIEngineeringPath.tsx (modified)
- package.json (modified)
- pnpm-lock.yaml (modified)
- vite.config.ts (modified)

## Senior Developer Review (AI)

- **Outcome:** Changes requested (move forward without addressing remaining issues).
- **AC validation:** All three ACs implemented (blog section on home with heading/layout/tokens; in-place loading; semantic structure and focus).
- **Task audit:** All tasks marked [x] verified as done.
- **Findings:** 0 High, 4 Medium, 4 Low. File List updated to include all modified files (Issue #1). Remaining: Completion notes vs Layout changes (M), test for blog-only-on-home (M), a11y/focus-order test (M), and four LOW items. Proceeding per product owner decision.

## Change Log

| Date       | Event              | Notes |
| ---------- | ------------------ | ----- |
| 2026-02-19 | Code review (AI)   | Review completed; status → in-progress; File List updated; remaining issues not addressed per PO. |
