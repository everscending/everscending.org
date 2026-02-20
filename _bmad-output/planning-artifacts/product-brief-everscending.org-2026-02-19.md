---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - index.md
  - agents.md
  - README.md
date: 2026-02-19
author: Jordan
userProvidedContext: |
  Blog integration: Adding a blog to the front page by integrating with headless CMS SonicJS.
  Docs: https://sonicjs.com/examples ("Blog Setup"). SonicJS backend already setup.
  Host:port → API mapping:
  - localhost:5173 → http://localhost:8787/api/blog/posts
  - develop.everscending-org.pages.dev → https://develop-everscending-blog.everscending.workers.dev/api/blog/posts
  - everscending-org.pages.dev → https://everscending-blog.everscending.workers.dev/api/blog/posts
  - everscending.org → https://everscending-blog.everscending.workers.dev/api/blog/posts
---

# Product Brief: everscending.org

<!-- Content will be appended sequentially through collaborative workflow steps -->

## User-provided context (captured at init)

- **Blog on front page:** Integrate the site with headless CMS **SonicJS**; full documentation at [SonicJS Examples – Blog Setup](https://sonicjs.com/examples).
- **Backend:** SonicJS backend is already set up.
- **Environment → API base** (implement blog integration for each):
  - `localhost:5173` → `http://localhost:8787/api/blog/posts`
  - `develop.everscending-org.pages.dev` → `https://develop-everscending-blog.everscending.workers.dev/api/blog/posts`
  - `everscending-org.pages.dev` → `https://everscending-blog.everscending.workers.dev/api/blog/posts`
  - `everscending.org` → `https://everscending-blog.everscending.workers.dev/api/blog/posts`

---

## Executive Summary

everscending.org is expanding from a portfolio site into a **focal point for AI and consciousness/philosophy**. A new blog on the front page will aggregate external links and posts (with or without commentary) and support original short posts, giving anyone interested in AI + consciousness a single, curated place to follow developments and ideas. Success looks like: one URL to point people to, a filtered view of what matters, and a coherent intellectual home. The blog is powered by SonicJS (headless CMS), with the backend already set up and environment-specific APIs defined for local, develop, and production.

---

## Core Vision

### Problem Statement

People interested in the intersection of **AI (LLMs, agents, breakthroughs)** and **consciousness/philosophy** lack a single, trusted focal point. Content is scattered across many sources; it's hard to get a coherent view of advances and ideas without curating it yourself.

### Problem Impact

- Readers spend time hunting across sites and feeds instead of engaging with ideas.
- No natural "home" for this niche that combines technical AI and philosophical/consciousness angles.
- Curators and thinkers who want to share a filtered view have to point to many places instead of one.

### Why Existing Solutions Fall Short

- General AI news sites focus on products and hype, not consciousness/philosophy.
- Philosophy and consciousness outlets rarely integrate AI/LLM/agent developments.
- Personal blogs are often either pure link dumps or long-form only, not a mix of aggregation and short original posts.

### Proposed Solution

A **blog integrated on the front page of everscending.org** that:

- **Aggregates** external content (links/posts) on AI, LLMs, agents, and consciousness/philosophy.
- Supports **commentary** (optional) on aggregated items.
- Supports **original short posts**.
- Serves as the **primary focal point** for this mix of topics.
- Uses **SonicJS** as the headless CMS, with environment-specific API endpoints for local, develop, and production.

### Key Differentiators

- **Niche focus:** Deliberately combines AI/agents and consciousness/philosophy in one place.
- **Flexible content mix:** Aggregation (with or without commentary) plus original posts.
- **Single destination:** One URL (everscending.org) for portfolio and this curated stream.
- **Your curation:** Filtered by you rather than algorithm or generic editorial.

---

## Target Users

### Primary Users

**Casual readers interested in AI + consciousness/philosophy**

- Looking for **one place** to skim curated content on AI, LLMs, agents, and consciousness/philosophy.
- Don’t want to hunt across many sites or feeds; want a single, trusted focal point.
- Success looks like: quick skim of links/short posts, optional commentary, no need to assemble the picture themselves.

### Secondary Users

**Employers / clients**

- See the blog as part of your professional brand (everscending.org as portfolio + thought leadership).
- Value: signal of interests, curation taste, and consistency of presence in AI + consciousness space.

### User Journey

- **Discovery:** Land on everscending.org from a shared link, portfolio visit, or search; see blog on the front page alongside existing nav.
- **Core usage:** Skim recent aggregated links and/or short posts; read with or without your commentary; return when they want a single-place update.
- **Success moment:** “I don’t have to hunt across 10 sites” — one URL, one feed. For employers/clients: “This is part of who they are professionally.”


---

## Success Metrics

**Primary user success:** Readers keep coming back — the blog becomes a place they revisit (return visits / repeated use) rather than a one-off.

### Business Objectives

Blog supports everscending.org as a single focal point for AI + consciousness content and reinforces professional brand for employers/clients; success is qualitative (readers return, one URL to share) unless you choose to add measurable targets later.

### Key Performance Indicators

- **User:** Return visits / readers coming back (observable behavior; optional tracking later if desired).
- **Curator/brand:** One URL to point people to; blog visible and findable on the front page.


---

## MVP Scope

### Core Features

- **Blog on the front page** — Blog content visible on the everscending.org landing (e.g. section or feed above/below existing nav).
- **Posts from SonicJS API** — Fetch and display blog posts from the SonicJS backend; support aggregated links/short posts (and optional commentary) as the API provides.
- **Correct API per environment** — Use the right base URL per host:
  - `localhost:5173` → `http://localhost:8787/api/blog/posts`
  - `develop.everscending-org.pages.dev` → `https://develop-everscending-blog.everscending.workers.dev/api/blog/posts`
  - `everscending-org.pages.dev` / `everscending.org` → `https://everscending-blog.everscending.workers.dev/api/blog/posts`

### Out of Scope for MVP

- RSS feed (deferred to later).
- Any other nice-to-have features not listed above (e.g. search, comments, analytics) unless specified.

### MVP Success Criteria

- Blog appears on the front page; posts load from SonicJS; each environment uses its correct API base.
- Readers can skim posts; one URL to share; foundation for "readers keep coming back."

### Future Vision

- **RSS feed** — Add an RSS feed so readers can subscribe and return via their reader.
