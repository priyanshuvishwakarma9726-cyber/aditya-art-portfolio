import React from 'react';
import { Artwork } from '@/types';
import { WatermarkImage } from './WatermarkImage';

interface ArtworkCardProps {
    artwork: Artwork;
    onClick: () => void;
}

export function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
    return (
        <div
            className="group relative cursor-pointer overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800"
            onClick={onClick}
        >
            <div className="aspect-[3/4] w-full relative">
                <WatermarkImage
                    src={artwork.image_url}
                    alt={artwork.title}
                    fill
                    className="group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 select-none shadow-[inset_0_-80px_60px_-15px_rgba(0,0,0,0.8)]">
                <h3 className="text-white text-xl font-serif font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {artwork.title}
                </h3>
                <p className="text-neutral-300 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 mb-2">
                    {artwork.category_name}
                </p>
                <p className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    ₹{Number(artwork.price).toFixed(2)}
                </p>
            </div>

            {/* Commission / Sold Out Tags */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
                {artwork.is_commission && (
                    <span className="bg-amber-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm shadow-sm">
                        Commission
                    </span>
                )}
                {artwork.stock_count === 0 && (
                    <span className="bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm shadow-sm">
                        Sold Out
                    </span>
                )}
            </div>
        </div>
    );
}
