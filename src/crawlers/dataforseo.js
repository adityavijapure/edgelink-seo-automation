// src/crawlers/dataforseo.js
const { USE_MOCKS } = require('../mocks');
const mockData = require('../mocks/dataforseo.mock');

async function getKeywordRankings(keyword, domain) {
  if (USE_MOCKS) {
    return mockData;
  }
  
  // Real DataForSEO API call stub
  return mockData;
}

module.exports = { getKeywordRankings };
