import React from 'react';
import { getRecommendations } from '@/lib/ai-recommendation';
import { Artwork } from '@/types';
import Image from 'next/image';
import { WatermarkImage } from './WatermarkImage';

interface Props {
    currentArtwork: Artwork;
    allArtworks: Artwork[];
    onArtworkClick: (art: Artwork) => void;
}

export function RecommendedArtworks({ currentArtwork, allArtworks, onArtworkClick }: Props) {
    const recommendations = getRecommendations(currentArtwork, allArtworks, 3);

    if (recommendations.length === 0) return <p className="text-sm text-neutral-500">No recommendations found.</p>;

    return (
        <div className="grid grid-cols-3 gap-2">
            {recommendations.map((art) => (
                <button
                    key={art.id}
                    onClick={() => onArtworkClick(art)}
                    className="relative aspect-square overflow-hidden rounded-md group hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                    <img
                        src={art.image_url}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <p className="text-[10px] text-white font-bold uppercase truncate">{art.title}</p>
                    </div>
                </button>
            ))}
        </div>
    );
}
