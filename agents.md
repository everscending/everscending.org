# Agents Reference: everscending.org

A comprehensive reference guide for understanding, modifying, and extending the everscending.org application.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture & Patterns](#architecture--patterns)
5. [Component Reference](#component-reference)
6. [Routing System](#routing-system)
7. [Styling System](#styling-system)
8. [External Integrations](#external-integrations)
9. [Development Workflow](#development-workflow)
10. [Testing](#testing)
11. [Modification Guide](#modification-guide)

---

## Project Overview

**everscending.org** is a personal portfolio website showcasing:

- Professional resume
- AI Engineering learning resources
- Interactive AI agent demonstrations (via Gradio embeds)
- Personal branding and navigation

The application is a **single-page React application** built with modern tooling, featuring client-side routing and dynamic loading of external AI agent interfaces.

### Key Characteristics

- **Type**: Static single-page application (SPA)
- **Deployment**: Static hosting (Vite build output)
- **Interactive Elements**: Embedded Gradio applications from HuggingFace Spaces
- **Design**: Dark theme with orange/yellow accent colors, minimal aesthetic
- **Responsive**: Mobile-friendly with media queries

---

## Technology Stack

### Core Dependencies

- **React 19.1.1**: UI framework
- **React Router DOM 7.9.1**: Client-side routing
- **TypeScript 5.8.3**: Type safety

### Build Tools

- **Vite 7.1.6**: Build tool and dev server
- **@vitejs/plugin-react**: React support for Vite

### Testing

- **Vitest 3.2.4**: Unit testing framework
- **@testing-library/react**: React component testing
- **Playwright 1.56.1**: End-to-end testing

### Code Quality

- **ESLint 9.35.0**: Linting
- **Prettier 3.6.2**: Code formatting
- **Husky 9.1.7**: Git hooks
- **lint-staged**: Pre-commit linting

### External Libraries (via CDN)

- **Vanta.js Waves**: Background animation (`index.html`)
- **Three.js**: Required by Vanta.js

---

## Project Structure

```
everscending.org/
├── src/
│   ├── components/          # React components
│   │   ├── Home.tsx         # Landing page
│   │   ├── Layout.tsx       # Shared layout wrapper
│   │   ├── Resume.tsx       # Resume page
│   │   ├── AgenticTwin.tsx  # LinkedIn agent demo
│   │   ├── ResearchAgent.tsx # Research agent demo
│   │   ├── AIEngineeringPath.tsx # Learning resources
│   │   └── *.css           # Component-specific styles
│   ├── utils/
│   │   └── loadGradioScript.ts # Gradio embedding utility
│   ├── assets/             # Images and icons
│   ├── test/               # Test setup
│   ├── App.tsx             # Main app component & routing
│   ├── App.css             # Global styles & CSS variables
│   └── main.tsx            # Application entry point
├── tests/
│   └── main.spec.ts        # Playwright E2E tests
├── dist/                   # Build output (generated)
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config (references)
├── tsconfig.app.json       # App TypeScript config
├── package.json            # Dependencies & scripts
└── playwright.config.ts    # Playwright configuration
```

---

## Architecture & Patterns

### Application Flow

1. **Entry Point** (`main.tsx`): Renders `App` component into `#root` DOM element
2. **App Component** (`App.tsx`): Sets up React Router and defines routes
3. **Route Components**: Each route renders a page component wrapped in `Layout`
4. **Layout Component**: Provides consistent structure (footer, social links, back navigation)
5. **Gradio Integration**: Specialized components load external Gradio apps dynamically

### Component Patterns

- **Functional Components**: All components use React function components with hooks
- **Layout Composition**: `Layout` wraps page content for consistent structure
- **Conditional Rendering**: Footer back-link only shows when not on home page
- **Refs for DOM Manipulation**: Used for Gradio container mounting (`useRef`)

### State Management

- **No global state library**: Simple component-level state
- **URL as source of truth**: React Router manages navigation state
- **Refs for loading flags**: Prevent duplicate Gradio script loading (`isLoading.current`)

---

## Component Reference

### `App.tsx`

**Purpose**: Root component configuring routing and route-to-component mapping.

**Routes Defined**:

- `/` → `Home` component
- `/resume` → `Resume` component
- `/agentic-twin` → `AgenticTwin` component
- `/research-agent` → `ResearchAgent` component
- `/ai-engineering-path` → `AIEngineeringPath` component
- `*` (catch-all) → Redirects to `/`

**Key Pattern**: Uses `BrowserRouter` from React Router DOM with declarative `Route` components.

---

### `Layout.tsx`

**Purpose**: Shared layout wrapper providing consistent page structure.

**Props**:

- `id: string` - Page identifier (used for CSS targeting and conditional logic)
- `children: React.ReactNode` - Page content

**Features**:

- Footer with social links (LinkedIn, GitHub, Email)
- Conditional "Back to Home" link (hidden on home page)
- Responsive container structure (`outer-container` → `inner-container`)

**Social Links**:

- LinkedIn: `https://linkedin.com/in/jordaneverscending`
- GitHub: `https://github.com/everscending`
- Email: `mailto:everscending@gmail.com`

---

### `Home.tsx`

**Purpose**: Landing page with navigation links to all major sections.

**Content**:

- Digital Lotus logo image
- Navigation links to all pages
- External link to Spotify playlist (धर्मकाय)

**Links**:

- AI Engineering Path
- Agentic Digital Twin
- Research Agent
- Resume
- External: Spotify playlist

---

### `Resume.tsx`

**Purpose**: Professional resume page displaying career history and skills.

**Structure**:

- Header with contact info (name, phone, email)
- Summary section
- Technical skills list
- Professional experience (chronological, detailed)
- External link to LinkedIn for full history

**Styling Notes**:

- Uses white background with dark text (print-friendly)
- Two-column layout for resume sections
- Print media queries for proper resume printing

**Data**: Hardcoded resume content (not data-driven).

---

### `AgenticTwin.tsx`

**Purpose**: Demonstrates an AI agent trained on LinkedIn profile data.

**Features**:

- Dynamically loads Gradio application from HuggingFace Space
- Loading state with spinner
- Links to HuggingFace Space and GitHub repository
- Uses `loadGradioScript` utility to embed external app

**HuggingFace Space**: `everscending/linkedin_agent`
**GitHub Repo**: `everscending/linkedin_agent`

**Implementation Details**:

- Uses `useRef` for container element
- Uses `useRef` for loading flag (prevents duplicate loads)
- `useEffect` runs once on mount to initialize Gradio app

---

### `ResearchAgent.tsx`

**Purpose**: Demonstrates a research agent that performs web searches and writes reports.

**Features**:

- Same pattern as `AgenticTwin` (Gradio embed)
- Different HuggingFace Space target
- Same loading and footer link patterns

**HuggingFace Space**: `everscending/research_agent`
**GitHub Repo**: `everscending/research_agent`

---

### `AIEngineeringPath.tsx`

**Purpose**: Curated learning resource list for AI/Agentic Engineering.

**Content Sections**:

- Intros & Roadmaps (YouTube videos, guides)
- Online Courses (DataCamp, Udemy, Scrimba, etc.)
- Books (with purchase links)
- Protocols, SDKs, Frameworks (MCP, OpenAI Agents SDK, etc.)
- Hackathons & Competitions

**Structure**: Simple list-based layout with external links (all open in new tabs).

---

### `loadGradioScript.ts` (Utility)

**Purpose**: Dynamically loads and embeds a Gradio application from HuggingFace Spaces.

**Function Signature**:

```typescript
loadGradioScript(
  title: string,                              // Agent name
  gradioContainerRef: React.RefObject<HTMLDivElement | null>,  // DOM container
  onRender: () => void                        // Callback when app renders
): () => void                                 // Cleanup function
```

**How It Works**:

1. Derives HuggingFace Space ID from title (lowercase, spaces → underscores)
2. Creates Gradio Space URL: `https://everscending-{gradioAppId}.hf.space`
3. Dynamically loads Gradio JavaScript SDK (version 5.49.1)
4. Creates `<gradio-app>` custom element with Space URL
5. Shows loading spinner until Gradio app renders
6. Handles render event to show app and hide spinner
7. Includes 15-second timeout fallback with link to open in new tab

**Important Constants**:

- `GRADIO_VERSION = "5.49.1"` - Must match Python Gradio version in HF Space

**Error Handling**:

- Timeout after 15 seconds shows message with link to open in new tab
- Loading flag prevents duplicate script injection

---

## Routing System

### Router Configuration

- **Router Type**: `BrowserRouter` (uses browser history API)
- **Base Path**: `/` (no base path configuration)

### Route Structure

| Path                   | Component           | Purpose             |
| ---------------------- | ------------------- | ------------------- |
| `/`                    | `Home`              | Landing page        |
| `/resume`              | `Resume`            | Professional resume |
| `/agentic-twin`        | `AgenticTwin`       | LinkedIn agent demo |
| `/research-agent`      | `ResearchAgent`     | Research agent demo |
| `/ai-engineering-path` | `AIEngineeringPath` | Learning resources  |
| `*` (catch-all)        | `Navigate to="/"`   | Redirects to home   |

### Navigation Patterns

- **Internal Navigation**: Uses `Link` component from `react-router-dom`
- **External Links**: Standard `<a>` tags with `target="_blank"` and `rel="noopener noreferrer"`
- **Back Navigation**: "← Back to Home" link in footer (except on home page)

---

## Styling System

### CSS Architecture

**Global Styles** (`App.css`):

- CSS custom properties (CSS variables) for theme colors
- Global typography and link styles
- Layout containers (`outer-container`, `inner-container`)
- Footer styles

**Component Styles**: Each component has its own CSS file for scoped styles.

### Design System

**Color Palette** (CSS Variables):

```css
--primary-bg: #101010 /* Dark background */ --primary-text: #ebebeb
    /* Light text */ --accent-orange: #e9a23e /* Primary accent */
    --accent-yellow: #fdc679 /* Secondary accent */ --link-color: #d0d0d0
    /* Default links */ --link-hover-color: #fff /* Link hover */;
```

**Typography**:

- Base font: `Optima` (system fallback)
- Resume font: `Verdana` (print-friendly)

**Layout Patterns**:

- Centered content with max-width constraints
- Flexbox for page structure (min-height: 100vh)
- Responsive margins and padding

### Responsive Design

**Breakpoints**:

- Mobile: `@media (max-width: 700px)` - Reduced margins for Gradio containers

**Print Styles** (`Resume.css`):

- Hides animation container
- Removes borders and padding
- White background
- Page breaks for multi-page resume

---

## External Integrations

### HuggingFace Spaces

**Integration Method**: Gradio JavaScript SDK embedded via custom element.

**Spaces Used**:

1. `everscending/linkedin_agent` - AgenticTwin page
2. `everscending/research_agent` - ResearchAgent page

**Access Pattern**:

- URL format: `https://everscending-{space-id}.hf.space`
- Loaded dynamically via `<gradio-app>` custom element
- Version must match: Gradio JS 5.49.1

**Dependencies**: External Gradio JavaScript loaded from CDN.

### Vanta.js Waves

**Purpose**: Animated background effect.

**Configuration** (`index.html`):

- Container: `#animation-container` (fixed, z-index: -1)
- Animation: Black waves with slow motion
- Responsive: Enabled for touch and mouse

**CDN Dependencies**:

- Three.js (required by Vanta.js)
- Vanta.js Waves library

---

## Development Workflow

### Available Scripts

```bash
# Development
pnpm dev              # Start Vite dev server (default: http://localhost:5173)

# Building
pnpm build            # TypeScript check + Vite build → dist/

# Testing
pnpm test             # Run Vitest unit tests
pnpm playwright       # Run Playwright E2E tests

# Code Quality
pnpm lint             # Run ESLint
pnpm preview          # Preview production build locally
```

### Development Server

- **Port**: 5173 (Vite default)
- **Hot Module Replacement**: Enabled
- **TypeScript**: Type checking via Vite + tsconfig

### Build Process

1. TypeScript compilation check (`tsc -b`)
2. Vite bundling (React components, assets, CSS)
3. Output to `dist/` directory
4. Static files ready for deployment

### Pre-commit Hooks (Husky + lint-staged)

**Runs on commit**:

- Prettier formatting for `src/**/*.{json,js,ts,jsx,tsx,html}`
- ESLint for `src/**/*.{js,jsx,ts,tsx}`
- TypeScript type checking (`tsc --noEmit`)

---

## Testing

### Unit Tests (`App.test.tsx`)

**Framework**: Vitest + React Testing Library

**Test Coverage**:

- App renders without crashing
- Home page renders default content
- Navigation to Resume page
- Navigation to AgenticTwin page
- Navigation to AIEngineeringPath page
- Back navigation from Resume to Home

**Setup**: `src/test/setup.ts` (if exists) - Test configuration

### E2E Tests (`tests/main.spec.ts`)

**Framework**: Playwright

**Test Coverage**:

- Page title verification
- Home page link visibility (all navigation links)
- Social links visibility

**Configuration**: `playwright.config.ts`

---

## Modification Guide

### Adding a New Page

1. **Create Component** (`src/components/NewPage.tsx`):

```tsx
import Layout from "./Layout";
import "./NewPage.css";

const NewPage = () => {
    return (
        <Layout id="new-page">
            <h1>New Page Title</h1>
            <p>Content here</p>
        </Layout>
    );
};

export default NewPage;
```

2. **Create Styles** (`src/components/NewPage.css`):

```css
#new-page.outer-container .inner-container {
    /* Your styles */
}
```

3. **Add Route** (`src/App.tsx`):

```tsx
import NewPage from "./components/NewPage";

// In Routes:
<Route path="/new-page" element={<NewPage />} />;
```

4. **Add Navigation Link** (e.g., in `Home.tsx`):

```tsx
<Link to="/new-page" className="nav-link">
    New Page
</Link>
```

---

### Adding a New Gradio Agent Page

1. **Create Component** (copy `AgenticTwin.tsx` pattern):

```tsx
import { useEffect, useRef } from "react";
import Layout from "./Layout";
import loadGradioScript from "../utils/loadGradioScript";
import "./GradioApp.css"; // Reuse existing styles

const NewAgent = () => {
    const gradioContainerRef = useRef<HTMLDivElement>(null);
    const isLoading = useRef(false);

    useEffect(() => {
        if (!isLoading.current) {
            isLoading.current = true;
            return loadGradioScript(
                "New Agent Name", // Title → Space ID mapping
                gradioContainerRef,
                () => {
                    isLoading.current = false;
                },
            );
        }
    }, []);

    return (
        <Layout id="new-agent">
            <div className="header">
                <h1>New Agent Title</h1>
                <p>Description</p>
            </div>
            <div ref={gradioContainerRef} id="gradio-container" />
            <div id="gradio-footer-links">
                <a
                    href="https://huggingface.co/spaces/everscending/space_id"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    HF Space
                </a>
                &nbsp;|&nbsp;
                <a
                    href="https://github.com/everscending/repo"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub Code
                </a>
            </div>
        </Layout>
    );
};

export default NewAgent;
```

2. **Ensure HuggingFace Space exists**: `everscending/new_agent_name` (title → ID conversion in `loadGradioScript`)
3. **Add route and navigation** (same as adding a new page)

**Note**: Title passed to `loadGradioScript` is converted: "New Agent Name" → `new_agent_name` → Space URL: `everscending-new-agent-name.hf.space`

---

### Modifying Styles

**Global Changes** (`src/App.css`):

- Update CSS variables for theme colors
- Modify typography, link styles
- Adjust layout containers

**Component-Specific** (`src/components/*.css`):

- Target by page `id` attribute (e.g., `#resume.outer-container`)
- Use CSS nesting (supported by modern CSS)
- Media queries for responsive design

**Adding New CSS Variables**:

```css
:root {
    --new-color: #hexcode;
}
```

---

### Updating Gradio Version

If HuggingFace Space Gradio version changes:

1. **Update in `loadGradioScript.ts`**:

```typescript
const GRADIO_VERSION = "5.49.1"; // Change to match Python package
```

2. **Verify Gradio JS CDN URL format**:
    - Format: `https://gradio.s3-us-west-2.amazonaws.com/${GRADIO_VERSION}/gradio.js`
    - Check Gradio documentation for CDN URL changes

---

### Adding External Dependencies

**For npm packages**:

```bash
pnpm add package-name
```

**For CDN scripts** (e.g., in `index.html`):

```html
<script src="https://cdn.example.com/library.js"></script>
```

**Note**: Vanta.js and Three.js are loaded via CDN in `index.html`; consider moving to npm if version control is critical.

---

### Modifying Resume Content

**Location**: `src/components/Resume.tsx`

**Structure**:

- Header: Contact info (hardcoded)
- Sections: Summary, Technical Skills, Professional Experience
- Experience entries: Date range + title + company + bullet list

**To Update**:

- Edit JSX content directly
- Maintain HTML structure (semantic elements)
- Update CSS in `Resume.css` if layout changes needed

---

### Changing Social Links

**Location**: `src/components/Layout.tsx`

**Update Footer Links**:

- Modify `href` attributes in footer `<a>` tags
- Update icon images in `src/assets/` if needed
- Icons: LinkedIn, GitHub, Email (20x20px, white/transparent)

---

### Environment Variables

**Current State**: No environment variables used.

**If Needed** (e.g., API keys, environment-specific URLs):

1. Create `.env` file:

```
VITE_API_KEY=value
VITE_HF_SPACE_BASE=https://...
```

2. Access in code: `import.meta.env.VITE_API_KEY`
3. Add `.env` to `.gitignore` (create if doesn't exist)

---

### Build Configuration

**Vite Config** (`vite.config.ts`):

- React plugin enabled
- Vitest configuration (test environment: jsdom)
- No custom build options currently

**TypeScript Config**:

- `tsconfig.json`: Project references only
- `tsconfig.app.json`: App-specific compiler options
    - Target: ES2022
    - Strict mode enabled
    - JSX: react-jsx
    - Module: ESNext

---

## Key Patterns & Conventions

### File Naming

- **Components**: PascalCase (`Home.tsx`, `AgenticTwin.tsx`)
- **Utilities**: camelCase (`loadGradioScript.ts`)
- **Styles**: Match component name (`Home.css`, `Layout.css`)
- **Assets**: kebab-case or descriptive names (`Everscending_Digital_Lotus_Logo.png`)

### Component Structure

```tsx
// Import statements (external deps, then local)
import { ... } from "react";
import Layout from "./Layout";
import "./Component.css";

// Component definition
const ComponentName = () => {
    // Hooks
    // State/refs
    // Effects

    // Render
    return (
        <Layout id="component-id">
            {/* Content */}
        </Layout>
    );
};

// Export
export default ComponentName;
```

### CSS Organization

- **Global**: CSS variables, typography, layout containers in `App.css`
- **Component**: Scoped styles targeting page `id` in component CSS files
- **Naming**: Use page `id` for scoping (e.g., `#home.outer-container`)

### Routing Conventions

- **URLs**: kebab-case (`/ai-engineering-path`)
- **Route paths**: Match component purpose
- **404 handling**: Redirect to home via catch-all route

---

## Deployment Considerations

### Build Output

- **Directory**: `dist/`
- **Contents**: Static HTML, CSS, JS, assets
- **Entry**: `dist/index.html`

### Static Hosting

Compatible with any static hosting:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any web server serving static files

### Required Configuration

**For SPA routing** (if hosting requires):

- Redirect all routes to `index.html` (for client-side routing)
- Example (Netlify `_redirects`):

```
/*    /index.html   200
```

### CDN Dependencies

External resources loaded at runtime:

- Gradio JS SDK (from Gradio CDN)
- Vanta.js + Three.js (from CDN in `index.html`)

Ensure CDN availability or consider bundling.

---

## Troubleshooting

### Gradio App Not Loading

1. **Check Gradio version**: Match `GRADIO_VERSION` in `loadGradioScript.ts` with HF Space Python package
2. **Verify Space URL**: Check HuggingFace Space ID matches title conversion
3. **Network tab**: Inspect script loading and errors
4. **Timeout**: Check if Space is running (may be sleeping on free tier)

### Routing Not Working (404s)

1. **Check hosting config**: Ensure redirect rules for SPA
2. **Base path**: Verify no base path configuration needed
3. **Build output**: Ensure `dist/index.html` contains all routes

### TypeScript Errors

1. **Run type check**: `pnpm tsc --noEmit`
2. **Check imports**: Ensure all imports are correct
3. **Type definitions**: Install `@types/*` packages if missing

### Styling Issues

1. **CSS specificity**: Check if styles are overridden
2. **CSS variables**: Verify variables are defined in `:root`
3. **Media queries**: Test responsive breakpoints

---

## Summary

**everscending.org** is a clean, modern React SPA showcasing professional content and AI agent demonstrations. The architecture is straightforward with clear separation of concerns:

- **Pages**: React components with shared Layout wrapper
- **Routing**: React Router with declarative routes
- **External Integration**: Dynamic Gradio embedding for AI demos
- **Styling**: CSS variables + component-scoped styles
- **Build**: Vite for fast development and optimized production builds

The codebase follows React best practices, uses TypeScript for safety, and maintains a minimal dependency footprint. All external content (AI agents) is loaded dynamically, keeping the core application lightweight and maintainable.
