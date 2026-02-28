import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import ActiveWorkClient from './ActiveWorkClient';

export const dynamic = 'force-dynamic';

export default async function ActiveWorkPage() {
    await requireAdmin();
    const db = await getDb();

    // Fetch orders that are in creation (in_progress) or ready for final balance (completed)
    const [activeWork]: any = await db.query(
        "SELECT * FROM commissions WHERE LOWER(status) IN ('in_progress', 'completed') ORDER BY created_at ASC"
    );

    return (
        <div className="w-full animate-fade-in-up space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif dark:text-white mb-2">Workspace (Active Work)</h1>
                    <p className="text-neutral-500 text-sm">Commissions that are paid and currently being processed.</p>
                </div>
                <div className="flex gap-4">
                    <a href="/admin/commissions" className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white rounded-lg text-sm font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
                        Pending Requests
                    </a>
                </div>
            </div>

            <ActiveWorkClient initialWork={activeWork} />

            <div className="pt-10 border-t dark:border-neutral-800">
                <p className="text-xs text-neutral-500 uppercase tracking-widest text-center font-bold font-mono">
                    Aditya Art Portfolio • Workflow Management System
                </p>
            </div>
        </div>
    );
}
