import { Eye, Info, MoveUpRight, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import { Emoji } from '@/components/Emoji';

export const metadata = {
    title: 'Virtual Exhibition | IMMORTALIZED',
    description: 'Experience the hyper-realistic artworks of Aditya Vishwakarma in a curated virtual museum setting.'
};

export default function ExhibitionPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Immersive Entry */}
            <section className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-4 text-center">
                <div className="z-20 space-y-8 animate-fade-in">
                    <span className="text-xs font-bold uppercase tracking-[0.5em] text-neutral-500 block">Season 2026 Collection</span>
                    <h1 className="text-6xl md:text-9xl font-serif tracking-tighter italic">IMMORTALIZED</h1>
                    <p className="max-w-xl mx-auto text-neutral-400 font-light tracking-wide text-lg md:text-xl">
                        A curated digital experience where shadows breathe and pencil strokes echo through silence.
                    </p>
                    <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button className="bg-white text-black px-10 py-5 font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform">
                            Enter the Gallery
                        </button>
                        <Link href="/gallery" className="text-neutral-400 hover:text-white transition uppercase text-xs font-bold tracking-widest border-b border-neutral-800 pb-2">
                            View Static Collection
                        </Link>
                    </div>
                </div>

                {/* Ambience / Dark Shadows */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-10 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-full -z-10">
                    <img
                        src="/exhibition-hero.jpg"
                        alt="Museum Setting"
                        className="w-full h-full object-cover opacity-30 grayscale blur-sm"
                    />
                </div>
            </section>

            {/* Curatorial Note */}
            <section className="py-32 px-4 border-y border-neutral-900">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-start">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif italic text-neutral-300">"The silence between the shades of gray."</h2>
                        <div className="w-20 h-px bg-neutral-800"></div>
                    </div>
                    <div className="space-y-8 text-neutral-500 leading-relaxed md:text-lg">
                        <p>
                            This virtual exhibition showcases the most technical pieces produced in the Aditya Art Studio over the last 24 months. Each piece selected explores the theme of human mortality vs. artistic immortality.
                        </p>
                        <p>
                            Experience the scale of these works as they would appear in a classical museum setting. Every room is designed to highlight the high-contrast tonal range of charcoal and graphite.
                        </p>
                    </div>
                </div>
            </section>

            {/* Exhibition Grid Preview */}
            <section className="py-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20">
                        <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-neutral-600 mb-4">Preview Rooms</h3>
                        <div className="w-full h-px bg-neutral-900"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                        {/* Room 1 */}
                        <div className="group space-y-8">
                            <div className="aspect-[16/10] bg-neutral-900 relative overflow-hidden rounded overflow-hidden cursor-pointer">
                                <img
                                    src="/room-1-preview.jpg"
                                    className="w-full h-full object-cover grayscale opacity-50 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                                    alt="Classical Room"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
                                        <Maximize2 size={24} className="text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-serif italic">Room 01: The Monoliths</h4>
                                    <p className="text-neutral-500 text-sm font-mono tracking-widest uppercase">Focus: Large Scale Charcoal</p>
                                </div>
                                <button className="p-3 border border-neutral-800 rounded-full hover:bg-white hover:text-black transition-colors">
                                    <MoveUpRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Room 2 */}
                        <div className="group space-y-8">
                            <div className="aspect-[16/10] bg-neutral-900 relative overflow-hidden rounded overflow-hidden cursor-pointer">
                                <img
                                    src="/room-2-preview.jpg"
                                    className="w-full h-full object-cover grayscale opacity-50 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                                    alt="Modern Room"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
                                        <Maximize2 size={24} className="text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-serif italic">Room 02: Eye to Eye</h4>
                                    <p className="text-neutral-500 text-sm font-mono tracking-widest uppercase">Focus: Hyper-Realistic Optics</p>
                                </div>
                                <button className="p-3 border border-neutral-800 rounded-full hover:bg-white hover:text-black transition-colors">
                                    <MoveUpRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Requirement Banner */}
            <section className="py-20 bg-neutral-950 border-t border-neutral-900">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                            <Eye className="text-neutral-400" size={20} />
                        </div>
                        <p className="text-neutral-400 text-sm md:text-base max-w-md italic">
                            Experience optimized for WebGL-enabled desktop browsers and VR headsets.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold font-mono tracking-widest uppercase">
                            <Info size={14} /> Guide Available
                        </div>
                        <div className="w-px h-6 bg-neutral-800 hidden md:block"></div>
                        <button className="text-neutral-300 hover:text-white transition text-xs font-bold tracking-widest uppercase border-b border-neutral-700 pb-1">
                            Troubleshoot Loading
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
