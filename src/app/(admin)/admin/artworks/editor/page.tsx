'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ArtworkEditor() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: '',
        slug: '',
        description: '',
        category_id: 1,
        price: 5000,
        is_commission: false,
        stock_count: 1,
        width_cm: 21,
        height_cm: 29.7,
        for_sale: true,
        is_active: true,
        image_url: '',
        before_image_url: '',
        after_image_url: ''
    });

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);
        uploadData.append('folder', 'artworks');

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData,
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Upload failed');
            }
            const data = await res.json();
            setForm((prev) => ({ ...prev, [field]: data.url }));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/artworks/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ artworks: [form] }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to create artwork');
            }
            router.push('/admin/artworks');
            router.refresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="max-w-4xl space-y-8 animate-fade-in-up pb-32">
            <h1 className="text-3xl font-serif dark:text-white mb-6">Create New Artwork</h1>

            <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-8 space-y-6 shadow-sm">

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Title</label>
                        <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className="w-full text-lg p-3 bg-neutral-50 dark:bg-neutral-950 border dark:border-neutral-800 rounded focus:border-black outline-none" placeholder="Artwork Title" />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">URI Slug</label>
                        <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full text-lg p-3 bg-neutral-50 dark:bg-neutral-950 border dark:border-neutral-800 rounded focus:border-black outline-none font-mono" />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Description</label>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-3 bg-neutral-50 dark:bg-neutral-950 border dark:border-neutral-800 rounded focus:border-black outline-none h-32 resize-none" />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Price (₹)</label>
                        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full p-3 bg-neutral-50 dark:bg-neutral-950 border dark:border-neutral-800 rounded font-mono" />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Stock Count</label>
                        <input type="number" value={form.stock_count} onChange={e => setForm({ ...form, stock_count: Number(e.target.value) })} className="w-full p-3 bg-neutral-50 dark:bg-neutral-950 border dark:border-neutral-800 rounded font-mono" />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Category ID</label>
                        <input type="number" value={form.category_id} onChange={e => setForm({ ...form, category_id: Number(e.target.value) })} className="w-full p-3 bg-neutral-50 dark:bg-neutral-950 border dark:border-neutral-800 rounded font-mono" />
                    </div>
                </div>

                <hr className="dark:border-neutral-800" />

                <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">Media Uploads</h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Final Image */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 flex justify-between">
                                Final Image (Required)
                            </label>
                            <input
                                type="file" required accept="image/jpeg, image/png, image/webp"
                                onChange={e => handleUpload(e, 'image_url')}
                                className="w-full text-xs text-neutral-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-neutral-800 file:text-white hover:file:bg-black cursor-pointer mb-2"
                            />
                            {form.image_url && <img src={form.image_url} alt="" className="w-full aspect-square object-cover rounded border dark:border-neutral-800" />}
                        </div>

                        {/* Before Image */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 flex justify-between">
                                Before Image (Optional)
                            </label>
                            <input
                                type="file" accept="image/jpeg, image/png, image/webp"
                                onChange={e => handleUpload(e, 'before_image_url')}
                                className="w-full text-xs text-neutral-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-neutral-800 file:text-white hover:file:bg-black cursor-pointer mb-2"
                            />
                            {form.before_image_url && <img src={form.before_image_url} alt="" className="w-full aspect-square object-cover rounded border dark:border-neutral-800" />}
                        </div>

                        {/* After Image */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 flex justify-between">
                                After Image (Optional)
                            </label>
                            <input
                                type="file" accept="image/jpeg, image/png, image/webp"
                                onChange={e => handleUpload(e, 'after_image_url')}
                                className="w-full text-xs text-neutral-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-neutral-800 file:text-white hover:file:bg-black cursor-pointer mb-2"
                            />
                            {form.after_image_url && <img src={form.after_image_url} alt="" className="w-full aspect-square object-cover rounded border dark:border-neutral-800" />}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t dark:border-neutral-800 flex justify-end">
                    <button type="submit" disabled={loading || !form.image_url} className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest rounded hover:opacity-80 transition disabled:opacity-50">
                        {loading ? 'Creating...' : 'Publish Artwork'}
                    </button>
                </div>

            </div>
        </form>
    );
}
