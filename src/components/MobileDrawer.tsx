'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function MobileDrawer({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);

    // Lock body scroll when drawer open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <div className="md:hidden flex items-center">
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 -mr-2 text-black dark:text-white"
                aria-label="Open Menu"
            >
                <Menu size={28} />
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] animate-in fade-in transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-white dark:bg-black z-[100] transform transition-transform duration-300 ease-in-out border-l dark:border-neutral-900 shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b dark:border-neutral-900">
                    <span className="font-serif font-bold tracking-tight text-xl">ADITYA.</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 -mr-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                        aria-label="Close Menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Links */}
                <div className="flex flex-col p-6 gap-6 text-xl tracking-tight font-medium overflow-y-auto">
                    <Link onClick={() => setIsOpen(false)} href="/shop" className="hover:text-black/60 dark:hover:text-white/60 transition">
                        Shop Store
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href="/blog" className="hover:text-black/60 dark:hover:text-white/60 transition">
                        Journal / Blog
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href="/gallery" className="hover:text-black/60 dark:hover:text-white/60 transition">
                        Gallery Work
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href="/commission" className="hover:text-black/60 dark:hover:text-white/60 transition">
                        Book Commission
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href="/about" className="hover:text-black/60 dark:hover:text-white/60 transition">
                        Artist Story
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href="/process" className="hover:text-black/60 dark:hover:text-white/60 transition">
                        The Process
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href="/exhibition" className="hover:text-black/60 dark:hover:text-white/60 transition">
                        Virtual Exhibition
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href="/nft" className="hover:text-black/60 dark:hover:text-white/60 transition">
                        NFT Collection
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href="/contact" className="hover:text-black/60 dark:hover:text-white/60 transition">
                        Contact Studio
                    </Link>

                    <hr className="dark:border-neutral-900 border-neutral-100 my-2" />

                    <Link onClick={() => setIsOpen(false)} href="/wishlist" className="hover:text-black/60 dark:hover:text-white/60 transition text-lg text-neutral-600 dark:text-neutral-400">
                        My Wishlist
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href="/cart" className="hover:text-black/60 dark:hover:text-white/60 transition text-lg text-neutral-600 dark:text-neutral-400">
                        Shopping Cart
                    </Link>

                    {user && (
                        <div className="mt-8 pt-6 border-t dark:border-neutral-900">
                            <Link
                                onClick={() => setIsOpen(false)}
                                href="/admin"
                                className="block w-full text-center py-4 bg-black text-white dark:bg-white dark:text-black rounded text-sm tracking-widest uppercase font-bold"
                            >
                                Admin Dashboard
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
