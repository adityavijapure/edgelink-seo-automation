// src/app/reports/[id]/route.js
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const rawId = params.id || '';
  const cleanId = rawId.replace(/\.pdf$/i, '');
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const targetUrl = new URL(`/api/reports/${cleanId}/pdf`, request.url || baseUrl);
  
  return NextResponse.redirect(targetUrl, 307);
}

