'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Search } from 'lucide-react';

export default function BlogGrid({ initialPosts }: { initialPosts: any[] }) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    const categories = useMemo(() => {
        const set = new Set(initialPosts.map(p => p.category_name).filter(Boolean));
        return ['All', ...Array.from(set)];
    }, [initialPosts]);

    const filtered = useMemo(() => {
        return initialPosts.filter(p => {
            const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt && p.excerpt.toLowerCase().includes(search.toLowerCase()));
            const matchCategory = category === 'All' || p.category_name === category;
            return matchSearch && matchCategory;
        });
    }, [initialPosts, search, category]);

    // Simple Pagination logic
    const ITEMS_PER_PAGE = 6;
    const [page, setPage] = useState(1);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col lg:flex-row gap-12">

            {/* Sidebar Tools */}
            <aside className="lg:w-64 shrink-0 flex flex-col gap-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-800 rounded p-3 pl-10 text-sm focus:border-black dark:focus:border-white outline-none transition"
                    />
                </div>

                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 border-b dark:border-neutral-800 pb-2">Filter Category</h3>
                    <div className="flex flex-col gap-3">
                        {categories.map((c: any) => (
                            <button
                                key={c}
                                onClick={() => { setCategory(c); setPage(1); }}
                                className={`text-left text-sm transition-all ${category === c ? 'font-bold text-black dark:text-white pl-2 border-l-2 border-black dark:border-white' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Grid Area */}
            <div className="flex-1 flex flex-col min-h-[50vh]">
                {filtered.length === 0 ? (
                    <div className="text-center text-neutral-500 mt-20 p-8 border border-dashed dark:border-neutral-800 rounded">
                        No articles found matching that criteria.
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 gap-10">
                            {paginated.map((post, idx) => (
                                <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col">
                                    <div className="aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden rounded border dark:border-neutral-800 mb-6 relative">
                                        {post.cover_image && (
                                            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" />
                                        )}
                                        {idx === 0 && page === 1 && category === 'All' && !search && (
                                            <span className="absolute top-4 left-4 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-lg">Featured</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold text-neutral-500 mb-3">
                                        <span className="text-black dark:text-white">{post.category_name || 'Studio'}</span>
                                        <span>•</span>
                                        <span>{post.published_at ? format(new Date(post.published_at), 'MMMM dd, yyyy') : 'Draft'}</span>
                                    </div>

                                    <h2 className="text-2xl font-serif text-black dark:text-white leading-tight mb-3 group-hover:underline underline-offset-4 decoration-1">{post.title}</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16 pt-8 border-t dark:border-neutral-800 flex justify-center gap-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-10 h-10 flex items-center justify-center font-bold text-sm tracking-widest cursor-pointer transition-colors ${page === i + 1 ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    );
}
