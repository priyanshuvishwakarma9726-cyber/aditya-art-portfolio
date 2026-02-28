import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { path } = await req.json();

        // Security check
        if (!path || typeof path !== 'string') return NextResponse.json({ error: 'Invalid path' }, { status: 400 });

        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        const userAgent = req.headers.get('user-agent') || 'unknown';

        // Hash IP to maintain user privacy + GDPR compliance
        const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

        const db = await getDb();

        // Prevent duplicate spam hits from the same user on the same path within the last minute
        const [recent]: any = await db.query(
            "SELECT id FROM visitor_logs WHERE ip_hash = ? AND path = ? AND created_at > (NOW() - INTERVAL 1 MINUTE)",
            [ipHash, path]
        );

        if (recent.length > 0) {
            return NextResponse.json({ success: true, message: 'Skipped to prevent spam' });
        }

        await db.execute(
            'INSERT INTO visitor_logs (ip_hash, path, user_agent) VALUES (?, ?, ?)',
            [ipHash, path, userAgent]
        );

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed logging' }, { status: 500 });
    }
}
