// src/app/api/audit/route.js
import { NextResponse } from 'next/server';
const { getAudits, createAudit, getClientById } = require('@/lib/store');
const { runAuditPipeline } = require('@/services/audit-runner');
const { addAuditJob } = require('@/lib/queue');
const { normalizeUrl } = require('@/lib/url-normalizer');

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');
  const audits = await getAudits(clientId || undefined);
  return NextResponse.json({ audits });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      clientId, 
      url, 
      businessType, 
      city, 
      state,
      phone,
      whatsappNumber,
      recipientPhone,
      email,
      emailRecipient,
      recipientEmail 
    } = body;

    let targetUrl = url;
    let bType = businessType;
    let cCity = city;
    let sState = state;
    let targetPhone = recipientPhone || whatsappNumber || phone;
    let targetEmail = recipientEmail || emailRecipient || email;

    if (clientId) {
      const client = await getClientById(clientId);
      if (client) {
        targetUrl = targetUrl || client.websiteUrl;
        bType = bType || client.businessType;
        cCity = cCity || client.city;
        sState = sState || client.state;
        targetPhone = targetPhone || client.phone;
        targetEmail = targetEmail || client.email;
      }
    }

    if (!targetUrl) {
      return NextResponse.json({ error: 'Target URL is required' }, { status: 400 });
    }

    targetUrl = normalizeUrl(targetUrl);

    const audit = await createAudit({
      clientId: clientId || 'adhoc-client',
      url: targetUrl,
      businessType: bType || 'Local Business',
      city: cCity || 'Pune',
      state: sState || 'Maharashtra',
      recipientPhone: targetPhone || '+91 86240 86811',
      recipientEmail: targetEmail || 'rahul@example-dental-clinic.com'
    });

    // Queue job through BullMQ
    const queueResult = await addAuditJob(audit.id, {
      url: targetUrl,
      clientId: audit.clientId
    });

    // Execute pipeline runner
    runAuditPipeline(audit.id).catch(err => {
      console.error(`Pipeline failed for audit ${audit.id}:`, err);
    });

    return NextResponse.json({
      message: 'Audit job queued in BullMQ [seo-audit-jobs]',
      auditId: audit.id,
      jobId: queueResult.jobId,
      isBullMQ: queueResult.isBullMQ,
      audit
    }, { status: 202 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
