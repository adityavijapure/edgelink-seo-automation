// src/app/api/audit/[id]/route.js
import { NextResponse } from 'next/server';
const { getAuditById, getClientById } = require('@/lib/store');
const { runAuditPipeline } = require('@/services/audit-runner');

export async function GET(request, { params }) {
  const { id } = params;
  const audit = await getAuditById(id);
  if (!audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }

  const client = await getClientById(audit.clientId);
  return NextResponse.json({ audit, client });
}

export async function POST(request, { params }) {
  const { id } = params;
  const audit = await getAuditById(id);
  if (!audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }

  // Trigger rerun
  runAuditPipeline(id).catch(err => {
    console.error(`Pipeline re-run failed for audit ${id}:`, err);
  });

  return NextResponse.json({ message: 'Audit re-run triggered', auditId: id });
}
