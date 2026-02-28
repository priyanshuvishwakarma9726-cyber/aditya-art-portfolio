'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeartCrack } from 'lucide-react';

export default function WishlistClient({ initialData, isAuthed }: { initialData: any[] | null, isAuthed: boolean }) {
    const [items, setItems] = useState<any[]>(initialData || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If they are not logged in, we fetch from their localStorage keys
        if (!isAuthed && initialData === null) {
            const stored = localStorage.getItem('aditya_wishlist');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.length > 0) {
                    setLoading(true);
                    fetch(`/api/artworks/batch?ids=${parsed.join(',')}`)
                        .then(res => res.json())
                        .then(data => setItems(data))
                        .catch(() => { })
                        .finally(() => setLoading(false));
                }
            }
        }
    }, [isAuthed, initialData]);

    const removeWish = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Remove optimistically
        setItems(prev => prev.filter(i => i.id !== id));

        // Remove locally
        let stored = JSON.parse(localStorage.getItem('aditya_wishlist') || '[]');
        stored = stored.filter((savedId: string) => savedId !== id);
        localStorage.setItem('aditya_wishlist', JSON.stringify(stored));

        // Attempt server delete quietly if auth
        fetch(`/api/cart/wishlist?id=${id}`, { method: 'DELETE' }).catch(() => { });
    };

    if (loading) {
        return <div className="text-center font-mono text-neutral-500 uppercase tracking-widest text-sm animate-pulse">Loading collection...</div>;
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                <HeartCrack className="w-16 h-16 mb-6 opacity-50" />
                <p>Your wishlist is currently empty.</p>
                <Link href="/shop" className="mt-8 bg-black text-white dark:bg-white dark:text-black hover:opacity-80 px-6 py-3 font-bold uppercase tracking-widest text-sm">
                    Explore Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map(p => (
                <div key={p.id} className="relative group">
                    <Link href={`/shop/${p.slug}`} className="flex flex-col text-left block h-full">
                        <div className="relative w-full aspect-square overflow-hidden mb-4 bg-neutral-100 dark:bg-neutral-900 border dark:border-neutral-800 p-4 rounded cursor-pointer group-hover:shadow-lg transition-all">
                            <img src={p.image_url} alt={p.title} className="object-cover w-full h-full mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-700" />

                            {/* Badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {p.is_limited_drop && <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow">Edition Drop</span>}
                                {p.stock_count === 0 && <span className="bg-black text-white text-[10px] uppercase font-bold px-2 py-0.5 shadow">Sold Out</span>}
                            </div>
                        </div>

                        <h2 className="text-lg font-serif text-black dark:text-white mb-1 px-1 truncate w-full">{p.title}</h2>
                        <p className="font-medium text-sm text-black dark:text-neutral-300 px-1 mb-2">₹{Number(p.price).toFixed(2)}</p>
                    </Link>

                    <button
                        onClick={(e) => removeWish(p.id, e)}
                        className="absolute bottom-16 right-6 bg-red-50 text-red-500 dark:bg-red-900/20 px-3 py-1 rounded text-xs font-bold shadow hover:bg-red-100 dark:hover:bg-red-800 transition z-10 uppercase tracking-widest"
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
}
