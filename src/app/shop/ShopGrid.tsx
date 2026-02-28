'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export default function ShopGrid({ initialProducts }: { initialProducts: any[] }) {
    const [sort, setSort] = useState('newest');
    const [filterCategory, setFilterCategory] = useState('All');

    const categories = useMemo(() => {
        const set = new Set(initialProducts.map(p => p.category_name).filter(Boolean));
        return ['All', ...Array.from(set)];
    }, [initialProducts]);

    const displayProducts = useMemo(() => {
        let items = [...initialProducts];

        // Filter
        if (filterCategory !== 'All') {
            items = items.filter(p => p.category_name === filterCategory);
        }

        // Sort
        if (sort === 'price_asc') {
            items.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sort === 'price_desc') {
            items.sort((a, b) => Number(b.price) - Number(a.price));
        } else {
            // Newest (Default, already sorted from DB DESC)
        }

        return items;
    }, [initialProducts, filterCategory, sort]);

    return (
        <div className="flex flex-col md:flex-row gap-10">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 flex flex-col gap-6 shrink-0">
                <div>
                    <h3 className="uppercase tracking-widest text-xs font-bold text-neutral-500 mb-4 border-b pb-2 dark:border-neutral-800">Browse</h3>
                    <div className="flex flex-col gap-2 text-sm">
                        {categories.map((c: any) => (
                            <button
                                key={c}
                                onClick={() => setFilterCategory(c)}
                                className={`text-left hover:text-black dark:hover:text-white transition-colors ${filterCategory === c ? 'text-black dark:text-white font-bold' : 'text-neutral-400'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="uppercase tracking-widest text-xs font-bold text-neutral-500 mb-4 border-b pb-2 dark:border-neutral-800">Sort By</h3>
                    <select
                        className="bg-transparent border dark:border-neutral-800 rounded p-2 text-sm w-full dark:text-white outline-none focus:border-black"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option className="dark:bg-black" value="newest">Newest Arrivals</option>
                        <option className="dark:bg-black" value="price_asc">Price: Low to High</option>
                        <option className="dark:bg-black" value="price_desc">Price: High to Low</option>
                    </select>
                </div>
            </aside>

            {/* Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayProducts.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-neutral-500">
                        No pieces currently match your criteria.
                    </div>
                ) : (
                    displayProducts.map(p => (
                        <Link href={`/shop/${p.slug}`} key={p.id} className="group flex flex-col items-center text-center">
                            <div className="relative w-full aspect-square overflow-hidden mb-4 bg-neutral-100 dark:bg-neutral-900 border dark:border-neutral-800 p-4 rounded cursor-pointer">
                                <img src={p.image_url} alt={p.title} className="object-cover w-full h-full mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 ease-in-out group-hover:scale-105" />

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {p.is_limited_drop && (
                                        <span className="bg-red-500 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded shadow-lg animate-pulse">
                                            Edition Drop
                                        </span>
                                    )}
                                    {p.stock_count === 0 && (
                                        <span className="bg-black text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 shadow-lg">
                                            Sold Out
                                        </span>
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-1">{p.category_name || 'Original art'}</p>
                            <h2 className="text-xl font-serif text-black dark:text-white mb-2 leading-tight px-4 truncate w-full">{p.title}</h2>
                            <p className="font-medium text-lg text-black dark:text-neutral-300">
                                ₹{Number(p.price).toFixed(2)}
                            </p>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
