import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

// Load default modern standard Inter, and a classic serif for the minimal luxury look
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['400', '500', '600', '700'] });

// Setup Global SEO Metadata
export const metadata: Metadata = {
  title: {
    template: '%s | Aditya Art Portfolio',
    default: 'Aditya Art Portfolio - Hyper Realistic Portrait Artist',
  },
  description: 'Aditya Vishwakarma: Specializing in hyper-realistic pencil portraits and bespoke art commissions. Experience deep emotional storytelling through minimal yet powerful artistry.',
  keywords: ['Aditya Vishwakarma', 'Pencil Drawings', 'Hyper Realistic Art', 'Portraits', 'Commission Artist', 'Digital Art', 'Indian Artist', 'Custom Paintings'],
  authors: [{ name: 'Aditya Vishwakarma' }],
  creator: 'Aditya Vishwakarma',
  openGraph: {
    title: 'Aditya Art Portfolio',
    description: 'I Turn Emotions into Pencil Stories.',
    url: 'https://adityavishwakarma.com', // To be updated
    siteName: 'Aditya Art',
    images: [{
      url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Replace with real OG image in future
      width: 1200,
      height: 630,
      alt: 'Aditya Art Portfolio Masterpiece'
    }],
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/components/store/CartProvider';
import VisitorTracker from '@/components/VisitorTracker';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        {/* Schema Markup (Structured data for Person / Artist) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Person",
              "name": "Aditya Vishwakarma",
              "url": "https://adityavishwakarma.com",
              "image": "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
              "jobTitle": "Artist",
              "worksFor": {
                "@type": "Organization",
                "name": "Aditya Art Studio"
              },
              "sameAs": [
                "https://instagram.com/aditya_art", // Placeholders
                "https://twitter.com/aditya_art"
              ]
            })
          }}
        />
      </head>
      <body className="font-sans bg-white dark:bg-neutral-950 text-black dark:text-white antialiased transition-colors duration-300" suppressHydrationWarning>
        <VisitorTracker />
        <CartProvider>
          <div id="top-boundary" className="min-h-screen flex flex-col pt-0">
            <Navbar />

            <div role="main" className="flex-grow w-full">
              {children}
            </div>

            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
