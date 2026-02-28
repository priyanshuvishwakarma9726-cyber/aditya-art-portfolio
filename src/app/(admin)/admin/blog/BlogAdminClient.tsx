'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings2, Trash2, Edit3, Eye } from 'lucide-react';

export default function BlogAdminClient({ initialPosts }: { initialPosts: any[] }) {
    const [posts, setPosts] = useState(initialPosts);

    const togglePublish = async (id: number, current: boolean) => {
        try {
            // Re-fetch the full post from server or just build a PATCH if the API allowed partial updates
            // Our API currently expects a full PUT, so we need a cleaner PATCH route. 
            // Wait, we can implement a partial update in API. 
            // Let's implement a PATCH specifically later, or for now, prompt to "Edit" to publish instead to prevent accidental empty overrides.
            // Editing within the Editor is safer for metadata generation.
        } catch {
            alert("Failed toggle.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you positive? This action is irreversible.")) return;
        try {
            const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            setPosts(posts.filter(p => p.id !== id));
        } catch {
            alert("Deletion failed.");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.length === 0 ? (
                <div className="col-span-full p-10 text-center bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl text-neutral-500 uppercase tracking-widest text-sm font-bold shadow-sm">
                    No articles currently drafted. The journal is empty.
                </div>
            ) : (
                posts.map((p) => (
                    <div key={p.id} className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col gap-4">
                        <div className="flex justify-between items-start border-b dark:border-neutral-800 pb-4">
                            <div className="flex gap-4 items-center overflow-hidden">
                                <div className="w-12 h-12 bg-neutral-200 dark:bg-black rounded overflow-hidden shrink-0">
                                    {p.cover_image && <img src={p.cover_image} className="w-full h-full object-cover" alt="" />}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-serif font-bold dark:text-white truncate">{p.title}</h3>
                                    <p className="text-xs text-neutral-500 font-mono truncate">/{p.slug}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Status</h3>
                                <span className={`px-2 py-1 inline-block rounded-sm text-[10px] uppercase tracking-widest font-bold ${p.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500'}`}>
                                    {p.is_published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Date</h3>
                                <p className="text-sm font-semibold">{p.published_at ? new Date(p.published_at).toLocaleDateString() : new Date(p.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center border-t dark:border-neutral-800 pt-4 mt-auto">
                            <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Actions</h3>
                            <div className="flex items-center gap-3 text-neutral-400">
                                {p.is_published && (
                                    <a href={`/blog/${p.slug}`} target="_blank" className="hover:text-black dark:hover:text-white transition">
                                        <Eye size={16} />
                                    </a>
                                )}
                                <Link href={`/admin/blog/edit/${p.id}`} className="hover:text-black dark:hover:text-white transition">
                                    <Edit3 size={16} />
                                </Link>
                                <button onClick={() => handleDelete(p.id)} className="hover:text-red-500 transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
