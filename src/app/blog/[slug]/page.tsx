import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import Newsletter from '@/components/blog/Newsletter';
import { format } from 'date-fns';
import Link from 'next/link';

export const revalidate = 3600; // ISR

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const db = await getDb();
    const [rows]: any = await db.query('SELECT title, excerpt, seo_title, seo_description, cover_image FROM blog_posts WHERE slug = ? AND is_published = TRUE', [params.slug]);

    if (!rows.length) return { title: 'Not Found' };
    const post = rows[0];

    return {
        title: post.seo_title || `${post.title} | Aditya Art Blog`,
        description: post.seo_description || post.excerpt,
        openGraph: {
            title: post.seo_title || post.title,
            description: post.seo_description || post.excerpt,
            type: 'article',
            images: post.cover_image ? [{ url: post.cover_image }] : [],
        }
    };
}

// Function to estimate reading time
function estimateReadingTime(text: string) {
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const db = await getDb();

    // Fetch Post
    const [rows]: any = await db.query(`
        SELECT b.*, c.name as category_name
        FROM blog_posts b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.slug = ? AND b.is_published = TRUE
    `, [params.slug]);

    if (rows.length === 0) return notFound();
    const post = rows[0];

    // Read Time calculation
    const readTime = estimateReadingTime(post.content);

    // Fetch Related Posts
    const [related]: any = await db.query(`
        SELECT title, slug, excerpt, cover_image, published_at
        FROM blog_posts 
        WHERE id != ? AND is_published = TRUE ${post.category_id ? 'AND category_id = ?' : ''}
        ORDER BY published_at DESC LIMIT 3
    `, post.category_id ? [post.id, post.category_id] : [post.id]);

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.cover_image ? [post.cover_image] : [],
        "datePublished": post.published_at,
        "dateModified": post.updated_at,
        "author": [{
            "@type": "Person",
            "name": "Aditya Vishwakarma",
            "url": "https://adityavishwakarma.com"
        }],
        "description": post.seo_description || post.excerpt
    };

    return (
        <article className="min-h-screen pt-20 pb-40 px-4 max-w-4xl mx-auto animate-fade-in-up">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* Header Content */}
            <header className="mb-14 text-center">
                <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-widest font-bold text-neutral-500 mb-6">
                    <span className="text-black dark:text-white bg-neutral-100 dark:bg-neutral-900 px-3 py-1 rounded">
                        {post.category_name || 'Journal'}
                    </span>
                    <span>•</span>
                    <span>{post.published_at ? format(new Date(post.published_at), 'MMM dd, yyyy') : 'Draft'}</span>
                    <span>•</span>
                    <span>{readTime} MIN READ</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-serif text-black dark:text-white leading-tight mb-8">
                    {post.title}
                </h1>

                {post.cover_image && (
                    <div className="w-full aspect-[21/9] bg-neutral-100 dark:bg-neutral-900 rounded-xl overflow-hidden mt-12 shadow-lg border dark:border-neutral-800">
                        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-1000" />
                    </div>
                )}
            </header>

            {/* Markdown Body */}
            <div className="pt-8 mb-20">
                <MarkdownRenderer content={post.content} />
            </div>

            {/* Tags footer */}
            {post.tags && (
                <div className="flex gap-2 flex-wrap mb-16 border-t dark:border-neutral-800 pt-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 mt-2 mr-4">Tagged in:</span>
                    {post.tags.split(',').map((tag: string) => (
                        <span key={tag} className="text-xs font-mono bg-neutral-100 dark:bg-neutral-900 px-3 py-1 rounded text-neutral-600 dark:text-neutral-400">
                            #{tag.trim()}
                        </span>
                    ))}
                </div>
            )}

            {/* Author Box & Share */}
            <div className="flex flex-col gap-6 mb-20">
                <div className="bg-neutral-50 dark:bg-neutral-900/50 p-8 rounded-xl border dark:border-neutral-800 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left shadow-sm">
                    <div className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-black overflow-hidden shrink-0">
                        <img src="/aditya.jpg" alt="Aditya Vishwakarma" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif mb-2 dark:text-white">Aditya Vishwakarma</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                            Hyper-realistic portrait artist based in India. I specialize in turning emotions into detailed pencil stories, focusing on raw textures and dramatic lighting.
                        </p>
                        <a href="/#portfolio" className="text-xs font-bold uppercase tracking-widest text-black dark:text-white hover:underline underline-offset-4 decoration-1">
                            View Portfolio →
                        </a>
                    </div>
                </div>

                {/* Social Share */}
                <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-neutral-500 justify-center pb-8 border-b dark:border-neutral-800">
                    Share:
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent('https://adityavishwakarma.com/blog/' + post.slug)}`} target="_blank" className="hover:text-blue-400 transition">Twitter (X)</a>
                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + 'https://adityavishwakarma.com/blog/' + post.slug)}`} target="_blank" className="hover:text-green-500 transition">WhatsApp</a>
                    <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://adityavishwakarma.com/blog/' + post.slug)}&title=${encodeURIComponent(post.title)}`} target="_blank" className="hover:text-blue-600 transition">LinkedIn</a>
                </div>
            </div>

            <Newsletter />

            {/* Related Posts */}
            {related.length > 0 && (
                <div className="border-t dark:border-neutral-800 pt-16">
                    <h3 className="text-2xl font-serif mb-10 text-center dark:text-white">Continue Reading</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {related.map((r: any) => (
                            <Link href={`/blog/${r.slug}`} key={r.slug} className="group flex flex-col items-center text-center">
                                {r.cover_image && (
                                    <div className="w-full aspect-[4/3] bg-neutral-100 dark:bg-neutral-900 overflow-hidden rounded mb-4 shadow">
                                        <img src={r.cover_image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                )}
                                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-2">{format(new Date(r.published_at), 'MMM dd, yyyy')}</span>
                                <h4 className="font-serif text-lg leading-tight group-hover:underline underline-offset-4 decoration-1 dark:text-white">{r.title}</h4>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}
