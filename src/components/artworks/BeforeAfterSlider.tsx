'use client'

import React, { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import { WatermarkImage } from './WatermarkImage';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    alt: string;
}

export function BeforeAfterSlider({ beforeImage, afterImage, alt }: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDrag = (clientX: number) => {
        if (!containerRef.current) return;
        const { left, width } = containerRef.current.getBoundingClientRect();
        const x = clientX - left;
        const position = Math.max(0, Math.min(100, (x / width) * 100));
        setSliderPosition(position);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        handleDrag(e.clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;
        handleDrag(e.touches[0].clientX);
    };

    const onMouseUp = () => setIsDragging(false);

    useEffect(() => {
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchend', onMouseUp);
        return () => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchend', onMouseUp);
        };
    }, []);

    return (
        <div
            className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden rounded-lg select-none cursor-ew-resize group"
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseMove={onMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchMove={onTouchMove}
        >
            {/* Before Image (underneath, full width initially visible) */}
            <div className="absolute inset-0">
                <WatermarkImage src={beforeImage} alt={`${alt} - Before`} fill className="object-cover" />
                <span className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 text-xs font-bold uppercase backdrop-blur-md rounded-md">
                    Before
                </span>
            </div>

            {/* After Image (Top layer, clipped by slider position) */}
            <div
                className="absolute inset-0 z-10 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
            >
                <div className="absolute top-0 left-0 bottom-0 min-w-full" style={{ width: '100vw' /* prevents squishing */ }}>
                    <WatermarkImage src={afterImage} alt={`${alt} - After`} fill className="object-cover" />
                </div>
                <span className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 text-xs font-bold uppercase backdrop-blur-md rounded-md"
                    style={{ right: `calc(${100 - sliderPosition}% + 1rem)` }}>
                    After
                </span>
            </div>

            {/* Slider Line & Handle */}
            <div
                className="absolute top-0 bottom-0 z-20 w-1 bg-white cursor-ew-resize shadow-2xl transition-all duration-75"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform duration-200">
                    <ChevronLeft className="w-4 h-4 -mr-1" />
                    <ChevronRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}
