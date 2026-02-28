import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { sendPaymentApprovedEmail, sendPaymentRejectedEmail } from '@/lib/email';
import { requireAdminAPI } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        // Enforce tight rate limiting on Admin Actions (Max 10 per minute per IP)
        if (!rateLimit(req, 10)) {
            return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
        }

        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const body = await req.json();
        const { trackingId, action, type, reason } = body;

        if (!trackingId || !action || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await getDb();
        const tableName = type === 'commission' ? 'commissions' : 'orders';

        // Fetch User details
        let customerData;
        if (type === 'commission') {
            const [rows]: any = await db.query('SELECT customer_email, customer_name FROM commissions WHERE tracking_number = ?', [trackingId]);
            customerData = rows[0];
        } else {
            const [rows]: any = await db.query(
                `SELECT u.email as customer_email, u.full_name as customer_name 
                 FROM orders o 
                 LEFT JOIN users u ON o.user_id = u.id 
                 WHERE o.tracking_number = ?`,
                [trackingId]
            );
            customerData = rows[0];
        }

        if (!customerData) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (action === 'approve') {
            const orderStatusCol = type === 'commission' ? 'status' : 'status';
            const inProgressVal = type === 'commission' ? 'in_progress' : 'processing';

            if (type === 'order') {
                const [orderRows]: any = await db.query('SELECT payment_phase FROM orders WHERE tracking_number = ?', [trackingId]);
                const phase = orderRows[0]?.payment_phase;

                if (phase === 'advance_pending') {
                    await db.execute(
                        `UPDATE orders SET payment_status = 'paid', payment_phase = 'advance_paid', status = 'processing' WHERE tracking_number = ?`,
                        [trackingId]
                    );
                } else if (phase === 'remaining_pending') {
                    await db.execute(
                        `UPDATE orders SET payment_status = 'paid', payment_phase = 'completed', status = 'delivered' WHERE tracking_number = ?`,
                        [trackingId]
                    );
                } else {
                    await db.execute(
                        `UPDATE orders SET payment_status = 'paid', status = 'processing' WHERE tracking_number = ?`,
                        [trackingId]
                    );
                }
            } else {
                await db.execute(
                    `UPDATE ${tableName} SET payment_status = 'paid', ${orderStatusCol} = ? WHERE tracking_number = ?`,
                    [inProgressVal, trackingId]
                );
            }

            // Send Email
            if (customerData?.customer_email) {
                await sendPaymentApprovedEmail(customerData.customer_email, customerData.customer_name, trackingId);
            }
        }
        else if (action === 'reject') {
            await db.execute(
                `UPDATE ${tableName} 
                 SET payment_status = 'rejected' 
                 WHERE tracking_number = ?`,
                [trackingId]
            );

            // Send Email
            if (customerData?.customer_email) {
                await sendPaymentRejectedEmail(customerData.customer_email, customerData.customer_name, trackingId, reason);
            }
        } else {
            return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: `Payment ${action}d properly.` });

    } catch (error: any) {
        console.error('Admin config API error', error);
        return NextResponse.json({ error: 'Failed to complete admin action' }, { status: 500 });
    }
}
