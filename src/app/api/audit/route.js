// src/app/api/audit/route.js
import { NextResponse } from 'next/server';
const { getAudits, createAudit, getClientById } = require('@/lib/store');
const { runAuditPipeline } = require('@/services/audit-runner');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');
  const audits = await getAudits(clientId || undefined);
  return NextResponse.json({ audits });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { clientId, url, businessType, city, state } = body;

    let targetUrl = url;
    let bType = businessType;
    let cCity = city;
    let sState = state;

    if (clientId) {
      const client = await getClientById(clientId);
      if (client) {
        targetUrl = targetUrl || client.websiteUrl;
        bType = bType || client.businessType;
        cCity = cCity || client.city;
        sState = sState || client.state;
      }
    }

    if (!targetUrl) {
      return NextResponse.json({ error: 'Target URL is required' }, { status: 400 });
    }

    const audit = await createAudit({
      clientId: clientId || 'adhoc-client',
      url: targetUrl,
      businessType: bType || 'Local Business',
      city: cCity || 'Pune',
      state: sState || 'Maharashtra'
    });

    // Run the pipeline asynchronously in background
    runAuditPipeline(audit.id).catch(err => {
      console.error(`Pipeline failed for audit ${audit.id}:`, err);
    });

    return NextResponse.json({
      message: 'Audit job queued in BullMQ [seo-audit-jobs]',
      auditId: audit.id,
      audit
    }, { status: 202 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
