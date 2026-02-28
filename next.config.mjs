/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['pdfkit-table', 'pdfkit'],
    compress: true, // GZIP
    poweredByHeader: false, // Security
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'adityavishwakarma.com' },
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-DNS-Prefetch-Control', value: 'on' },
                    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Content-Security-Policy', value: "default-src 'self' 'unsafe-eval' 'unsafe-inline' https: data:;" }
                ],
            },
            {
                source: '/_next/image(.*)',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            }
        ];
    }
};

export default nextConfig;
