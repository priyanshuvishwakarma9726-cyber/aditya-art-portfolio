'use client'

import React from 'react';
import Link from 'next/link';

export function Hero() {
    const scrollToPortfolio = () => {
        document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative w-full min-h-[80vh] md:min-h-screen py-20 md:py-0 px-6 md:px-20 flex flex-col justify-center overflow-hidden bg-neutral-900">

            {/* Desktop Background Layer */}
            <div
                className="absolute inset-0 z-0 hidden md:block bg-cover bg-center bg-no-repeat opacity-50 dark:opacity-30"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/60 dark:from-black/80 dark:via-black/20 dark:to-black/80" />
            </div>

            {/* Mobile Background Layer */}
            <div
                className="absolute inset-0 z-0 block md:hidden bg-cover bg-center bg-no-repeat opacity-60 dark:opacity-30"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-full flex flex-col items-start md:items-center text-left md:text-center break-words">
                <h1 className="text-3xl md:text-6xl font-serif text-white md:text-black dark:text-white font-medium mb-4 md:mb-6 leading-tight max-w-full break-words">
                    I Turn Emotions into <br className="block md:hidden" /><span className="italic text-neutral-300 md:text-neutral-800 dark:text-neutral-300">Pencil Stories.</span>
                </h1>

                <p className="text-base md:text-xl text-neutral-200 md:text-neutral-800 dark:text-neutral-300 mb-8 md:mb-12 max-w-full leading-tight font-light tracking-wide break-words">
                    Experience the depth of realistic portraiture and bespoke commissions crafted with passion and precision.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-start md:justify-center items-start md:items-center w-full md:w-auto">
                    <button
                        onClick={scrollToPortfolio}
                        className="px-8 py-4 bg-white md:bg-black dark:bg-white text-black md:text-white dark:text-black font-bold uppercase tracking-widest text-xs md:text-sm rounded hover:opacity-80 transition-opacity w-full sm:w-auto shadow-lg"
                    >
                        View Portfolio
                    </button>
                    <Link
                        href="/commission"
                        className="px-8 py-4 bg-black/20 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border border-white md:border-2 md:border-black dark:border-white text-white md:text-black dark:text-white font-bold uppercase tracking-widest text-xs md:text-sm rounded hover:bg-white hover:text-black md:hover:bg-black md:hover:text-white transition-colors w-full sm:w-auto text-center shadow-lg"
                    >
                        Commission Me
                    </Link>
                </div>
            </div>
        </section>
    );
}
