import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminAPI } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const { artworks } = await req.json();

        if (!artworks || !Array.isArray(artworks)) {
            return NextResponse.json({ error: 'Artworks array is required' }, { status: 400 });
        }

        const db = await getDb();

        const results = [];

        for (const artwork of artworks) {
            const {
                title,
                slug,
                description,
                category_id,
                price,
                is_commission,
                stock_count,
                width_cm,
                height_cm,
                for_sale,
                is_active,
                image_url,
                before_image_url,
                after_image_url
            } = artwork;

            const id = uuidv4();

            await db.execute(
                `INSERT INTO artworks (
                    id, title, slug, description, category_id, price, 
                    is_commission, stock_count, width_cm, height_cm, 
                    for_sale, is_active, image_url, before_image_url, after_image_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id, title, slug, description, category_id, price,
                    is_commission ? 1 : 0, stock_count, width_cm, height_cm,
                    for_sale ? 1 : 0, is_active ? 1 : 0, image_url,
                    before_image_url || null, after_image_url || null
                ]
            );

            results.push({ id, title, slug });
        }

        return NextResponse.json({ success: true, results });

    } catch (err: any) {
        console.error('Batch artwork creation error:', err);
        return NextResponse.json({ error: 'Failed to create artworks: ' + err.message }, { status: 500 });
    }
}
