import { getDb } from '@/lib/db';
import { ArtworkGrid } from '@/components/artworks/ArtworkGrid';

export const revalidate = 3600; // 1 hr ISR
export const metadata = {
    title: 'Gallery | Aditya Art Studio',
    description: 'Explore the complete portfolio of hyper-realistic pencil and charcoal artworks by Aditya.'
};

export default async function GalleryPage() {
    const db = await getDb();

    // Fetch all published artworks
    const [artworks]: any = await db.query(
        'SELECT a.*, c.name as category_name FROM artworks a LEFT JOIN categories c ON a.category_id = c.id WHERE a.is_active = TRUE ORDER BY a.created_at DESC'
    );

    // Fetch distinct categories
    const [categories]: any = await db.query('SELECT * FROM categories ORDER BY name ASC');

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-32 md:py-40">
            <div className="max-w-7xl mx-auto w-full">
                <div className="text-center mb-16 md:mb-24 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-serif dark:text-white tracking-tight mb-6">The Gallery</h1>
                    <p className="max-w-2xl mx-auto text-neutral-500 dark:text-neutral-400 font-light tracking-wide md:text-lg">
                        A curated archive of past commissions, personal studies, and hyper-realistic original artworks crafted carefully with graphite and charcoal.
                    </p>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <ArtworkGrid initialArtworks={artworks} categories={categories} />
                </div>
            </div>
        </div>
    );
}
