# AGENTS.md

This file provides durable guidance for agents working in this repository.
Source code, configuration, tests, and the current user request are authoritative.
Inspect the repository before relying on architectural assumptions.

## Project Overview

This is Petr Ivan's personal website and blog. It is a fully static SvelteKit
site intended for GitHub Pages at `https://petrivan.com`.

The site should feel personal, warm, comfortable, technically sharp, and
unforced. It is a portfolio and place for exploratory writing, not a résumé
converted into a website or a content-marketing exercise.

The implementation is the public source of truth. Keep internal planning and
private source material outside the repository.

## Quick Start

Prerequisites:

- Node.js 22.12 or newer
- pnpm 10.17.1

Commands:

```powershell
pnpm install
pnpm run dev
pnpm run format
pnpm run lint
pnpm run check
pnpm run test
pnpm run build
pnpm run validate
```

`pnpm run validate` is the default complete verification command.

## Working Style

Do not edit files, run formatters, or otherwise mutate the project when the user
is only asking a question, researching options, requesting a review, or
discussing tradeoffs. Start making changes when the request explicitly or
contextually asks for implementation.

Plan non-trivial work before implementation. Preserve user changes and unrelated
work. Do not clean up, revert, stash, reset, or absorb work you did not make.

Prefer the smallest coherent implementation that establishes the intended
architecture. Do not add abstractions, dependencies, compatibility layers, or
content systems before they solve a current need.

## Agent Configuration

- `AGENTS.md` is the canonical shared instruction file.
- `CLAUDE.md` is a thin Claude Code compatibility shim that points here.
- Canonical project skills live in `.agents/skills/`.
- `.claude/skills/` contains compatibility wrappers only.
- Project-local skills are limited to the `commit` and `open-pr` GitHub
  workflows for now.
- Use a skill only when its trigger conditions match the request.
- When the user names multiple skills, execute them in the stated order.
- Do not invent additional project skills without explicit approval.

## Architecture

```text
src/
├── lib/
│   ├── assets/          imported images and other build-processed assets
│   ├── components/      reusable UI grouped by responsibility
│   ├── content/         blog and project content plus content queries
│   ├── styles/          shared style modules when global CSS is insufficient
│   └── utils/           small framework-independent utilities
└── routes/              SvelteKit pages, layouts, and prerendered endpoints
static/                  files copied unchanged, including CNAME and robots.txt
```

Avoid a large undifferentiated component folder. When a feature grows, group its
components, types, and utilities by responsibility.

## Static Hosting Invariants

- Use `@sveltejs/adapter-static`.
- Keep the root route tree prerenderable.
- Runtime-dependent server routes, actions, databases, and private server
  environment variables are out of scope for GitHub Pages.
- Prerendered `+server.ts` endpoints are allowed for artifacts such as RSS,
  sitemap XML, or generated metadata.
- Use trailing-slash output so nested routes work as static directory indexes.
- `static/CNAME` must contain `petrivan.com`.
- Do not add a repository-name base path; the custom apex domain is canonical.
- Preserve `www.petrivan.com` as a redirect concern outside the static build.

During development, the Pages workflow is manual-only and `static/robots.txt`
blocks indexing. At public launch, enable deployment from `main` and allow
indexing together.

## Svelte and TypeScript

- Use Svelte 5 runes and strict TypeScript.
- Prefer ordinary Svelte components and browser/platform APIs over unnecessary
  state libraries.
- Keep page data serializable and static-build safe.
- Use `$lib` imports for shared first-party modules.
- Keep component props and content metadata explicitly typed.
- Remove dead code instead of retaining compatibility shims.
- Keep comments for non-obvious reasoning, not line-by-line narration.

## Content

- Author rich posts as `.svx` files through mdsvex.
- The authoring experience should feel like Markdown with optional Svelte
  components; do not require components for ordinary prose.
- Use stable filenames/slugs and ISO `YYYY-MM-DD` dates.
- Required initial frontmatter is `title`, `description`, `date`, and `draft`.
- Labels or tags are optional and should not become redundant navigation.
- Distinguish personal synthesis and exploration from claims of novelty.
- Do not manufacture filler posts or inflate project notes into essays.

Draft content may appear in development, but must be absent from production
routes, indexes, feeds, sitemaps, metadata, search data, and generated assets.
The current placeholder post is development scaffolding and must never be
published.

## Visual System

Use the established tokens from `src/routes/layout.css`:

| Role       | Light     | Dark      |
| ---------- | --------- | --------- |
| Background | `#f4efe6` | `#211c18` |
| Surface    | `#fcf8f1` | `#2b241f` |
| Text       | `#28231f` | `#f4eadf` |
| Muted      | `#71675e` | `#b9aa9d` |
| Border     | `#d8cec0` | `#463a31` |
| Accent     | `#78463b` | `#db9582` |

- Use Figtree as the primary typeface.
- Use Fluent UI System Icons in the 24px Filled style.
- Prefer warm editorial composition, generous typography, rounded content
  surfaces, and a flat header separated by a line.
- Avoid outline-only icon treatments, dashboard-like card grids, large pill
  navigation, a separate "Now" widget, and awkward hero social links.
- Keep social and contact links in a deliberate footer or utility area.
- Evaluate and present desktop and mobile designs separately, with mobile below
  desktop rather than squeezed beside it.
- Respect the system theme, allow a persistent manual override, and avoid a
  flash of the wrong theme.

## Images and Icons

- Put build-processed local images in `src/lib/assets/` and import them.
- Use `@sveltejs/enhanced-img` for raster content images.
- Keep descriptive source filenames independent of a particular UI slot.
- Preserve original source images and control display crops in components.
- Always provide appropriate alt text; use empty alt text only for genuinely
  decorative images.
- Import only the Fluent icons used by the interface.
- Keep third-party notices current when adding or replacing assets.

## Accessibility and Responsive Behavior

- Use semantic landmarks and heading order.
- Ensure all interactive behavior works with a keyboard.
- Keep visible, high-contrast focus states.
- Do not rely on color alone to communicate meaning.
- Respect `prefers-reduced-motion`.
- Maintain comfortable reading widths and line heights for long-form content.
- Test narrow mobile widths, text zoom, and long labels.
- Controls that only display an icon need an accessible name.

## Analytics and Privacy

Umami is the selected analytics provider, but it is not enabled during
development. When added:

- load it only in production;
- keep its site identifier in public build configuration, never pretend it is a
  secret;
- avoid collecting local and preview traffic;
- keep the integration isolated so it can be removed or replaced easily;
- document any custom events before adding them.

Never commit secrets, access tokens, account exports, unpublished personal
records, environment files, internal planning, or private source material. The
tracked profile portrait has been scrubbed of EXIF metadata; verify the same for
future source photographs.

## Verification

Use the narrowest checks that cover the change:

| Change                                          | Default verification                                        |
| ----------------------------------------------- | ----------------------------------------------------------- |
| Svelte, TypeScript, content loading             | `pnpm run check` and `pnpm run test`                        |
| Styles or layout                                | `pnpm run check`, then inspect desktop and mobile rendering |
| Static routes, metadata, assets, adapter config | `pnpm run build` and inspect `build/`                       |
| Dependencies or CI                              | `pnpm install --frozen-lockfile` and `pnpm run validate`    |
| Docs, agent instructions, skills                | validate links/commands; run skill validator for skills     |

For meaningful visual changes, browser inspection is appropriate because the
rendered result is the product. Check both themes and show mobile separately
from desktop when presenting alternatives.

## Git and GitHub Conventions

- Never commit or push unless the user explicitly asks.
- Use the `commit` skill for commits and the `open-pr` skill for pull requests.
- Use conventional prefixes: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`,
  and `test:`.
- Keep commit messages and PR titles concise and focused on why.
- Never add generated-by or co-author attribution for an agent.
- Never force-push, discard unrelated changes, or bypass verification hooks.
- Inspect untracked files before any broad staging operation.

## Keeping This File Current

Update `AGENTS.md` for durable command, architecture, validation, hosting,
content, or agent-routing changes. Keep temporary implementation plans and
detailed design explorations elsewhere.
