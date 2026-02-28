'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Captured Global Issue:', error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 font-sans bg-white dark:bg-neutral-950 text-black dark:text-white">
            <h1 className="text-4xl md:text-5xl font-serif mb-6 text-neutral-800 dark:text-neutral-100">Rendering Interrupted.</h1>
            <p className="text-neutral-500 uppercase tracking-widest text-xs font-bold max-w-md mb-10 leading-relaxed">
                We encountered an unexpected stroke on the canvas. The development team has been tentatively notified (Server Error 500).
            </p>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => reset()}
                    className="bg-black text-white dark:bg-white dark:text-black py-4 px-8 uppercase tracking-widest text-xs font-bold hover:opacity-80 transition"
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="border border-neutral-300 dark:border-neutral-800 text-black dark:text-white py-4 px-8 uppercase tracking-widest text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900 transition"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
