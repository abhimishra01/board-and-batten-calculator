// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
export default {
  name: 'Board and Batten Calculator',                 // shown in header, title, footer
  domain: 'boardandbattenspacingcalculator.com',            // no https://, no www. Used for canonical, sitemap, robots
  cloudflareProject: 'board-and-batten-calculator',    // Cloudflare Pages project name (used by npm run deploy)
  keyword: 'board and batten calculator',            // main keyword: goes in the H1 and title
  keywords: ['board and batten spacing calculator', 'batten spacing calculator', 'board and batten wall layout', 'how to space board and batten', 'board and batten spacing for entire room', 'board and batten cut list'], // supporting keywords
  tagline: 'Spacing, marks and cut list',  // short line used in the title after the keyword
  description:
    'A free online ruler that works in your browser. No sign-up, no install. Measure in inches or centimetres.',
  email: 'hello@boardandbattenspacingcalculator.com',       // contact email (shown on Contact and Privacy pages)
  ga4: '',                            // GA4 measurement ID, e.g. 'G-XXXXXXXXXX'. Empty = Google Analytics off
  adsense: '',                        // AdSense publisher ID, e.g. 'ca-pub-1234567890123456'. Empty = ads off
  brand: '#2c5a4b',                   // brand colour (hex)
  locale: 'en-US',                    // BCP 47 language tag
  ogImage: '/og.png',                        // e.g. '/og.png' (1200x630 file in public/). Empty = no image
  category: 'UtilitiesApplication',   // schema.org applicationCategory
  owner: 'Board and Batten Calculator',                // name used in legal pages (person or business)
};
