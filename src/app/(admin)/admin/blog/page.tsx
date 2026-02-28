import { getDb } from '@/lib/db';
import BlogAdminClient from './BlogAdminClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
    const db = await getDb();

    // Fetch all posts including drafts
    const [rows]: any = await db.query(`
        SELECT id, title, slug, is_published, published_at, created_at, cover_image
        FROM blog_posts
        ORDER BY created_at DESC
    `);

    return (
        <div className="w-full space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif dark:text-white">Journal & Blog Management</h1>
                <Link href="/admin/blog/edit/new" className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded text-sm uppercase font-bold tracking-widest hover:opacity-80">
                    + Draft New Article
                </Link>
            </div>

            <p className="text-neutral-500 mb-8 max-w-3xl">
                The content management core for SEO articles and Studio updates. Build markdown posts, manage metadata, and control publishing queues seamlessly.
            </p>

            <BlogAdminClient initialPosts={rows} />
        </div>
    );
}
