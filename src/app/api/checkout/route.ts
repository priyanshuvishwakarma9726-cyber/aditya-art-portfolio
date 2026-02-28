import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { razorpayInstance } from '@/lib/razorpay';
import { v4 as uuidv4 } from 'uuid';
import { sendAdminNotification } from '@/lib/email';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { items, address } = data; // Items expected: [{artworkId, qty}]

        if (!items || items.length === 0) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

        const db = await getDb();
        const cookieStore = await cookies();
        const guestSession = cookieStore.get('guest_session_id')?.value;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || null;

        // Verify each item's stock and calculate pure backend total amount
        let totalAmount = 0;
        const validatedItems = [];

        for (const item of items) {
            const [artworks]: any = await db.query('SELECT stock_count, price, title, is_limited_drop, drop_end_time FROM artworks WHERE id = ? FOR UPDATE', [item.artworkId]);
            const art = artworks[0];
            if (!art) throw new Error('Artwork Not Found');
            if (art.stock_count < item.qty) throw new Error(`Not enough stock for ${art.title}`);

            if (art.is_limited_drop && art.drop_end_time) {
                const expired = new Date(art.drop_end_time).getTime() <= Date.now();
                if (expired) throw new Error(`The drop window for ${art.title} has ended. Cannot fulfill order.`);
            }

            totalAmount += parseFloat(art.price) * item.qty;
            validatedItems.push({ ...item, priceAtPurchase: art.price });
        }

        // Apply Coupon if provided
        let discount = 0;
        if (data.couponCode === 'ART2026') {
            discount = totalAmount * 0.1;
            totalAmount -= discount;
        }

        const trackingId = `AW-${uuidv4().substring(0, 8).toUpperCase()}`;
        const orderId = uuidv4();
        const advanceAmount = totalAmount / 2;
        const remainingAmount = totalAmount - advanceAmount;

        // Insert Order Base
        await db.execute(
            `INSERT INTO orders (id, user_id, status, payment_status, total_amount, discount_amount, advance_amount_inr, remaining_amount_inr, payment_phase, tracking_number, shipping_address, order_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [orderId, userId, 'pending', 'pending', totalAmount, discount, advanceAmount, remainingAmount, 'advance_pending', trackingId, address, 'store']
        );

        // Insert Order Items and Drop Stock
        for (const vItem of validatedItems) {
            await db.execute(
                'INSERT INTO order_items (order_id, artwork_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                [orderId, vItem.artworkId, vItem.qty, vItem.priceAtPurchase]
            );
            await db.execute(
                'UPDATE artworks SET stock_count = stock_count - ? WHERE id = ?',
                [vItem.qty, vItem.artworkId]
            );
        }

        // Optionally clean the session cart
        if (guestSession) {
            await db.execute('DELETE FROM session_carts WHERE session_id = ?', [guestSession]);
        }

        sendAdminNotification('New Store Order Placed', `Order Tracker: ${trackingId}\nTotal: ₹${totalAmount}\nCustomer: ${user?.email || 'Guest'}`);

        return NextResponse.json({
            trackingId,
            amount: totalAmount
        });

    } catch (err: any) {
        console.error('Checkout error:', err);
        return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
    }
}
