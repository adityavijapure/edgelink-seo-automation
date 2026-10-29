// src/app/api/clients/route.js
import { NextResponse } from 'next/server';
const { getClients, addClient } = require('@/lib/store');

export async function GET() {
  const clients = await getClients();
  return NextResponse.json({ clients });
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.websiteUrl) {
      return NextResponse.json({ error: 'Name and Website URL are required' }, { status: 400 });
    }
    const client = await addClient(body);
    return NextResponse.json({ client }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
