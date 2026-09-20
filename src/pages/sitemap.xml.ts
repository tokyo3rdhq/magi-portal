import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const siteUrl = 'https://magi.website';
  
  const pages = [
    {
      url: siteUrl,
      lastmod: new Date().toISOString(),
      priority: '1.0',
      changefreq: 'weekly',
    },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
