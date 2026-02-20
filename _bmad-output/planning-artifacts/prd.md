---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
inputDocuments:
  - product-brief-everscending.org-2026-02-19.md
briefCount: 1
researchCount: 0
brainstormingCount: 0
projectDocsCount: 0
workflowType: prd
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: brownfield
---

# Product Requirements Document - everscending.org

**Author:** Jordan
**Date:** 2026-02-19

## Executive Summary

everscending.org is being extended from a portfolio site into a single focal point for people interested in AI (LLMs, agents, breakthroughs) and consciousness/philosophy. The product is a blog on the front page that aggregates external links and posts (with or without commentary) and supports original short posts, so casual readers have one place to skim curated content instead of hunting across many sources. Target users are casual readers in this niche and, secondarily, employers/clients who see the blog as part of your professional brand. Success is readers coming back and having one URL to share. The blog is powered by SonicJS (headless CMS), with the backend already set up and environment-specific API bases defined for local, develop, and production.

### What Makes This Special

- **Niche focus:** Deliberately combines AI/agents and consciousness/philosophy in one place; not generic AI news or standalone philosophy.
- **Human curation:** One trusted filter (you), not algorithm or editorial noise.
- **Flexible content mix:** Aggregation (with or without commentary) plus original short posts.
- **Single destination:** Portfolio and this curated stream live at everscending.org — one URL to point people to.

## Project Classification

- **Project type:** Web app (SPA, browser-based).
- **Domain:** General (content/publishing, personal brand).
- **Complexity:** Low (API integration, env-based config, standard front-end work).
- **Project context:** Brownfield (adding a defined feature to the existing everscending.org site).

## Success Criteria

### User Success

- Readers use the blog as their **one place** to skim AI + consciousness content (no need to hunt across many sites).
- **Return visits** — readers come back (observable; optional analytics later).
- "Aha" moment: "I don't have to hunt across 10 sites."
- For employers/clients: blog is visible and findable as part of your professional brand.

### Business Success

- everscending.org functions as a **single focal point** for this niche.
- One URL to share (portfolio + blog).
- Success is qualitative unless you add targets (e.g. posts/month, return visits).

### Technical Success

- Blog appears on the **front page**; posts load from SonicJS API.
- **Correct API base per environment:** localhost:5173 → local API; develop branch → develop API; production (everscending-org.pages.dev / everscending.org) → production API.
- No hardcoded API URLs; env-based config so each deploy uses the right backend.

### Measurable Outcomes

- **User:** Return visits / repeat use (optional tracking later).
- **Curator/brand:** One live URL; blog visible and findable on the front page.

## Product Scope

### MVP - Minimum Viable Product

- Blog on the front page (visible on everscending.org landing).
- Posts fetched and displayed from SonicJS API (aggregated links/short posts as provided by API).
- Environment-specific API base for: local (localhost:5173), develop (develop.everscending-org.pages.dev), production (everscending-org.pages.dev, everscending.org).
- Readers can skim posts; one URL to share; foundation for "readers keep coming back."

### Growth Features (Post-MVP)

- **RSS feed** so readers can subscribe and return via their reader.
- Other growth ideas TBD.

### Vision (Future)

- RSS and any further content/UX enhancements that reinforce the single focal point and return visits.

## User Journeys

### 1. Casual reader – success path

- **Opening:** They care about AI and consciousness but don’t want to jump between many sites. They want one place to skim.
- **Rising action:** They land on everscending.org (shared link, search, or portfolio visit). They see the blog on the front page alongside existing nav. They skim the latest posts (links and/or short posts, with or without your commentary).
- **Climax:** They realize they can get a curated view without opening 10 tabs — “this is the one place I’ll check.”
- **Resolution:** They finish skimming, maybe open a link or two. They leave with the intention to come back next time they want an update.

### 2. Casual reader – edge case

- **Opening:** Same as above; they expect to see recent posts.
- **Rising action:** They open the site but the blog section is empty (API down, no posts yet, or network issue).
- **Climax:** They see an empty state or a clear “can’t load posts” message, not a broken or spinning page.
- **Resolution:** They can still use the rest of the site (portfolio, nav). They might retry later or assume you haven’t posted yet. No dead-end or cryptic error.

### 3. Employer / client – brand viewer

- **Opening:** They’re evaluating you (hire, collab, or referral). They visit everscending.org to see who you are and what you care about.
- **Rising action:** They see the blog on the front page and notice the mix of AI and consciousness/philosophy. They skim a few titles or open one post.
- **Climax:** They get a clear signal: “This person curates and writes about this space in one place.”
- **Resolution:** The blog reinforces your brand as part of the same everscending.org experience (one URL, coherent story).

### Journey Requirements Summary

- **Front-page blog:** Blog section visible on the home page; posts from SonicJS (list and/or cards with title, link, optional excerpt/commentary).
- **Environment-aware API:** Correct SonicJS base URL per environment (local, develop, production) so the blog works in each.
- **Empty/error handling:** Graceful state when there are no posts or the API fails (empty state or clear message; rest of site still usable).
- **Consistent experience:** Blog fits the existing everscending.org layout and nav so readers and employers/clients get one coherent destination.

The following requirements are specific to web applications and support the functional and non-functional requirements below.

## Web App Specific Requirements

### Project-Type Overview

everscending.org is a **single-page application (SPA)** (React, Vite). The blog is a front-page section that fetches posts from the SonicJS API. Same SPA, same deployment model; no separate backend. Content is read-only for visitors; authoring happens in SonicJS.

### Technical Architecture Considerations

- **SPA:** Single shell; blog is a section on the home route. No server-side rendering in MVP; optional SSR/SSG later for SEO if needed.
- **Data:** Blog posts loaded client-side from SonicJS (`/api/blog/posts`). API base URL is environment-dependent (local, develop, production). Pagination: default page size is 20, passed as the `limit` argument to the posts API.
- **Real-time:** Not in scope for MVP (no live updates; refresh to get new posts).
- **State:** Blog list (and optional post detail) in component state or simple cache; no global store required for MVP.

### Browser Matrix

- Match existing site: modern evergreen browsers (Chrome, Firefox, Safari, Edge). No legacy IE.
- Assume ES2022+ and standard fetch; no polyfills beyond what Vite/React provide.

### Responsive Design

- Blog section follows existing layout and breakpoints (e.g. same container, typography, spacing as rest of site).
- List/cards readable and tappable on small viewports; no new breakpoints required unless you specify.

### Performance Targets

- Blog API call non-blocking (don’t block initial paint of nav/rest of page).
- Prefer: show shell and nav immediately, then blog when response arrives; or short loading state.
- No hard target for LCP/CLS in PRD unless you set one; “no regression vs current site” is a reasonable baseline.

### SEO Strategy

- MVP: SPA as-is; crawlers that execute JS will see blog content. No dedicated meta/schema for posts in MVP unless you want it.
- Optional later: per-post meta tags, Open Graph, or pre-render/SSG for key routes.

### Accessibility Level

- Align with current site: semantic HTML, focus order, sufficient contrast. Blog list and links keyboard- and screen-reader friendly (e.g. list or list-like structure, one link per post).
- No new a11y standard beyond what’s already in the PRD/design for everscending.org.

### Implementation Considerations

- **Environment config:** One source of truth for SonicJS API base per environment (e.g. `import.meta.env.VITE_BLOG_API_BASE` or equivalent), mapped to local, develop, and production.
- **Pagination:** Request posts with a `limit` parameter; default page size is 20 (e.g. `limit=20`). Use offset or cursor as needed for next/previous page per API contract.
- **Error and empty states:** Handle network failure and empty response (empty state or message; no infinite spin or blank section).
- **No native/CLI:** Web only; no native app or CLI in scope.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

- **MVP approach:** Problem-solving MVP — smallest set that delivers "one place to skim AI + consciousness content" and "readers can come back." No RSS, no extra features; blog on front page + SonicJS + env-specific API.
- **Resource requirements:** Solo or small team; front-end only (React/Vite). Content and API are in SonicJS; no new backend. One clear slice: one new section + one config-driven integration.

### MVP Feature Set (Phase 1)

**Core user journeys supported:**

- Casual reader success path (land → see blog → skim posts).
- Casual reader edge case (empty/error handled).
- Employer/client brand viewer (blog visible, coherent with site).

**Must-have capabilities:** See Product Scope and Functional Requirements for the full set; MVP delivers front-page blog, SonicJS fetch, env-based API, empty/error states, and layout fit.

### Post-MVP Features

**Phase 2 (Growth):**

- RSS feed for subscription and return visits.

**Phase 3 (Expansion):**

- Optional: per-post SEO (meta, OG), SSG/pre-render for key routes, or other content/UX improvements that reinforce "one focal point" and return visits.

### Risk Mitigation Strategy

- **Technical:** SonicJS already set up; main risk is env config mistakes — document mapping (host/port → API base) and use a single env variable (e.g. `VITE_BLOG_API_BASE`). Fallback: clear error/empty state so the site never appears broken.
- **Market:** Low — audience is "anyone interested"; MVP validates "one URL, one place" and return visits. Learning: do readers come back and do you use the one URL?
- **Resource:** MVP is one integration + one section; can be cut to "blog block + single env var" if needed. No backend or new infra.

## Functional Requirements

### Blog content display

- FR1: A visitor can see a blog section on the everscending.org front page (home route).
- FR2: A visitor can see a list (or card set) of blog posts sourced from the SonicJS API.
- FR3: A visitor can see for each post at least a title and a link to the full post (and optionally excerpt/commentary when the API provides it).
- FR4: A visitor can open a post via its link (external or in-app per API/content model).

### Pagination

- FR4a: The blog displays posts in paginated pages. Default page size is 20; the application requests posts from the SonicJS API with a `limit` argument (e.g. `limit=20`). A visitor can navigate between pages (e.g. next/previous or page numbers).

### Environment & configuration

- FR5: The application can use a different SonicJS API base URL per deployment environment (local, develop, production).
- FR6: The application can resolve the correct API base for the current host (e.g. localhost:5173, develop.everscending-org.pages.dev, everscending-org.pages.dev, everscending.org) without hardcoding URLs in code.

### Error & empty states

- FR7: A visitor can see a clear empty state when there are no posts (e.g. "No posts yet" or equivalent).
- FR8: A visitor can see a clear error or fallback state when the blog API request fails (e.g. network error or timeout), without the rest of the page appearing broken.
- FR9: A visitor can continue using the rest of the site (navigation, other content) when the blog section is empty or in error.

### Navigation & layout

- FR10: A visitor can reach the blog as part of the normal front-page experience (no separate login or gate).
- FR11: The blog section can fit within the existing everscending.org layout and navigation so the site feels like one coherent experience.

### Content freshness

- FR12: A visitor receives blog content that reflects the current state of the SonicJS API at the time of load (no requirement for real-time updates in MVP).

## Non-Functional Requirements

### Performance

- NFR-P1: The initial page render (shell and nav) is not blocked by the blog API request; the blog section may load after first paint.
- NFR-P2: If the blog API responds within a reasonable timeout (e.g. 10s), the blog section displays; if it does not, the user sees an error/fallback state and the rest of the site remains usable.
- NFR-P3: Blog list rendering does not cause a noticeable long block of the main thread (no regression vs current site feel).

### Accessibility

- NFR-A1: The blog section is keyboard navigable (focus order, actionable elements reachable and activatable via keyboard).
- NFR-A2: The blog section uses semantic structure (e.g. list, headings, links) so screen readers can understand and navigate it.
- NFR-A3: Color and contrast for the blog section meet the same baseline as the rest of everscending.org (no new regression).

### Integration

- NFR-I1: The app uses the correct SonicJS API base URL for the environment in which it is running (local, develop, production), with no hardcoded production URLs in code.
- NFR-I2: On API failure (network error, timeout, or non-2xx response), the app shows a clear error/fallback state for the blog section and does not break the rest of the page.
- NFR-I3: The app does not assume a specific SonicJS response schema beyond what is needed for MVP (e.g. list of posts with title and link); minor schema changes should be absorbable with minimal code change (e.g. mapping layer).
