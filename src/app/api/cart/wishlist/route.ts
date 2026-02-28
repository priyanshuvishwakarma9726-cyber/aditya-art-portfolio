import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Guest' }, { status: 401 }); // Silent fail for guests

        const { artworkId } = await req.json();
        if (!artworkId) return NextResponse.json({ error: 'Missing artwork' }, { status: 400 });

        const db = await getDb();
        await db.execute(
            'INSERT IGNORE INTO wishlists (user_id, artwork_id) VALUES (?, ?)',
            [user.id, artworkId]
        );

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: 'Wishlist sync failed' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Guest' }, { status: 401 });

        const url = new URL(req.url);
        const artworkId = url.searchParams.get('id');
        if (!artworkId) return NextResponse.json({ error: 'Missing target' }, { status: 400 });

        const db = await getDb();
        await db.execute(
            'DELETE FROM wishlists WHERE user_id = ? AND artwork_id = ?',
            [user.id, artworkId]
        );

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: 'Wishlist sync failed' }, { status: 500 });
    }
}
