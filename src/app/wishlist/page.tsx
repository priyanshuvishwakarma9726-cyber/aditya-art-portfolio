import { getDb } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import WishlistClient from './WishlistClient';

export default async function WishlistPage() {
    let authArtworks = null;
    let isAuthed = false;

    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            isAuthed = true;
            const db = await getDb();
            const [rows]: any = await db.query(`
                SELECT a.id, a.title, a.slug, a.price, a.stock_count, a.image_url, a.is_limited_drop, a.drop_end_time
                FROM wishlists w
                JOIN artworks a ON w.artwork_id = a.id
                WHERE w.user_id = ? AND a.is_active = TRUE
                ORDER BY w.created_at DESC
            `, [user.id]);
            authArtworks = rows;
        }
    } catch {
        // Fallback to client local storage if DB fails or unauthed
    }

    return (
        <div className="min-h-screen py-20 px-4 max-w-7xl mx-auto">
            <div className="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-8 text-center animate-fade-in-up">
                <h1 className="text-5xl font-serif text-black dark:text-white mb-4">Your Wishlist</h1>
                <p className="text-neutral-500 uppercase tracking-widest text-sm max-w-xl mx-auto">
                    Saved works that caught your eye.
                </p>
            </div>

            <WishlistClient initialData={authArtworks} isAuthed={isAuthed} />
        </div>
    );
}
