import { getDb } from '@/lib/db';
import { Package } from 'lucide-react';
import OrdersClient from './OrdersClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const db = await getDb();

    const [orders]: any = await db.query(`
    SELECT o.*, u.full_name as user_name 
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    ORDER BY o.created_at DESC
  `);

    return (
        <div className="w-full animate-fade-in-up">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-serif dark:text-white mb-2">Store Management</h1>
                    <p className="text-neutral-500 text-sm tracking-wide">Manage product fulfillment and 50/50 payment lifecycles.</p>
                </div>
            </div>

            <OrdersClient orders={orders} />
        </div>
    );
}
