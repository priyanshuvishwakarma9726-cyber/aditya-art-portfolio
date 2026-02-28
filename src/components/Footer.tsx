import Link from 'next/link';
import { Instagram, Twitter, Linkedin, MessageCircle, ArrowUpRight } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const sections = [
        {
            title: "Studio",
            links: [
                { name: "About Artist", href: "/about" },
                { name: "The Process", href: "/process" },
                { name: "Gallery", href: "/gallery" },
                { name: "Contact", href: "/contact" }
            ]
        },
        {
            title: "Collection",
            links: [
                { name: "Original Shop", href: "/shop" },
                { name: "Limited Drops", href: "/shop" },
                { name: "Virtual Exhibition", href: "/exhibition" },
                { name: "Digital (NFTs)", href: "/nft" }
            ]
        },
        {
            title: "Support",
            links: [
                { name: "Terms of Service", href: "/terms" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Refund Policy", href: "/refund-policy" },
                { name: "Track Order", href: "/track" }
            ]
        }
    ];

    return (
        <footer className="bg-neutral-50 dark:bg-black border-t dark:border-neutral-900 pt-24 pb-12 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-24">
                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-2 space-y-8">
                        <Link href="/" className="font-serif text-3xl font-bold tracking-tighter">
                            ADITYA ART STUDIO.
                        </Link>
                        <p className="text-neutral-500 max-w-sm leading-relaxed text-sm lg:text-base italic">
                            Immortality through pencil, bridging the gap between human emotion and physical medium. Based in India, shipping globally.
                        </p>
                        <div className="flex gap-5 pt-4">
                            <a href="#" className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Nav Columns */}
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link href={link.href} className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors text-sm font-medium flex items-center group gap-1">
                                            {link.name}
                                            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -translate-y-1 translate-x-1 transition-all" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t dark:border-neutral-900 gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-mono tracking-widest text-neutral-500 uppercase">
                        <span>© {currentYear} Aditya Art Studio</span>
                        <span className="hidden md:inline">•</span>
                        <span>Built with Precision in 2026</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="https://wa.me/919999999999" target="_blank" className="flex items-center gap-2 text-green-600 hover:text-green-500 transition font-bold text-xs uppercase tracking-widest">
                            <MessageCircle size={16} /> WhatsApp Support
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
