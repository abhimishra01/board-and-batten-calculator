import type { APIRoute } from 'astro';
import site from '../site.config.ts';
import { href } from '../lib/url.ts';
// Built as a route so start_url and icon paths follow the base path.
export const GET: APIRoute = () =>
  new Response(JSON.stringify({
    name: site.name,
    short_name: 'Batten Calc',
    start_url: href('/'),
    display: 'standalone',
    background_color: '#f7f6f2',
    theme_color: site.brand,
    icons: [
      { src: href('/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: href('/icon-512.png'), sizes: '512x512', type: 'image/png' },
    ],
  }), { headers: { 'Content-Type': 'application/manifest+json' } });
