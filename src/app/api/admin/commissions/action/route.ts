import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminAPI } from '@/lib/auth';
import { sendCommissionQuote, sendPaymentApprovedEmail, sendPaymentRejectedEmail, sendArtworkCompleted, sendFinalPaymentVerified } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const body = await req.json();
        const { commission_id, action } = body;

        if (!commission_id || !action) {
            return NextResponse.json({ error: 'Missing commission_id or action' }, { status: 400 });
        }

        const db = await getDb();

        // Check if commission exists
        const [rows]: any = await db.query('SELECT * FROM commissions WHERE id = ?', [commission_id]);
        if (rows.length === 0) return NextResponse.json({ error: 'Commission not found' }, { status: 404 });
        const comm = rows[0];

        const buildShippingHtml = (c: any) => {
            if (c.requires_physical_delivery === 1) {
                return `
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #334155; font-size: 14px; text-transform: uppercase;">Delivery Details Confirmed:</h3>
                    <p style="margin: 0; color: #475569; font-family: monospace; font-size: 14px;">
                        ${c.shipping_full_address}<br/>
                        ${c.shipping_city}, ${c.shipping_state}<br/>
                        ${c.shipping_country} - ${c.shipping_pincode}<br/>
                        Phone: ${c.shipping_phone}
                    </p>
                </div>
                `;
            }
            return '';
        };

        if (action === 'send_quote') {
            const { final_total, advance_amount } = body;
            const remaining = Number(final_total) - Number(advance_amount);

            await db.execute(
                `UPDATE commissions 
                 SET final_total_price_inr = ?, 
                     advance_amount_inr = ?, 
                     remaining_amount_inr = ?, 
                     status = 'quoted' 
                 WHERE id = ?`,
                [Number(final_total), Number(advance_amount), remaining, commission_id]
            );

            try {
                await sendCommissionQuote(comm.customer_email, comm.customer_name, comm.tracking_number, final_total, advance_amount, buildShippingHtml(comm));
            } catch (emailErr) {
                console.warn('Failed to send quote email:', emailErr);
            }
        }
        else if (action === 'accept') {
            // If accepting advance
            if (comm.advance_payment_status === 'under_verification') {
                await db.execute(
                    "UPDATE commissions SET advance_payment_status = 'paid', status = 'in_progress' WHERE id = ?",
                    [commission_id]
                );
                await sendPaymentApprovedEmail(comm.customer_email, comm.customer_name, comm.tracking_number);
            } else {
                // Classic direct accept (legacy single payment or force accept)
                await db.execute(
                    "UPDATE commissions SET payment_status = 'paid', status = 'in_progress' WHERE id = ?",
                    [commission_id]
                );
            }
        }
        else if (action === 'reject') {
            await db.execute(
                "UPDATE commissions SET status = 'cancelled' WHERE id = ?",
                [commission_id]
            );
            await sendPaymentRejectedEmail(comm.customer_email, comm.customer_name, comm.tracking_number, "Rejected by administration.");
        }
        else if (action === 'complete') {
            await db.execute(
                "UPDATE commissions SET status = 'completed', final_payment_status = 'pending' WHERE id = ?",
                [commission_id]
            );
            await sendArtworkCompleted(comm.customer_email, comm.customer_name, comm.tracking_number, comm.remaining_amount_inr.toString(), buildShippingHtml(comm));
        }
        else if (action === 'accept_final') {
            await db.execute(
                "UPDATE commissions SET final_payment_status = 'paid', status = 'closed', payment_status = 'paid' WHERE id = ?",
                [commission_id]
            );
            await sendFinalPaymentVerified(comm.customer_email, comm.customer_name, comm.tracking_number);
        }
        else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error('Commission Action Error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
