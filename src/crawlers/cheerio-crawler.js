// src/crawlers/cheerio-crawler.js
const cheerio = require('cheerio');
const { USE_MOCKS } = require('../mocks');

async function crawlUrl(url) {
  if (USE_MOCKS && (!url || url.includes('example-dental-clinic.com'))) {
    return {
      url: url || 'https://example-dental-clinic.com',
      statusCode: 200,
      title: 'Best Dental Clinic in Pune | Dr. Smile Advanced Dentistry',
      metaDescription: 'Leading dental clinic in Pune offering painless root canal, dental implants, teeth whitening and smile design. Book an appointment today!',
      canonical: url || 'https://example-dental-clinic.com',
      wordCount: 840,
      h1: ['Advanced Dental Care in Pune'],
      h2: [
        'Our Specialized Dental Services',
        'Meet Our Dental Specialists',
        'Patient Testimonials & Reviews',
        'Book Your Consultation Today'
      ],
      h3: ['Dental Implants', 'Root Canal Treatment', 'Invisalign & Braces', 'Teeth Whitening'],
      imagesTotal: 14,
      imagesMissingAlt: 5,
      linksInternal: 28,
      linksExternal: 4,
      openGraph: {
        title: 'Best Dental Clinic in Pune | Dr. Smile Advanced Dentistry',
        description: 'Award winning dental clinic in Pune. Painless treatments by experts.',
        image: 'https://example-dental-clinic.com/og-banner.jpg'
      },
      hasSsl: true,
      viewportConfigured: true,
      structuredDataCount: 1
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EdgeLinkBot/1.0; +https://edgelinktechnology.com/bot)'
      },
      signal: AbortSignal.timeout(10000)
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    const h1 = $('h1').map((_, el) => $(el).text().trim()).get();
    const h2 = $('h2').map((_, el) => $(el).text().trim()).get();
    const h3 = $('h3').map((_, el) => $(el).text().trim()).get();
    
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText.split(' ').filter(Boolean).length;

    const images = $('img');
    const imagesTotal = images.length;
    let imagesMissingAlt = 0;
    images.each((_, img) => {
      if (!$(img).attr('alt') || $(img).attr('alt').trim() === '') {
        imagesMissingAlt++;
      }
    });

    const linksInternal = $(`a[href^="/"], a[href^="${url}"]`).length;
    const linksExternal = $('a[href^="http"]').length - linksInternal;

    const openGraph = {
      title: $('meta[property="og:title"]').attr('content') || title,
      description: $('meta[property="og:description"]').attr('content') || metaDescription,
      image: $('meta[property="og:image"]').attr('content') || ''
    };

    const structuredDataScripts = $('script[type="application/ld+json"]').length;

    return {
      url,
      statusCode: response.status,
      title,
      metaDescription,
      canonical,
      wordCount,
      h1,
      h2,
      h3,
      imagesTotal,
      imagesMissingAlt,
      linksInternal,
      linksExternal,
      openGraph,
      hasSsl: url.startsWith('https://'),
      viewportConfigured: !!$('meta[name="viewport"]').length,
      structuredDataCount: structuredDataScripts
    };
  } catch (err) {
    console.warn(`[Crawler] Failed to fetch ${url}, falling back:`, err.message);
    return {
      url,
      statusCode: 500,
      error: err.message,
      title: 'Extracted via fallback',
      metaDescription: '',
      wordCount: 0,
      h1: [],
      h2: [],
      h3: [],
      imagesTotal: 0,
      imagesMissingAlt: 0,
      linksInternal: 0,
      linksExternal: 0,
      hasSsl: url ? url.startsWith('https://') : false
    };
  }
}

module.exports = { crawlUrl };
