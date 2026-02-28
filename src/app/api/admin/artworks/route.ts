import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminAPI } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
    try {
        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const body = await req.json();
        const { id, action, value, drop_end_time } = body;

        if (!id || !action) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

        const db = await getDb();

        if (action === 'toggleSale') {
            await db.execute('UPDATE artworks SET for_sale = ? WHERE id = ?', [value === true ? 1 : 0, id]);
        } else if (action === 'updateStock') {
            await db.execute('UPDATE artworks SET stock_count = ? WHERE id = ?', [Math.max(0, Number(value)), id]);
        } else if (action === 'toggleDrop') {
            const isDrop = value === true ? 1 : 0;
            // If dropping ends, you may auto null the date, but we'll leave it as history unless changed
            if (isDrop && drop_end_time) {
                // Ensure datetime format matches MySQL expectations for simplicity, though Node MySQL mostly parses ISO okay.
                const mysqlDate = new Date(drop_end_time).toISOString().slice(0, 19).replace('T', ' ');
                await db.execute('UPDATE artworks SET is_limited_drop = ?, drop_end_time = ? WHERE id = ?', [isDrop, mysqlDate, id]);
            } else {
                await db.execute('UPDATE artworks SET is_limited_drop = ? WHERE id = ?', [isDrop, id]);
            }
        } else {
            return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('Artwork Config admin error', err);
        return NextResponse.json({ error: 'Internal server error while patching artwork module.' }, { status: 500 });
    }
}
