import Link from 'next/link';
import { ArrowRight, Instagram, Twitter, Linkedin } from 'lucide-react';

export const metadata = {
    title: 'About | Aditya Vishwakarma',
    description: 'Learn more about Aditya Vishwakarma, a professional hyper-realistic sketch artist specializing in graphite and charcoal portraits.'
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black overflow-hidden pt-20">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 px-4 border-b dark:border-neutral-900">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
                    <div className="w-full md:w-1/2 relative group">
                        <div className="aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 overflow-hidden rounded shadow-2xl">
                            <img
                                src="/aditya-profile.jpg"
                                alt="Aditya Vishwakarma"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 border-l border-t border-neutral-200 dark:border-neutral-800 -z-10 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-500"></div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 border-r border-b border-neutral-200 dark:border-neutral-800 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
                    </div>

                    <div className="w-full md:w-1/2 space-y-8 animate-fade-in-up">
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">The Artist</span>
                        <h1 className="text-5xl md:text-7xl font-serif dark:text-white leading-tight">Aditya Vishwakarma</h1>
                        <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                            "A pencil is more than just a tool; it's a bridge between human emotion and the tangible world."
                        </p>
                        <div className="space-y-6 text-neutral-700 dark:text-neutral-300 leading-relaxed md:text-lg">
                            <p>
                                Born with a fascination for the interplay of light and shadow, I have dedicated the last decade to mastering the art of hyper-realism. My work primarily focuses on the human portrait, seeking to capture not just a likeness, but the very essence of the soul.
                            </p>
                            <p>
                                Every stroke of graphite or smudge of charcoal is a deliberate choice. A single portrait often takes upwards of 80 hours of focused dedication to achieve the depth and texture that hyper-realism demands.
                            </p>
                        </div>
                        <div className="flex gap-6 pt-4">
                            <a href="#" className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-24 md:py-32 px-4 bg-neutral-50 dark:bg-neutral-950">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <h2 className="text-4xl md:text-5xl font-serif dark:text-white">Philosophy of Perception</h2>
                    <div className="grid md:grid-cols-3 gap-12 text-left mt-20">
                        <div className="space-y-4">
                            <span className="text-4xl font-serif italic text-neutral-300 dark:text-neutral-800 block">01</span>
                            <h3 className="text-xl font-bold uppercase tracking-widest dark:text-white">Extreme Focus</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                                Beyond the surface level, searching for the microscopic details—the pores, the fine wrinkles, the subtle reflections in the iris.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="text-4xl font-serif italic text-neutral-300 dark:text-neutral-800 block">02</span>
                            <h3 className="text-xl font-bold uppercase tracking-widest dark:text-white">Eternal Patience</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                                Art cannot be rushed. Each piece is a journey of thousands of strokes, layered slowly over weeks to build realistic depth.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="text-4xl font-serif italic text-neutral-300 dark:text-neutral-800 block">03</span>
                            <h3 className="text-xl font-bold uppercase tracking-widest dark:text-white">Archival Sanctity</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                                Using only museum-grade archival papers and professional lightfast pencils to ensure your artwork lasts for generations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32 px-4 border-t dark:border-neutral-900">
                <div className="max-w-3xl mx-auto text-center space-y-10">
                    <h2 className="text-4xl md:text-5xl font-serif dark:text-white italic">"Ready to immortalize a memory?"</h2>
                    <p className="text-neutral-500 md:text-lg">
                        I am currently accepting a limited number of commissions for the upcoming months. Whether it's a portrait of a loved one or a personal project, let's create something timeless together.
                    </p>
                    <div className="pt-6">
                        <Link href="/commission" className="inline-flex items-center gap-3 bg-black text-white dark:bg-white dark:text-black py-5 px-10 font-bold uppercase tracking-[0.2em] text-xs hover:scale-105 transition-transform">
                            Inquire Now <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
