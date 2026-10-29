// src/crawlers/gsc.js
const { USE_MOCKS } = require('../mocks');
const mockData = require('../mocks/gsc.mock');

async function getSearchConsoleData(url) {
  if (USE_MOCKS) {
    return mockData;
  }
  
  // Real Google Search Console integration stub
  return mockData;
}

module.exports = { getSearchConsoleData };
