// src/crawlers/pagespeed.js
const { USE_MOCKS } = require('../mocks');
const mockData = require('../mocks/pagespeed.mock');

async function getPageSpeed(url) {
  if (USE_MOCKS) {
    return { ...mockData, url: url || mockData.url };
  }
  
  // Real PageSpeed Insights API call if API key provided
  try {
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile${apiKey ? `&key=${apiKey}` : ''}`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`PageSpeed API returned ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[PageSpeed] Falling back to mock data due to error:', err.message);
    return { ...mockData, url: url || mockData.url };
  }
}

module.exports = { getPageSpeed };
