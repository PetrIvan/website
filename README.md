# Petr Ivan

[![CI](https://github.com/PetrIvan/website/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/PetrIvan/website/actions/workflows/ci.yml)

This repository contains the source for [petrivan.com](https://petrivan.com), my
personal website and blog.

The site uses SvelteKit, Svelte 5, TypeScript, Tailwind CSS, mdsvex, and
`@sveltejs/enhanced-img`. It is prerendered as static files and published to
GitHub Pages.

## Project structure

```text
src/
├── lib/
│   ├── assets/          build-processed images, icons, fonts, and media
│   ├── components/      reusable interface components
│   └── content/         mdsvex posts, project records, and content queries
└── routes/              pages and prerendered endpoints
resume/                  Typst résumé source, fonts, and local assets
scripts/                 generated-asset and repository utilities
static/                  public files copied directly into the build
tests/e2e/               Playwright browser tests
tests/visual/            scheduled visual-review captures
```

Project pages are typed content records. Blog posts are `.svx` files with
`title`, `description`, and ISO `date` frontmatter.

## Development

The project requires Node.js 22.12 or newer, pnpm 10.17.1, and Typst 0.14.2.
Install the Playwright engines before running the complete validation suite.

```powershell
pnpm install
pnpm exec playwright install chromium firefox webkit
pnpm run dev
```

| Command                 | Purpose                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `pnpm run dev`          | Start the local development server                             |
| `pnpm run lint`         | Check formatting and lint the source                           |
| `pnpm run check`        | Run Svelte and TypeScript checks                               |
| `pnpm run test`         | Run unit tests once                                            |
| `pnpm run test:e2e`     | Build and run desktop and mobile browser tests                 |
| `pnpm run test:visual`  | Build and capture desktop/mobile screenshots for manual review |
| `pnpm run build`        | Generate public assets and write the site to `build/`          |
| `pnpm run preview`      | Serve the production build locally                             |
| `pnpm run validate`     | Run the complete local verification suite                      |
| `pnpm run resume:build` | Rebuild the downloadable résumé with Typst 0.14.2              |

## Build and verification

`pnpm run build`, `pnpm run test:e2e`, and `pnpm run validate` regenerate the
social card and canonical public portrait copy before building the site. The
source images and generation script are tracked for reproducible CI builds.

The résumé PDF is rebuilt during `pnpm run validate`. CI compiles it before the
site build, so the deployed site contains the PDF generated in the same Ubuntu
environment as the rest of the production output.

The [Visual review workflow](.github/workflows/visual-review.yml) runs weekly
and on demand. It captures representative pages in light and dark themes at
desktop and mobile widths, then uploads the screenshots as a GitHub Actions
artifact for manual comparison. Run `pnpm run test:visual` to create the same
captures locally under `test-results/visual-review/`.

## Deployment

Pushes to `main` are validated and deployed to GitHub Pages by
[`.github/workflows/ci.yml`](.github/workflows/ci.yml). The workflow publishes
the static `build/` output with the official Pages actions and can also be run
manually. [`static/CNAME`](static/CNAME) defines the custom domain, while
[`static/robots.txt`](static/robots.txt) advertises the generated sitemap.

## Licensing

Source code is available under the [MIT License](LICENSE). Original prose,
photographs, and other original site content are available under
[CC BY 4.0](CONTENT_LICENSE.md), unless a file says otherwise. Third-party
assets retain their own licenses; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
