# Code Review: Story 2.2 — Display blog posts in the section

**Story file:** `2-2-display-blog-posts-in-the-section.md`  
**Story key:** `2-2-display-blog-posts-in-the-section`  
**Reviewer:** Jordan (adversarial senior developer review)  
**Date:** 2026-02-23

---

## Git vs Story Discrepancies

- **Files in git but not in this story's File List:** `src/utils/blogApi.ts`, `src/utils/blogApi.test.ts`, `pnpm-lock.yaml` (delivered in Story 2.1; same branch). Story 2.2 File List is correctly scoped to 2.2-only files. **Discrepancy count:** 1 (branch contains 2.1+2.2; story documents 2.2 only — consider noting 2.1 files in Dev Agent Record for traceability).
- **Files in story File List with no git changes:** None; all listed files are modified or added in git.
- **Uncommitted changes:** All changes are uncommitted; File List matches the set of files touched for 2.2.

---

## Acceptance Criteria Verification

| AC | Requirement | Status | Evidence |
|----|--------------|--------|----------|
| AC1 | Blog section requests posts (GET with limit and page), does not block paint | ✅ IMPLEMENTED | `useQuery` + `fetchBlogPosts` with page and limit in BlogSection; QueryClientProvider in main.tsx; no blocking render |
| AC2 | List/cards with title, link, optional excerpt; content from SonicJS at load | ✅ IMPLEMENTED | PostCard shows title, link, optional excerpt; data from API mapping |
| AC3 | Semantic structure, one focusable link per post | ✅ IMPLEMENTED | `<section>`, `<h2>`, `<ul>`/`<li>`, one `<a>` per PostCard; tests verify one link per post |

---

## Task Completion Audit

- **Task 1 (Wire fetch, React Query):** ✅ Done — useQuery, queryFn throws on !result.ok, QueryClientProvider in main.tsx, aria-busy/aria-live, no hardcoded API URLs.
- **Task 2 (Render list/cards):** ✅ Done — PostCard, ul/li, title + link + optional excerpt, semantic list, one focusable link per post.
- **Task 3 (A11y and edge states):** ✅ Done — empty "No posts yet", error "Couldn't load posts" in-section, semantic structure.
- **Task 4 (No regressions):** ✅ Done — 37 tests pass, pnpm build/tsc/lint verified.

---

## Issues Found

### HIGH (must fix)

- None. All ACs and tasks are implemented; no false [x] claims.

### MEDIUM (should fix)

1. **Stale list and error both shown on refetch failure** [BlogSection.tsx]  
   When React Query has cached data and a refetch fails, the component renders both the cached post list and the error paragraph (list first, then "Couldn't load posts" below). This can confuse users. Prefer: when `isError` and we want to prioritize the error, render only the error state; or show the list with a clear "stale" or "Update failed" message so the UX is unambiguous.

2. **Slug not sanitized when building post link** [blogApi.ts / PostCard]  
   `post.link` is built as `/blog/${slug}` in `mapSonicJSPostToBlogPost`. If the API ever returned a slug with `javascript:...`, `../`, or other unsafe characters, the link could be unsafe (XSS or path confusion when Epic 3 adds the route). Recommend: sanitize or validate slug (e.g. allow only `[a-zA-Z0-9-_]`) in the mapper and default to a safe value (e.g. id or "untitled") when invalid.

3. **Branch vs story File List** [Story Dev Agent Record]  
   The branch includes 2.1 and 2.2. The story File List only lists 2.2 files. For traceability, add a short note in Dev Agent Record that blogApi.ts, blogApi.test.ts, and pnpm-lock.yaml are from Story 2.1 (or document branch scope).

### LOW (nice to fix)

4. **Story doc status inconsistency** [2-2-display-blog-posts-in-the-section.md]  
   The "Completion status" section says "Status: ready-for-dev" while the story header has "Status: review". Update the Completion status to "review" (or remove the duplicate) so the story is consistent.

5. **Custom error message not covered by test** [BlogSection.test.tsx]  
   When `fetchBlogPosts` returns `{ ok: false, error: "Custom message" }`, the UI should show that message. The only error test uses "Couldn't load posts". Add a test that asserts a custom error string (e.g. "Unknown host for blog API") is displayed.

6. **Empty slug produces `/blog/`** [blogApi.ts]  
   `slug ?? ""` yields `link: "/blog/"` when slug is missing. Consider normalizing (e.g. use `id` or a fallback slug) or documenting this edge case.

7. **Exported query key unused** [BlogSection.tsx]  
   `BLOG_POSTS_QUERY_KEY` is exported but not used elsewhere. Acceptable for future cache invalidation; optionally remove until needed to reduce surface area.

---

## Summary

- **Git vs Story discrepancies:** 1 (branch has 2.1 files not listed in 2.2 File List; recommend documenting in Dev Agent Record).
- **Issues:** 0 High, 3 Medium, 4 Low.
- **README / .env.example:** Verified — README documents host → blog API mapping; .env.example states no env vars required for blog API.
- **Tests:** 37 tests pass; BlogSection tests cover loading, list, empty, error, aria-busy, one focusable link per post.

---

## Resolution (2026-02-23)

User chose **Fix them automatically**. Applied:

- **BlogSection.tsx:** List and empty state render only when `!isError`; error state is the only content when `isError` (no stale list + error).
- **blogApi.ts:** Slug sanitization via `safeSlugForLink()` — allowed chars `[a-zA-Z0-9-_]`; fallback to sanitized `id`, then `"untitled"`. Updated `mapSonicJSPostToBlogPost` and added unit test for sanitization and fallback.
- **Story:** File List now has branch-scope note (2.1 files); Completion status set to review then done; Completion Notes and Change Log updated with code review fixes.
- **BlogSection.test.tsx:** Test added for custom API error message displayed in UI.
- **Story status:** Set to **done**; sprint-status synced: `2-2-display-blog-posts-in-the-section: done`.

---

## Next Steps (archived)

Choose one:

1. **Fix them automatically** — Apply fixes for HIGH and MEDIUM issues in code and tests, update File List/Dev Agent Record if needed.
2. **Create action items** — Add a "Review Follow-ups (AI)" subsection to the story Tasks/Subtasks with `- [ ] [AI-Review][Severity] Description [file:line]` for each issue.
3. **Show me details** — Deep dive into specific issues (e.g. refetch UX or slug sanitization) with code-level suggestions.

After that, story status and sprint-status will be updated per workflow (done vs in-progress based on whether HIGH/MEDIUM are resolved).
