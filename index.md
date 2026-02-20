# Directory Index

Lightweight index for quick LLM scanning of the everscending.org project. Use this to understand available docs and key files without loading everything.

---

## Root

- **[agents.md](./agents.md)** - Project reference: architecture, components, routing, styling
- **[README.md](./README.md)** - React + Vite template and ESLint setup
- **[index.html](./index.html)** - HTML entry, Vanta.js waves background, root div
- **[package.json](./package.json)** - Scripts, React deps, dev tooling
- **[vite.config.ts](./vite.config.ts)** - Vite + React plugin, Vitest config
- **[playwright.config.ts](./playwright.config.ts)** - Playwright E2E test config
- **[tsconfig.json](./tsconfig.json)** - TypeScript project references
- **[tsconfig.app.json](./tsconfig.app.json)** - App TS options, strict, JSX
- **[tsconfig.node.json](./tsconfig.node.json)** - Node/build TS config
- **[eslint.config.js](./eslint.config.js)** - ESLint configuration

---

## src/

- **[main.tsx](./src/main.tsx)** - React root mount, StrictMode
- **[App.tsx](./src/App.tsx)** - Router, routes, layout wrapper
- **[App.css](./src/App.css)** - Global styles, CSS variables, layout
- **[App.test.tsx](./src/App.test.tsx)** - Vitest unit tests for App
- **[vite-env.d.ts](./src/vite-env.d.ts)** - Vite client types

### src/components/

- **[Home.tsx](./src/components/Home.tsx)** - Landing page, nav links
- **[Home.css](./src/components/Home.css)** - Home page styles
- **[Layout.tsx](./src/components/Layout.tsx)** - Shared layout, footer, social links
- **[Layout.css](./src/components/Layout.css)** - Layout and footer styles
- **[Projects.tsx](./src/components/Projects.tsx)** - Projects page
- **[Projects.css](./src/components/Projects.css)** - Projects page styles
- **[Resume.tsx](./src/components/Resume.tsx)** - Professional resume content
- **[Resume.css](./src/components/Resume.css)** - Resume and print styles
- **[AgenticTwin.tsx](./src/components/AgenticTwin.tsx)** - LinkedIn agent Gradio embed
- **[ResearchAgent.tsx](./src/components/ResearchAgent.tsx)** - Research agent Gradio embed
- **[AIEngineeringPath.tsx](./src/components/AIEngineeringPath.tsx)** - AI learning resources list
- **[AIEngineeringPath.css](./src/components/AIEngineeringPath.css)** - AI path styles
- **[VisionDojo.tsx](./src/components/VisionDojo.tsx)** - Vision Dojo page
- **[VisionDojo.css](./src/components/VisionDojo.css)** - Vision Dojo styles
- **[ConcentricCircles.tsx](./src/components/ConcentricCircles.tsx)** - Concentric circles component
- **[ConcentricCircles.css](./src/components/ConcentricCircles.css)** - Concentric circles styles
- **[GradioApp.css](./src/components/GradioApp.css)** - Shared Gradio embed styles

### src/utils/

- **[loadGradioScript.ts](./src/utils/loadGradioScript.ts)** - Load and embed HuggingFace Gradio apps

### src/assets/

- **[Everscending_Digital_Lotus_Logo.png](./src/assets/Everscending_Digital_Lotus_Logo.png)** - Digital lotus logo
- **[Everscending_Digital_Lotus_Logo2.png](./src/assets/Everscending_Digital_Lotus_Logo2.png)** - Alternate lotus logo
- **[seed-of-life-dark.svg](./src/assets/seed-of-life-dark.svg)** - Seed of life icon dark
- **[seed-of-life-light.svg](./src/assets/seed-of-life-light.svg)** - Seed of life icon light
- **[github-mark-white.svg](./src/assets/github-mark-white.svg)** - GitHub mark white
- **[envelope.png](./src/assets/envelope.png)** - Email icon
- **[InBug-White.png](./src/assets/InBug-White.png)** - LinkedIn icon
- **[CCGreen_Base.png](./src/assets/CCGreen_Base.png)** - Green base asset
- **[CCRed_Base.png](./src/assets/CCRed_Base.png)** - Red base asset

### src/test/

- **[setup.ts](./src/test/setup.ts)** - Vitest test setup
- **[vitest.d.ts](./src/test/vitest.d.ts)** - Vitest type declarations

---

## tests/

- **[main.spec.ts](./tests/main.spec.ts)** - Playwright E2E tests, home and links

---

## _bmad/

BMAD workflow and task definitions for this project.

### _bmad/core/

- **[config.yaml](./_bmad/core/config.yaml)** - User name, language, output folder

### _bmad/core/agents/

- **[bmad-master.md](./_bmad/core/agents/bmad-master.md)** - BMad Master executor and menu

### _bmad/core/tasks/

- **[help.md](./_bmad/core/tasks/help.md)** - BMAD Help task: next steps, routing, display rules
- **[index-docs.xml](./_bmad/core/tasks/index-docs.xml)** - Index-docs task definition
- **[editorial-review-prose.xml](./_bmad/core/tasks/editorial-review-prose.xml)** - Prose review task
- **[editorial-review-structure.xml](./_bmad/core/tasks/editorial-review-structure.xml)** - Structure review task
- **[review-adversarial-general.xml](./_bmad/core/tasks/review-adversarial-general.xml)** - Adversarial review task
- **[shard-doc.xml](./_bmad/core/tasks/shard-doc.xml)** - Shard document task
- **[workflow.xml](./_bmad/core/tasks/workflow.xml)** - Workflow task definition

### _bmad/core/workflows/brainstorming/

- **[workflow.md](./_bmad/core/workflows/brainstorming/workflow.md)** - Brainstorming session workflow
- **[template.md](./_bmad/core/workflows/brainstorming/template.md)** - Brainstorming session template
- **[steps/step-01-session-setup.md](./_bmad/core/workflows/brainstorming/steps/step-01-session-setup.md)** - Session setup step
- **[steps/step-01b-continue.md](./_bmad/core/workflows/brainstorming/steps/step-01b-continue.md)** - Continue session step
- **[steps/step-02a-user-selected.md](./_bmad/core/workflows/brainstorming/steps/step-02a-user-selected.md)** - User-selected technique
- **[steps/step-02b-ai-recommended.md](./_bmad/core/workflows/brainstorming/steps/step-02b-ai-recommended.md)** - AI-recommended technique
- **[steps/step-02c-random-selection.md](./_bmad/core/workflows/brainstorming/steps/step-02c-random-selection.md)** - Random technique selection
- **[steps/step-02d-progressive-flow.md](./_bmad/core/workflows/brainstorming/steps/step-02d-progressive-flow.md)** - Progressive flow step
- **[steps/step-03-technique-execution.md](./_bmad/core/workflows/brainstorming/steps/step-03-technique-execution.md)** - Execute technique step
- **[steps/step-04-idea-organization.md](./_bmad/core/workflows/brainstorming/steps/step-04-idea-organization.md)** - Organize ideas step

### _bmad/core/workflows/party-mode/

- **[workflow.md](./_bmad/core/workflows/party-mode/workflow.md)** - Party mode multi-agent workflow
- **[steps/step-01-agent-loading.md](./_bmad/core/workflows/party-mode/steps/step-01-agent-loading.md)** - Load agents step
- **[steps/step-02-discussion-orchestration.md](./_bmad/core/workflows/party-mode/steps/step-02-discussion-orchestration.md)** - Discussion orchestration step
- **[steps/step-03-graceful-exit.md](./_bmad/core/workflows/party-mode/steps/step-03-graceful-exit.md)** - Graceful exit step
