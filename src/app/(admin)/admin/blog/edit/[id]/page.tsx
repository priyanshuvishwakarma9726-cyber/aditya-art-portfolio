import { getDb } from '@/lib/db';
import BlogEditor from './BlogEditor';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditBlogPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    let initialData = null;

    if (params.id !== 'new') {
        const db = await getDb();
        const [rows]: any = await db.query('SELECT * FROM blog_posts WHERE id = ?', [params.id]);
        if (!rows.length) return notFound();
        initialData = rows[0];
    }

    return (
        <div className="w-full h-full animate-fade-in-up">
            <Link href="/admin/blog" className="flex items-center gap-2 text-neutral-500 hover:text-black dark:hover:text-white uppercase tracking-widest text-xs font-bold mb-6 w-max">
                <ArrowLeft size={14} /> Back to Journal
            </Link>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif dark:text-white">
                    {initialData ? 'Edit Markdown Draft' : 'New Article Draft'}
                </h1>
            </div>

            <BlogEditor initialData={initialData} />
        </div>
    );
}
