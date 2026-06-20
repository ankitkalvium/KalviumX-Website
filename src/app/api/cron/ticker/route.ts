import { NextResponse } from 'next/server';
import { runTickerPipeline } from '@/lib/ticker-agent';

export async function GET() {
  const items = await runTickerPipeline();
  return NextResponse.json({ ok: true, count: items.length, items, ts: new Date().toISOString() });
}
