import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 font-sans bg-white dark:bg-neutral-950 text-black dark:text-white">
            <h1 className="text-8xl md:text-9xl font-serif mb-4 text-neutral-200 dark:text-neutral-900 drop-shadow-sm">404</h1>
            <h2 className="text-2xl md:text-4xl font-serif mb-6 absolute">Canvas Not Found</h2>
            <p className="text-neutral-500 uppercase tracking-widest text-xs font-bold max-w-sm mb-10 pt-16">
                The artwork or page you are looking for has been moved, sold, or doesn't exist.
            </p>
            <Link href="/" className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black py-4 px-8 uppercase tracking-widest text-xs font-bold hover:opacity-80 transition transform hover:scale-105">
                <ArrowLeft size={16} /> Return to Studio
            </Link>
        </div>
    );
}
