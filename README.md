# pcndigwe.site

Portfolio of Chinenye "Chi" Ndigwe, technical product manager in Lagos.

Built with [Astro](https://astro.build). Static output, deployed on Cloudflare Pages.

## Run it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-checks, then builds to dist/
npm run preview
```

## Where things live

- `src/styles/tokens.css`: brand palette, ramps, semantic tokens (night and daylight surfaces)
- `src/styles/global.css`: base styles, type, buttons, motion primitives
- `src/layouts/Base.astro`: page shell (SEO, sky, header, footer)
- `src/components/Sky.astro` + `src/scripts/stars.ts`: the night sky
- `src/pages/system.astro`: design system specimen at `/system` (not indexed)

## Cloudflare Pages settings

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 22 (set `NODE_VERSION=22`)
