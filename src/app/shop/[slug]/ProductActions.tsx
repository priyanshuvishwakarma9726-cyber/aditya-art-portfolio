'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/components/store/CartProvider';
import Countdown from '@/components/store/Countdown';
import { Heart, ShoppingBag } from 'lucide-react';

interface ProductActionsProps {
    product: any;
    isOutOfStock: boolean;
    isLimitedDrop: boolean;
    dropEndTime: string | null;
}

export default function ProductActions({ product, isOutOfStock, isLimitedDrop, dropEndTime }: ProductActionsProps) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [wished, setWished] = useState(false);
    const [expired, setExpired] = useState(false);

    // Initial Wishlist Load (Local Storage approach for speed, can sync to DB via API later)
    useEffect(() => {
        const stored = localStorage.getItem('aditya_wishlist');
        if (stored) {
            const list = JSON.parse(stored);
            if (list.includes(product.id)) setWished(true);
        }
    }, [product.id]);

    const handleWishlist = async () => {
        try {
            // Optimistic UI
            setWished(!wished);
            const stored = JSON.parse(localStorage.getItem('aditya_wishlist') || '[]');

            if (!wished) {
                stored.push(product.id);
                // Also attempt DB sync silently
                fetch('/api/cart/wishlist', { method: 'POST', body: JSON.stringify({ artworkId: product.id }) }).catch(() => { });
            } else {
                const index = stored.indexOf(product.id);
                if (index > -1) stored.splice(index, 1);
                fetch(`/api/cart/wishlist?id=${product.id}`, { method: 'DELETE' }).catch(() => { });
            }

            localStorage.setItem('aditya_wishlist', JSON.stringify(stored));
        } catch (e) {
            console.error('Wishlist error', e);
        }
    };

    const handleAdd = () => {
        if (isOutOfStock || expired) return;

        addToCart({
            artworkId: product.id,
            qty: 1,
            title: product.title,
            price: Number(product.price),
            imageUrl: product.image_url
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const finalOutOfStock = isOutOfStock || expired || product.stock_count <= 0;

    return (
        <div className="flex flex-col gap-6">
            {/* Stock Counters & Timers */}
            <div>
                {isLimitedDrop && dropEndTime && !expired && (
                    <Countdown targetDate={dropEndTime} onExpire={() => setExpired(true)} />
                )}

                {!finalOutOfStock && product.stock_count > 0 && product.stock_count < 5 && (
                    <p className="text-amber-500 font-bold tracking-widest text-xs uppercase animate-pulse">
                        Only {product.stock_count} Left In Studio
                    </p>
                )}
                {finalOutOfStock && (
                    <p className="text-red-500 font-bold tracking-widest text-sm uppercase">
                        Currently Unavailable
                    </p>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 items-stretch h-14">
                <button
                    onClick={handleAdd}
                    disabled={finalOutOfStock || added}
                    className={`flex-1 flex items-center justify-center gap-3 uppercase tracking-widest font-bold text-sm transition-all duration-300
                    ${finalOutOfStock
                            ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                            : added
                                ? 'bg-green-600 text-white'
                                : 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black hover:dark:opacity-80'}`}
                >
                    <ShoppingBag size={18} />
                    {added ? 'Secured in Cart' : finalOutOfStock ? 'Sold Out' : 'Order with 50% Advance'}
                </button>

                <button
                    onClick={handleWishlist}
                    className={`aspect-square w-14 flex items-center justify-center border transition-all duration-300 rounded
                    ${wished ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 text-red-500' : 'bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white'}`}
                >
                    <Heart size={20} className={wished ? 'fill-current' : ''} />
                </button>
            </div>
        </div>
    );
}
