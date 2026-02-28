import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sendNewsletterWelcomeEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
    try {
        // Simple rate limiting
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        if (!rateLimit(req as any, 3, 60000)) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        const { email } = await req.json();

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
        }

        const db = await getDb();

        // Prevent enumerations with silent success on duplicate
        const [existing]: any = await db.query('SELECT id FROM newsletter_subscribers WHERE email = ?', [email]);
        if (existing.length > 0) {
            return NextResponse.json({ success: true });
        }

        await db.execute('INSERT INTO newsletter_subscribers (email) VALUES (?)', [email]);

        // Fire and forget welcome logic
        sendNewsletterWelcomeEmail(email).catch(console.error);

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
