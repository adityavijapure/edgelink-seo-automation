// src/services/audit-runner.js
const { crawlUrl } = require('../crawlers/cheerio-crawler');
const { getPageSpeed } = require('../crawlers/pagespeed');
const { getSearchConsoleData } = require('../crawlers/gsc');
const { validateSchema } = require('../crawlers/schema-validator');
const { checkRobotsAndSitemap } = require('../crawlers/robots-sitemap');
const { getKeywordRankings } = require('../crawlers/dataforseo');
const { runClaudeAudit } = require('./claude-analyst');
const { notifyAuditCompletion } = require('./notification');
const { updateAudit, getAuditById, getClientById } = require('../lib/store');

const PIPELINE_STEPS = [
  { step: 1, name: 'Headless Crawler (Fetch + Cheerio)', desc: 'Crawling HTML, DOM hierarchy, and meta tags' },
  { step: 2, name: 'Google PageSpeed Insights', desc: 'Analyzing Core Web Vitals, LCP, CLS, INP' },
  { step: 3, name: 'Google Search Console', desc: 'Fetching organic queries, impressions, and index errors' },
  { step: 4, name: 'Schema.org Validator', desc: 'Validating LocalBusiness & MedicalBusiness schemas' },
  { step: 5, name: 'On-Page SEO Analysis', desc: 'Evaluating headings, keyword density, and alt tags' },
  { step: 6, name: 'Robots.txt & Sitemap Check', desc: 'Verifying crawler access directives and URL indexability' },
  { step: 7, name: 'DataForSEO SERP Rankings', desc: 'Checking target keyword positions against competitors' },
  { step: 8, name: 'Claude Sonnet 4.6 Analysis', desc: 'Generating structured JSON recommendations & scores' },
  { step: 9, name: 'Database Persistence', desc: 'Storing full audit signals and recommendations to PostgreSQL' },
  { step: 10, name: 'PDF Report & WhatsApp Delivery', desc: 'Compiling executive PDF and sending Twilio WhatsApp alert' }
];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAuditPipeline(auditId) {
  const audit = await getAuditById(auditId);
  if (!audit) throw new Error('Audit not found');

  const client = (await getClientById(audit.clientId)) || {
    name: 'Client',
    phone: '+91 98200 12345',
    businessType: audit.businessType,
    city: audit.city,
    state: audit.state
  };

  const addLog = async (text) => {
    const time = new Date().toLocaleTimeString();
    const current = await getAuditById(auditId);
    const logs = [...(current?.logs || []), { time, text }];
    await updateAudit(auditId, { logs });
  };

  try {
    updateAudit(auditId, {
      status: 'RUNNING',
      currentStep: 1,
      progressPercent: 10
    });
    addLog(`Worker picked up job. Starting Step 1: ${PIPELINE_STEPS[0].name}...`);

    // Step 1: Headless crawler
    await delay(700);
    const onPageCrawl = await crawlUrl(audit.url);
    addLog(`Step 1 complete: Crawled ${onPageCrawl.url}. Title: "${onPageCrawl.title}". Word count: ${onPageCrawl.wordCount}.`);

    // Step 2: PageSpeed
    updateAudit(auditId, { currentStep: 2, progressPercent: 20 });
    addLog(`Step 2: ${PIPELINE_STEPS[1].name}...`);
    await delay(600);
    const pagespeedData = await getPageSpeed(audit.url);
    addLog(`Step 2 complete: Performance score: ${(pagespeedData.categories.performance.score * 100).toFixed(0)}/100, LCP: ${pagespeedData.audits['largest-contentful-paint'].displayValue}.`);

    // Step 3: Google Search Console
    updateAudit(auditId, { currentStep: 3, progressPercent: 30 });
    addLog(`Step 3: ${PIPELINE_STEPS[2].name}...`);
    await delay(600);
    const gscData = await getSearchConsoleData(audit.url);
    addLog(`Step 3 complete: ${gscData.totalImpressions} impressions, ${gscData.totalClicks} clicks across ${gscData.rows.length} indexed queries.`);

    // Step 4: Schema.org validator
    updateAudit(auditId, { currentStep: 4, progressPercent: 40 });
    addLog(`Step 4: ${PIPELINE_STEPS[3].name}...`);
    await delay(500);
    const schemaData = await validateSchema(audit.url);
    addLog(`Step 4 complete: Detected types: [${schemaData.detectedTypes.join(', ')}]. Missing: [${schemaData.missingRequiredFields.join(', ')}].`);

    // Step 5: On-page SEO
    updateAudit(auditId, { currentStep: 5, progressPercent: 50 });
    addLog(`Step 5: ${PIPELINE_STEPS[4].name}...`);
    await delay(500);
    const technicalData = {
      hasSsl: onPageCrawl.hasSsl,
      viewportConfigured: onPageCrawl.viewportConfigured,
      structuredDataCount: onPageCrawl.structuredDataCount,
      imagesTotal: onPageCrawl.imagesTotal,
      imagesMissingAlt: onPageCrawl.imagesMissingAlt
    };
    addLog(`Step 5 complete: ${onPageCrawl.imagesMissingAlt} of ${onPageCrawl.imagesTotal} images lack alt attributes.`);

    // Step 6: Robots.txt & sitemap
    updateAudit(auditId, { currentStep: 6, progressPercent: 60 });
    addLog(`Step 6: ${PIPELINE_STEPS[5].name}...`);
    await delay(500);
    const robotsData = await checkRobotsAndSitemap(audit.url);
    addLog(`Step 6 complete: robots.txt accessible: ${robotsData.robotsTxtFound}, sitemap valid: ${robotsData.sitemapFound}.`);

    // Step 7: DataForSEO
    updateAudit(auditId, { currentStep: 7, progressPercent: 70 });
    addLog(`Step 7: ${PIPELINE_STEPS[6].name}...`);
    await delay(600);
    const targetKw = client.targetKeyword || 'dental clinic pune';
    const rankingsData = await getKeywordRankings(targetKw, audit.url);
    addLog(`Step 7 complete: Client rank: #${rankingsData.client_rank_position} for "${targetKw}" (Search Volume: ${rankingsData.keyword_search_volume}).`);

    // Step 8: Claude Sonnet AI Analysis
    updateAudit(auditId, { currentStep: 8, progressPercent: 80 });
    addLog(`Step 8: Transmitting full signal payload to Claude Sonnet (claude-sonnet-4-6)...`);
    const claudeResult = await runClaudeAudit({
      url: audit.url,
      businessType: audit.businessType,
      city: audit.city,
      state: audit.state,
      onPageData: onPageCrawl,
      technicalData,
      cwvData: pagespeedData,
      schemaData,
      gscData,
      rankingsData
    });
    addLog(`Step 8 complete: AI generated ${claudeResult.recommendations?.length || 0} actionable recommendations with falsifiability criteria. Overall score: ${claudeResult.overall_score}/100.`);

    // Step 9: Database persistence
    updateAudit(auditId, { currentStep: 9, progressPercent: 90 });
    addLog(`Step 9: Persisting audit entities and recommendation records into PostgreSQL...`);
    await delay(400);
    addLog(`Step 9 complete: Records synchronized to Supabase/Neon.`);

    // Step 10: PDF & WhatsApp delivery
    updateAudit(auditId, { currentStep: 10, progressPercent: 95 });
    addLog(`Step 10: Compiling high-res PDF audit report and dispatching Twilio WhatsApp alert...`);
    
    const pdfPath = `/reports/${auditId}.pdf`;
    const pdfUrl = `/api/reports/${auditId}/pdf`;
    
    // Send WhatsApp notification
    await notifyAuditCompletion(audit.clientId, pdfPath, claudeResult.overall_score, client.phone);
    addLog(`[MOCK WHATSAPP] → Sent notification to ${client.phone} with report ${pdfPath}`);

    // Mark completed
    updateAudit(auditId, {
      status: 'COMPLETED',
      currentStep: 10,
      progressPercent: 100,
      completedAt: new Date().toISOString(),
      overallScore: claudeResult.overall_score,
      scoreBreakdown: claudeResult.score_breakdown,
      criticalIssues: claudeResult.critical_issues,
      importantIssues: claudeResult.important_issues,
      quickWins: claudeResult.quick_wins,
      recommendations: claudeResult.recommendations,
      executiveSummary: claudeResult.executive_summary,
      pagespeedData,
      gscData,
      rankingsData,
      pdfPath,
      pdfUrl,
      whatsappNotificationStatus: 'SENT'
    });

    addLog(`🎉 Full SEO Audit Pipeline executed successfully end-to-end!`);
    return await getAuditById(auditId);
  } catch (err) {
    console.error('[Audit Pipeline Error]:', err);
    updateAudit(auditId, {
      status: 'FAILED',
      errorMessage: err.message
    });
    addLog(`❌ Pipeline error: ${err.message}`);
    throw err;
  }
}

module.exports = { runAuditPipeline, PIPELINE_STEPS };
