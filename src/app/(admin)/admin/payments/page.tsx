import React from 'react';
import { getDb } from '@/lib/db';
import PaymentActions from './PaymentActions';

export default async function AdminPaymentsPage() {
    const db = await getDb();

    // Fetch Commissions pending verification
    const [cRows]: any = await db.query(`
        SELECT id, tracking_number, customer_name, calculated_price as amount, screenshot_path, created_at, 'commission' as type 
        FROM commissions 
        WHERE payment_status = 'pending_verification'
        ORDER BY created_at ASC
    `);

    // Fetch Orders pending verification
    const [oRows]: any = await db.query(`
        SELECT o.id, o.tracking_number, u.full_name as customer_name, o.total_amount as amount, o.screenshot_path, o.created_at, 'order' as type 
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE payment_status = 'pending_verification'
        ORDER BY created_at ASC
    `);

    const allPayments = [...cRows, ...oRows].sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return (
        <div className="p-8">
            <h1 className="text-3xl font-serif mb-8 text-neutral-900 dark:text-white">Verify Payments</h1>
            <p className="text-neutral-500 mb-8 max-w-2xl">
                Review the screenshot proofs uploaded by customers for their UPI transactions. If the transaction ID (UTR) and amount perfectly match your bank statement, securely approve the payment here. If there are discrepancies, you can reject it with a reason.
            </p>

            {/* Client Component for Interactions */}
            <PaymentActions payments={allPayments} />
        </div>
    );
}
