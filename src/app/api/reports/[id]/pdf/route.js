// src/app/api/reports/[id]/pdf/route.js
import { NextResponse } from 'next/server';
const { getAuditById, getClientById } = require('@/lib/store');

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { id } = params;
  const audit = await getAuditById(id);
  if (!audit) {
    return new NextResponse('Audit report not found', { status: 404 });
  }

  const client = (await getClientById(audit.clientId)) || {
    name: 'Client',
    websiteUrl: audit.url,
    city: audit.city || 'Pune',
    businessType: audit.businessType || 'Local Business'
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SEO Audit Report - ${client.name}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; line-height: 1.5; margin: 0; padding: 24px; }
    .header { border-bottom: 2px solid #0f766e; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 24px; font-weight: 800; color: #0f766e; margin: 0; }
    .subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
    .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .meta-item label { display: block; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; }
    .meta-item value { display: block; font-size: 14px; font-weight: 600; color: #0f172a; margin-top: 2px; }
    .score-banner { background: #0f766e; color: white; border-radius: 8px; padding: 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .score-circle { font-size: 40px; font-weight: 900; background: rgba(255,255,255,0.2); padding: 10px 24px; border-radius: 999px; }
    .breakdown-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 24px; }
    .breakdown-card { background: #f1f5f9; border-radius: 6px; padding: 12px; text-align: center; }
    .breakdown-card span { display: block; font-size: 11px; color: #64748b; font-weight: 600; }
    .breakdown-card strong { display: block; font-size: 18px; color: #0f766e; margin-top: 4px; }
    .section-title { font-size: 16px; font-weight: 700; color: #0f172a; border-left: 4px solid #0f766e; padding-left: 8px; margin: 24px 0 12px 0; }
    .exec-summary { background: #ecfdf5; border-left: 4px solid #10b981; padding: 14px; border-radius: 4px; font-size: 13px; color: #065f46; margin-bottom: 24px; }
    .rec-card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 12px; background: white; }
    .rec-badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; margin-bottom: 6px; }
    .badge-CRITICAL { background: #fee2e2; color: #991b1b; }
    .badge-HIGH { background: #ffedd5; color: #9a3412; }
    .badge-MEDIUM { background: #fef3c7; color: #92400e; }
    .badge-LOW { background: #e0f2fe; color: #075985; }
    .finding { font-weight: 600; font-size: 13px; color: #1e293b; margin-bottom: 4px; }
    .fix { font-size: 12px; color: #334155; margin-bottom: 4px; }
    .falsify { font-size: 11px; color: #047857; font-style: italic; }
    .footer { text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 32px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; display: flex; justify-content: flex-end; gap: 10px;">
    <button onclick="window.print()" style="background: #0f766e; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;">Print / Save as PDF</button>
  </div>

  <div class="header">
    <div>
      <h1 class="title">SEO AUDIT REPORT</h1>
      <div class="subtitle">Comprehensive Technical & On-Page SEO Analysis</div>
    </div>
    <div style="text-align: right;">
      <div style="font-weight: 700; font-size: 13px;">Audit ID: ${audit.id}</div>
      <div style="font-size: 11px; color: #64748b;">Generated: ${new Date(audit.createdAt).toLocaleDateString()}</div>
    </div>
  </div>

  <div class="meta-box">
    <div class="meta-item">
      <label>Client Name</label>
      <value>${client.name}</value>
    </div>
    <div class="meta-item">
      <label>Target Website</label>
      <value>${audit.url}</value>
    </div>
    <div class="meta-item">
      <label>Location & Sector</label>
      <value>${audit.city || 'Pune'}, India • ${audit.businessType || 'Healthcare'}</value>
    </div>
  </div>

  <div class="score-banner">
    <div>
      <div style="font-size: 18px; font-weight: 700;">Overall SEO Health Score</div>
      <div style="font-size: 12px; opacity: 0.9;">Evaluated against Indian local search benchmarks & Core Web Vitals</div>
    </div>
    <div class="score-circle">${audit.overallScore || 0}/100</div>
  </div>

  <div class="breakdown-grid">
    <div class="breakdown-card">
      <span>Technical</span>
      <strong>${audit.scoreBreakdown?.technical || 0}/100</strong>
    </div>
    <div class="breakdown-card">
      <span>On-Page</span>
      <strong>${audit.scoreBreakdown?.on_page || 0}/100</strong>
    </div>
    <div class="breakdown-card">
      <span>Content</span>
      <strong>${audit.scoreBreakdown?.content || 0}/100</strong>
    </div>
    <div class="breakdown-card">
      <span>Core Web Vitals</span>
      <strong>${audit.scoreBreakdown?.core_web_vitals || 0}/100</strong>
    </div>
    <div class="breakdown-card">
      <span>Schema.org</span>
      <strong>${audit.scoreBreakdown?.schema || 0}/100</strong>
    </div>
  </div>

  <div class="section-title">Executive Summary</div>
  <div class="exec-summary">
    ${audit.executiveSummary || 'Audit analysis in progress.'}
  </div>

  <div class="section-title">Critical & High Priority Recommendations</div>
  ${(audit.recommendations || []).map(r => `
    <div class="rec-card">
      <span class="rec-badge badge-${r.priority}">${r.priority} • ${r.category} • Impact: ${r.estimated_impact}</span>
      <div class="finding"><strong>Finding:</strong> ${r.finding}</div>
      <div class="fix"><strong>Recommended Action:</strong> ${r.fix}</div>
      <div class="falsify"><strong>Verification Check:</strong> ${r.falsifiability_check}</div>
    </div>
  `).join('')}

  <div class="section-title">Quick Wins (Effort &le; 2 Hours)</div>
  <ul style="font-size: 12px; color: #334155; line-height: 1.8;">
    ${(audit.quickWins || []).map(qw => `<li>${qw}</li>`).join('')}
  </ul>

  <div class="footer">
    Report generated by SEO Automation Engine • AI Analysis by Claude 3.5 Sonnet • © 2026 Aditya Vijapure
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}
