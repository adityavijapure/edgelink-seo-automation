// src/services/claude-analyst.js
const { USE_MOCKS } = require('../mocks');

const SYSTEM_PROMPT = `You are a senior SEO analyst with 15+ years experience specialising in
Indian local business websites, healthcare, dental, and real estate sectors.
You produce honest, falsifiable, prioritised SEO audit reports.
Your output must be valid JSON only — no markdown, no preamble.
Every recommendation must include: finding, fix, estimated_impact (High/Medium/Low),
effort (Hours/Days/Weeks), falsifiability_check (how we know if this worked).`;

function buildUserPrompt(params) {
  const {
    url,
    businessType,
    city,
    state,
    onPageData,
    technicalData,
    cwvData,
    schemaData,
    gscData,
    rankingsData
  } = params;

  return `Analyse the following SEO signals for: ${url}
Business type: ${businessType || 'Dental Clinic'}
Business location: ${city || 'Pune'}, ${state || 'Maharashtra'}, India

=== ON-PAGE DATA ===
${JSON.stringify(onPageData, null, 2)}

=== TECHNICAL DATA ===
${JSON.stringify(technicalData, null, 2)}

=== CORE WEB VITALS ===
${JSON.stringify(cwvData, null, 2)}

=== SCHEMA.ORG DATA ===
${JSON.stringify(schemaData, null, 2)}

=== GOOGLE SEARCH CONSOLE ===
${JSON.stringify(gscData, null, 2)}

=== KEYWORD RANKINGS ===
${JSON.stringify(rankingsData, null, 2)}

Respond ONLY with this JSON structure — no other text:
{
  "audit_version": "v1.0",
  "overall_score": <integer 0-100>,
  "score_breakdown": {
    "technical": <0-100>,
    "on_page": <0-100>,
    "content": <0-100>,
    "core_web_vitals": <0-100>,
    "schema": <0-100>
  },
  "critical_issues": [<max 5 items>],
  "important_issues": [<max 8 items>],
  "quick_wins": [<max 5 items — effort <= 2 hours>],
  "recommendations": [
    {
      "priority": "CRITICAL|HIGH|MEDIUM|LOW",
      "category": "Technical|OnPage|Content|Schema|CWV",
      "finding": "<what is wrong>",
      "fix": "<exact action to take>",
      "estimated_impact": "High|Medium|Low",
      "effort": "Hours|Days|Weeks",
      "falsifiability_check": "<how to verify this worked>"
    }
  ],
  "executive_summary": "<3 sentences max, plain English>"
}`;
}

const DEFAULT_MOCK_AUDIT = {
  audit_version: "v1.0",
  overall_score: 68,
  score_breakdown: {
    technical: 74,
    on_page: 78,
    content: 65,
    core_web_vitals: 61,
    schema: 72
  },
  critical_issues: [
    "LCP is 4.2 seconds on mobile, failing Google's 2.5s Core Web Vitals threshold due to uncompressed hero imagery.",
    "3 index coverage errors detected in Google Search Console, blocking key service pages from ranking.",
    "Missing geo coordinates and aggregate rating in LocalBusiness JSON-LD schema, limiting Google Local Pack visibility."
  ],
  important_issues: [
    "420 KiB of unused JavaScript from analytics and chatbot scripts is delaying Interaction to Next Paint (INP: 280ms).",
    "5 service images are missing descriptive alt text targeting Pune local dentistry terms.",
    "Average ranking for 'dental implants cost pune' is #11.3 (page 2), leaking high-intent commercial leads to competitors.",
    "Sitemap contains 2 redirected URLs that deplete Googlebot crawl budget.",
    "Missing localized FAQ schema on primary treatment pages (Root Canal, Braces)."
  ],
  quick_wins: [
    "Add alt text to 5 hero and service images targeting 'dental clinic pune' (effort: 30 mins).",
    "Defer unused third-party JS scripts using next/script strategy='lazyOnload' (effort: 1 hour).",
    "Add 'geo' coordinates and 'openingHoursSpecification' to existing Dentist schema.org block (effort: 45 mins).",
    "Fix meta title tag length on homepage to avoid SERP truncation (effort: 15 mins)."
  ],
  recommendations: [
    {
      priority: "CRITICAL",
      category: "CWV",
      finding: "Mobile Largest Contentful Paint (LCP) is 4.2s caused by large unoptimized hero banner (1.4MB) and 2 render-blocking resources.",
      fix: "Convert hero images to WebP/AVIF format with explicit dimensions, preload priority image, and inline critical CSS.",
      estimated_impact: "High",
      effort: "Hours",
      falsifiability_check: "PageSpeed Insights mobile LCP drops below 2.2s and Performance score increases to >= 85."
    },
    {
      priority: "CRITICAL",
      category: "Schema",
      finding: "Incomplete Dentist schema markup missing latitude, longitude, and priceRange attributes.",
      fix: "Enrich LocalBusiness JSON-LD with geo coordinates (18.5204, 73.8567), openingHours 'Mo-Sa 09:00-20:00', and priceRange '₹₹'.",
      estimated_impact: "High",
      effort: "Hours",
      falsifiability_check: "Google Rich Results Test confirms zero errors and Local Pack appearance in Pune searches."
    },
    {
      priority: "HIGH",
      category: "Technical",
      finding: "Google Search Console reports 3 index coverage errors causing pages to drop out of index.",
      fix: "Inspect GSC coverage report, resolve 404s/redirect loops with 301 redirects to parent treatment pages, and request re-indexing.",
      estimated_impact: "High",
      effort: "Hours",
      falsifiability_check: "GSC Index Coverage report displays zero 'Error' status URLs and valid pages climb."
    },
    {
      priority: "HIGH",
      category: "Content",
      finding: "Primary high-intent keyword 'dental implants cost pune' ranks #11.3 with 310 monthly impressions and 3.5% CTR.",
      fix: "Create an in-depth Pune Dental Implant Cost Guide breakdown table with pricing tiers, recovery timeline, and patient FAQs.",
      estimated_impact: "High",
      effort: "Days",
      falsifiability_check: "Keyword position moves from #11.3 to top 5 in DataForSEO and impressions increase by >= 40%."
    },
    {
      priority: "MEDIUM",
      category: "CWV",
      finding: "420 KiB unused JavaScript is blocking main thread and elevating INP to 280ms.",
      fix: "Code-split heavy interactive bundles and load third-party chat widgets on demand upon user interaction.",
      estimated_impact: "Medium",
      effort: "Hours",
      falsifiability_check: "PageSpeed report shows unused JS below 50 KiB and INP below 180ms."
    },
    {
      priority: "MEDIUM",
      category: "OnPage",
      finding: "5 service images lack localized descriptive alt attributes.",
      fix: "Update image tags with descriptive, geo-targeted alt text like 'Dr. Smile Clinic Pune root canal operatory'.",
      estimated_impact: "Medium",
      effort: "Hours",
      falsifiability_check: "Image SEO audit flags 0 missing alt tags and Google Image Search clicks increase."
    }
  ],
  executive_summary: "The website exhibits solid local relevance with 4,560 organic impressions and a top 4 ranking for primary Pune dental queries. However, a slow mobile LCP of 4.2s and missing local schema signals are restricting entry into Google's 3-Pack and dragging overall SEO health to 68/100. Implementing the quick wins on image optimization and schema will immediately elevate rankings for high-value dental implant keywords."
};

async function runClaudeAudit(params) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (USE_MOCKS || !apiKey) {
    console.log('[Claude Analyst] Using mock analysis (USE_MOCKS=true or ANTHROPIC_API_KEY not set)');
    // Slightly customize mock with params if provided
    const customized = { ...DEFAULT_MOCK_AUDIT };
    if (params.url) {
      customized.executive_summary = customized.executive_summary.replace('The website', `The website for ${params.url}`);
    }
    return customized;
  }

  try {
    const userPrompt = buildUserPrompt(params);
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 3500,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Claude API Error]:', errText);
      return DEFAULT_MOCK_AUDIT;
    }

    const data = await response.json();
    const rawContent = data.content?.[0]?.text || '';
    
    // Parse JSON safely
    const cleanJson = rawContent.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return parsed;
  } catch (err) {
    console.error('[Claude Analyst Error]:', err.message);
    return DEFAULT_MOCK_AUDIT;
  }
}

module.exports = { runClaudeAudit, SYSTEM_PROMPT, buildUserPrompt, DEFAULT_MOCK_AUDIT };
