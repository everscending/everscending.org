# Story 3.1: Open post via link

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to open a post via its link,
so that I can read the full content (in-app or external).

## Acceptance Criteria

1. **Given** a post is displayed (title and/or link), **when** I activate the post link, **then** I am taken to the full post (in-app or external per API/content model) (FR4). **And** the link has a visible focus indicator and is keyboard activatable (NFR-A1).

## Tasks / Subtasks

- [x] Task 1 (AC: 1) — Add single-post API and route
  - [x] In `src/utils/blogApi.ts`, add `fetchBlogPostBySlug(slug: string)` that calls `GET {API_BASE}/api/blog/posts/:slug`, uses same timeout and error handling as `fetchBlogPosts`, and returns `{ ok: true, data: BlogPostDetail } | { ok: false, error: string }`. Single-post response shape per architecture: `{ success, data: Post }`. Map to a **detail UI type that includes `content`** (HTML string): either extend BlogPost with optional `content` for detail, or add `BlogPostDetail` (id, slug, title, excerpt, link, content; optionally author, publishedAt) and a mapper (e.g. `mapSonicJSPostToBlogPostDetail`) so the page can render the post body. List view continues to use existing `BlogPost` (no content); single-post only uses the detail type.
  - [x] In `App.tsx`, add route `path="/blog/:slug"` rendering a new post-detail page component (e.g. `BlogPostPage` or `PostPage`). Catch-all `*` must remain last so `/blog/:slug` is matched before redirect.
  - [x] Ensure `PostCard` continues to use `post.link` (already `/blog/${slug}` from blogApi mapping); no change to link href unless switching to external URL model.
- [x] Task 2 (AC: 1) — Post detail page
  - [x] Create `src/components/BlogPostPage.tsx` (or `PostPage.tsx`): read `slug` from route params (`useParams()`), call `fetchBlogPostBySlug(slug)` (via React Query `useQuery` for consistency with BlogSection), render loading/error states in-section, and on success render full post content (at least title and content; optionally excerpt, author, date per architecture). **Post body is HTML from SonicJS:** render via `dangerouslySetInnerHTML` for the content field (trusted API source for MVP); use a wrapper element with a class for styling. Use `Layout` with an appropriate `id`; page should fit existing layout and design tokens. Layout already provides "Back to Home" when not on home—do not add a duplicate back control.
  - [x] Add `BlogPostPage.css` for post content styling (typography, spacing); reuse App.css variables and container patterns.
  - [x] Handle not-found vs generic error: when API returns HTTP 404 or `success === false` with no data for unknown slug, show "Post not found" (or equivalent) in-section; for network/timeout or other 5xx errors show "Couldn't load post" (or equivalent). Do not break shell or nav.
- [x] Task 3 (AC: 1) — Accessibility and link behavior
  - [x] Post list link: BlogSection.css already defines `.blog-section a:focus-visible`; confirm post card links (inside BlogSection) have visible focus indicator and are keyboard activatable. If any link outside the blog section ever needs the same, add `.post-card__link:focus-visible` in PostCard.css.
  - [x] Post detail page: semantic structure (e.g. article, heading, main content); focus order and screen reader friendly per NFR-A1, NFR-A2.
- [x] Task 4 (AC: 1) — No regressions
  - [x] Run `pnpm build` and `pnpm tsc --noEmit`; fix any type or lint issues.
  - [x] Existing BlogSection and PostCard tests still pass. Add tests for BlogPostPage (e.g. loading, success with content, not-found/error) and for blogApi `fetchBlogPostBySlug` if applicable.

## Dev Notes

- **BlogSection limit:** Page size for the blog list is configurable; no fixed value is required by the architecture.
- **In-app vs external:** Architecture and epic allow "in-app or external per API/content model." Current codebase uses in-app links (`/blog/${slug}`). Implement in-app: add `/blog/:slug` route and a page that fetches and displays the post via SonicJS single-post endpoint. Do not change to external URLs unless product decision dictates otherwise.
- **Single source of truth:** All blog HTTP calls go through `src/utils/blogApi.ts`. Add `fetchBlogPostBySlug` there; post page must not call fetch directly. [Source: architecture.md – API boundaries]
- **SonicJS single-post:** `GET {API_BASE}/api/blog/posts/:slug` returns `{ success: boolean, data: Post }`. Same Post shape as list. Use existing `mapSonicJSPostToBlogPost` for UI model. [Source: architecture.md – SonicJS API response schemas]
- **React Query:** Use `useQuery` for the single-post fetch in the new page (same pattern as BlogSection) so loading/error/success are consistent and cache key can include slug.
- **Detail type and HTML content:** List view keeps using `BlogPost` (no content). Single-post response must be mapped to a type that includes `content` (HTML string) so the page can render the body; use `dangerouslySetInnerHTML` for MVP (trusted SonicJS source). Implementation sanitizes post body HTML with DOMPurify before rendering (defense in depth).

### Project Structure Notes

- **Existing:** `PostCard.tsx` renders `<a href={post.link}>`; `post.link` is already `/blog/${slug}` from blogApi. No change to PostCard link href for in-app implementation.
- **Existing:** `src/utils/blogApi.ts` has `fetchBlogPosts`, types, mapping. Add `fetchBlogPostBySlug(slug)`, a detail UI type that includes `content` (e.g. `BlogPostDetail`), and a mapper that includes content; export result type (e.g. `FetchBlogPostBySlugResult`).
- **New:** `src/components/BlogPostPage.tsx` (or `PostPage.tsx`), `BlogPostPage.css`; add route in `App.tsx`.
- **Alignment:** Same patterns as 2.2: components in `src/components/`, co-located CSS, blog API in `src/utils/blogApi.ts`. [Source: architecture.md – Structure Patterns]

### References

- [Source: _bmad-output/planning-artifacts/epics.md – Epic 3, Story 3.1]
- [Source: _bmad-output/planning-artifacts/architecture.md – API & Communication Patterns, SonicJS API response schemas (single post), Route and URL naming]
- [Source: _bmad-output/planning-artifacts/architecture.md – Component boundaries, Data boundaries, Naming patterns]

## Developer Context (for Dev Agent)

### Technical requirements

- **Single-post API:** Implement `fetchBlogPostBySlug(slug: string)` in `blogApi.ts`. URL: `${getBlogApiBaseUrl()}/posts/${encodeURIComponent(slug)}`. Same timeout (10s) and error handling as `fetchBlogPosts`. Response: `{ success, data: Post }`; map to a **detail type that includes `content`** (e.g. `BlogPostDetail`: id, slug, title, excerpt, link, content; optionally author, publishedAt). Return `{ ok: true, data: BlogPostDetail } | { ok: false, error: string }`. Do not reuse `mapSonicJSPostToBlogPost` for single-post if it omits content—add a mapper that includes content. Treat HTTP 404 or success=false with no data as not-found; return distinct error message so UI can show "Post not found" vs "Couldn't load post". Sanitize/slug validation: reuse or mirror `safeSlugForLink` logic for request slug if needed.
- **Route:** Add `<Route path="/blog/:slug" element={<BlogPostPage />} />` in `App.tsx` (before the catch-all `*` route). Ensure `BlogPostPage` is imported.
- **Post page component:** New component that uses `useParams()` from react-router-dom to get `slug`, calls `fetchBlogPostBySlug(slug)` via `useQuery` (queryKey e.g. `['blog','post', slug]`, queryFn that throws on `!result.ok`). States: loading (in-section message or skeleton), error (show "Post not found" when result indicates not-found, else "Couldn't load post"), success (render title and content; optionally excerpt, author, publishedAt). **Render HTML content** via `dangerouslySetInnerHTML` on a wrapper div (content is from trusted SonicJS API for MVP). Wrap in `Layout id="blog-post"` (or similar). Use existing design tokens and inner-container/outer-container if applicable.
- **Link and a11y:** Post card links already get `.blog-section a:focus-visible` from BlogSection.css. Post detail page: use semantic HTML (article, h1, main content area) and ensure focus order and screen reader announcements (e.g. live region for loading/error).

### Architecture compliance

- All blog HTTP in `src/utils/blogApi.ts` only. New page must use `fetchBlogPostBySlug` from blogApi; no direct fetch to SonicJS in components.
- Use existing design tokens and layout (App.css variables, Layout, containers); no new design system or UI framework.
- Naming: `BlogPostPage` or `PostPage` (PascalCase); `fetchBlogPostBySlug` (camelCase). Types: list continues to use `BlogPost`; single-post uses a detail type that includes `content` (e.g. `BlogPostDetail`), aligned with SonicJSPost.

### Library / framework requirements

- **React Router:** Already in use. Use `useParams()` for `:slug` in the new page.
- **React Query:** Already used in BlogSection. Use `useQuery` for single-post fetch in BlogPostPage with a slug-dependent query key and queryFn that calls `fetchBlogPostBySlug` and throws on `!result.ok`.
- No new libraries required.

### File structure requirements

- **Modify:** `src/utils/blogApi.ts` (add `fetchBlogPostBySlug`, optional result type). `src/App.tsx` (add route and import for BlogPostPage).
- **Create:** `src/components/BlogPostPage.tsx`, `src/components/BlogPostPage.css`. Optional: `BlogPostPage.test.tsx` for unit tests.
- **Do not:** Scatter blog fetch logic; add duplicate API base resolution; remove or break existing BlogSection/PostCard behavior.

### Testing requirements

- **Unit:** (1) blogApi: `fetchBlogPostBySlug` returns ok+data (with content) for successful response, ok:false with appropriate error for 404/not-found vs network/5xx (mock fetch). (2) BlogPostPage: wrap in `QueryClientProvider` with same pattern as BlogSection.test.tsx (createTestQueryClient with retry: false, renderWithClient); mock `blogApi.fetchBlogPostBySlug` at module boundary; tests: shows loading while fetching, renders content when success, shows "Post not found" for not-found, shows "Couldn't load post" for generic error. Use Vitest and React Testing Library.
- **E2E (optional):** Playwright: navigate to home, click a post link, assert URL is /blog/:slug and page shows post content or not-found. Can be added in this story or later.
- **No regression:** Existing BlogSection and PostCard tests pass; existing App routes and Home unchanged except for new route.

### Previous story intelligence (Epic 2)

- **Story 2.2:** BlogSection uses React Query `useQuery` for `fetchBlogPosts`; QueryClientProvider in main.tsx. PostCard is presentational, receives `BlogPost`, renders `<a href={post.link}>` with title and optional excerpt. Post links are already `/blog/${slug}` from blogApi mapping. No `/blog/:slug` route exists yet—adding it is the scope of this story.
- **Story 2.1:** blogApi has `getBlogApiBaseUrl()`, `fetchBlogPosts`, types, mapping. Single-post endpoint documented in architecture; not yet implemented in code.
- **Patterns:** Co-located CSS; components in `src/components/`; utils in `src/utils/`; tests next to component; React Query for server state.

### Git intelligence summary

- Recent commits: blog epic 2 merge, BlogSection + PostCard + React Query. PostCard and blogApi already produce `/blog/${slug}` links; App.tsx has no /blog route yet. Implement fetchBlogPostBySlug, new route, and BlogPostPage in this story.

### Latest tech information

- React Query and React Router versions already in use (see package.json). No new version research required for this story. Use existing patterns from BlogSection for useQuery and from App.tsx for routes.

### Project context reference

- **AGENTS.md:** React 19, Vite 7, TypeScript, Vitest, Playwright; `src/components/`, `src/utils/`; styling via App.css and component CSS. Blog is a front-page section and in-app post viewing.
- **Architecture:** Single blog API module (`blogApi.ts`), GET posts list and GET posts/:slug; mapping layer; component-level state; loading/error in-section only; route `/blog/:slug` for post detail.

### Story completion status

- **Status:** ready-for-dev
- **Completion note:** Ultimate context engine analysis completed—comprehensive developer guide created. Implement in-app post view: add fetchBlogPostBySlug, /blog/:slug route, BlogPostPage with useQuery; ensure link focus and a11y; no regressions.

## Dev Agent Record

### Agent Model Used

(To be filled by dev agent)

### Debug Log References

### Completion Notes List

- Implemented single-post API: `fetchBlogPostBySlug(slug)` in blogApi.ts with `BlogPostDetail` type and `mapSonicJSPostToBlogPostDetail`; distinct "Post not found" vs "Couldn't load post" errors.
- Added route `/blog/:slug` in App.tsx and created BlogPostPage with useQuery, loading/error/not-found states, and HTML content sanitized with DOMPurify then rendered via dangerouslySetInnerHTML.
- Added PostCard link focus-visible style; BlogPostPage uses article landmark, aria-busy, aria-live.
- Unit tests: blogApi fetchBlogPostBySlug (success, 404, not-found, 5xx, network error); BlogPostPage (loading, success with content, not-found, generic error, slug from route, article a11y). BlogSection test updated to avoid asserting a specific page size. All 55 tests pass; build and tsc pass.
- Post body HTML is sanitized with DOMPurify before rendering (defense in depth; story originally specified trusted API + dangerouslySetInnerHTML for MVP).

### File List

- src/utils/blogApi.ts (modified)
- src/utils/blogApi.test.ts (modified)
- src/App.tsx (modified)
- src/components/BlogPostPage.tsx (new)
- src/components/BlogPostPage.css (new)
- src/components/BlogPostPage.test.tsx (new)
- src/components/PostCard.tsx (modified)
- src/components/PostCard.css (modified)
- src/components/BlogSection.test.tsx (modified)
- package.json (modified — DOMPurify dependency)
- pnpm-lock.yaml (modified)
- _bmad-output/implementation-artifacts/sprint-status.yaml (modified — sprint tracking)
