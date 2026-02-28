import { getDb } from '@/lib/db';
import { DownloadCloud, TrendingUp, Users, ShoppingBag, Eye } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AnalyticsDashboard() {
    const db = await getDb();

    // Key Performance Indicators
    const [[{ total_store_sales }]]: any = await db.query("SELECT COALESCE(SUM(CASE WHEN LOWER(payment_status) = 'paid' THEN total_amount ELSE 0 END), 0) as total_store_sales FROM orders");
    const [[{ total_comm_sales }]]: any = await db.query("SELECT COALESCE(SUM(CASE WHEN LOWER(payment_status) = 'paid' THEN COALESCE(final_price_inr, calculated_price) ELSE 0 END), 0) as total_comm_sales FROM commissions WHERE LOWER(payment_status) != 'rejected'");
    const [[{ order_count }]]: any = await db.query("SELECT COUNT(*) as order_count FROM orders");
    const [[{ sub_count }]]: any = await db.query("SELECT COUNT(*) as sub_count FROM newsletter_subscribers WHERE is_active = TRUE");

    // Most Sold Artwork Array mapping
    const [topArt]: any = await db.query(
        "SELECT a.title, SUM(oi.quantity) as total_sold FROM order_items oi JOIN artworks a ON oi.artwork_id = a.id GROUP BY oi.artwork_id ORDER BY total_sold DESC LIMIT 5"
    );

    // Visitor Tracking / Last 7 Days grouped by Date
    const [visitors]: any = await db.query(
        "SELECT DATE(created_at) as visit_date, COUNT(*) as daily_visitors FROM visitor_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY visit_date ORDER BY visit_date ASC"
    );

    // Top Blogs Array mapping 
    // Usually Pageviews exist in analytics. Since we log paths, let's group visitor logs by path where it matches '/blog/%'
    const [topBlogs]: any = await db.query(
        "SELECT path, COUNT(*) as views FROM visitor_logs WHERE path LIKE '/blog/%' GROUP BY path ORDER BY views DESC LIMIT 3"
    );

    const totalRevenue = Number(total_store_sales) + Number(total_comm_sales);

    // Dynamic Chart Computation
    const maxVisitorValue = Math.max(...visitors.map((v: any) => v.daily_visitors), 10);

    return (
        <div className="w-full space-y-10 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b dark:border-neutral-800 pb-6">
                <div>
                    <h1 className="text-3xl font-serif dark:text-white">Analytics & Growth</h1>
                    <p className="text-neutral-500 mt-2 text-sm font-bold uppercase tracking-widest">Real-time studio metrics</p>
                </div>
                <a href="/api/admin/analytics/export" target="_blank" className="inline-flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-6 py-3 font-bold uppercase tracking-widest text-xs hover:opacity-80 transition rounded">
                    <DownloadCloud size={16} /> Export JSON
                </a>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 text-neutral-500 mb-4">
                        <TrendingUp size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Total Revenue</span>
                    </div>
                    <div className="text-3xl font-serif dark:text-white mb-1">₹{totalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-neutral-400">Store + Commissions</div>
                </div>

                <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 text-neutral-500 mb-4">
                        <ShoppingBag size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Total Orders</span>
                    </div>
                    <div className="text-3xl font-serif dark:text-white mb-1">{order_count}</div>
                    <div className="text-xs text-neutral-400">All Time</div>
                </div>

                <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 text-neutral-500 mb-4">
                        <Users size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Subscribers</span>
                    </div>
                    <div className="text-3xl font-serif dark:text-white mb-1">{sub_count}</div>
                    <div className="text-xs text-green-500 flex gap-1 items-center font-bold tracking-widest">
                        + Active Mailing List
                    </div>
                </div>
            </div>

            {/* Charts & Lists Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 7-Day Traffic Minimal Native Bar Chart */}
                <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-8 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 text-neutral-500 mb-8 border-b dark:border-neutral-800 pb-4">
                        <Eye size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Unique 7-Day Traffic</span>
                    </div>
                    <div className="h-48 flex items-end gap-2 justify-between mt-6">
                        {visitors.length === 0 ? (
                            <div className="w-full text-center text-neutral-500 text-sm italic">Not enough visual tracking data yet.</div>
                        ) : (
                            visitors.map((v: any, idx: number) => {
                                const heightPercentage = (Number(v.daily_visitors) / maxVisitorValue) * 100;
                                const dateStr = new Date(v.visit_date).toLocaleDateString(undefined, { weekday: 'short' });
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-2 group relative">
                                        <div className="absolute -top-8 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">
                                            {v.daily_visitors} Hits
                                        </div>
                                        <div
                                            className="w-full bg-neutral-200 dark:bg-neutral-800 group-hover:bg-neutral-400 dark:group-hover:bg-neutral-600 transition-colors rounded-t-sm"
                                            style={{ height: `${Math.max(heightPercentage, 2)}%` }}
                                        />
                                        <div className="text-[10px] font-mono text-neutral-500 uppercase">{dateStr}</div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Top Products */}
                    <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6 border-b dark:border-neutral-800 pb-4">Top Sold Artworks</h3>
                        {topArt.length === 0 ? <p className="text-sm text-neutral-500">No original sales registered.</p> : (
                            <ul className="space-y-4">
                                {topArt.map((art: any, i: number) => (
                                    <li key={i} className="flex justify-between items-center text-sm font-medium text-black dark:text-white">
                                        <span>{i + 1}. {art.title}</span>
                                        <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-xs">
                                            Sold x{Number(art.total_sold)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Top Blog Views */}
                    <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6 border-b dark:border-neutral-800 pb-4">Trending Journal Posts</h3>
                        {topBlogs.length === 0 ? <p className="text-sm text-neutral-500">No log data mapped yet.</p> : (
                            <ul className="space-y-4">
                                {topBlogs.map((b: any, i: number) => (
                                    <li key={i} className="flex justify-between items-center text-sm font-medium text-black dark:text-white">
                                        <Link href={b.path} target="_blank" className="hover:underline">{b.path.replace('/blog/', '')}</Link>
                                        <span className="text-neutral-500 text-xs">{Number(b.views)} pageviews</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
