# Petr Ivan

[![CI](https://github.com/PetrIvan/website/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/PetrIvan/website/actions/workflows/ci.yml)

This repository contains the source for [petrivan.com](https://petrivan.com), my
personal website and blog. It includes project write-ups, essays and notes, a
short account of my background, and the source for my résumé.

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
```

Project pages are typed content records. Blog posts are `.svx` files with
`title`, `description`, and ISO `date` frontmatter.

## Development

The project requires Node.js 22.12 or newer and pnpm 10.17.1. Install the
Playwright engines before running the complete validation suite.

```powershell
pnpm install
pnpm exec playwright install chromium firefox webkit
pnpm run dev
```

| Command                      | Purpose                                                             |
| ---------------------------- | ------------------------------------------------------------------- |
| `pnpm run dev`               | Start the local development server                                  |
| `pnpm run format`            | Format repository files                                             |
| `pnpm run lint`              | Check formatting and lint the source                                |
| `pnpm run check`             | Run Svelte and TypeScript checks                                    |
| `pnpm run test`              | Run unit tests once                                                 |
| `pnpm run test:e2e`          | Build and run desktop and mobile browser tests                      |
| `pnpm run build`             | Generate public assets and write the site to `build/`               |
| `pnpm run preview`           | Serve the production build locally                                  |
| `pnpm run validate`          | Run lint, skill validation, checks, tests, and the production build |
| `pnpm run skills:validate`   | Validate canonical skills and Claude compatibility wrappers         |
| `pnpm run social-card:build` | Regenerate the social card and public portrait copy                 |
| `pnpm run resume:build`      | Rebuild the downloadable résumé with Typst 0.14 or newer            |

## Generated public assets

`pnpm run build` runs `scripts/generate-social-card.mjs` first. The script writes
both `static/social-card.png` and `static/petr-ivan-portrait.jpg` from the source
portrait and the current design tokens. Because `test:e2e` builds the site,
`pnpm run test:e2e` and `pnpm run validate` regenerate these files as well.

The résumé PDF is generated separately. Run `pnpm run resume:build` after
changing `resume/resume.typ`, its fonts, or its local assets.

## Deployment

The site is public. [GitHub Actions](.github/workflows/deploy-pages.yml) installs
dependencies and browser engines, validates the repository, builds the static
site, and deploys it to GitHub Pages after every push to `main`. The workflow can
also be run manually.

## Analytics

Production traffic is measured with
[Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/).
The beacon is included only when `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` is
available during the deployment build, and it loads only on `petrivan.com`.
Local development, browser tests, preview servers, and copied build artifacts do
not send analytics.

Cloudflare records visits and page views, page paths, referrers, countries,
device and browser categories, page-load timing, and Core Web Vitals. It does not
use cookies or local storage, log URL query strings, or support custom events or
UTM campaign tracking. Client-side analytics can be blocked, so the totals are
directional rather than an exact traffic census. Data is available for the
previous six months.

To finish the Cloudflare setup without moving the domain or changing DNS:

1. [Open Cloudflare Web Analytics](https://dash.cloudflare.com/?to=/:account/web-analytics),
   select **Add a site**, and enter `petrivan.com` as the hostname.
2. Copy the token from the generated JavaScript snippet. It is the value inside
   `data-cf-beacon`, not the whole snippet.
3. Following GitHub's
   [repository variable instructions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-variables#creating-configuration-variables-for-a-repository),
   create `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` under **Settings > Secrets and
   variables > Actions > Variables**. The token is embedded in the public site,
   so it is configuration rather than a secret or API key.
4. Push to `main` or manually run the **Deploy GitHub Pages** workflow. Visit
   the live site with browser blocking disabled and confirm that the visit
   appears in Cloudflare Web Analytics. No Cloudflare nameserver or proxy
   change is required.

[`static/robots.txt`](static/robots.txt) allows indexing and advertises the
generated sitemap. [`static/CNAME`](static/CNAME) configures the canonical
`petrivan.com` domain.

## Licensing

Source code is available under the [MIT License](LICENSE). Original prose,
photographs, and other original site content are available under
[CC BY 4.0](CONTENT_LICENSE.md), unless a file says otherwise. Third-party
assets retain their own licenses; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
