// src/lib/store.js
const { DEFAULT_MOCK_AUDIT } = require('../services/claude-analyst');
const { normalizeUrl } = require('./url-normalizer');
const pagespeedMock = require('../mocks/pagespeed.mock');
const gscMock = require('../mocks/gsc.mock');
const dataforseoMock = require('../mocks/dataforseo.mock');

// Global store in memory so changes persist across requests during server runtime
if (!global.__SEO_STORE__) {
  global.__SEO_STORE__ = {
    clients: [
      {
        id: 'client-1',
        name: 'Dr. Smile Dental Clinic',
        contactPerson: 'Dr. Rahul Sharma',
        email: 'rahul@example-dental-clinic.com',
        phone: '+91 86240 86811',
        websiteUrl: 'https://example-dental-clinic.com',
        businessType: 'Dental Clinic & Oral Surgery',
        city: 'Pune',
        state: 'Maharashtra',
        targetKeyword: 'dental clinic pune',
        createdAt: '2026-10-15T10:00:00.000Z',
        lastAuditDate: '2026-10-28T14:30:00.000Z',
        latestScore: 68,
        status: 'ACTIVE'
      },
      {
        id: 'client-2',
        name: 'Pune Prime Properties',
        contactPerson: 'Vikram Malhotra',
        email: 'vikram@puneprimeproperties.com',
        phone: '+91 86240 86811',
        websiteUrl: 'https://puneprimeproperties.com',
        businessType: 'Real Estate Developer',
        city: 'Pune',
        state: 'Maharashtra',
        targetKeyword: 'luxury apartments pune',
        createdAt: '2026-10-20T11:00:00.000Z',
        lastAuditDate: '2026-10-27T09:15:00.000Z',
        latestScore: 82,
        status: 'ACTIVE'
      },
      {
        id: 'client-3',
        name: 'Apex Orthopedic Hospital',
        contactPerson: 'Dr. Sunita Kulkarni',
        email: 'info@apexorthopune.in',
        phone: '+91 86240 86811',
        websiteUrl: 'https://apexorthopune.in',
        businessType: 'Healthcare & Joint Replacement',
        city: 'Pune',
        state: 'Maharashtra',
        targetKeyword: 'orthopedic hospital pune',
        createdAt: '2026-10-22T08:30:00.000Z',
        lastAuditDate: null,
        latestScore: null,
        status: 'PENDING_FIRST_AUDIT'
      }
    ],
    audits: [
      {
        id: 'audit-101',
        clientId: 'client-1',
        url: 'https://example-dental-clinic.com',
        businessType: 'Dental Clinic',
        city: 'Pune',
        state: 'Maharashtra',
        status: 'COMPLETED',
        currentStep: 10,
        totalSteps: 10,
        progressPercent: 100,
        createdAt: '2026-10-28T14:28:10.000Z',
        completedAt: '2026-10-28T14:30:05.000Z',
        overallScore: 68,
        scoreBreakdown: DEFAULT_MOCK_AUDIT.score_breakdown,
        criticalIssues: DEFAULT_MOCK_AUDIT.critical_issues,
        importantIssues: DEFAULT_MOCK_AUDIT.important_issues,
        quickWins: DEFAULT_MOCK_AUDIT.quick_wins,
        recommendations: DEFAULT_MOCK_AUDIT.recommendations,
        executiveSummary: DEFAULT_MOCK_AUDIT.executive_summary,
        pagespeedData: pagespeedMock,
        gscData: gscMock,
        rankingsData: dataforseoMock,
        pdfPath: '/reports/audit-101.pdf',
        pdfUrl: '/api/reports/audit-101/pdf',
        whatsappNotificationStatus: 'SENT',
        logs: [
          { time: '14:28:10', text: 'Job queued in BullMQ [seo-audit-jobs]' },
          { time: '14:28:12', text: 'Worker picked up job. Starting Step 1: Headless crawler (Cheerio)...' },
          { time: '14:28:16', text: 'Step 1 complete. Extracted 840 words, 14 images, 1 H1, 4 H2s.' },
          { time: '14:28:18', text: 'Step 2: Google PageSpeed Insights API (mobile strategy) - LCP 4.2s, score 61.' },
          { time: '14:28:22', text: 'Step 3: Google Search Console - 4,560 impressions, 167 clicks.' },
          { time: '14:28:25', text: 'Step 4: Schema.org validator - LocalBusiness detected, missing geo & openingHours.' },
          { time: '14:28:29', text: 'Step 5: On-page SEO analysis complete.' },
          { time: '14:28:32', text: 'Step 6: Robots.txt & sitemap.xml verified. Disallow: /admin/' },
          { time: '14:28:36', text: 'Step 7: DataForSEO rankings fetched. Rank #4 for "dental clinic pune".' },
          { time: '14:28:40', text: 'Analyzing all signals with Claude Sonnet 4.6 (Indian local SEO specialist)...' },
          { time: '14:28:55', text: 'Structured JSON recommendations generated successfully (Overall score: 68).' },
          { time: '14:28:58', text: 'Audit record persisted to database.' },
          { time: '14:29:02', text: 'Automated PDF audit report generated.' },
          { time: '14:29:05', text: '[MOCK WHATSAPP] → Client: client-1 | Score: 68/100 | Report: /reports/audit-101.pdf' }
        ]
      }
    ],
    queueJobs: [
      {
        id: 'job-101',
        name: 'seo-audit-client-1',
        queueName: 'seo-audit-jobs',
        status: 'COMPLETED',
        clientId: 'client-1',
        auditId: 'audit-101',
        progress: 100,
        createdAt: '2026-10-28T14:28:10.000Z',
        completedAt: '2026-10-28T14:30:05.000Z'
      }
    ]
  };
}

const store = global.__SEO_STORE__;

let prisma = null;
try {
  if (process.env.DATABASE_URL) {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
  }
} catch (e) {
  // Prisma not configured
}

async function getClients() {
  if (prisma && process.env.DATABASE_URL) {
    try {
      const dbClients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' }
      });
      if (dbClients && dbClients.length > 0) return dbClients;
    } catch (e) {
      console.warn('[Prisma] Could not fetch clients from database, falling back to memory store:', e.message);
    }
  }
  return store.clients;
}

async function getClientById(id) {
  if (prisma && process.env.DATABASE_URL) {
    try {
      const client = await prisma.client.findUnique({ where: { id } });
      if (client) return client;
    } catch (e) {
      // fallback
    }
  }
  return store.clients.find(c => c.id === id);
}

async function addClient(clientData) {
  const newClient = {
    id: 'client-' + Date.now(),
    name: clientData.name,
    contactPerson: clientData.contactPerson || clientData.name,
    email: clientData.email,
    phone: clientData.phone || '+91 98000 00000',
    websiteUrl: clientData.websiteUrl,
    businessType: clientData.businessType || 'Local Business',
    city: clientData.city || 'Pune',
    state: clientData.state || 'Maharashtra',
    targetKeyword: clientData.targetKeyword || 'local service',
    createdAt: new Date().toISOString(),
    lastAuditDate: null,
    latestScore: null,
    status: 'PENDING_FIRST_AUDIT'
  };

  store.clients.unshift(newClient);

  if (prisma && process.env.DATABASE_URL) {
    try {
      await prisma.client.create({
        data: {
          id: newClient.id,
          name: newClient.name,
          contactPerson: newClient.contactPerson,
          email: newClient.email,
          phone: newClient.phone,
          websiteUrl: newClient.websiteUrl,
          businessType: newClient.businessType,
          city: newClient.city,
          state: newClient.state,
          targetKeyword: newClient.targetKeyword,
          status: newClient.status
        }
      });
    } catch (e) {
      console.warn('[Prisma] Client creation failed in DB:', e.message);
    }
  }

  return newClient;
}

async function getAudits(clientId) {
  if (prisma && process.env.DATABASE_URL) {
    try {
      const dbAudits = await prisma.audit.findMany({
        where: clientId ? { clientId } : undefined,
        include: { recommendations: true },
        orderBy: { createdAt: 'desc' }
      });
      if (dbAudits && dbAudits.length > 0) return dbAudits;
    } catch (e) {
      // fallback
    }
  }

  if (clientId) {
    return store.audits.filter(a => a.clientId === clientId);
  }
  return store.audits;
}

async function getAuditById(id) {
  if (prisma && process.env.DATABASE_URL) {
    try {
      const dbAudit = await prisma.audit.findUnique({
        where: { id },
        include: { recommendations: true }
      });
      if (dbAudit) return dbAudit;
    } catch (e) {
      // fallback
    }
  }
  return store.audits.find(a => a.id === id);
}

async function createAudit(auditData) {
  const newAudit = {
    id: 'audit-' + Date.now(),
    clientId: auditData.clientId,
    url: normalizeUrl(auditData.url),
    businessType: auditData.businessType,
    city: auditData.city,
    state: auditData.state,
    status: 'QUEUED',
    currentStep: 0,
    totalSteps: 10,
    progressPercent: 0,
    createdAt: new Date().toISOString(),
    completedAt: null,
    overallScore: null,
    scoreBreakdown: null,
    criticalIssues: [],
    importantIssues: [],
    quickWins: [],
    recommendations: [],
    executiveSummary: '',
    pagespeedData: null,
    gscData: null,
    rankingsData: null,
    pdfPath: null,
    pdfUrl: null,
    whatsappNotificationStatus: 'PENDING',
    logs: [
      { time: new Date().toLocaleTimeString(), text: 'Audit job queued in BullMQ [seo-audit-jobs]' }
    ]
  };
  store.audits.unshift(newAudit);

  // Also add queue job record
  store.queueJobs.unshift({
    id: 'job-' + Date.now(),
    name: `seo-audit-${auditData.clientId}`,
    queueName: 'seo-audit-jobs',
    status: 'QUEUED',
    clientId: auditData.clientId,
    auditId: newAudit.id,
    progress: 0,
    createdAt: new Date().toISOString(),
    completedAt: null
  });

  return newAudit;
}

async function updateAudit(id, updates) {
  const audit = store.audits.find(a => a.id === id);
  if (!audit) return null;
  Object.assign(audit, updates);

  // If completed, update client latestScore and lastAuditDate
  if (updates.status === 'COMPLETED' && updates.overallScore) {
    const client = store.clients.find(c => c.id === audit.clientId);
    if (client) {
      client.latestScore = updates.overallScore;
      client.lastAuditDate = new Date().toISOString();
      client.status = 'ACTIVE';
    }
    const qJob = store.queueJobs.find(j => j.auditId === id);
    if (qJob) {
      qJob.status = 'COMPLETED';
      qJob.progress = 100;
      qJob.completedAt = new Date().toISOString();
    }
  }

  // Persist to Prisma if available
  if (prisma && process.env.DATABASE_URL && updates.status === 'COMPLETED') {
    try {
      await prisma.audit.upsert({
        where: { id },
        update: {
          status: updates.status,
          currentStep: updates.currentStep || 10,
          progressPercent: updates.progressPercent || 100,
          overallScore: updates.overallScore,
          scoreBreakdown: updates.scoreBreakdown,
          criticalIssues: updates.criticalIssues,
          importantIssues: updates.importantIssues,
          quickWins: updates.quickWins,
          executiveSummary: updates.executiveSummary,
          pagespeedData: updates.pagespeedData,
          gscData: updates.gscData,
          rankingsData: updates.rankingsData,
          pdfPath: updates.pdfPath,
          pdfUrl: updates.pdfUrl,
          completedAt: new Date(),
          whatsappStatus: 'SENT'
        },
        create: {
          id,
          clientId: audit.clientId,
          url: audit.url,
          businessType: audit.businessType || 'Local Business',
          city: audit.city || 'Pune',
          state: audit.state || 'Maharashtra',
          status: updates.status,
          currentStep: 10,
          progressPercent: 100,
          overallScore: updates.overallScore,
          scoreBreakdown: updates.scoreBreakdown,
          criticalIssues: updates.criticalIssues,
          importantIssues: updates.importantIssues,
          quickWins: updates.quickWins,
          executiveSummary: updates.executiveSummary,
          pagespeedData: updates.pagespeedData,
          gscData: updates.gscData,
          rankingsData: updates.rankingsData,
          pdfPath: updates.pdfPath,
          pdfUrl: updates.pdfUrl,
          completedAt: new Date(),
          whatsappStatus: 'SENT'
        }
      });
    } catch (e) {
      console.warn('[Prisma] Failed to persist audit to DB:', e.message);
    }
  }

  return audit;
}

function getQueueJobs() {
  return store.queueJobs;
}

module.exports = {
  getClients,
  getClientById,
  addClient,
  getAudits,
  getAuditById,
  createAudit,
  updateAudit,
  getQueueJobs
};
