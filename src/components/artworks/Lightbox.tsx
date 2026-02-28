'use client'

import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Artwork } from '@/types';
import { WatermarkImage } from './WatermarkImage';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RecommendedArtworks } from './RecommendedArtworks';

interface LightboxProps {
    artwork: Artwork | null;
    allArtworks: Artwork[];
    isOpen: boolean;
    onClose: () => void;
}

export function Lightbox({ artwork, allArtworks, isOpen, onClose }: LightboxProps) {

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!isOpen || !artwork) return null;

    const hasBeforeAfter = artwork.before_image_url && artwork.after_image_url;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in group">

            {/* Background click listener */}
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-xl shadow-2xl flex flex-col md:flex-row transform scale-95 opacity-0 animate-[fade-in-up_0.3s_ease-out_forwards]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Image / Interactive Media Side */}
                <div className="md:w-2/3 h-[50vh] md:h-auto min-h-[400px] relative bg-neutral-100 dark:bg-black rounded-t-xl md:rounded-l-xl md:rounded-tr-none flex items-center justify-center overflow-hidden">
                    {hasBeforeAfter ? (
                        <BeforeAfterSlider
                            beforeImage={artwork.before_image_url!}
                            afterImage={artwork.after_image_url || artwork.image_url}
                            alt={artwork.title}
                        />
                    ) : (
                        <WatermarkImage
                            src={artwork.image_url}
                            alt={artwork.title}
                            fill
                            className="object-contain"
                        />
                    )}
                </div>

                {/* Artwork Info Side */}
                <div className="md:w-1/3 p-6 md:p-8 flex flex-col items-start text-left overflow-y-auto">
                    <span className="text-xs font-bold tracking-wider uppercase text-neutral-500 mb-2">
                        {artwork.category_name}
                    </span>
                    <h2 className="text-3xl font-serif mb-4 text-neutral-900 dark:text-white">
                        {artwork.title}
                    </h2>

                    <div className="flex gap-4 mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                        {artwork.width_cm && artwork.height_cm && (
                            <span>{artwork.width_cm} x {artwork.height_cm} cm</span>
                        )}
                        {artwork.is_commission && (
                            <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 rounded-sm font-semibold">
                                Custom Commission
                            </span>
                        )}
                    </div>

                    <p className="text-neutral-700 dark:text-neutral-300 mb-8 whitespace-pre-line leading-relaxed flex-grow">
                        {artwork.description || "No description provided."}
                    </p>

                    <div className="w-full flex justify-between items-center bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg mb-8">
                        <span className="text-2xl font-bold font-serif text-neutral-900 dark:text-white">
                            ₹{Number(artwork.price).toFixed(2)}
                        </span>
                        <Link
                            href={`/shop/${artwork.slug}`}
                            className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 rounded-md font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center gap-2"
                            onClick={onClose}
                        >
                            Buy Now <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* AI Recommendations */}
                    <div className="w-full border-t border-neutral-200 dark:border-neutral-700 pt-6">
                        <h3 className="text-lg font-serif mb-4 dark:text-white">You might also like</h3>
                        <RecommendedArtworks currentArtwork={artwork} allArtworks={allArtworks} onArtworkClick={(art) => { }} />
                    </div>

                </div>
            </div>
        </div>
    );
}
