# Board and Batten Calculator

A free browser tool that spaces board and batten evenly on a wall. You enter the wall size, the batten width and either the number of battens or the gap you want. It returns the exact gap, a pencil mark for every batten (to 1/16 inch), a to-scale drawing, optional horizontal rails, a cut list, and the number of 8, 10 and 12 foot boards to buy. It also works in metric. Domain: boardandbattenspacingcalculator.com.

Built with Astro (static output) and Tailwind 4. No backend.

## Where the logic lives

- `src/lib/layout.mjs`: all the math (parsing, formatting, spacing, rails, board packing, limits). Plain JavaScript with no dependencies, so Node can test it.
- `src/components/Tool.astro`: the form, the drawing and the page script. It only reads inputs, calls `plan()` and shows the result.
- `src/components/LenField.astro`: one length input (feet, inches, fraction, or centimeters).
- `src/components/Article.astro` and `src/data/faq.ts`: the text under the tool. The "common wall sizes" table is computed from `layout.mjs` at build time.
- `src/site.config.ts`: name, domain, description, email, analytics and ads IDs.
- `src/lib/url.ts`: `href()` adds the base path to every internal link and asset.

## Commands

- `npm run dev`: work on the site.
- `npm test`: unit tests for `layout.mjs` (`scripts/test.mjs`).
- `npm run build`: build `dist/`.
- `npm run preview`: serve the build.
- `npm run deploy`: run the tests, build, then upload to Cloudflare Pages (needs `npx wrangler login` once, and Node 22.6 or newer).

## Rules the tool follows

- With a batten at each end, gap = (wall - battens x width) / (battens - 1). Without end battens, divide by (battens + 1).
- Rails sit flush with the floor and the ceiling (one rail sits in the middle).
- Board counts allow 1/8 inch per saw cut. Limits: 300 battens, 20 rails.
- Marks are rounded to the nearest 1/16 inch.

## GitHub Pages

The site is also served from `https://abhimishra01.github.io/board-and-batten-calculator/` until the domain is live. `.github/workflows/pages.yml` runs on every push to `main`: install, test, build with `PAGES_BASE=/board-and-batten-calculator/` and `PAGES_SITE=https://abhimishra01.github.io`, then deploy. To test it locally:

```
PAGES_BASE=/board-and-batten-calculator/ npx astro build --outDir dist-pages
```

Canonical links always point to the real domain. Without those two variables the build uses `/` and the real domain.

## Go live

1. Buy the domain, and make sure `domain` in `src/site.config.ts` matches.
2. Add the domain to Cloudflare Pages and run `npm run deploy`. `public/_headers` keeps the `*.pages.dev` address out of Google.
3. Add the site to Google Search Console and Bing Webmaster Tools, and submit `/sitemap-index.xml`.
4. For analytics or ads, set `ga4` or `adsense` in the config and rebuild. `/ads.txt` is generated from the AdSense ID.
