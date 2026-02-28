'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';

export default function BlogEditor({ initialData }: { initialData: any }) {
    const router = useRouter();

    const [form, setForm] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '# Hello World',
        cover_image: initialData?.cover_image || '',
        seo_title: initialData?.seo_title || '',
        seo_description: initialData?.seo_description || '',
        tags: initialData?.tags || '',
        is_published: initialData?.is_published ? true : false,
    });

    const [previewTab, setPreviewTab] = useState(false);
    const [loading, setLoading] = useState(false);

    const generateSlug = () => {
        setForm({ ...form, slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const method = initialData ? 'PUT' : 'POST';
            const payload = { ...form, id: initialData?.id };

            const res = await fetch('/api/admin/blog', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed saving article.");

            router.push('/admin/blog');
            router.refresh();

        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="grid lg:grid-cols-3 gap-8 pb-32">

            {/* Main Editor Body */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Post Title</label>
                    <input
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        onBlur={!initialData && !form.slug ? generateSlug : undefined}
                        className="w-full text-3xl font-serif bg-transparent border-b-2 dark:border-neutral-800 pb-2 focus:border-black outline-none placeholder:text-neutral-300 dark:text-white"
                        placeholder="The Graphite Renaissance..."
                    />
                </div>

                <div className="flex gap-4 items-center">
                    <button type="button" onClick={() => setPreviewTab(false)} className={`px-4 py-2 text-sm font-bold tracking-widest uppercase transition-colors rounded ${!previewTab ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-900 border dark:border-neutral-800 hover:text-black dark:hover:text-white'}`}>Raw Markdown</button>
                    <button type="button" onClick={() => setPreviewTab(true)} className={`px-4 py-2 text-sm font-bold tracking-widest uppercase transition-colors rounded ${previewTab ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-900 border dark:border-neutral-800 hover:text-black dark:hover:text-white'}`}>Live Preview</button>
                </div>

                <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl overflow-hidden min-h-[500px] flex shadow-sm">
                    {!previewTab ? (
                        <textarea
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            className="w-full h-full min-h-[500px] p-6 text-sm font-mono leading-relaxed bg-transparent outline-none resize-none dark:text-neutral-300"
                            placeholder="Write your article here..."
                            required
                        />
                    ) : (
                        <div className="w-full h-full min-h-[500px] p-10 bg-neutral-50 dark:bg-neutral-950 overflow-y-auto">
                            <MarkdownRenderer content={form.content} />
                        </div>
                    )}
                </div>
            </div>

            {/* Config Sidebar */}
            <aside className="w-full h-max bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-6 flex flex-col gap-6 shadow-sm sticky top-10">
                <h3 className="font-serif text-xl border-b dark:border-neutral-800 pb-4 dark:text-white">Publication Settings</h3>

                <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">URI Slug</label>
                    <input
                        required
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border dark:border-neutral-800 p-2 rounded text-sm font-mono focus:border-black outline-none"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Cover Image</label>
                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const uploadData = new FormData();
                            uploadData.append('image', file);
                            uploadData.append('folder', 'blog');

                            setLoading(true);
                            try {
                                const uploadRes = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: uploadData,
                                });
                                if (!uploadRes.ok) {
                                    const err = await uploadRes.json();
                                    throw new Error(err.error || 'File upload failed');
                                }
                                const uploadJson = await uploadRes.json();
                                setForm({ ...form, cover_image: uploadJson.url });
                            } catch (err: any) {
                                alert(err.message);
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-black transition-colors cursor-pointer"
                    />
                    {form.cover_image && <img src={form.cover_image} alt="" className="mt-4 w-full aspect-video object-cover rounded bg-neutral-200" />}
                </div>

                <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Excerpt (Listing Summary)</label>
                    <textarea
                        value={form.excerpt}
                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border dark:border-neutral-800 p-2 rounded text-sm focus:border-black outline-none resize-none h-24"
                    />
                </div>

                <div className="pt-4 border-t dark:border-neutral-800 flex flex-col gap-4">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">SEO Injectors</h4>
                    <input
                        value={form.seo_title}
                        onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                        placeholder="Overrides Title Tag..."
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border dark:border-neutral-800 p-2 rounded text-sm focus:border-black outline-none"
                    />
                    <input
                        value={form.seo_description}
                        onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                        placeholder="Overrides Meta Description..."
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border dark:border-neutral-800 p-2 rounded text-sm focus:border-black outline-none"
                    />
                    <input
                        value={form.tags}
                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                        placeholder="Tags (comma separated)..."
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border dark:border-neutral-800 p-2 rounded text-sm focus:border-black outline-none"
                    />
                </div>

                <div className="pt-4 border-t dark:border-neutral-800 flex items-center justify-between pb-8">
                    <label className="text-sm font-bold flex items-center gap-3 cursor-pointer dark:text-white">
                        <input
                            type="checkbox"
                            checked={form.is_published}
                            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                            className="w-4 h-4 accent-black dark:accent-white"
                        />
                        Publish Instantly
                    </label>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 bg-white dark:bg-black border-t dark:border-neutral-800">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white dark:bg-white dark:text-black py-4 font-bold uppercase tracking-widest rounded hover:opacity-80 transition disabled:opacity-50"
                    >
                        {loading ? 'Committing...' : 'Commit Database Save'}
                    </button>
                </div>
            </aside>

        </form>
    );
}
