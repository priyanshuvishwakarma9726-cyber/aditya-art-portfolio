import { getDb } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/blog/Newsletter';
import Chatbot from '@/components/chat/Chatbot';
import { Hero } from '@/components/home/Hero';

export const revalidate = 3600; // 1 hr ISR

export default async function Home() {
  const db = await getDb();

  // Fetch Latest Portfolio (For Gallery)
  const [portfolio]: any = await db.query(
    'SELECT a.id, a.title, a.image_url as finalImage, c.name as category FROM artworks a LEFT JOIN categories c ON a.category_id = c.id WHERE a.is_active = TRUE ORDER BY a.created_at DESC LIMIT 6'
  );

  // Fetch Active Limited Drops
  const [drops]: any = await db.query(
    'SELECT title, slug, image_url as cover_image, drop_end_time FROM artworks WHERE for_sale = TRUE AND is_limited_drop = TRUE AND drop_end_time > NOW() AND stock_count > 0 ORDER BY drop_end_time ASC LIMIT 1'
  );

  // Fetch Best Sellers (Shop Preview)
  const [bestSellers]: any = await db.query(
    'SELECT id, title, slug, price, image_url as cover_image FROM artworks WHERE for_sale = TRUE AND stock_count > 0 ORDER BY created_at DESC LIMIT 4'
  );

  // Fetch Latest Journal Entries
  const [blogs]: any = await db.query(
    'SELECT title, slug, excerpt, cover_image, published_at FROM blog_posts WHERE is_published = TRUE ORDER BY published_at DESC LIMIT 3'
  );

  const activeDrop = drops[0];

  return (
    <div className="flex flex-col min-h-screen">

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Limited Drop Banner (Contextual Engine) */}
      {activeDrop && (
        <section className="bg-black text-white dark:bg-white dark:text-black py-4 px-4 text-center border-y border-neutral-800 flex justify-center items-center gap-4 text-sm uppercase tracking-widest font-bold font-mono">
          <span className="animate-pulse bg-red-600 w-2 h-2 rounded-full inline-block"></span>
          ACTIVE DROP: {activeDrop.title} is live! Limited Availability.
          <Link href={`/shop/${activeDrop.slug}`} className="ml-2 underline hover:text-neutral-400 transition">Shop Now →</Link>
        </section>
      )}

      {/* 3. Featured Portfolio (Gallery Preview) */}
      <section id="portfolio" className="py-32 mt-16 md:mt-32 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b dark:border-neutral-800 pb-6 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif dark:text-white">Selected Works</h2>
            <p className="text-neutral-500 uppercase tracking-widest text-xs font-bold mt-4">A decade of graphite mastery</p>
          </div>
          <Link href="/gallery" className="text-sm font-bold uppercase tracking-widest dark:text-white hover:underline underline-offset-4 decoration-1 flex items-center gap-2">
            View All Gallery <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
          {portfolio.map((art: any) => (
            <div key={art.id} className="group relative overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900 aspect-[3/4]">
              {art.finalImage && <img src={art.finalImage} alt={art.title} className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out" />}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <h3 className="text-white font-serif text-xl">{art.title}</h3>
                <p className="text-white/70 text-xs uppercase tracking-widest font-mono mt-1">{art.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Commission Trust Section */}
      <section className="bg-neutral-950 text-white py-32 px-4 relative overflow-hidden flex items-center justify-center border-y border-neutral-800">
        <div className="max-w-4xl mx-auto text-center z-10 relative">
          <div className="mb-8 flex justify-center gap-2 text-yellow-500">
            {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} />)}
          </div>
          <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight drop-shadow-md">
            Over 100+ Happy Clients Globally
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg mb-12 font-serif italic">
            "An immortalized memory on paper. The depth of the charcoal and the precision of the lines bring the subject back to life. Every commission is treated with museum-grade archival sanctity."
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-md mx-auto">
            <Link href="/commission" className="bg-white text-black py-4 px-8 font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform duration-300">
              Start Your Commission
            </Link>
          </div>
        </div>

        {/* Background Graphic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 pointer-events-none flex items-center justify-center">
          <div className="w-[800px] h-[800px] border border-neutral-700 rounded-full animate-pulse"></div>
          <div className="absolute w-[600px] h-[600px] border border-neutral-800 rounded-full animate-[spin_60s_linear_infinite]"></div>
        </div>
      </section>

      {/* 5. Shop Preview (Originals & Prints) */}
      <section className="py-32 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 border-b dark:border-neutral-800 pb-10">
          <h2 className="text-4xl md:text-5xl font-serif dark:text-white mb-4">Original Artworks</h2>
          <p className="text-neutral-500 uppercase tracking-widest text-xs font-bold flex justify-center items-center gap-4">
            Available in the Studio
            <Link href="/shop" className="text-black dark:text-white hover:underline underline-offset-4 decoration-1 flex items-center gap-1">
              Shop All <ArrowRight size={14} />
            </Link>
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {bestSellers.map((item: any) => (
            <Link href={`/shop/${item.slug}`} key={item.id} className="group block text-center">
              <div className="w-full aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 border dark:border-neutral-800 rounded mb-6 overflow-hidden relative shadow-sm">
                {item.cover_image && <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out mix-blend-multiply dark:mix-blend-normal" />}
              </div>
              <h3 className="font-serif text-lg leading-tight group-hover:underline underline-offset-4 decoration-1 dark:text-white">{item.title}</h3>
              <p className="text-neutral-500 font-mono text-xs mt-2 font-bold tracking-widest">₹{Number(item.price).toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. High-End Testimonials Display */}
      <Testimonials />

      {/* 7. Journal Preview */}
      <section className="py-32 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-16 border-b dark:border-neutral-800 pb-6">
          <h2 className="text-4xl font-serif dark:text-white">Studio Journal</h2>
          <Link href="/blog" className="text-sm font-bold uppercase tracking-widest dark:text-white hover:underline underline-offset-4 decoration-1 flex items-center gap-2">
            Read All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {blogs.map((b: any) => (
            <Link href={`/blog/${b.slug}`} key={b.slug} className="group flex flex-col">
              <div className="aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-900 rounded border dark:border-neutral-800 mb-6 overflow-hidden">
                {b.cover_image && <img src={b.cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={b.title} />}
              </div>
              <h3 className="font-serif text-2xl leading-tight mb-3 group-hover:underline underline-offset-4 decoration-1 dark:text-white">{b.title}</h3>
              <p className="text-neutral-500 text-sm line-clamp-2">{b.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. Newsletter & Chatbot Overlay */}
      <div className="max-w-4xl mx-auto w-full px-4 mb-32">
        <Newsletter />
      </div>

      <Chatbot />

      {/* 9. Final CTA */}
      <section className="bg-neutral-50 dark:bg-neutral-950 py-32 px-4 text-center border-t dark:border-neutral-800">
        <h2 className="text-3xl md:text-5xl font-serif mb-6 dark:text-white">Still have questions?</h2>
        <p className="text-neutral-500 max-w-md mx-auto mb-10 text-sm leading-relaxed">
          Whether you want to commission a unique piece or inquire about an existing artwork, I'm just a message away.
        </p>
        <a href="https://wa.me/919999999999" target="_blank" className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 uppercase font-bold tracking-widest text-sm hover:bg-green-600 transition shadow-lg rounded-full">
          <MessageCircle size={18} /> Chat on WhatsApp
        </a>
      </section>

    </div>
  );
}

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);
