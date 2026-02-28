import { ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';
import Link from 'next/link';
import { Emoji } from '@/components/Emoji';

export const metadata = {
    title: 'Digital Editions | Aditya Vishwakarma',
    description: 'Explore the digital scarcity of Adityas hyper-realistic artworks through curated NFT collections on the Ethereum blockchain.'
};

export default function NFTPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-20">
            {/* Dark Tech Hero */}
            <section className="py-24 md:py-40 px-4 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto space-y-10 z-10 relative animate-fade-in">
                    <span className="text-xs font-bold uppercase tracking-[0.5em] text-cyan-400">Web3 Digital Scarcity</span>
                    <h1 className="text-6xl md:text-8xl font-serif tracking-tighter italic">Proof of Artist</h1>
                    <p className="max-w-xl mx-auto text-neutral-400 font-light tracking-wide text-lg">
                        Bridging the tactile texture of physical graphite with the immutable permanence of the blockchain.
                    </p>
                    <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <a href="https://opensea.io" target="_blank" className="bg-cyan-500 text-black px-10 py-5 font-bold uppercase tracking-widest text-xs hover:bg-cyan-400 transition shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                            Explore on OpenSea
                        </a>
                        <Link href="/gallery" className="text-neutral-500 hover:text-white transition uppercase text-xs font-bold tracking-widest border-b border-neutral-800 pb-2">
                            View Physical Works
                        </Link>
                    </div>
                </div>

                {/* Animated tech background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent rotate-45"></div>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -rotate-45"></div>
                </div>
            </section>

            {/* Why Digital? */}
            <section className="py-32 px-4 border-y border-neutral-900 bg-black">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <Cpu className="text-cyan-500 mb-6" size={32} />
                        <h3 className="text-xl font-bold uppercase tracking-widest">Hi-Res Scans</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            Every NFT is backed by a 1200 DPI archival scan, preserving every pencil grain invisible to the naked eye.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <ShieldCheck className="text-cyan-500 mb-6" size={32} />
                        <h3 className="text-xl font-bold uppercase tracking-widest">Ownership</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            Verified digital provenance ensuring you own a piece of Adityas artistic journey, cryptographically signed.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <Zap className="text-cyan-500 mb-6" size={32} />
                        <h3 className="text-xl font-bold uppercase tracking-widest">Hybrid Drop</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            Some digital editions include a physical certificate or a signed print delivered to the token holder.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <Globe className="text-cyan-500 mb-6" size={32} />
                        <h3 className="text-xl font-bold uppercase tracking-widest">Community</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            Holding an Aditya Art token grants early access to future commissions and private exhibition viewings.
                        </p>
                    </div>
                </div>
            </section>

            {/* Active Collections Preview */}
            <section className="py-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-16 border-b border-neutral-900 pb-10">
                        <div>
                            <h2 className="text-4xl font-serif italic">Curated Collections</h2>
                            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-4">Selected on-chain releases</p>
                        </div>
                        <div className="text-sm font-bold uppercase text-cyan-500 tracking-tighter">Verified Creator <Emoji emoji="✅" /></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Genesis Collection */}
                        <div className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-neutral-900">
                            <img
                                src="/nft-genesis.jpg"
                                className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                                alt="Genesis Collection"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
                                <h4 className="text-3xl font-serif italic mb-2">The Genesis Series</h4>
                                <p className="text-neutral-400 text-sm font-mono tracking-widest uppercase mb-6">Edition of 10 • sold out</p>
                                <div className="flex gap-4">
                                    <button className="bg-white text-black text-xs font-bold uppercase tracking-widest px-6 py-3 rounded">View Items</button>
                                </div>
                            </div>
                        </div>

                        {/* Shadow & Light */}
                        <div className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-neutral-900">
                            <img
                                src="/nft-shadow.jpg"
                                className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                                alt="Shadow & Light Collection"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
                                <h4 className="text-3xl font-serif italic mb-2">Shadow & Light</h4>
                                <p className="text-neutral-400 text-sm font-mono tracking-widest uppercase mb-6">Fractionalized Originals • active</p>
                                <div className="flex gap-4">
                                    <button className="bg-cyan-500 text-black text-xs font-bold uppercase tracking-widest px-6 py-3 rounded">Bid on Foundation</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Overlay specifically for NFT drops */}
            <section className="py-24 px-4 bg-neutral-950">
                <div className="max-w-3xl mx-auto text-center space-y-10">
                    <h2 className="text-3xl font-serif italic">Never miss a drop.</h2>
                    <p className="text-neutral-500">Join the whitelist for upcoming digital-to-physical hybrid releases.</p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Wallet Address / Email"
                            className="flex-grow bg-black border border-neutral-800 px-6 py-4 rounded focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <button className="bg-white text-black py-4 px-10 font-bold uppercase tracking-widest text-xs">Join</button>
                    </form>
                </div>
            </section>
        </div>
    );
}
