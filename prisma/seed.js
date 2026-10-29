// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { DEFAULT_MOCK_AUDIT } = require('../src/services/claude-analyst');
const pagespeedMock = require('../src/mocks/pagespeed.mock');
const gscMock = require('../src/mocks/gsc.mock');
const dataforseoMock = require('../src/mocks/dataforseo.mock');

async function main() {
  console.log('🌱 Seeding database with initial EdgeLink clients & audits...');

  // 1. Create Dr. Smile Dental Clinic
  const client1 = await prisma.client.upsert({
    where: { id: 'client-1' },
    update: {},
    create: {
      id: 'client-1',
      name: 'Dr. Smile Dental Clinic',
      contactPerson: 'Dr. Rahul Sharma',
      email: 'rahul@example-dental-clinic.com',
      phone: '+91 98234 56789',
      websiteUrl: 'https://example-dental-clinic.com',
      businessType: 'Dental Clinic & Oral Surgery',
      city: 'Pune',
      state: 'Maharashtra',
      targetKeyword: 'dental clinic pune',
      latestScore: 68,
      lastAuditDate: new Date('2026-10-28T14:30:00.000Z'),
      status: 'ACTIVE'
    }
  });

  // 2. Create Pune Prime Properties
  await prisma.client.upsert({
    where: { id: 'client-2' },
    update: {},
    create: {
      id: 'client-2',
      name: 'Pune Prime Properties',
      contactPerson: 'Vikram Malhotra',
      email: 'vikram@puneprimeproperties.com',
      phone: '+91 99221 44332',
      websiteUrl: 'https://puneprimeproperties.com',
      businessType: 'Real Estate Developer',
      city: 'Pune',
      state: 'Maharashtra',
      targetKeyword: 'luxury apartments pune',
      latestScore: 82,
      lastAuditDate: new Date('2026-10-27T09:15:00.000Z'),
      status: 'ACTIVE'
    }
  });

  // 3. Create Apex Orthopedic Hospital
  await prisma.client.upsert({
    where: { id: 'client-3' },
    update: {},
    create: {
      id: 'client-3',
      name: 'Apex Orthopedic Hospital',
      contactPerson: 'Dr. Sunita Kulkarni',
      email: 'info@apexorthopune.in',
      phone: '+91 98811 77665',
      websiteUrl: 'https://apexorthopune.in',
      businessType: 'Healthcare & Joint Replacement',
      city: 'Pune',
      state: 'Maharashtra',
      targetKeyword: 'orthopedic hospital pune',
      status: 'PENDING_FIRST_AUDIT'
    }
  });

  // 4. Create Initial Audit for client-1
  await prisma.audit.upsert({
    where: { id: 'audit-101' },
    update: {},
    create: {
      id: 'audit-101',
      clientId: client1.id,
      url: 'https://example-dental-clinic.com',
      businessType: 'Dental Clinic',
      city: 'Pune',
      state: 'Maharashtra',
      status: 'COMPLETED',
      currentStep: 10,
      totalSteps: 10,
      progressPercent: 100,
      overallScore: 68,
      scoreBreakdown: DEFAULT_MOCK_AUDIT.score_breakdown,
      criticalIssues: DEFAULT_MOCK_AUDIT.critical_issues,
      importantIssues: DEFAULT_MOCK_AUDIT.important_issues,
      quickWins: DEFAULT_MOCK_AUDIT.quick_wins,
      executiveSummary: DEFAULT_MOCK_AUDIT.executive_summary,
      pagespeedData: pagespeedMock,
      gscData: gscMock,
      rankingsData: dataforseoMock,
      pdfPath: '/reports/audit-101.pdf',
      pdfUrl: '/api/reports/audit-101/pdf',
      whatsappStatus: 'SENT',
      completedAt: new Date('2026-10-28T14:30:05.000Z'),
      recommendations: {
        create: DEFAULT_MOCK_AUDIT.recommendations.map(r => ({
          priority: r.priority,
          category: r.category,
          finding: r.finding,
          fix: r.fix,
          estimatedImpact: r.estimated_impact,
          effort: r.effort,
          falsifiabilityCheck: r.falsifiability_check
        }))
      }
    }
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
