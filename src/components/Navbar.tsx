import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import MobileDrawer from './MobileDrawer';

export default async function Navbar() {
    // Only check basic supabase auth status for the navbar, don't ping the database to prevent duplicate query crashes during edge redirects.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <nav className="w-full flex justify-between items-center px-6 md:px-10 py-4 lg:py-6 border-b border-neutral-100 dark:border-neutral-900 bg-white dark:bg-black sticky top-0 z-50 transition-all duration-300">
            <Link href="/" className="font-serif text-2xl lg:text-3xl font-bold tracking-tight shrink-0 hover:opacity-70 transition-opacity">
                ADITYA ART.
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6 lg:gap-8 xl:gap-10 items-center text-sm lg:text-base font-medium">
                <Link href="/shop" className="hover:text-black/60 dark:hover:text-white/60 transition">
                    Shop
                </Link>
                <Link href="/blog" className="hover:text-black/60 dark:hover:text-white/60 transition">
                    Journal
                </Link>
                <Link href="/gallery" className="hover:text-black/60 dark:hover:text-white/60 transition">
                    Gallery
                </Link>
                <Link href="/commission" className="hover:text-black/60 dark:hover:text-white/60 transition">
                    Commission
                </Link>
                <Link href="/wishlist" className="hover:text-black/60 dark:hover:text-white/60 transition">
                    Wishlist
                </Link>
                <Link href="/cart" className="hover:text-black/60 dark:hover:text-white/60 transition flex items-center gap-2">
                    Cart
                </Link>
                {user && (
                    <Link href="/admin" className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded text-xs tracking-widest uppercase font-bold hover:scale-105 active:scale-95 transition-all shadow-sm">
                        Dashboard
                    </Link>
                )}
            </div>

            {/* Mobile Drawer Navigation */}
            <MobileDrawer user={user} />
        </nav>
    );
}
