import { NextResponse } from 'next/server';
import { runTickerPipeline } from '@/lib/ticker-agent';

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = await runTickerPipeline();
  return NextResponse.json({ ok: true, count: items.length, items, ts: new Date().toISOString() });
}
