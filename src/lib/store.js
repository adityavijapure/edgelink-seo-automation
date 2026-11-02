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
        phone: '+91 98200 12345',
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
        phone: '+91 98200 54321',
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
        phone: '+91 98200 67890',
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

function normalizeRec(r) {
  return {
    ...r,
    estimated_impact: r.estimated_impact || r.estimatedImpact || 'Medium',
    estimatedImpact: r.estimatedImpact || r.estimated_impact || 'Medium',
    falsifiability_check: r.falsifiability_check || r.falsifiabilityCheck || 'Verify with search audit.',
    falsifiabilityCheck: r.falsifiabilityCheck || r.falsifiability_check || 'Verify with search audit.'
  };
}

async function getAudits(clientId) {
  let memAudits = clientId ? store.audits.filter(a => a.clientId === clientId) : store.audits;

  if (prisma && process.env.DATABASE_URL) {
    try {
      const dbAudits = await prisma.audit.findMany({
        where: clientId ? { clientId } : undefined,
        include: { recommendations: true },
        orderBy: { createdAt: 'desc' }
      });
      if (dbAudits && dbAudits.length > 0) {
        return dbAudits.map(dbA => {
          const matchMem = store.audits.find(m => m.id === dbA.id);
          const rawRecs = (dbA.recommendations && dbA.recommendations.length > 0)
            ? dbA.recommendations
            : (matchMem?.recommendations || []);
          return {
            ...matchMem,
            ...dbA,
            overallScore: dbA.overallScore ?? matchMem?.overallScore ?? 70,
            overall_score: dbA.overallScore ?? matchMem?.overallScore ?? 70,
            scoreBreakdown: dbA.scoreBreakdown ?? matchMem?.scoreBreakdown,
            criticalIssues: dbA.criticalIssues ?? matchMem?.criticalIssues ?? [],
            importantIssues: dbA.importantIssues ?? matchMem?.importantIssues ?? [],
            quickWins: dbA.quickWins ?? matchMem?.quickWins ?? [],
            executiveSummary: dbA.executiveSummary ?? matchMem?.executiveSummary ?? '',
            whatsappNotificationStatus: matchMem?.whatsappNotificationStatus || dbA.whatsappStatus || 'SENT',
            recipientPhone: matchMem?.recipientPhone || '+91 98200 12345',
            recipientEmail: matchMem?.recipientEmail || 'rahul@example-dental-clinic.com',
            whatsappShareUrl: matchMem?.whatsappShareUrl || null,
            recommendations: rawRecs.map(normalizeRec)
          };
        });
      }
    } catch (e) {
      // fallback
    }
  }

  return memAudits;
}

async function getAuditById(id) {
  const memAudit = store.audits.find(a => a.id === id);

  if (prisma && process.env.DATABASE_URL) {
    try {
      const dbAudit = await prisma.audit.findUnique({
        where: { id },
        include: { recommendations: true }
      });
      if (dbAudit) {
        const rawRecs = (dbAudit.recommendations && dbAudit.recommendations.length > 0)
          ? dbAudit.recommendations
          : (memAudit?.recommendations || []);
        return {
          ...memAudit,
          ...dbAudit,
          overallScore: dbAudit.overallScore ?? memAudit?.overallScore ?? 70,
          overall_score: dbAudit.overallScore ?? memAudit?.overallScore ?? 70,
          scoreBreakdown: dbAudit.scoreBreakdown ?? memAudit?.scoreBreakdown,
          criticalIssues: dbAudit.criticalIssues ?? memAudit?.criticalIssues ?? [],
          importantIssues: dbAudit.importantIssues ?? memAudit?.importantIssues ?? [],
          quickWins: dbAudit.quickWins ?? memAudit?.quickWins ?? [],
          executiveSummary: dbAudit.executiveSummary ?? memAudit?.executiveSummary ?? '',
          whatsappNotificationStatus: memAudit?.whatsappNotificationStatus || dbAudit.whatsappStatus || 'SENT',
          recipientPhone: memAudit?.recipientPhone || '+91 98200 12345',
          recipientEmail: memAudit?.recipientEmail || 'rahul@example-dental-clinic.com',
          whatsappShareUrl: memAudit?.whatsappShareUrl || null,
          recommendations: rawRecs.map(normalizeRec)
        };
      }
    } catch (e) {
      // fallback
    }
  }
  return memAudit;
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
    recipientPhone: auditData.recipientPhone || auditData.whatsappNumber || auditData.phone || '+91 98200 12345',
    recipientEmail: auditData.recipientEmail || auditData.emailRecipient || auditData.email || 'rahul@example-dental-clinic.com',
    whatsappShareUrl: null,
    whatsappNotificationStatus: 'PENDING',
    logs: [
      { time: new Date().toLocaleTimeString(), text: 'Audit job queued in BullMQ [seo-audit-jobs]' }
    ]
  };
  store.audits.unshift(newAudit);

  const newJob = {
    id: 'job-' + Date.now(),
    name: `seo-audit-${auditData.clientId}`,
    queueName: 'seo-audit-jobs',
    status: 'QUEUED',
    clientId: auditData.clientId,
    auditId: newAudit.id,
    progress: 0,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
  store.queueJobs.unshift(newJob);

  if (prisma && process.env.DATABASE_URL) {
    try {
      const targetClientId = newAudit.clientId || 'adhoc-client';
      newAudit.clientId = targetClientId;
      const memC = store.clients.find(c => c.id === targetClientId);

      await prisma.audit.create({
        data: {
          id: newAudit.id,
          url: newAudit.url,
          businessType: newAudit.businessType || 'Local Business',
          city: newAudit.city || 'Pune',
          state: newAudit.state || 'Maharashtra',
          status: 'QUEUED',
          currentStep: 0,
          totalSteps: 10,
          progressPercent: 0,
          logs: newAudit.logs,
          whatsappStatus: 'PENDING',
          createdAt: new Date(),
          client: {
            connectOrCreate: {
              where: { id: targetClientId },
              create: {
                id: targetClientId,
                name: memC?.name || auditData.clientName || 'Client ' + targetClientId,
                websiteUrl: memC?.websiteUrl || newAudit.url || 'https://example.com',
                businessType: memC?.businessType || newAudit.businessType || 'Local Business',
                city: memC?.city || newAudit.city || 'Pune',
                state: memC?.state || newAudit.state || 'Maharashtra',
                phone: memC?.phone || newAudit.recipientPhone || '+91 98200 12345',
                email: memC?.email || newAudit.recipientEmail || 'info@client.com',
                status: 'ACTIVE'
              }
            }
          }
        }
      });

      prisma.queueJob.create({
        data: {
          id: newJob.id,
          jobId: newJob.id,
          queueName: 'seo-audit-jobs',
          clientId: targetClientId,
          auditId: newAudit.id,
          status: 'QUEUED',
          progress: 0,
          createdAt: new Date()
        }
      }).catch(() => {});
    } catch (e) {
      console.warn('[Prisma] Could not create audit/queue_job record in DB:', e.message);
    }
  }

  return newAudit;
}

async function updateAudit(id, updates, options = {}) {
  let audit = store.audits.find(a => a.id === id);
  if (!audit) {
    audit = await getAuditById(id);
    if (audit) store.audits.unshift(audit);
  }
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

  // Only persist to Prisma if COMPLETED or FAILED or explicitly requested
  const shouldPersist = options.persistToDb ?? (updates.status === 'COMPLETED' || updates.status === 'FAILED');

  if (shouldPersist && prisma && process.env.DATABASE_URL) {
    try {
      const dataToUpdate = {};
      if (updates.status) dataToUpdate.status = updates.status;
      if (updates.currentStep !== undefined) dataToUpdate.currentStep = updates.currentStep;
      if (updates.totalSteps !== undefined) dataToUpdate.totalSteps = updates.totalSteps;
      if (updates.progressPercent !== undefined) dataToUpdate.progressPercent = updates.progressPercent;
      if (updates.logs) dataToUpdate.logs = updates.logs;
      if (updates.overallScore !== undefined) dataToUpdate.overallScore = updates.overallScore;
      if (updates.scoreBreakdown) dataToUpdate.scoreBreakdown = updates.scoreBreakdown;
      if (updates.criticalIssues) dataToUpdate.criticalIssues = updates.criticalIssues;
      if (updates.importantIssues) dataToUpdate.importantIssues = updates.importantIssues;
      if (updates.quickWins) dataToUpdate.quickWins = updates.quickWins;
      if (updates.executiveSummary) dataToUpdate.executiveSummary = updates.executiveSummary;
      if (updates.pagespeedData) dataToUpdate.pagespeedData = updates.pagespeedData;
      if (updates.gscData) dataToUpdate.gscData = updates.gscData;
      if (updates.rankingsData) dataToUpdate.rankingsData = updates.rankingsData;
      if (updates.pdfPath) dataToUpdate.pdfPath = updates.pdfPath;
      if (updates.pdfUrl) dataToUpdate.pdfUrl = updates.pdfUrl;
      if (updates.whatsappNotificationStatus) dataToUpdate.whatsappStatus = updates.whatsappNotificationStatus;
      if (updates.status === 'COMPLETED') {
        dataToUpdate.completedAt = new Date();
        dataToUpdate.whatsappStatus = 'SENT';
      }

      if (audit.clientId) {
        const memC = store.clients.find(c => c.id === audit.clientId);
        try {
          await prisma.client.upsert({
            where: { id: audit.clientId },
            update: {},
            create: {
              id: audit.clientId,
              name: memC?.name || audit.businessType || 'Client ' + audit.clientId,
              websiteUrl: memC?.websiteUrl || audit.url || 'https://example.com',
              businessType: memC?.businessType || audit.businessType || 'Local Business',
              city: memC?.city || audit.city || 'Pune',
              state: memC?.state || audit.state || 'Maharashtra',
              phone: memC?.phone || audit.recipientPhone || '+91 98200 12345',
              email: memC?.email || audit.recipientEmail || 'info@client.com',
              status: 'ACTIVE'
            }
          });
        } catch (cUpsertErr) {
          // ignore if already present
        }
      }

      await prisma.audit.upsert({
        where: { id },
        update: dataToUpdate,
        create: {
          id,
          clientId: audit.clientId,
          url: audit.url,
          businessType: audit.businessType || 'Local Business',
          city: audit.city || 'Pune',
          state: audit.state || 'Maharashtra',
          status: updates.status || 'QUEUED',
          currentStep: updates.currentStep || 0,
          totalSteps: 10,
          progressPercent: updates.progressPercent || 0,
          logs: updates.logs || audit.logs || [],
          whatsappStatus: updates.whatsappNotificationStatus || 'PENDING'
        }
      });

      // Update Client, QueueJob, and Recommendations in parallel
      const ancillaryTasks = [];

      if (updates.status === 'COMPLETED' && updates.overallScore && audit.clientId) {
        ancillaryTasks.push(
          prisma.client.update({
            where: { id: audit.clientId },
            data: {
              latestScore: updates.overallScore,
              lastAuditDate: new Date(),
              status: 'ACTIVE'
            }
          }).catch(() => {})
        );
      }

      ancillaryTasks.push(
        prisma.queueJob.updateMany({
          where: { auditId: id },
          data: {
            status: updates.status || 'RUNNING',
            progress: updates.progressPercent || (updates.status === 'COMPLETED' ? 100 : 0),
            completedAt: updates.status === 'COMPLETED' ? new Date() : undefined
          }
        }).catch(() => {})
      );

      if (Array.isArray(updates.recommendations) && updates.recommendations.length > 0) {
        ancillaryTasks.push(
          prisma.recommendation.deleteMany({ where: { auditId: id } })
            .then(() => prisma.recommendation.createMany({
              data: updates.recommendations.map(r => ({
                auditId: id,
                priority: r.priority || 'HIGH',
                category: r.category || 'General',
                finding: r.finding || '',
                fix: r.fix || '',
                estimatedImpact: r.estimatedImpact || r.estimated_impact || 'Medium',
                effort: r.effort || 'Hours',
                falsifiabilityCheck: r.falsifiabilityCheck || r.falsifiability_check || ''
              }))
            }))
            .catch(() => {})
        );
      }

      await Promise.all(ancillaryTasks);
    } catch (e) {
      console.warn('[Prisma] Failed to update audit in DB:', e.message);
    }
  }

  return audit;
}

async function getQueueJobs() {
  if (prisma && process.env.DATABASE_URL) {
    try {
      const dbJobs = await prisma.queueJob.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      if (dbJobs && dbJobs.length > 0) {
        return dbJobs.map(j => ({
          ...j,
          createdAt: j.createdAt ? j.createdAt.toISOString() : null,
          completedAt: j.completedAt ? j.completedAt.toISOString() : null
        }));
      }
    } catch (e) {
      console.warn('[Prisma] Could not fetch queue_jobs from DB, falling back to memory:', e.message);
    }
  }
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
