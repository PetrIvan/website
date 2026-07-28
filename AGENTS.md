# AGENTS.md

This file contains durable instructions for agents working in this repository.
The current user request, source code, configuration, and tests are authoritative.

## Project

This is Petr Ivan's personal website and blog at `https://petrivan.com`. It is a
fully static SvelteKit site deployed to GitHub Pages.

The site should feel personal, warm, technically sharp, and unforced. It is a
portfolio and a place for exploratory writing, not a résumé converted into a
website or a content-marketing project.

Keep internal planning, private source material, credentials, account exports,
and unpublished personal records outside the repository.

## Start here

Requirements:

- Node.js 22.12 or newer
- pnpm 10.17.1
- Playwright browser engines for end-to-end tests
- Typst 0.14 or newer only when rebuilding the résumé PDF

```powershell
pnpm install
pnpm exec playwright install chromium firefox webkit
pnpm run dev
```

Use `pnpm run validate` for complete local verification. The README and
`package.json` are the command reference.

## Scope and authorization

- Treat questions, reviews, audits, research, and tradeoff discussions as
  read-only unless the user also asks for changes.
- When the user asks for a specific fix, implement that fix and the smallest
  supporting changes needed to make it complete.
- Do not turn a narrow request into a broad rewrite, redesign, cleanup, or
  refactor. Make extensive changes only when the user explicitly asks for them.
- An explicit implementation request is sufficient approval for changes within
  its stated scope. Do not require a second approval for every individual edit.
- Ask before making a consequential choice when the request leaves genuinely
  different outcomes open and repository context does not resolve it.
- Preserve unrelated and user-authored work. Do not clean, revert, stash, reset,
  or absorb changes outside the task.
- Prefer the smallest coherent implementation. Do not add abstractions,
  dependencies, compatibility layers, or content systems before they solve a
  current need.

## Repository skills

Canonical skills live in `.agents/skills/`; `.claude/skills/` contains thin
compatibility wrappers.

- Use `writing` for drafting, reviewing, or editing prose anywhere in the
  repository, including site copy, posts, project write-ups, metadata, résumé
  text, and documentation.
- Use `commit` only when the user explicitly asks to commit or ship changes.
- Use `open-pr` when the user asks to open, publish, refresh, or update a pull
  request.
- When the user names multiple skills, use them in the stated order.
- Do not create additional project skills without explicit approval.

Validate canonical skills and their compatibility wrappers with:

```powershell
pnpm run skills:validate
```

## Repository layout

```text
src/
├── lib/
│   ├── assets/          build-processed images, icons, fonts, and media
│   ├── components/      reusable UI grouped by responsibility
│   └── content/         blog posts, project records, and content queries
└── routes/              pages, layouts, and prerendered endpoints
static/                  public files copied unchanged into the build
resume/                  Typst résumé source, fonts, and local assets
scripts/                 deterministic asset and repository utilities
tests/
├── e2e/                 Playwright browser tests
└── visual/              scheduled manual-review captures
```

When a feature grows, group its components, types, and utilities by
responsibility rather than expanding an undifferentiated component directory.

## Static hosting invariants

- Use `@sveltejs/adapter-static` and keep the root route tree prerenderable.
- Runtime server routes, form actions, databases, and private server environment
  variables are incompatible with GitHub Pages.
- Prerendered `+server.ts` endpoints are allowed for static artifacts such as
  sitemap XML or feeds.
- Preserve trailing-slash output so nested routes work as directory indexes.
- Keep `static/CNAME` set to `petrivan.com`; do not add a repository-name base
  path.
- Deployment from `main` and public indexing are enabled for the public site.
  Do not disable either as a temporary development measure.
- Treat `www.petrivan.com` redirection as infrastructure outside this static
  build.

## Implementation conventions

- Use Svelte 5 runes and strict TypeScript.
- Prefer ordinary components and browser APIs over unnecessary state libraries.
- Keep page data serializable and safe for prerendering.
- Use `$lib` imports for shared first-party modules.
- Keep component props and content metadata explicitly typed.
- Remove dead code instead of retaining compatibility shims.
- Comment non-obvious reasoning, not line-by-line behavior.

## Visual and interaction principles

- Use the existing tokens and typography defined in `src/routes/layout.css`;
  do not duplicate their current values in documentation or components.
- Preserve the warm editorial composition, generous typography, rounded content
  surfaces, and flat header.
- Use Figtree and import only the Fluent UI System Icons required by the
  interface.
- Keep interaction spatially static. Color feedback may transition, and the
  mobile navigation drawer may slide over fixed page content; avoid decorative
  movement, smooth scrolling, lifting, scaling, and layout shifts.
- Keep the portrait visually unframed and consistent between Home and About:
  after the introduction on narrow screens and beside the page header when
  space permits. Keep crop and silhouette details in the portrait component.
- Keep social and contact links in deliberate utility or footer areas.
- Respect system theme, persistent manual override, reduced motion, and
  no-flash theme initialization.

## Assets, accessibility, and privacy

- Put build-processed local assets in `src/lib/assets/` and import them. Use
  `@sveltejs/enhanced-img` for raster content images.
- Preserve original source images and control display crops in components.
- Give informative images useful alt text and decorative images empty alt text.
- Keep third-party notices and license files current when assets change.
- Verify that new source photographs contain no sensitive metadata before
  committing them.
- Use semantic landmarks and heading order, keyboard-operable interactions,
  visible focus states, and labels for icon-only controls.
- Do not rely on color alone. Test narrow widths, long labels, text zoom, both
  themes, and reduced motion where relevant.

Cloudflare Web Analytics is the selected analytics provider. If enabled, load
its beacon only in production, keep its public site token in public build
configuration, and avoid local and preview traffic. It does not require the
domain to use Cloudflare DNS or proxying.

## Verification

Use the narrowest checks that cover the change:

| Change                                                    | Verification                                                                                                                                             |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Svelte, TypeScript, content loading                       | `pnpm run check` and `pnpm run test`                                                                                                                     |
| Styles, layout, or interaction                            | `pnpm run check`, `pnpm run test:e2e`, and visual inspection in both themes at desktop and mobile widths; use `pnpm run test:visual` for review captures |
| Static routes, metadata, assets, or adapter configuration | `pnpm run build` and inspect `build/`                                                                                                                    |
| Résumé source or content                                  | `pnpm run resume:build`, render the PDF, and inspect it                                                                                                  |
| Dependencies, CI, or deployment                           | `pnpm install --frozen-lockfile` and `pnpm run validate`                                                                                                 |
| Documentation or agent instructions                       | validate links and commands, then run Prettier in check mode on affected files                                                                           |
| Skills                                                    | `pnpm run skills:validate` and Prettier in check mode                                                                                                    |

`pnpm run build`, `pnpm run test:e2e`, and `pnpm run validate` regenerate the
public social card and portrait copy as a documented build step.

## Git and GitHub

- Never commit unless the user explicitly asks.
- A commit authorization always includes push authorization. After every
  successful commit, always push the current branch as the final step unless the
  user explicitly says not to push or to keep the commit local. The absence of a
  separate push request is never a reason to skip it. Do not ask whether to push;
  the commit workflow is incomplete until the push succeeds or a concrete push
  failure is reported.
- Stage explicit paths and inspect every untracked file before including it.
- Use conventional prefixes: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`,
  and `test:`.
- Keep commit messages and PR titles concise and focused on why.
- Never add generated-by or co-author attribution for an agent.
- Never force-push, discard unrelated changes, or bypass verification hooks.

Update this file only for durable project-wide instructions. Keep implementation
details in source, tests, or focused documentation nearer to the affected code.
