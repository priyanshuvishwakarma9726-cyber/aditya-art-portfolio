import { getDb } from '@/lib/db';
import BlogGrid from './BlogGrid';
import { Metadata } from 'next';

export const revalidate = 3600; // ISR 1 Hour

export const metadata: Metadata = {
    title: 'Journal & Stories',
    description: 'Read the latest insights into the creative process, materials, and art appreciation.',
};

export default async function BlogIndexPage() {
    const db = await getDb();

    // Fetch only published posts
    const [rows]: any = await db.query(`
        SELECT b.id, b.title, b.slug, b.excerpt, b.cover_image, b.published_at, c.name as category_name
        FROM blog_posts b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.is_published = TRUE
        ORDER BY b.published_at DESC
    `);

    return (
        <div className="min-h-screen py-20 px-4 max-w-7xl mx-auto animate-fade-in-up">
            <div className="text-center mb-16 border-b dark:border-neutral-800 pb-10">
                <h1 className="text-5xl font-serif text-black dark:text-white mb-4 leading-tight">Studio Journal</h1>
                <p className="text-neutral-500 max-w-lg mx-auto uppercase tracking-widest text-sm text-balance">
                    Thoughts on graphite, commission workflows, and everything in between.
                </p>
            </div>

            <BlogGrid initialPosts={rows} />
        </div>
    );
}
