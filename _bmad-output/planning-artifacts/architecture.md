---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - prd.md
  - product-brief-everscending.org-2026-02-19.md
  - ux-design-specification.md
workflowType: 'architecture'
project_name: 'everscending.org'
user_name: 'Jordan'
date: '2026-02-19'
lastStep: 8
status: 'complete'
completedAt: '2026-02-19'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

- **Blog content display (FR1–FR4):** A blog section on the front page (home route) showing a list or card set of posts from the SonicJS API. Each post has at least title and link; optionally excerpt/commentary. Visitors can open posts via link (external or in-app per API).
- **Pagination (FR4a):** Posts shown in paginated pages; default page size 20 via `limit=20` (and offset/cursor per API). Visitors can move between pages (e.g. next/previous or page numbers).
- **Environment & configuration (FR5–FR6):** Different SonicJS API base URL per deployment (local, develop, production). Correct base resolved from current host (localhost:5173, develop.everscending-org.pages.dev, everscending-org.pages.dev, everscending.org) without hardcoded URLs.
- **Error & empty states (FR7–FR9):** Clear empty state when no posts; clear error/fallback when the API fails; rest of site (nav, other content) remains usable.
- **Navigation & layout (FR10–FR11):** Blog reachable as part of the normal front-page experience; fits existing everscending.org layout and nav for one coherent experience.
- **Content freshness (FR12):** Content reflects SonicJS at time of load; no real-time updates in MVP.

**Non-Functional Requirements:**

- **Performance (NFR-P1–P3):** Initial render not blocked by blog API; blog may load after first paint. Timeout (e.g. 10s) then error/fallback; rest of site usable. No noticeable main-thread block from blog list.
- **Accessibility (NFR-A1–A3):** Blog keyboard navigable, semantic structure (list/headings/links), same contrast baseline as site.
- **Integration (NFR-I1–I3):** Correct API base per environment; on failure, clear blog error/fallback without breaking the page; avoid hard dependency on a fixed SonicJS schema (mapping layer for minor schema changes).

**Scale & Complexity:**

- **Primary domain:** Web front-end (SPA, single external API integration).
- **Complexity level:** Low (PRD classification: API integration, host-derived API config, standard front-end work; brownfield).
- **Estimated architectural components:** One new front-page section (blog block); one config-driven API client; a small set of UI states (loading, empty, error) and pagination; reuse of existing layout and design tokens.

### Technical Constraints & Dependencies

- **SPA:** React + Vite; blog is a section on the home route. No SSR/SSG in MVP.
- **Data:** Client-side fetch only; no global store required; component or simple cache for list (and optional detail).
- **API:** SonicJS backend already set up; API base is derived at runtime from the current frontend host via `getBlogApiBaseUrl()` in `src/utils/blogApi.ts`; host → API base mapping is the single source of truth (documented in README and implemented in code).
- **Browser:** Modern evergreen (Chrome, Firefox, Safari, Edge); ES2022+ and standard `fetch`; no legacy IE.
- **Design:** Extend existing everscending.org design system (custom CSS, same containers/typography/breakpoints); no new UI framework.

### Cross-Cutting Concerns Identified

- **Environment configuration:** API base is derived from the current frontend host (e.g. `window.location.host`) via `getBlogApiBaseUrl()`; host → API base mapping must be documented (README) and implemented in one place (`blogApi.ts`) and consistent across local, develop, and production.
- **Error and empty handling:** Shared pattern for loading, empty, and error states so the blog section never blocks or breaks the rest of the page.
- **Layout and accessibility consistency:** Blog must use the same layout, breakpoints, and a11y baseline as the rest of the site so the product feels like one destination.
- **API contract resilience:** Mapping layer between SonicJS response and UI so minor schema changes don’t force large refactors.

## Starter Template Evaluation

### Primary Technology Domain

**Web application (existing React SPA)** — Identified from project context. everscending.org is a brownfield React + Vite single-page application; the blog is a new section on the home route, not a new project.

### Starter Options Considered

No new starter template is used. The project is **brownfield**: the existing codebase is the foundation. Creating a new app (e.g. `npm create vite@latest`) would duplicate the repo and conflict with the requirement to extend the current site. The blog feature will be implemented as new components and API integration within the existing stack. Current tool versions (Vite 7.x, React 19.x) were verified as current and supported (Feb 2026).

### Selected Starter: Existing everscending.org Stack

**Rationale for Selection:** The site is already built and deployed. The "starter" is the current stack; no initialization command applies. The first implementation story is adding the blog section and SonicJS integration to this codebase, not scaffolding a new project.

**Initialization Command:** N/A — project already initialized. First implementation story: implement the front-page blog section and SonicJS API integration within the existing everscending.org codebase.

**Architectural Decisions Provided by Existing Stack:**

**Language & Runtime:**
- TypeScript ~5.8.3 with strict mode; ES2022 target. React 19.1.x with react-dom; JSX via react-jsx.

**Styling Solution:**
- Custom CSS only (no Tailwind or component library). Global tokens and layout in `App.css`; component-scoped CSS files; existing containers (`outer-container`, `inner-container`), typography (Optima), and palette (e.g. `--primary-bg`, `--accent-orange`). Blog will extend this system per UX spec.

**Build Tooling:**
- Vite ^7.1.6 with @vitejs/plugin-react. Build: `tsc -b && vite build`; output to `dist/`. No SSR/SSG in MVP.

**Testing Framework:**
- Vitest 3.2.x (unit) with Testing Library and happy-dom; Playwright 1.56.x (E2E). Blog components and flows should be covered by the same patterns.

**Code Organization:**
- `src/components/` for page and UI components; `src/utils/` for utilities; `src/App.tsx` for routing; each component with co-located `.css`. Blog will add blog-related components and a shared API/config layer.

**Development Experience:**
- `pnpm dev` (Vite dev server); HMR; ESLint 9 + Prettier 3; Husky + lint-staged for pre-commit (format, lint, `tsc --noEmit`). Blog API base is derived at runtime from the current host via `getBlogApiBaseUrl()` (no blog-specific env var required).

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Environment configuration: single source of truth for SonicJS API base per environment (build-time env var).
- API client: fetch to SonicJS with timeout and error/empty handling; mapping layer between API response and UI model.
- Blog placement: blog section on home route only; component state or minimal shared state for list and pagination.

**Important Decisions (Shape Architecture):**
- Pagination: default page size 20, `limit` (and offset/cursor per API); Next/Previous (and optional page numbers) per UX.
- Loading/empty/error states: in-section only; non-blocking; rest of site always usable.

**Deferred Decisions (Post-MVP):**
- RSS feed; per-post SEO/meta; SSG/pre-render; retry control in error state (optional in MVP).

### Data Architecture

- **Data source:** SonicJS API only; no application database. Content is read-only for visitors.
- **Data validation:** TypeScript types and a mapping layer from SonicJS response to a minimal UI model (title, link, optional excerpt/commentary, and fields needed for pagination). No runtime schema validation in MVP.
- **Caching:** No global cache requirement; component-level state for current page. Refetch on navigation or refresh.

### Authentication & Security

- **Authentication:** Not applicable for blog (public read-only). No login or user-specific content in MVP.
- **API security:** Rely on SonicJS and hosting (HTTPS). No API keys in front-end for public read. CORS handled by SonicJS backend.

### API & Communication Patterns

- **API style:** REST (SonicJS). Posts endpoint: `{API_BASE}/api/blog/posts` with `limit` (default 20) and offset/cursor as per API contract.
- **Client:** Native `fetch`. Timeout (e.g. 10s) then treat as error; no retry in MVP unless explicitly added.
- **Error handling:** Non-2xx or network/timeout → show error state in blog section only; do not break shell or nav (NFR-I2).
- **Environment:** API base is derived at runtime from the current frontend host via `getBlogApiBaseUrl()` in `blogApi.ts`. A single host → API base mapping (e.g. localhost:5173, develop.everscending-org.pages.dev, everscending-org.pages.dev, everscending.org, everscending-web.everscending.workers.dev, everscending.ai) is defined in code and documented in README; unknown host returns empty string and the API client returns an error. No blog-specific env variable; same build can run in any environment.

**SonicJS API response schemas**

The mapping layer should consume these response shapes. Types and mappers should align with these schemas; minor schema changes (e.g. added optional fields) can be absorbed in the mapping layer.

**Posts list — `GET {API_BASE}/api/blog/posts` (e.g. `?limit=20&page=1`)**

- **Response:** `{ success: boolean, data: Post[], pagination: Pagination }`
- **Post:** `id` (UUID), `slug` (string), `title` (string), `excerpt` (string), `content` (HTML string), `featuredImage` (path string, e.g. `/files/images/...`), `author` (string), `publishedAt` (string), `status` (string), `tags` (string)
- **Pagination:** `page` (number), `limit` (number), `total` (number), `totalPages` (number)

Example:

```json
{
  "success": true,
  "data": [
    {
      "id": "d6dbda95-523f-4933-9dc6-f850c3c004b6",
      "slug": "welcome",
      "title": "Welcome",
      "excerpt": "excerpt...",
      "content": "<p>content...</p>",
      "featuredImage": "/files/images/99dd5c34-b75a-454b-b92f-63dfe02d4a8d.jpg",
      "author": "Jordan",
      "publishedAt": "",
      "status": "published",
      "tags": ""
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
}
```

**Single post — `GET {API_BASE}/api/blog/posts/:slug`**

- **Response:** `{ success: boolean, data: Post }`
- **Post:** Same shape as in the list response.

Example:

```json
{
  "success": true,
  "data": {
    "id": "d6dbda95-523f-4933-9dc6-f850c3c004b6",
    "slug": "welcome",
    "title": "Welcome",
    "excerpt": "excerpt...",
    "content": "<p>content...</p>",
    "featuredImage": "/files/images/99dd5c34-b75a-454b-b92f-63dfe02d4a8d.jpg",
    "author": "Jordan",
    "publishedAt": "",
    "status": "published",
    "tags": ""
  }
}
```

For the front-page list view, the UI model needs at least: `id`, `slug`, `title`, `excerpt` (optional), and a link derived from `slug` (or API contract). `featuredImage`, `author`, `publishedAt`, `content`, `tags` can be mapped if needed for cards or future detail views. Pagination UI uses `pagination.page`, `pagination.limit`, `pagination.total`, `pagination.totalPages`.

### Frontend Architecture

- **State management:** Component-level state for blog (posts list, current page, loading/empty/error). No global store for blog in MVP.
- **Component structure:** Blog section wrapper on home route; post cards; loading, empty, and error states; pagination controls. Co-located CSS reusing existing tokens and layout.
- **Routing:** No new route; blog is a section on the existing home route.
- **Performance:** Blog request does not block initial paint; shell and nav render first, then blog section fills or shows state (NFR-P1). List rendering should not block main thread (NFR-P3).

### Infrastructure & Deployment

- **Hosting:** Unchanged; existing static deployment (e.g. Cloudflare Pages). Build output remains `dist/`.
- **Environment configuration:** API base is derived at runtime from the current frontend host via `getBlogApiBaseUrl()`; each deployment (local, develop, production) resolves to the correct API base automatically based on host.
- **CI/CD:** No change required for blog; existing build and deploy pipeline applies.

### Decision Impact Analysis

**Implementation sequence:**
1. Add `getBlogApiBaseUrl()` and host → API base mapping in `blogApi.ts`, and document the full mapping in README.
2. Add API client (fetch + timeout + mapping layer) and types for SonicJS response and UI model.
3. Add blog section component (wrapper, cards, loading/empty/error, pagination) on the home route using existing layout and styles.
4. Wire pagination (limit=20, offset/cursor) to API and UI.

**Cross-component dependencies:**
- Host-derived API base (`getBlogApiBaseUrl()`) is used by the API client only; no other components depend on it directly.
- API client is used by the blog section; mapping layer isolates SonicJS schema from the rest of the UI.
- Blog section depends on existing Layout and design tokens; no changes to global layout required beyond inserting the section.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical conflict points identified:** Naming (components, files, API types), project structure (where blog and API code live), API response handling and mapping, and loading/error/empty state behavior. Without consistent rules, agents could split blog logic differently, name types or components inconsistently, or handle errors in incompatible ways.

### Naming Patterns

**API and type naming (blog):**
- SonicJS response fields are camelCase (`featuredImage`, `publishedAt`, `totalPages`). Keep API response types aligned with the API (camelCase) in the mapping layer input; UI model types can stay camelCase for consistency with the rest of the app.
- Type names: `SonicJSPost`, `SonicJSPostsResponse`, `SonicJSPagination` (or similar) for raw API shapes; `BlogPost`, `BlogPagination` (or similar) for the UI model after mapping.
- API client function names: `fetchBlogPosts`, `fetchBlogPostBySlug` (or equivalent); avoid generic names like `getPosts` without a clear module boundary.

**Code naming (existing + blog):**
- Components: PascalCase (`BlogSection`, `PostCard`, `BlogEmptyState`). Files: `BlogSection.tsx`, `PostCard.tsx`, co-located `BlogSection.css`.
- Utilities: camelCase (`fetchBlogPosts`, `mapSonicJSPostToBlogPost`). File: e.g. `blogApi.ts` or `fetchBlogPosts.ts` in a dedicated place (see structure).
- Variables and props: camelCase. Constants: UPPER_SNAKE_CASE only for true constants (e.g. `DEFAULT_PAGE_SIZE = 20`).

**Route and URL naming:**
- No new route for blog in MVP; blog is a section on the home route. If a post detail route is added later, use path like `/blog/:slug` to match API.

### Structure Patterns

**Project organization:**
- **Blog UI:** New components in `src/components/`: e.g. `BlogSection.tsx` (wrapper), `PostCard.tsx`, and shared loading/empty/error components or in-section markup. Co-located CSS per component (`BlogSection.css`, etc.).
- **Blog API and types:** Single place for blog API client and mapping: either `src/utils/blogApi.ts` (and types in the same file or `src/types/blog.ts`) or a small `src/blog/` folder (e.g. `api.ts`, `types.ts`, `mappers.ts`) so all blog data-fetching and mapping live together. Do not scatter blog fetch logic across multiple components.
- **Tests:** Unit tests co-located with source (e.g. `BlogSection.test.tsx`) or in a `src/components/__tests__/` pattern if the project adopts it; E2E in `tests/` (existing). Prefer one consistent approach for new blog tests.

**File structure:**
- Blog API base: Resolve via `getBlogApiBaseUrl()` from current host; host → API base mapping lives in `blogApi.ts` and is documented in README. No blog-specific env variable. Optional `.env.example` with a comment only (e.g. "No env vars required for blog API").
- No new top-level config files for blog; use existing Vite approach.

### Format Patterns

**API response handling:**
- Expect SonicJS wrapper: `{ success: boolean, data: T, pagination?: Pagination }`. Always check `success === true` and presence of `data` before using; treat non-success or missing `data` as error path. Use the documented schema (see SonicJS API response schemas in this doc) for types.
- Do not assume a different wrapper (e.g. direct array or different property names) without updating the architecture doc and mapping layer.

**Error handling (blog):**
- Network/timeout/non-2xx: surface in the blog section only (error state UI). Do not throw unhandled or use a global error boundary for expected API failures. Message text: clear and user-facing (e.g. "Couldn't load posts"); avoid raw status codes or stack traces in UI.
- Empty list: `data` array empty and `success === true` → empty state (e.g. "No posts yet"), not error state.

**Data mapping:**
- Map from SonicJS Post to UI model in one place (e.g. `mapSonicJSPostToBlogPost`). UI model includes at least what the list/card needs (id, slug, title, excerpt, link); optional fields (featuredImage, author, publishedAt, etc.) only if used. Pagination: pass through `page`, `limit`, `total`, `totalPages` from API so pagination UI stays in sync.

### Process Patterns

**Loading state:**
- Blog section only: one loading state while the posts request is in flight. Show in-place (e.g. "Loading…" or minimal skeleton) inside the blog section; do not block shell or nav. Replace with content, empty, or error when the request settles.

**Error and empty states:**
- Exactly three section states: loading, empty (no posts), error (request failed). No infinite spinner; no blank section without message. Rest of page (nav, other content) remains usable when in error or empty.

**Pagination:**
- Request: `limit=20` and `page` (or offset) per API contract. Use the same parameter names and types as the architecture/API schema. UI: Next/Previous at minimum; page numbers optional. Disable Previous on first page and Next on last page using `pagination.totalPages` or equivalent.

### Enforcement Guidelines

**All agents MUST:**
- Put blog API client and mapping in one module/folder; do not duplicate fetch logic in multiple components.
- Use the SonicJS response schema and types documented in this architecture; extend types only when the API contract changes and update this doc.
- Use existing design tokens and layout (e.g. `outer-container`, `inner-container`, CSS variables from `App.css`) for blog UI; do not introduce a new design system or new global layout.
- Resolve API base from the current frontend host via `getBlogApiBaseUrl()`; keep the host → API base mapping in one place (`blogApi.ts`) and document it in README; do not scatter API base URLs or duplicate the mapping elsewhere.

**Pattern verification:** Lint and type-check (existing ESLint, Prettier, `tsc --noEmit`). New blog code should follow the same pre-commit checks. Document any intentional deviation in the architecture or AGENTS.md.

### Pattern Examples

**Good:**
- One `blogApi.ts` (or `src/blog/api.ts`) that exports `getBlogApiBaseUrl()`, `fetchBlogPosts(params)` and optionally `fetchBlogPostBySlug(slug)`; uses the host-derived API base from `getBlogApiBaseUrl()`, applies timeout and mapping, and returns typed results or an error result (no unhandled throws). Full host → API base mapping in code and README.
- Blog section component that calls that API, holds loading/empty/error and list/pagination in local state, and renders one of the three states or the card list + pagination.
- Types: `SonicJSPost`, `SonicJSPostsResponse`, `BlogPost`, `BlogPagination` aligned with the schema in this doc.

**Avoid:**
- Fetching posts in more than one place (e.g. both in a layout and in the blog section).
- Defining API base URLs or host mapping outside `blogApi.ts` or README; do not duplicate the mapping in components or config.
- Using a different response shape or field names without updating the mapping layer and this architecture.
- Global loading spinner or full-page error for blog API failure; keep failure scoped to the blog section.

## Project Structure & Boundaries

### Complete Project Directory Structure

```
everscending.org/
├── README.md
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── index.html
├── .env.example                    # Optional: comment only (no blog env var; API base is host-derived)
├── .gitignore
├── playwright.config.ts
├── AGENTS.md                       # Project reference (update with blog when added)
├── _bmad-output/
│   └── planning-artifacts/
│       ├── architecture.md         # This document
│       ├── prd.md
│       ├── product-brief-*.md
│       └── ux-design-specification.md
├── dist/                           # Build output (generated)
├── tests/
│   └── main.spec.ts                # Playwright E2E; add blog flows as needed
├── src/
│   ├── main.tsx
│   ├── App.tsx                     # Routes; home route renders Home (blog section inside)
│   ├── App.css                     # Global styles and CSS variables
│   ├── App.test.tsx
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Layout.css
│   │   ├── Home.tsx                # Landing; will contain or compose BlogSection
│   │   ├── Home.css
│   │   ├── BlogSection.tsx         # NEW: blog wrapper, state, loading/empty/error + list + pagination
│   │   ├── BlogSection.css
│   │   ├── PostCard.tsx            # NEW: single post card (title, link, optional excerpt)
│   │   ├── PostCard.css
│   │   ├── Resume.tsx
│   │   ├── Resume.css
│   │   ├── AgenticTwin.tsx
│   │   ├── ResearchAgent.tsx
│   │   ├── AIEngineeringPath.tsx
│   │   ├── AIEngineeringPath.css
│   │   ├── Projects.tsx
│   │   ├── Projects.css
│   │   ├── VisionDojo.tsx
│   │   ├── VisionDojo.css
│   │   ├── ConcentricCircles.tsx
│   │   ├── ConcentricCircles.css
│   │   ├── GradioApp.css
│   │   └── ...                     # Other existing components
│   ├── utils/
│   │   ├── loadGradioScript.ts
│   │   └── blogApi.ts              # NEW: fetchBlogPosts, fetchBlogPostBySlug, types, mapping
│   ├── test/
│   │   ├── setup.ts
│   │   └── vitest.d.ts
│   └── assets/
│       └── ...                     # Existing assets
```

New blog-related files: `src/components/BlogSection.tsx`, `BlogSection.css`, `PostCard.tsx`, `PostCard.css`, `src/utils/blogApi.ts`. Optional: unit test `BlogSection.test.tsx` or `src/components/__tests__/BlogSection.test.tsx`; E2E additions in `tests/main.spec.ts` or `tests/blog.spec.ts`.

### Architectural Boundaries

**API boundaries:**
- **External:** SonicJS at the URL returned by `getBlogApiBaseUrl()` — `GET {base}/posts` (list) and `GET {base}/posts/:slug` (single). All blog HTTP calls go through `src/utils/blogApi.ts`; no other module should call the blog API directly.
- **Internal:** No internal REST API; SPA only. Blog section consumes `blogApi` only.

**Component boundaries:**
- **BlogSection:** Owns blog state (loading, empty, error, posts, pagination). Fetches via `blogApi`, renders PostCard list or loading/empty/error UI and pagination. Rendered by `Home` (or equivalent) on the home route only.
- **PostCard:** Presentational; receives a single post (UI model) and renders title, link, optional excerpt. No fetch.
- **Home:** Composes existing home content and `BlogSection`; does not own blog data or fetch.

**Data boundaries:**
- **SonicJS → app:** Raw response typed and mapped in `blogApi.ts`; UI model (e.g. `BlogPost`, `BlogPagination`) used by components. No global store; blog state lives in `BlogSection` (or a small blog context if introduced later).
- **Caching:** None in MVP; refetch on mount or pagination change.

### Requirements to Structure Mapping

**Blog content display (FR1–FR4):** `BlogSection` + `PostCard` in `src/components/`; data from `blogApi.ts` (list and optional single-post fetch).

**Pagination (FR4a):** Handled in `BlogSection` (state: page, pagination); `blogApi.fetchBlogPosts({ page, limit })`; UI uses `pagination` from API response.

**Environment & configuration (FR5–FR6):** API base derived in `blogApi.ts` via `getBlogApiBaseUrl()` from the current frontend host; host → API base mapping in code and README; no other module resolves blog API base.

**Error & empty states (FR7–FR9):** Implemented inside `BlogSection` (conditional render of loading, empty, error, or list); no global error boundary for blog.

**Navigation & layout (FR10–FR11):** Blog is a child of the home route; `Home` includes `BlogSection`; layout uses existing `Layout` and containers/CSS variables.

### Integration Points

**Internal:** `Home` → `BlogSection` → `PostCard`; `BlogSection` → `blogApi`. One-way data flow; no blog events or shared store in MVP.

**External:** SonicJS (read-only). API base is provided at runtime by `getBlogApiBaseUrl()` from the current host.

**Data flow:** User lands on home → `Home` mounts → `BlogSection` mounts → `blogApi.fetchBlogPosts({ page: 1, limit: 20 })` → mapping → state update → render cards + pagination or loading/empty/error.

### File Organization Patterns

**Configuration:** Root-level Vite/TS/Playwright; optional `.env.example` with a comment that no blog env var is required (API base is host-derived). README documents the full host → API base mapping.

**Source:** Feature components and shared utils under `src/`; blog API and types centralized in `src/utils/blogApi.ts`.

**Tests:** E2E in `tests/`; unit tests co-located (e.g. `App.test.tsx`) or in `src/components/*.test.tsx`; blog tests follow the same convention.

**Assets:** `src/assets/`; blog may reference images from API (e.g. `featuredImage`) via full URL or relative to API base as needed.

### Development and Build

**Development:** `pnpm dev`; `Home` and `BlogSection` load on `/`; API base is derived at runtime from the current host via `getBlogApiBaseUrl()`.

**Build:** `pnpm build` → `dist/`; same build runs in any environment; API base is determined at runtime by host. Deployment unchanged; static hosting serves the SPA.

## Architecture Validation Results

### Coherence Validation

**Decision compatibility:** Technology choices are consistent: React 19, Vite 7, TypeScript, custom CSS, and SonicJS as the only blog data source. No conflicting decisions; host-derived API base (getBlogApiBaseUrl), single blog API module, and component-level state are aligned. Versions (Vite 7.x, React 19.x) are current and compatible.

**Pattern consistency:** Naming (PascalCase components, camelCase utils, API types aligned with SonicJS) matches the stack and existing AGENTS.md. Structure (blog UI in `src/components/`, single `blogApi.ts` in `src/utils/`) supports one-way data flow and no scattered fetch logic. Process patterns (loading/empty/error in-section, pagination from API) support the architectural decisions.

**Structure alignment:** Project tree includes all new blog files (BlogSection, PostCard, blogApi.ts); boundaries (API only via blogApi, BlogSection owns state, Home composes) are clear. Integration points (Home → BlogSection → blogApi, external SonicJS) are defined.

### Requirements Coverage Validation

**Functional requirements coverage:** FR1–FR4 (blog section, list/cards, title/link/excerpt, open post): covered by BlogSection + PostCard + blogApi and mapping. FR4a (pagination, limit 20): covered by blogApi params and BlogSection pagination state/UI. FR5–FR6 (correct API base per environment, no scattered hardcoding): covered by `getBlogApiBaseUrl()` and host mapping in blogApi and README. FR7–FR9 (empty, error, rest of site usable): covered by in-section states in BlogSection. FR10–FR11 (blog on front page, layout fit): covered by Home composing BlogSection and existing layout. FR12 (content at load time): covered by fetch-on-mount and no real-time requirement.

**Non-functional requirements coverage:** NFR-P1–P3 (non-blocking load, timeout/error, no main-thread block): addressed by architecture and patterns. NFR-A1–A3 (keyboard, semantic structure, contrast): addressed by UX and design tokens. NFR-I1–I3 (correct API base, error/fallback, mapping layer): addressed by host-derived API base, error handling, and mapping in blogApi.

### Implementation Readiness Validation

**Decision completeness:** Critical decisions (host-derived API base via getBlogApiBaseUrl, API client, blog placement) and important ones (pagination, states) are documented. SonicJS response schemas and mapping guidance are in the doc. Versions and rationale are present.

**Structure completeness:** Directory tree lists new files; BlogSection, PostCard, blogApi.ts and optional test locations are specified. Integration points and data flow are described.

**Pattern completeness:** Naming, structure, format, process, and enforcement rules are defined. Good and anti-pattern examples are given. Conflict points (single API module, host-derived mapping in one place, scoped states) are addressed.

### Gap Analysis Results

**Critical gaps:** None. All blocking decisions and structure are in place.

**Important gaps:** Query param name for pagination (e.g. `page` vs `offset`) is implied by "page" in the schema; confirm with SonicJS API (e.g. `?page=1&limit=20`). If the API uses a different param, document it in the architecture and in blogApi.

**Nice-to-have:** Optional retry on error and optional unit/E2E test file names are noted in structure; can be finalized during implementation.

### Validation Issues Addressed

No contradictory decisions or missing capabilities found. Pagination query params: architecture assumes `page` and `limit`; if SonicJS uses different names, update the API schemas section and blogApi implementation accordingly.

### Architecture Completeness Checklist

**Requirements analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements-to-structure mapping complete

### Architecture Readiness Assessment

**Overall status:** READY FOR IMPLEMENTATION

**Confidence level:** High — requirements are covered, decisions are consistent, patterns and structure are specific enough for agents to implement without conflicting.

**Strengths:** Single API module and mapping layer; clear loading/empty/error and pagination behavior; SonicJS schemas documented; boundaries and data flow explicit; brownfield extension with minimal new surface area.

**Areas for future enhancement:** Retry on error, RSS, per-post SEO, and tests can be added later without changing the core architecture.

### Implementation Handoff

**AI agent guidelines:**

- Follow the architectural decisions in this document.
- Use the implementation patterns (naming, structure, format, process) consistently.
- Respect project structure and boundaries (blog API only in blogApi.ts; BlogSection owns blog state).
- Use this document and the SonicJS API schemas here for all blog-related architectural questions.

**First implementation priority:** Add `getBlogApiBaseUrl()` and host → API base mapping in `src/utils/blogApi.ts`, and document the full mapping in README; then implement the rest of `blogApi.ts` (fetch, timeout, types, mapping); then add BlogSection and PostCard and integrate into Home.
