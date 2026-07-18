# petrivan.com

Personal website and blog for Petr Ivan. The site is built as static files with
SvelteKit and published to GitHub Pages at `petrivan.com`.

## Development

```powershell
pnpm install
pnpm run dev
```

Run the complete local validation suite with:

```powershell
pnpm run validate
```

The production build is written to `build/`.

## Publishing status

GitHub Pages deployment is manual-only during development, and `robots.txt`
blocks indexing. At launch, deployment from `main` and indexing should be
enabled together.

## Licensing

Source code is available under the [MIT License](LICENSE). Original prose,
photographs, and other original site content are available under
[CC BY 4.0](CONTENT_LICENSE.md), unless a file says otherwise. Third-party
assets retain their own licenses; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
