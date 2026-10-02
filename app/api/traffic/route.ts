import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { logTraffic, getTrafficStats } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const stats = await getTrafficStats();
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, referrer } = body;
    if (!path) return NextResponse.json({ error: 'Path required' }, { status: 400 });

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const ua = req.headers.get('user-agent') || '';
    const ipHash = crypto.createHash('md5').update(ip).digest('hex').slice(0, 10);

    let device: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    if (/tablet|ipad/i.test(ua)) {
      device = 'tablet';
    } else if (/mobile|android|iphone/i.test(ua)) {
      device = 'mobile';
    }

    await logTraffic({
      path,
      ip_hash: ipHash,
      user_agent: ua.slice(0, 200),
      device,
      referrer: referrer || req.headers.get('referer') || 'Direct',
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
