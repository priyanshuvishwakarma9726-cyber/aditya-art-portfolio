import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductActions from './ProductActions';
import Link from 'next/link';
import { WatermarkImage } from '@/components/artworks/WatermarkImage';
import { Package } from 'lucide-react';

export const revalidate = 60; // ISR

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const db = await getDb();
    const [rows]: any = await db.query('SELECT title, description, image_url FROM artworks WHERE slug = ? AND for_sale = TRUE', [params.slug]);

    if (!rows.length) return { title: 'Not Found' };
    const art = rows[0];

    return {
        title: `${art.title} | Aditya Art Shop`,
        description: art.description?.substring(0, 160) || 'Buy exclusive artwork by Aditya Vishwakarma.',
        openGraph: {
            title: art.title,
            description: art.description?.substring(0, 160),
            images: [{ url: art.image_url }] // Assuming remote storage path
        }
    };
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const db = await getDb();

    // Fetch Artwork
    const [rows]: any = await db.query(`
        SELECT a.*, c.name as category_name
        FROM artworks a
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.slug = ? AND a.for_sale = TRUE AND a.is_active = TRUE
    `, [params.slug]);

    if (rows.length === 0) return notFound();
    const art = rows[0];

    // Fetch basic related
    const [relatedRows]: any = await db.query(`
        SELECT id, title, slug, image_url, price, stock_count
        FROM artworks 
        WHERE category_id = ? AND id != ? AND for_sale = TRUE AND is_active = TRUE
        ORDER BY created_at DESC LIMIT 4
    `, [art.category_id, art.id]);

    const isDropActive = art.is_limited_drop && art.drop_end_time && new Date(art.drop_end_time).getTime() > Date.now();
    const isOutOfStock = art.stock_count <= 0 || (art.is_limited_drop && !isDropActive);

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": art.title,
        "image": art.image_url,
        "description": art.description,
        "sku": art.id,
        "offers": {
            "@type": "Offer",
            "url": `https://adityavishwakarma.com/shop/${art.slug}`,
            "priceCurrency": "INR",
            "price": art.price,
            "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-40 px-4 max-w-7xl mx-auto">
            {/* Structured Schema Component */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="grid lg:grid-cols-2 gap-16">
                {/* Image Section */}
                <div className="animate-fade-in-up">
                    <div className="sticky top-24 w-full aspect-square bg-neutral-100 dark:bg-neutral-900 border dark:border-neutral-800 rounded-lg overflow-hidden flex items-center justify-center p-8 select-none">
                        <WatermarkImage
                            src={art.image_url}
                            alt={art.title}
                            className="object-contain w-full h-full drop-shadow-2xl mix-blend-multiply dark:mix-blend-normal filter drop-shadow hover:scale-105 transition-transform duration-1000"
                        />
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex flex-col pt-10 animate-[fade-in-up_0.8s_ease-out_forwards]">
                    {/* Tags */}
                    <div className="flex gap-3 text-xs uppercase tracking-widest font-bold mb-4 flex-wrap">
                        <span className="text-neutral-500 bg-neutral-100 dark:bg-neutral-900 px-3 py-1 rounded">{art.category_name || 'Original'}</span>
                        {art.is_limited_drop && (
                            <span className="bg-red-500 text-white px-3 py-1 rounded shadow-sm animate-pulse">Limited Edition Drop</span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-6 dark:text-white">{art.title}</h1>

                    <div className="flex items-baseline gap-4 mb-2 pb-0 border-none">
                        <p className="text-4xl font-medium text-black dark:text-neutral-300">
                            ₹{Number(art.price).toFixed(2)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-8 pb-8 border-b dark:border-neutral-800 animate-pulse">
                        <Package size={14} /> Pay 50% Now, 50% After Delivery
                    </div>

                    {/* Actions wrapper (Client Component for hooks) */}
                    <ProductActions
                        product={art}
                        isOutOfStock={isOutOfStock}
                        isLimitedDrop={art.is_limited_drop}
                        dropEndTime={art.drop_end_time}
                    />

                    {/* Details section */}
                    <div className="mt-12 space-y-8 text-neutral-600 dark:text-neutral-400 leading-relaxed text-base">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white mb-2">Description</h3>
                            <p className="whitespace-pre-wrap">{art.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm font-mono bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg dark:border dark:border-neutral-800">
                            <div>
                                <span className="opacity-50 block mb-1">Dimensions</span>
                                <span className="text-black dark:text-white">{art.width_cm}cm × {art.height_cm}cm</span>
                            </div>
                            <div>
                                <span className="opacity-50 block mb-1">Medium</span>
                                <span className="text-black dark:text-white">{art.is_commission ? 'Custom' : 'Standard'}</span>
                            </div>
                            <div>
                                <span className="opacity-50 block mb-1">Certificate</span>
                                <span className="text-black dark:text-white">Included</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related items */}
            {relatedRows.length > 0 && (
                <div className="mt-40 border-t dark:border-neutral-800 pt-20">
                    <h3 className="text-2xl font-serif text-center mb-10 dark:text-white">You May Also Like</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedRows.map((r: any) => (
                            <Link href={`/shop/${r.slug}`} key={r.id} className="group">
                                <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded mb-4 overflow-hidden p-2">
                                    <img src={r.image_url} alt={r.title} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform" />
                                </div>
                                <h4 className="font-serif text-lg leading-tight dark:text-white">{r.title}</h4>
                                <p className="text-sm text-neutral-500">₹{Number(r.price).toFixed(2)}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
