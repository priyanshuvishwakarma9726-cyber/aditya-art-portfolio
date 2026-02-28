import { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://adityavishwakarma.com';
    const db = await getDb();

    // Fetch Shop URIs
    const [artworks]: any = await db.query('SELECT slug, updated_at FROM artworks WHERE for_sale = TRUE AND is_active = TRUE');
    const artworkRoutes = artworks.map((art: any) => ({
        url: `${baseUrl}/shop/${art.slug}`,
        lastModified: art.updated_at,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Fetch Blog URIs
    const [blogs]: any = await db.query('SELECT slug, updated_at FROM blog_posts WHERE is_published = TRUE');
    const blogRoutes = blogs.map((blog: any) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updated_at,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Static Base Routes
    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/commission`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }
    ];

    return [...staticRoutes, ...artworkRoutes, ...blogRoutes];
}
