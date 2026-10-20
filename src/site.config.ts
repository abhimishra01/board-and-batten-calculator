// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
export default {
  name: 'Board and Batten Calculator',                 // shown in header, title, footer
  domain: 'boardandbattenspacingcalculator.com',            // no https://, no www. Used for canonical, sitemap, robots
  cloudflareProject: 'board-and-batten-calculator',    // Cloudflare Pages project name (used by npm run deploy)
  keyword: 'board and batten calculator',            // main keyword: goes in the H1 and title
  tagline: 'Spacing, marks and cut list',  // short line used in the title after the keyword
  description:
    'Free board and batten spacing calculator. Get the exact gap, a mark for every batten, a to-scale drawing and the boards to buy.',
  email: 'hello@boardandbattenspacingcalculator.com',       // contact email (shown on Contact and Privacy pages)
  ga4: '',                            // GA4 measurement ID, e.g. 'G-XXXXXXXXXX'. Empty = Google Analytics off
  adsense: '',                        // AdSense publisher ID, e.g. 'ca-pub-1234567890123456'. Empty = ads off
  brand: '#4d6319',                   // brand color (hex)
  locale: 'en-US',                    // BCP 47 language tag
  ogImage: '/og.png',                        // e.g. '/og.png' (1200x630 file in public/). Empty = no image
  category: 'UtilitiesApplication',   // schema.org applicationCategory
  owner: 'Board and Batten Calculator',                // name used in legal pages (person or business)
};
