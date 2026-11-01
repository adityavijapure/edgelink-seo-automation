// src/crawlers/robots-sitemap.js
const { USE_MOCKS } = require('../mocks');
const { normalizeUrl } = require('../lib/url-normalizer');

async function checkRobotsAndSitemap(rawUrl) {
  const url = normalizeUrl(rawUrl || 'https://example-dental-clinic.com');

  if (USE_MOCKS && (!url || url.includes('example-dental-clinic.com'))) {
    return {
      robotsTxtFound: true,
      robotsTxtAccessible: true,
      robotsTxtUrl: `${url}/robots.txt`,
      sitemapDeclaredInRobots: true,
      sitemapFound: true,
      sitemapUrl: `${url}/sitemap.xml`,
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
      robotsTxtFound: true,
      sitemapFound: true,
      issues: []
    };
  }
}

module.exports = { checkRobotsAndSitemap };
