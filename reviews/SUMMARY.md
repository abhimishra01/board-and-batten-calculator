# Fix summary (Natasha, 2026-10-20)

## Fixed
- Wrong site description (ruler text) replaced with a real US English one. All pages and JSON-LD use it.
- Gap mode with no end battens could return 0 battens and crash the drawing. Solver now picks at least 1; plan rejects count < 1. Tests added.
- Strict input parsing: `12'6` and `12' 6 1/2"` work in the feet box; `12abc`, `1e2` and `1/2` ft give an error; `5.` is accepted. Old results are cleared on any error (Copy no longer copies stale numbers).
- Errors show at the top of the form (near the fields on a phone), and the bad field gets aria-invalid.
- Limits: 300 battens, 20 rails, with plain errors (page cannot hang on a typo or bad link).
- Exact-fit float errors (metric 30 cm / ten 3 cm, 3 x 1.1 on 3.3) now work; the "gap is zero" warning shows.
- Rails now always sit flush with floor and ceiling, with their own note (no hidden link to the end-batten box).
- Best board length moved into `plan()` as `best` (tested). Cut list lines are built once for the page and the copy text.
- Drawing: larger text (readable on a phone), "8 ft" words instead of marks, last number label no longer touches the previous one, aria-label quote bug fixed.
- Print: dark mode prints light, marks table no longer clipped, one summary line of the inputs is printed.
- Phone: a sticky summary bar (count and gap, "See marks") shows while the tool is on screen.
- Marks table is keyboard reachable (tabindex, role, label). Tool headings are H2 (heading-order). Chips show aria-pressed. Chips, segments 44 px tall.
- Added a "Copy link" button, plain help text under the results, metric batten-size hint, "Planning a whole room" section, a link from the article to the tool. Removed a closer sentence and reworded the table intro. Removed the one-item breadcrumb schema and the keywords meta tag.
- The "common wall sizes" table is computed from `layout.mjs` at build time (values unchanged, verified).
- Share hash holds only the active unit's fields. Field list is read from the DOM. Duplicated length markup now one `LenField.astro`. Input and change events no longer double-run compute. Dead code removed, `centre` renamed `center`, `gapFmt/lenFmt` renamed `fmtShort/fmtLong`, stale comments fixed, test names fixed, `engines` added.
- Template items: README rewritten; US spelling everywhere; fixed "Last updated" (October 20, 2026); no cookie-banner claim; "upload" removed from Privacy; new-tool.sh removed; screenshots/ and .playwright-cli/ ignored and untracked (also dist-*, tmp-*); duplicate legal link block removed from home; deploy runs `npm test` first; no cross-project paths.
- Tailwind scanning limited to src: CSS 118,227 bytes before, 25,637 bytes after. JS 12,755 to 14,287 bytes (new features).
- GitHub Pages: `base`/`site` from PAGES_BASE/PAGES_SITE; `href()` helper for all links, icons, manifest (now a route), sitemap link, og:image; canonical always the real domain; `.github/workflows/pages.yml` added (checkout@v4, setup-node@v4 node 22, upload-pages-artifact@v3, deploy-pages@v4). Verified a `dist-pages` build served under /board-and-batten-calculator/: home (tool computes), about, privacy, terms, logo and icons, manifest, og.png, sitemap all load with 200 and no console errors. dist-pages removed. Branch is `main`.

## Rejected (and why)
- Rail positions and batten height controls, on-center input, neighbour-count picker, window/door helper, PNG save: new features that turn it into a bigger app. Listed for later.
- Sticky form column on desktop: with rails open the form is taller than the screen and would hide its bottom.
- JSDoc/TypeScript types for the plan result and moving draw() into lib: the return shape is now documented in `layout.mjs`; a bigger refactor adds little. DOM code (hash, copy) remains untested in Node.
- "Default rail 3 in is not a real size": the default is 3 1/2 in (3 + 1/2). No change.
- Metric chip rounding (6.4 cm vs 63.5 mm) and 1/16 round trip: under 1 mm; accepted.
- Same name in header vs titles; About "Why we built it" origin line: owner decision.

## Status
- `npm test`: 23 tests pass. `npm run build`: passes (6 pages).
- Screenshots at 1280 and 390, light and dark, checked by eye (in `screenshots/`, ignored by git).
- Lighthouse: not re-run (not available offline here). Last review run: 100 / 98 / 100 / 100; the one failure (heading order) is fixed.
- Print was fixed in CSS but not checked in a real print preview.

## Left for the owner
- Review the About page "Why we built it" copy (invented origin line).
- Push to GitHub (Barney) and enable Pages (Settings > Pages > Source: GitHub Actions).
- Consider the feature requests above for a later version.

## Phase 2 SEO pages (not built)
Board and batten spacing for a: 1. 6 ft wall, 2. 8 ft wall, 3. 9 ft wall, 4. 10 ft wall, 5. 12 ft wall, 6. 14 ft wall, 7. 16 ft wall, 8. 20 ft wall. Plus: 9. board and batten spacing for an entire room, 10. board and batten spacing 12 inch gap, 11. 16 inch gap, 12. 1x3 batten spacing, 13. 1x4 batten spacing, 14. 1x2 batten spacing, 15. board and batten with no end battens, 16. board and batten cut list, 17. how many boards for a 10 ft wall, 18. board and batten for a staircase wall, 19. board and batten in a bathroom/nursery, 20. board and batten spacing in metric (cm).
