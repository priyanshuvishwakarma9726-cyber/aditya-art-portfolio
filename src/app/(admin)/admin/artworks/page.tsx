import { getDb } from '@/lib/db';
import StoreManagementClient from './StoreManagementClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminArtworksPage() {
    const db = await getDb();

    // Fetch all artworks, regardless of active status, explicitly for admin viewing
    const [rows]: any = await db.query(`
        SELECT a.id, a.title, a.slug, a.price, a.stock_count, a.for_sale, a.is_limited_drop, a.drop_end_time, a.image_url, c.name as category_name
        FROM artworks a
        LEFT JOIN categories c ON a.category_id = c.id
        ORDER BY a.created_at DESC
    `);

    // Fetch total shop items
    const [ordersCountRows]: any = await db.query(`
        SELECT artwork_id, COUNT(*) as sold_count 
        FROM order_items 
        GROUP BY artwork_id
    `);

    // Map sales counts
    const productsWithStats = rows.map((product: any) => {
        const matchingSales = ordersCountRows.find((o: any) => o.artwork_id === product.id);
        return {
            ...product,
            total_sold: matchingSales ? matchingSales.sold_count : 0
        };
    });

    return (
        <div className="w-full space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif dark:text-white">Store & Artworks Management</h1>
                <Link href="/admin/artworks/editor" className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded text-sm uppercase font-bold tracking-widest hover:opacity-80 transition-opacity">
                    + Add New Artwork
                </Link>
            </div>

            <p className="text-neutral-500 mb-8 max-w-3xl">
                Control panel for all gallery and shop instances. Toggle pieces to instantly enable checkout, set specific stock amounts, or activate countdown timed Limited Drops.
            </p>

            <StoreManagementClient initialProducts={productsWithStats} />
        </div>
    );
}
