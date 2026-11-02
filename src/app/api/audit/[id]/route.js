// src/app/api/audit/[id]/route.js
import { NextResponse } from 'next/server';
const { getAuditById, getClientById } = require('@/lib/store');
const { runAuditPipeline } = require('@/services/audit-runner');

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { id } = params;
  const audit = await getAuditById(id);
  
  if (!audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }

  const client = (await getClientById(audit.clientId)) || {
    id: audit.clientId,
    name: audit.businessType || 'Client',
    city: audit.city || 'Pune',
    phone: audit.recipientPhone || '+91 98200 12345',
    email: audit.recipientEmail || 'rahul@example-dental-clinic.com'
  };

  return NextResponse.json({ audit, client });
}

export async function POST(request, { params }) {
  const { id } = params;
  let audit = await getAuditById(id);
  if (!audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }

  try {
    audit = await runAuditPipeline(id);
  } catch (err) {
    console.error(`Pipeline re-run failed for audit ${id}:`, err);
  }

  return NextResponse.json({ message: 'Audit re-run triggered', auditId: id, audit });
}
