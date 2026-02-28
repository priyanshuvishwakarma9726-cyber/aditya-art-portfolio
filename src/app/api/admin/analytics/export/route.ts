import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminAPI } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const db = await getDb();

        const [orders]: any = await db.query("SELECT * FROM orders");
        const [commissions]: any = await db.query("SELECT * FROM commissions");
        const [visitors]: any = await db.query("SELECT * FROM visitor_logs");
        const [subscribers]: any = await db.query("SELECT * FROM newsletter_subscribers");

        const data = {
            export_date: new Date().toISOString(),
            metrics: {
                total_orders: orders.length,
                total_commissions: commissions.length,
                total_visitors: visitors.length,
                total_subscribers: subscribers.length
            },
            orders,
            commissions,
            visitors,
            subscribers
        };

        return new NextResponse(JSON.stringify(data, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': 'attachment; filename="studio_analytics_export.json"'
            }
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
