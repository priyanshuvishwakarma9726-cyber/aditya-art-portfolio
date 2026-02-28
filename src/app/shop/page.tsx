import { getDb } from '@/lib/db';
import ShopGrid from './ShopGrid';

export const revalidate = 60; // ISR per minute

export default async function ShopPage() {
    const db = await getDb();

    // Fetch artworks marked for sale
    const [rows]: any = await db.query(`
        SELECT a.id, a.title, a.slug, a.price, a.stock_count, a.image_url, a.is_limited_drop, a.drop_end_time, c.name as category_name
        FROM artworks a
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.for_sale = TRUE AND a.is_active = TRUE
        ORDER BY a.created_at DESC
    `);

    return (
        <div className="min-h-screen py-20 px-4 max-w-7xl mx-auto">
            <div className="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-8 text-center animate-fade-in-up">
                <h1 className="text-5xl font-serif text-black dark:text-white mb-4">The Studio Shop</h1>
                <p className="text-neutral-500 uppercase tracking-widest text-sm max-w-xl mx-auto">
                    Limited Original Pieces, Certified Prints, and Exclusive Drops.
                </p>
            </div>

            <ShopGrid initialProducts={rows} />
        </div>
    );
}
