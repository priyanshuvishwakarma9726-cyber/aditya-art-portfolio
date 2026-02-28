import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminAPI } from '@/lib/auth';
import { sendOrderShippedEmail, sendOrderDeliveredEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const { trackingId, action, courierName, courierTrackingId } = await req.json();

        if (!trackingId || !action) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const db = await getDb();

        // Fetch User details for emails
        const [rows]: any = await db.query(
            `SELECT u.email as customer_email, u.full_name as customer_name 
             FROM orders o 
             LEFT JOIN users u ON o.user_id = u.id 
             WHERE o.tracking_number = ?`,
            [trackingId]
        );
        const customerData = rows[0];

        if (action === 'ship') {
            if (!courierName || !courierTrackingId) {
                return NextResponse.json({ error: 'Courier name and tracking ID are required' }, { status: 400 });
            }

            // Validate state: Cannot ship unless advance is paid
            const [orderRows]: any = await db.query('SELECT payment_phase FROM orders WHERE tracking_number = ?', [trackingId]);
            if (orderRows[0]?.payment_phase === 'advance_pending') {
                return NextResponse.json({ error: 'Cannot ship before advance payment is verified.' }, { status: 400 });
            }

            await db.execute(
                `UPDATE orders 
                 SET status = 'shipped', payment_phase = 'shipped', courier_name = ?, tracking_number = ? 
                 WHERE tracking_number = ?`,
                [courierName, courierTrackingId, trackingId]
            );

            if (customerData?.customer_email) {
                await sendOrderShippedEmail(customerData.customer_email, customerData.customer_name, trackingId, courierName, courierTrackingId);
            }

        } else if (action === 'deliver') {
            await db.execute(
                `UPDATE orders 
                 SET status = 'delivered', payment_phase = 'remaining_pending' 
                 WHERE tracking_number = ?`,
                [trackingId]
            );

            if (customerData?.customer_email) {
                await sendOrderDeliveredEmail(customerData.customer_email, customerData.customer_name, trackingId);
            }
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Order update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
