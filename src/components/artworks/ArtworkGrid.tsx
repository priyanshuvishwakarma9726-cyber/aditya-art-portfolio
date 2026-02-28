'use client'

import React, { useState } from 'react';
import { Artwork, Category } from '@/types';
import { ArtworkCard } from './ArtworkCard';
import { Lightbox } from './Lightbox';
import { cn } from '@/lib/utils';

interface ArtworkGridProps {
    initialArtworks: Artwork[];
    categories: Category[];
}

export function ArtworkGrid({ initialArtworks, categories }: ArtworkGridProps) {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

    const filteredArtworks = activeCategory === 'all'
        ? initialArtworks
        : initialArtworks.filter(a => a.category_name.toLowerCase() === activeCategory.toLowerCase());

    return (
        <div className="w-full">
            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-16 px-4">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={cn(
                        "text-sm font-bold uppercase tracking-widest pb-2 transition-all duration-300",
                        activeCategory === 'all'
                            ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                            : "text-neutral-500 hover:text-black dark:hover:text-white border-b-2 border-transparent"
                    )}
                >
                    All Works
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.name)}
                        className={cn(
                            "text-sm font-bold uppercase tracking-widest pb-2 transition-all duration-300",
                            activeCategory === cat.name
                                ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                                : "text-neutral-500 hover:text-black dark:hover:text-white border-b-2 border-transparent"
                        )}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filteredArtworks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
                    {filteredArtworks.map((artwork) => (
                        <ArtworkCard
                            key={artwork.id}
                            artwork={artwork}
                            onClick={() => setSelectedArtwork(artwork)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-neutral-500">
                    <p className="text-lg">No artworks found in this category.</p>
                </div>
            )}

            {/* Lightbox Modal */}
            <Lightbox
                artwork={selectedArtwork}
                allArtworks={initialArtworks}
                isOpen={!!selectedArtwork}
                onClose={() => setSelectedArtwork(null)}
            />
        </div>
    );
}
