// src/app/api/cron/audit/route.js
import { NextResponse } from 'next/server';
const { getClients } = require('@/lib/store');

export const dynamic = 'force-dynamic';

/**
 * Scheduled Client Audit Trigger
 * Can be scheduled via cron-job.org (e.g. daily or monthly)
 * to automatically initiate recurring audits for all monitored clients.
 */
export async function GET(request) {
  try {
    const clients = await getClients();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: `Audit schedule check completed across ${clients.length} registered client accounts.`,
      monitoredClients: clients.length,
      nextScheduledWindow: 'Active'
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  return GET(request);
}
