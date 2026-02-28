import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/admin/'], // Protect the Admin paths from being scraped
        },
        sitemap: 'https://adityavishwakarma.com/sitemap.xml',
    };
}
