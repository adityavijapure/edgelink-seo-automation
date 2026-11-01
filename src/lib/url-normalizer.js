// src/lib/url-normalizer.js

/**
 * Normalizes user-submitted URLs:
 * - Fixes typo commas in domain extensions (e.g. flipkart,com -> flipkart.com)
 * - Auto-prepends https:// if protocol is missing
 * - Trims whitespace
 * - Ensures valid URL format
 */
function normalizeUrl(input) {
  if (!input || typeof input !== 'string') return '';
  let str = input.trim();

  // Fix common typo: comma instead of dot (e.g. flipkart,com -> flipkart.com, clinic,in -> clinic.in)
  str = str.replace(/,/g, '.');

  // Auto-prepend https:// if missing
  if (!/^https?:\/\//i.test(str)) {
    str = 'https://' + str;
  }

  try {
    const parsed = new URL(str);
    // If hostname doesn't contain a dot, assume .com
    if (!parsed.hostname.includes('.')) {
      parsed.hostname = parsed.hostname + '.com';
    }
    // Remove trailing slash if path is just /
    if (parsed.pathname === '/') {
      return `${parsed.protocol}//${parsed.hostname}`;
    }
    return parsed.href;
  } catch (e) {
    return str;
  }
}

function extractDomainName(url) {
  try {
    const parsed = new URL(normalizeUrl(url));
    return parsed.hostname.replace(/^www\./i, '');
  } catch (e) {
    return url || 'website';
  }
}

module.exports = { normalizeUrl, extractDomainName };
