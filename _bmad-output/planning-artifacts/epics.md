---
stepsCompleted: ['step-01-validate-prerequisites', 'step-01-extraction', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - prd.md
  - architecture.md
  - ux-design-specification.md
---

# everscending.org - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for everscending.org, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: A visitor can see a blog section on the everscending.org front page (home route).
FR2: A visitor can see a list (or card set) of blog posts sourced from the SonicJS API.
FR3: A visitor can see for each post at least a title and a link to the full post (and optionally excerpt/commentary when the API provides it).
FR4: A visitor can open a post via its link (external or in-app per API/content model).
FR4a: The blog displays posts in paginated pages. Default page size is 20; the application requests posts from the SonicJS API with a `limit` argument (e.g. `limit=20`). A visitor can navigate between pages (e.g. next/previous or page numbers).
FR5: The application can use a different SonicJS API base URL per deployment environment (local, develop, production).
FR6: The application can resolve the correct API base for the current host (e.g. localhost:5173, develop.everscending-org.pages.dev, everscending-org.pages.dev, everscending.org) without hardcoding URLs in code.
FR7: A visitor can see a clear empty state when there are no posts (e.g. "No posts yet" or equivalent).
FR8: A visitor can see a clear error or fallback state when the blog API request fails (e.g. network error or timeout), without the rest of the page appearing broken.
FR9: A visitor can continue using the rest of the site (navigation, other content) when the blog section is empty or in error.
FR10: A visitor can reach the blog as part of the normal front-page experience (no separate login or gate).
FR11: The blog section can fit within the existing everscending.org layout and navigation so the site feels like one coherent experience.
FR12: A visitor receives blog content that reflects the current state of the SonicJS API at the time of load (no requirement for real-time updates in MVP).

### NonFunctional Requirements

NFR-P1: The initial page render (shell and nav) is not blocked by the blog API request; the blog section may load after first paint.
NFR-P2: If the blog API responds within a reasonable timeout (e.g. 10s), the blog section displays; if it does not, the user sees an error/fallback state and the rest of the site remains usable.
NFR-P3: Blog list rendering does not cause a noticeable long block of the main thread (no regression vs current site feel).
NFR-A1: The blog section is keyboard navigable (focus order, actionable elements reachable and activatable via keyboard).
NFR-A2: The blog section uses semantic structure (e.g. list, headings, links) so screen readers can understand and navigate it.
NFR-A3: Color and contrast for the blog section meet the same baseline as the rest of everscending.org (no new regression).
NFR-I1: The app uses the correct SonicJS API base URL for the environment in which it is running (local, develop, production), with no hardcoded production URLs in code.
NFR-I2: On API failure (network error, timeout, or non-2xx response), the app shows a clear error/fallback state for the blog section and does not break the rest of the page.
NFR-I3: The app does not assume a specific SonicJS response schema beyond what is needed for MVP (e.g. list of posts with title and link); minor schema changes should be absorbable with minimal code change (e.g. mapping layer).

### Additional Requirements

**From Architecture:**
- No new starter template; brownfield project. First implementation story: add front-page blog section and SonicJS API integration within the existing everscending.org codebase.
- Single source of truth for SonicJS API base: one env variable (e.g. VITE_BLOG_API_BASE) per environment; document host → API base mapping for local, develop, production.
- API client in one place: fetch to SonicJS with timeout (e.g. 10s) and error/empty handling; mapping layer between SonicJS response and UI model (e.g. blogApi.ts).
- Blog placement: blog section on home route only; component-level state (or minimal shared state) for list and pagination; no new route for blog in MVP.
- SonicJS API contract: GET {API_BASE}/api/blog/posts (e.g. ?limit=20&page=1) and GET {API_BASE}/api/blog/posts/:slug; response shape { success, data, pagination }; types and mappers must align with Architecture-documented schemas.
- Type naming: SonicJSPost, SonicJSPostsResponse, SonicJSPagination for raw API; BlogPost, BlogPagination for UI model after mapping.
- Project structure: BlogSection.tsx, PostCard.tsx in src/components/; blog API and mapping in src/utils/blogApi.ts (or src/blog/); no scattered fetch logic.
- Error handling: non-2xx or network/timeout → show error state in blog section only; do not break shell or nav. Empty list (success === true, data array empty) → empty state, not error.
- Pagination: request limit=20 and page (or offset per API contract); UI: Next/Previous at minimum; disable Previous on first page and Next on last page using pagination.totalPages.

**From UX:**
- Responsive: reuse existing everscending.org breakpoints and layout; no new breakpoints for blog; cards readable and tappable on small viewports.
- Accessibility: WCAG 2.x Level AA; semantic structure (section, heading, list or list-like); loading/empty/error states announced (e.g. live region or heading); focus order nav → blog heading → post links → pagination; visible focus indicators; touch targets (e.g. 44×44px) on small viewports.
- Component specs: Blog section wrapper (section, aria-label e.g. "Blog", heading "Blog"/"Latest"); Post card (title, link, optional excerpt; one focusable link per card); Loading state (in-section, e.g. "Loading…" or minimal skeleton; aria-busy or live region); Empty state ("No posts yet"); Error state ("Couldn't load posts", optional retry); Pagination (Previous/Next, optional page numbers, current page indicated, keyboard operable).
- Copy: Empty state = "No posts yet" (or equivalent); Error state = "Couldn't load posts" (or equivalent).
- Design: extend existing design system only (App.css variables, outer-container, inner-container, Optima, existing palette); paginated card layout; no new theme or third-party UI framework.

### FR Coverage Map

FR1: Epic 1 - Blog section visible on front page (home route)
FR2: Epic 2 - List/cards of posts from SonicJS API
FR3: Epic 2 - Per-post title, link, optional excerpt/commentary
FR4: Epic 3 - Open post via link (external or in-app)
FR4a: Epic 3 - Paginated pages (default 20), navigate next/previous
FR5: Epic 2 - Different SonicJS API base per environment
FR6: Epic 2 - Correct API base for current host, no hardcoded URLs
FR7: Epic 4 - Clear empty state when no posts
FR8: Epic 4 - Clear error/fallback when API fails
FR9: Epic 4 - Rest of site usable when blog empty or in error
FR10: Epic 1 - Blog reachable as normal front-page experience
FR11: Epic 1 - Blog fits existing layout and navigation
FR12: Epic 2 - Content reflects SonicJS at time of load

## Epic List

### Epic 1: Blog section on the front page

A visitor can see the blog as a visible part of the home page with no gate, and it fits the existing everscending.org layout so the site feels like one coherent experience.

**FRs covered:** FR1, FR10, FR11

### Epic 2: Blog shows posts from SonicJS

A visitor can see a list (or cards) of real blog posts—title, link, optional excerpt—that reflect current SonicJS content, with the app using the correct API base for the environment.

**FRs covered:** FR2, FR3, FR5, FR6, FR12

### Epic 3: Navigate pages and open posts

A visitor can open a post via its link and move between pages of posts (e.g. next/previous, default page size 20).

**FRs covered:** FR4, FR4a

### Epic 4: Clear empty and error experience

When there are no posts or the blog API fails, the visitor sees a clear message and the rest of the site (navigation, other content) remains usable.

**FRs covered:** FR7, FR8, FR9

---

## Epic 1: Blog section on the front page

A visitor can see the blog as a visible part of the home page with no gate, and it fits the existing everscending.org layout so the site feels like one coherent experience.

### Story 1.1: Blog section on front page

As a visitor,
I want to see a blog section on the everscending.org front page,
So that I can find the blog as part of the normal home experience with no login or gate.

**Acceptance Criteria:**

**Given** I am on the home route (`/`),
**When** the page loads,
**Then** I see a blog section with a visible heading (e.g. "Blog" or "Latest").
**And** the section uses the existing site layout (e.g. outer-container, inner-container) and design tokens so the site feels like one coherent experience (FR1, FR10, FR11).

**Given** the blog section is present,
**When** content is not yet available,
**Then** the section shows an in-place loading state (e.g. "Loading…" or minimal placeholder) so the area is never blank.
**And** the rest of the page (shell and nav) is visible and usable (NFR-P1).

**Given** I use a keyboard or screen reader,
**When** I focus the blog area,
**Then** the section has semantic structure (e.g. section landmark, heading) and is reachable in a logical focus order (NFR-A1, NFR-A2).

---

## Epic 2: Blog shows posts from SonicJS

A visitor can see a list (or cards) of real blog posts—title, link, optional excerpt—that reflect current SonicJS content, with the app using the correct API base for the environment.

### Story 2.1: Environment and API client for blog

As a visitor (via correct deployment),
I want the app to use the correct SonicJS API base for the current environment,
So that the blog can load real content in local, develop, and production without hardcoded URLs.

**Acceptance Criteria:**

**Given** the app is built for an environment (local, develop, production),
**When** the blog needs to request posts,
**Then** the request uses the API base from VITE_BLOG_API_BASE (no hardcoded production URLs in code) (FR5, FR6, NFR-I1).
**And** host-to-API-base mapping is documented (e.g. in README or architecture).

**Given** the SonicJS API is available,
**When** the app fetches the posts list,
**Then** it uses a single blog API module (e.g. src/utils/blogApi.ts) that performs fetch with a reasonable timeout (e.g. 10s), checks success and data, and maps the response to a UI model (NFR-I3).
**And** types align with the Architecture-documented SonicJS response shape (e.g. SonicJSPost, SonicJSPostsResponse, BlogPost, BlogPagination).

### Story 2.2: Display blog posts in the section

As a visitor,
I want to see a list (or cards) of blog posts from SonicJS (title, link, optional excerpt),
So that I can skim the latest content.

**Acceptance Criteria:**

**Given** the blog section exists and the API client is configured,
**When** the home page loads,
**Then** the blog section requests posts from the SonicJS API (e.g. GET {API_BASE}/api/blog/posts?limit=20&page=1) and does not block initial paint of the shell and nav (NFR-P1, FR2).

**Given** the API returns a successful response with posts,
**When** the blog section renders,
**Then** I see a list or card set of posts, each with at least title and link, and optionally excerpt/commentary when the API provides it (FR2, FR3).
**And** the content reflects the current state of SonicJS at load time (FR12).

**Given** the blog list is rendered,
**When** I use a keyboard or screen reader,
**Then** the list has semantic structure (e.g. list or list-like) and one focusable link per post (NFR-A1, NFR-A2).

---

## Epic 3: Navigate pages and open posts

A visitor can open a post via its link and move between pages of posts (e.g. next/previous, default page size 20).

### Story 3.1: Open post via link

As a visitor,
I want to open a post via its link,
So that I can read the full content (in-app or external).

**Acceptance Criteria:**

**Given** a post is displayed (title and/or link),
**When** I activate the post link,
**Then** I am taken to the full post (in-app or external per API/content model) (FR4).
**And** the link has a visible focus indicator and is keyboard activatable (NFR-A1).

### Story 3.2: Pagination controls

As a visitor,
I want to move between pages of posts (e.g. next/previous),
So that I can browse when there are more than one page.

**Acceptance Criteria:**

**Given** the blog displays a list of posts and the API returns pagination info,
**When** there are multiple pages,
**Then** I see pagination controls (e.g. Previous, Next) (FR4a).
**And** when I use Next or Previous, the list updates to the requested page (limit=20, page or offset per API contract).
**And** Previous is disabled on the first page and Next on the last page (using pagination.totalPages or equivalent).
**And** pagination controls are keyboard operable and clearly labeled (e.g. "Previous page", "Next page") (NFR-A1).

---

## Epic 4: Clear empty and error experience

When there are no posts or the blog API fails, the visitor sees a clear message and the rest of the site (navigation, other content) remains usable.

### Story 4.1: Empty state

As a visitor,
I want to see a clear message when there are no posts,
So that I know the blog is working and there is simply no content yet.

**Acceptance Criteria:**

**Given** the blog API returns successfully with an empty list (success === true, data array empty),
**When** the blog section renders,
**Then** I see a clear empty-state message (e.g. "No posts yet") (FR7).
**And** the rest of the page (nav, other content) remains usable (FR9).
**And** the empty state is announced to screen readers (e.g. live region or heading) (NFR-A2).

### Story 4.2: Error state

As a visitor,
I want to see a clear message when the blog API fails,
So that I know what happened and can still use the rest of the site.

**Acceptance Criteria:**

**Given** the blog API request fails (network error, timeout, or non-2xx response),
**When** the blog section handles the failure,
**Then** I see a clear error/fallback message (e.g. "Couldn't load posts") (FR8, NFR-I2).
**And** the rest of the page (nav, other content) remains usable (FR9).
**And** the error state is announced to screen readers (NFR-A2).
**And** optional: a retry control (e.g. link or button) is available and focusable.
