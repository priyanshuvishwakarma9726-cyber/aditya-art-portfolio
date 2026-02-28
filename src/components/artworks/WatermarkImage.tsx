'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils'; // Create utils.ts next

interface WatermarkImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    width?: number;
    height?: number;
    priority?: boolean;
    className?: string;
    watermarkText?: string;
}

export function WatermarkImage({
    src,
    alt,
    fill = true,
    width,
    height,
    priority = false,
    className,
    watermarkText = '© Aditya Vishwakarma',
}: WatermarkImageProps) {
    const [isLoading, setLoading] = useState(true);

    // Combine dimensions config for Next.js Image
    const imgProps = fill ? { fill } : { width, height };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault(); // Disable Right-Click
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.preventDefault(); // Disable Dragging
    };

    return (
        <div
            className={cn("relative overflow-hidden w-full h-full", className)}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
        >
            <Image
                src={src}
                alt={alt}
                priority={priority}
                className={cn(
                    "object-cover transition-opacity duration-700 ease-in-out select-none",
                    isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
                )}
                onLoad={() => setLoading(false)}
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                {...imgProps}
            />

            {/* Dynamic Watermark Overlay (CSS based to not be draggable) */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-wrap justify-center items-center opacity-10 overflow-hidden mix-blend-overlay">
                {Array.from({ length: 15 }).map((_, i) => (
                    <span
                        key={i}
                        className="text-white text-lg font-bold uppercase rotate-[-30deg] tracking-widest whitespace-nowrap p-4"
                    >
                        {watermarkText}
                    </span>
                ))}
            </div>

            {/* Loading Skeleton */}
            {isLoading && (
                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse z-0 rounded-md" />
            )}
        </div>
    );
}
