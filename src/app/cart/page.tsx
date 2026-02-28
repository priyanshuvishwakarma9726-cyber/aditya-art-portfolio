'use client';

import React, { useState } from 'react';
import { useCart } from '@/components/store/CartProvider';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
    const { items, removeFromCart, clearCart } = useCart();
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [address, setAddress] = useState('');
    const [coupon, setCoupon] = useState('');

    const cartTotal = items.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
    // Simple mock coupon logic
    const applyDiscount = coupon === 'ART2026' ? 0.1 : 0;
    const finalTotal = cartTotal * (1 - applyDiscount);

    const handleCheckout = async () => {
        if (!address) return alert("Shipping address is required.");

        setIsCheckingOut(true);
        try {
            const apiItems = items.map(i => ({ artworkId: i.artworkId, qty: i.qty }));
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: apiItems, address, couponCode: coupon })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Checkout failed.");
            }

            const data = await res.json();
            clearCart();

            // Navigate to newly created UPI Payment Flow
            router.push(`/payment/${data.trackingId}`);

        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <ShoppingBag className="w-16 h-16 text-neutral-300 mb-4" />
                <h1 className="text-3xl font-serif text-neutral-900 dark:text-white">Your Cart is Empty</h1>
                <a href="/shop" className="mt-8 px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest text-sm hover:opacity-80">
                    Browse Originals
                </a>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-20 animate-fade-in-up">
            <h1 className="text-4xl font-serif mb-10 text-neutral-900 dark:text-white border-b pb-4 border-neutral-200 dark:border-neutral-800">
                Studio Cart
            </h1>

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {items.map(item => (
                        <div key={item.artworkId} className="flex gap-6 items-center border dark:border-neutral-800 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                            {/* In a real app, Next Image goes here */}
                            <div className="w-24 h-24 bg-neutral-200 dark:bg-black rounded object-cover overflow-hidden">
                                {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-serif text-xl">{item.title}</h3>
                                <p className="text-sm text-neutral-500 uppercase tracking-widest mt-1">Qty: {item.qty}</p>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-lg">₹{(item.price * item.qty).toFixed(2)}</p>
                                <button onClick={() => removeFromCart(item.artworkId)} className="text-red-500 hover:text-red-700 mt-2 p-2">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1 bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-lg p-6 shadow-sm h-max sticky top-20">
                    <h2 className="text-2xl font-serif mb-6 border-b dark:border-neutral-800 pb-4">Order Summary</h2>

                    <div className="space-y-4 text-sm mb-6">
                        <div className="flex justify-between text-neutral-500">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>

                        <div className="mt-4">
                            <label className="text-xs uppercase font-bold tracking-widest opacity-50 mb-2 block">Discount Code (Try 'ART2026')</label>
                            <div className="flex gap-2">
                                <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="COUPON" className="p-2 border dark:border-neutral-700 bg-transparent w-full uppercase" />
                            </div>
                            {applyDiscount > 0 && <p className="text-green-600 text-xs mt-2">10% Off applied!</p>}
                        </div>

                        <div className="pt-4 border-t dark:border-neutral-800 flex justify-between font-bold text-lg mt-4 font-serif">
                            <span>Total (INR)</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>

                        <div className="pt-2 flex justify-between text-blue-500 font-bold">
                            <span className="text-xs uppercase tracking-widest">Advance Due Today (50%)</span>
                            <span>₹{(finalTotal / 2).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Shipping Details</label>
                        <textarea
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full border dark:border-neutral-700 bg-transparent p-3 min-h-[100px]"
                            placeholder="Full delivery address with Pincode..."
                            required
                        />
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut || !address}
                        className="w-full bg-black text-white dark:bg-white dark:text-black py-4 font-bold uppercase tracking-widest hover:opacity-80 disabled:opacity-50 transition"
                    >
                        {isCheckingOut ? 'Securing Stock...' : 'Pay 50% Advance via UPI'}
                    </button>
                    <p className="text-xs text-center text-neutral-400 mt-4 leading-relaxed">
                        After confirming, you will be redirected to the secure offline UPI payment portal to scan and verify your transaction screenshot.
                    </p>
                </div>
            </div>
        </div>
    );
}
