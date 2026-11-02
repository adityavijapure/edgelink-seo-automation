// src/app/api/cron/worker/route.js
import { NextResponse } from 'next/server';
const { getAudits } = require('@/lib/store');
const { runAuditPipeline } = require('@/services/audit-runner');

export const dynamic = 'force-dynamic';

/**
 * Cron Worker Endpoint
 * Triggered on schedule (e.g. every minute via cron-job.org)
 * Enables serverless environments (like Vercel) to process queued BullMQ / database audit jobs
 * without requiring a 24/7 dedicated VPS process.
 */
export async function GET(request) {
  try {
    const audits = await getAudits();
    const pending = audits.filter(a => a.status === 'QUEUED' || a.status === 'PENDING');

    if (pending.length === 0) {
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        message: 'Queue idle. No pending audit jobs awaiting execution.',
        processed: 0
      });
    }

    const jobToRun = pending[0];
    runAuditPipeline(jobToRun.id).catch(err => {
      console.error('[Cron Worker] Execution error for audit', jobToRun.id, err);
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: `Triggered background audit pipeline for audit: ${jobToRun.id}`,
      processed: 1,
      auditId: jobToRun.id
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  return GET(request);
}

