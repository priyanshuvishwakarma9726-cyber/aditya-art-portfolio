import { getDb } from '@/lib/db';
import { Package, ArrowUpRight, TrendingUp, Clock, CreditCard, Layout } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const db = await getDb();

    // 1. REVENUE CALCULATION (Including Advance + Remaining from paid commissions)
    const [orderRev]: any = await db.query("SELECT SUM(total_amount) as rev FROM orders WHERE payment_status = 'paid'");
    const [commRev]: any = await db.query(`
        SELECT SUM(advance_amount_inr) as adv, SUM(CASE WHEN final_payment_status = 'paid' THEN remaining_amount_inr ELSE 0 END) as rem 
        FROM commissions 
        WHERE advance_payment_status = 'paid' OR payment_status = 'paid'
    `);

    const totalRevenue = (Number(orderRev[0]?.rev) || 0) + (Number(commRev[0]?.adv) || 0) + (Number(commRev[0]?.rem) || 0);

    // 2. DASHBOARD COUNTS (Rule 8)
    const [[{ pending_quotes }]]: any = await db.query("SELECT COUNT(*) as count FROM commissions WHERE status = 'pending'");
    const [[{ advance_pending }]]: any = await db.query("SELECT COUNT(*) as count FROM commissions WHERE status = 'quoted' AND advance_payment_status != 'paid'");
    const [[{ in_progress }]]: any = await db.query("SELECT COUNT(*) as count FROM commissions WHERE status = 'in_progress'");
    const [[{ final_pending }]]: any = await db.query("SELECT COUNT(*) as count FROM commissions WHERE status = 'completed' AND final_payment_status != 'paid'");
    const [[{ completed_orders }]]: any = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'delivered'");

    return (
        <div className="w-full space-y-10 animate-fade-in-up">
            <div className="flex justify-between items-center bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-8 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-4xl font-serif dark:text-white mb-2">Portfolio Cockpit</h1>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.3em]">Master Business Control • Real-time</p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-1 block">Total Profit Loop</span>
                    <span className="text-4xl font-serif dark:text-white font-bold">₹{totalRevenue.toLocaleString()}</span>
                </div>
            </div>

            {/* Dashboard Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                    { label: 'Pending Quotes', count: pending_quotes, link: '/admin/commissions', color: 'text-yellow-500', icon: <Clock size={16} /> },
                    { label: 'Advance Due', count: advance_pending, link: '/admin/commissions', color: 'text-indigo-500', icon: <CreditCard size={16} /> },
                    { label: 'In Progress', count: in_progress, link: '/admin/active-work', color: 'text-blue-500', icon: <TrendingUp size={16} /> },
                    { label: 'Final Payment', count: final_pending, link: '/admin/active-work', color: 'text-purple-500', icon: <Layout size={16} /> },
                    { label: 'Store Delivered', count: completed_orders, link: '/admin/orders', color: 'text-emerald-500', icon: <Package size={16} /> },
                ].map((stat, i) => (
                    <Link key={i} href={stat.link} className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-6 rounded-2xl hover:scale-[1.02] transition group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-neutral-50 dark:bg-black border dark:border-neutral-800 ${stat.color} group-hover:scale-110 transition`}>
                                {stat.icon}
                            </div>
                            <ArrowUpRight size={14} className="text-neutral-300 group-hover:text-black dark:group-hover:text-white" />
                        </div>
                        <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-serif font-bold dark:text-white tracking-tight">{stat.count}</p>
                    </Link>
                ))}
            </div>

            {/* Visual Call to Action Section */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-black text-white p-10 rounded-2xl flex flex-col justify-between h-64 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-serif mb-4 italic text-neutral-300">"Every portrait tells a story, <br /> every quote builds a legacy."</h3>
                        <p className="text-neutral-400 text-xs uppercase tracking-widest font-bold font-mono">Aditya • Studio Guidelines</p>
                    </div>
                    <Link href="/admin/artworks" className="relative z-10 w-max bg-white text-black px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition flex items-center gap-2">
                        Manage Portfolio <ArrowUpRight size={14} />
                    </Link>
                </div>

                <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-8 rounded-2xl flex flex-col justify-center gap-4">
                    <div className="flex items-center gap-4 text-neutral-400 mb-2">
                        <Layout size={20} /> <span className="text-[10px] font-bold uppercase tracking-widest">Workspace Insights</span>
                    </div>
                    <p className="text-sm text-neutral-500 leading-relaxed italic">
                        The multi-stage system ensures financial security for every commission. Remind clients to check their emails once you send a custom quote from the commissions panel.
                    </p>
                    <div className="pt-4 border-t dark:border-neutral-800 flex gap-4">
                        <Link href="/admin/analytics" className="text-xs font-bold uppercase text-blue-500 hover:underline">Deep Growth Analytics</Link>
                        <Link href="/admin/settings" className="text-xs font-bold uppercase text-neutral-500 hover:underline">Studio Settings</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
