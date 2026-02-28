'use client';

import React, { useState } from 'react';
import { Settings2, Clock, CheckCircle2, Box } from 'lucide-react';

export default function StoreManagementClient({ initialProducts }: { initialProducts: any[] }) {
    const [products, setProducts] = useState(initialProducts);
    const [updating, setUpdating] = useState<string | null>(null);

    const toggleForSale = async (id: string, currentStatus: boolean) => {
        setUpdating(id);
        try {
            const res = await fetch('/api/admin/artworks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'toggleSale', value: !currentStatus })
            });
            if (!res.ok) throw new Error();
            setProducts(products.map(p => p.id === id ? { ...p, for_sale: !currentStatus } : p));
        } catch {
            alert('Update failed');
        } finally {
            setUpdating(null);
        }
    };

    const handleStockUpdate = async (id: string, newStock: number) => {
        setUpdating(id);
        try {
            const res = await fetch('/api/admin/artworks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'updateStock', value: newStock })
            });
            if (!res.ok) throw new Error();
            setProducts(products.map(p => p.id === id ? { ...p, stock_count: newStock } : p));
        } catch {
            alert('Update failed');
        } finally {
            setUpdating(null);
        }
    };

    const toggleLimitedDrop = async (id: string, currentStatus: boolean, dropTime: string | null) => {
        // If enabling drop, prompt for time in hours from now
        let finalTime = null;
        if (!currentStatus) {
            const hours = prompt("Enter hours until Drop Ends (e.g. 24, 48). Or leave empty to keep existing.");
            if (hours) {
                const end = new Date();
                end.setHours(end.getHours() + Number(hours));
                finalTime = end.toISOString();
            } else if (!dropTime) {
                alert("You must provide a dropdown end time for a new drop.");
                return;
            } else {
                finalTime = dropTime; // Keep old
            }
        }

        setUpdating(id);
        try {
            const res = await fetch('/api/admin/artworks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'toggleDrop', value: !currentStatus, drop_end_time: finalTime })
            });
            if (!res.ok) throw new Error();
            setProducts(products.map(p => p.id === id ? { ...p, is_limited_drop: !currentStatus, drop_end_time: finalTime || p.drop_end_time } : p));
        } catch {
            alert('Update failed');
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
                <div className="col-span-full p-10 text-center bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl text-neutral-500 uppercase tracking-widest text-sm font-bold shadow-sm">
                    No artworks available in the store.
                </div>
            ) : (
                products.map((p) => (
                    <div key={p.id} className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col gap-4">
                        <div className="flex justify-between items-start border-b dark:border-neutral-800 pb-4">
                            <div className="flex gap-4 items-center overflow-hidden">
                                <img src={p.image_url} alt="" className="w-12 h-12 object-cover rounded bg-neutral-200 shrink-0" />
                                <div className="min-w-0">
                                    <h3 className="font-serif font-bold dark:text-white truncate">{p.title}</h3>
                                    <p className="text-xs text-neutral-500 truncate">{p.category_name} • Total Sold: {p.total_sold}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-b dark:border-neutral-800 pb-4">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">For Sale</h3>
                                <button
                                    disabled={updating === p.id}
                                    onClick={() => toggleForSale(p.id, p.for_sale)}
                                    className={`w-full py-2 rounded text-[10px] uppercase tracking-widest font-bold transition-all ${p.for_sale ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500' : 'bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'}`}
                                >
                                    {p.for_sale ? 'Active' : 'Hidden'}
                                </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Stock</h3>
                                <div className="flex items-center gap-2">
                                    <Box size={14} className="opacity-50" />
                                    <input
                                        type="number"
                                        min="0"
                                        value={p.stock_count}
                                        onChange={(e) => handleStockUpdate(p.id, Number(e.target.value))}
                                        disabled={updating === p.id}
                                        className="w-full bg-transparent border dark:border-neutral-700 rounded px-2 py-1.5 text-center font-mono focus:border-black outline-none h-[32px] text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center mt-auto pt-2">
                            <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-2 w-full text-left">Limited Drop</h3>
                            <button
                                disabled={updating === p.id}
                                onClick={() => toggleLimitedDrop(p.id, p.is_limited_drop, p.drop_end_time)}
                                className={`w-full flex justify-center items-center gap-2 px-3 py-2 rounded text-[10px] uppercase tracking-widest font-bold transition-all ${p.is_limited_drop ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'}`}
                            >
                                <Clock size={12} />
                                {p.is_limited_drop ? 'Drop Active' : 'Enable Drop'}
                            </button>
                            {p.is_limited_drop && p.drop_end_time && (
                                <div className="text-[10px] text-neutral-500 mt-2 font-mono w-full text-center">
                                    Ends: {new Date(p.drop_end_time).toLocaleDateString()}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center border-t dark:border-neutral-800 pt-4 mt-2">
                            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Settings</span>
                            <button className="text-neutral-400 hover:text-black dark:hover:text-white p-1" title="Edit Metadata">
                                <Settings2 size={16} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
