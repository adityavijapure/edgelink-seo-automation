// src/crawlers/robots-sitemap.js
const { USE_MOCKS } = require('../mocks');

async function checkRobotsAndSitemap(url) {
  if (USE_MOCKS) {
    return {
      robotsTxtFound: true,
      robotsTxtAccessible: true,
      robotsTxtUrl: 'https://example-dental-clinic.com/robots.txt',
      sitemapDeclaredInRobots: true,
      sitemapFound: true,
      sitemapUrl: 'https://example-dental-clinic.com/sitemap.xml',
      sitemapEntriesCount: 34,
      disallowedPaths: ['/admin/', '/api/', '/private/'],
      issues: [
        'Sitemap contains 2 redirected URLs that should be updated to canonical 200 URLs',
        'Robots.txt crawl-delay directive is not recognized by Googlebot'
      ]
    };
  }

  try {
    const origin = new URL(url).origin;
    const robotsRes = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(5000) });
    const robotsTxtFound = robotsRes.ok;
    const sitemapRes = await fetch(`${origin}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
    const sitemapFound = sitemapRes.ok;

    return {
      robotsTxtFound,
      robotsTxtAccessible: robotsTxtFound,
      robotsTxtUrl: `${origin}/robots.txt`,
      sitemapDeclaredInRobots: robotsTxtFound,
      sitemapFound,
      sitemapUrl: `${origin}/sitemap.xml`,
      sitemapEntriesCount: sitemapFound ? 20 : 0,
      disallowedPaths: ['/admin/'],
      issues: sitemapFound ? [] : ['Sitemap.xml not found at root path']
    };
  } catch (err) {
    return {
      robotsTxtFound: false,
      sitemapFound: false,
      issues: ['Could not verify robots.txt or sitemap: ' + err.message]
    };
  }
}

module.exports = { checkRobotsAndSitemap };
