import { NextResponse } from 'next/server';
import { runTickerPipeline, STATIC_FALLBACK } from '@/lib/ticker-agent';

export const revalidate = 3600;

export async function GET() {
  try {
    const items = await runTickerPipeline();
    return NextResponse.json({ items, source: 'live', ts: Date.now() });
  } catch {
    return NextResponse.json({ items: STATIC_FALLBACK, source: 'fallback', ts: Date.now() });
  }
}
