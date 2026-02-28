import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const guestSession = cookieStore.get('guest_session_id')?.value;
        if (!guestSession) return NextResponse.json({ items: [] });

        const db = await getDb();
        const [rows]: any = await db.query('SELECT cart_data FROM session_carts WHERE session_id = ?', [guestSession]);

        if (rows.length === 0) return NextResponse.json({ items: [] });

        return NextResponse.json({ items: rows[0].cart_data || [] });
    } catch (err) {
        return NextResponse.json({ error: 'Failed retrieving cart' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { artworkId, qty } = data;
        const cookieStore = await cookies();
        const guestSession = cookieStore.get('guest_session_id')?.value;
        if (!guestSession) return NextResponse.json({ error: 'No session' }, { status: 400 });

        const db = await getDb();

        // Stock Check Logic
        const [artworks]: any = await db.query('SELECT stock_count, id FROM artworks WHERE id = ? FOR UPDATE', [artworkId]);
        if (artworks.length === 0 || artworks[0].stock_count < qty) {
            return NextResponse.json({ error: 'Out of stock or invalid art' }, { status: 400 });
        }

        // Load current cart array
        let cartItems: any[] = [];
        const [rows]: any = await db.query('SELECT cart_data FROM session_carts WHERE session_id = ?', [guestSession]);
        if (rows.length > 0) cartItems = rows[0].cart_data || [];

        // Update Logic
        const existingIndex = cartItems.findIndex(i => i.artworkId === artworkId);
        if (existingIndex > -1) {
            cartItems[existingIndex].qty += qty;
        } else {
            cartItems.push({ artworkId, qty });
        }

        // Upsert into DB
        if (rows.length === 0) {
            await db.execute('INSERT INTO session_carts (session_id, cart_data) VALUES (?, ?)', [guestSession, JSON.stringify(cartItems)]);
        } else {
            await db.execute('UPDATE session_carts SET cart_data = ? WHERE session_id = ?', [JSON.stringify(cartItems), guestSession]);
        }

        return NextResponse.json({ items: cartItems });
    } catch (err) {
        return NextResponse.json({ error: 'Failed updating cart' }, { status: 500 });
    }
}
