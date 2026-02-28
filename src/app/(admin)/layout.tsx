import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';
import { Settings, LayoutDashboard, ShoppingCart, PaintBucket, BadgeIndianRupee, Settings2, LineChart } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdmin();

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-white dark:bg-black border-r dark:border-neutral-800 p-6 flex flex-col">
                <h2 className="text-xl font-serif font-bold mb-10 dark:text-white">Admin Panel</h2>
                <nav className="flex flex-col gap-4 text-sm font-medium">
                    <Link href="/admin" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link href="/admin/analytics" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                        <LineChart size={18} /> Analytics & Growth
                    </Link>
                    <Link href="/admin/artworks" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                        <PaintBucket size={18} /> Store Content
                    </Link>
                    <Link href="/admin/blog" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                        <BadgeIndianRupee size={18} /> Journal Editor
                    </Link>
                    <Link href="/admin/faqs" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                        <Settings2 size={18} /> AI Assistant
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                        <ShoppingCart size={18} /> Store Orders
                    </Link>
                    <Link href="/admin/commissions" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                        <PaintBucket size={18} /> Commissions
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors mt-auto">
                        <Settings size={18} /> Settings
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
