'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Priya Sharma",
        text: "Aditya completely captured my grandfather's soul in this charcoal piece. The details in the eyes are mesmerizing. It felt like he was back with us.",
        rating: 5,
        location: "Mumbai, India",
    },
    {
        id: 2,
        name: "David Chen",
        text: "I commissioned a portrait for my anniversary. The communication was excellent, the shipping was secure, and the final artwork left my wife in tears. Truly a master of his craft.",
        rating: 5,
        location: "Toronto, Canada",
    },
    {
        id: 3,
        name: "Rohan Desai",
        text: "Bought a limited drop original from the shop. The packaging was premium, and opening it was an experience in itself. The graphite textures are even better in person.",
        rating: 5,
        location: "Delhi, India",
    }
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent((c) => (c + 1) % testimonials.length);
    const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

    return (
        <section className="py-24 bg-neutral-50 dark:bg-neutral-900 border-y dark:border-neutral-800 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-5xl font-serif mb-4 dark:text-white">Voices & Echoes</h2>
                    <p className="text-neutral-500 uppercase tracking-widest text-sm font-bold">What collectors are saying</p>
                </div>

                <div className="relative min-h-[250px] flex items-center justify-center">
                    {/* Navigation */}
                    <button onClick={prev} className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-black dark:hover:text-white transition hidden md:block">
                        <ChevronLeft size={32} strokeWidth={1} />
                    </button>

                    <button onClick={next} className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-black dark:hover:text-white transition hidden md:block">
                        <ChevronRight size={32} strokeWidth={1} />
                    </button>

                    {/* Slides */}
                    <div className="overflow-hidden w-full relative h-[250px]">
                        {testimonials.map((t, i) => (
                            <div
                                key={t.id}
                                className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out flex flex-col items-center justify-center ${i === current ? 'opacity-100 translate-x-0' : i < current ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'
                                    }`}
                            >
                                <div className="flex gap-1 text-black dark:text-white mb-6">
                                    {[...Array(t.rating)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-xl md:text-2xl font-serif leading-relaxed mb-8 dark:text-neutral-200">
                                    "{t.text}"
                                </p>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-black dark:text-white">{t.name}</div>
                                    <div className="text-xs text-neutral-400 font-mono mt-1">{t.location}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-500 ${i === current ? 'bg-black dark:bg-white w-6' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
