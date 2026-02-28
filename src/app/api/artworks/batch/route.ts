import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const ids = url.searchParams.get('ids');

        if (!ids) {
            return NextResponse.json([]);
        }

        const idArray = ids.split(',').slice(0, 50); // limit to 50 max to prevent abuse
        if (idArray.length === 0) return NextResponse.json([]);

        // Build bound parameters dynamically
        const placeholders = idArray.map(() => '?').join(',');
        const query = `
            SELECT id, title, slug, price, stock_count, image_url, is_limited_drop, drop_end_time 
            FROM artworks WHERE id IN (${placeholders}) AND is_active = TRUE
        `;

        const db = await getDb();
        const [rows]: any = await db.query(query, idArray);

        return NextResponse.json(rows);
    } catch (err: any) {
        return NextResponse.json({ error: 'Failed to fetch batch artworks' }, { status: 500 });
    }
}
