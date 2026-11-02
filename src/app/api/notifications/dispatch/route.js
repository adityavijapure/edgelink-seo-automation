// src/app/api/notifications/dispatch/route.js
import { NextResponse } from 'next/server';
const { getAuditById, updateAudit } = require('@/lib/store');
const { notifyAuditCompletion } = require('@/services/notification');

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { auditId, phone, email, channel = 'both' } = body;

    if (!auditId) {
      return NextResponse.json({ error: 'auditId is required' }, { status: 400 });
    }

    const audit = await getAuditById(auditId);
    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    const targetPhone = phone || audit.recipientPhone || '+91 86240 86811';
    const targetEmail = email || audit.recipientEmail || 'rahul@example-dental-clinic.com';
    const pdfPath = audit.pdfPath || `/reports/${auditId}.pdf`;
    const score = audit.overallScore || 70;

    const notif = await notifyAuditCompletion(
      audit.clientId || 'Client',
      pdfPath,
      score,
      targetPhone,
      targetEmail
    );

    // Append to audit logs if audit exists
    const time = new Date().toLocaleTimeString();
    const updatedLogs = [
      ...(audit.logs || []),
      { time, text: `[ON-DEMAND DISPATCH] → WhatsApp: ${notif.recipientPhone} | Email: ${notif.recipientEmail}` }
    ];

    await updateAudit(auditId, {
      recipientPhone: notif.recipientPhone,
      recipientEmail: notif.recipientEmail,
      whatsappShareUrl: notif.whatsappShareUrl,
      logs: updatedLogs
    });

    return NextResponse.json({
      success: true,
      message: 'Audit report notification dispatched successfully',
      recipientPhone: notif.recipientPhone,
      recipientEmail: notif.recipientEmail,
      whatsappShareUrl: notif.whatsappShareUrl,
      mailtoUrl: notif.mailtoUrl,
      pdfUrl: notif.pdfUrl,
      isLive: notif.isLive
    });
  } catch (err) {
    console.error('[Notification Dispatch API Error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

