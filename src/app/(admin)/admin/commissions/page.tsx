import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import CommissionClient from './CommissionClient';

export const dynamic = 'force-dynamic';

export default async function AdminCommissionsPage() {
    await requireAdmin();
    const db = await getDb();

    // Include 'pending' (needs quote) and 'quoted' (needs advance payment verification)
    const [commissions]: any = await db.query(
        "SELECT * FROM commissions WHERE LOWER(status) IN ('pending', 'quoted') ORDER BY created_at ASC"
    );

    return (
        <div className="w-full animate-fade-in-up space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-serif dark:text-white mb-2">Commission Requests</h1>
                    <p className="text-neutral-500 text-sm italic">New requests requiring payment verification or approval.</p>
                </div>
                <div className="flex gap-4">
                    <a href="/admin/active-work" className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
                        View Active Work
                    </a>
                </div>
            </div>

            <CommissionClient initialCommissions={commissions} />
        </div>
    );
}
