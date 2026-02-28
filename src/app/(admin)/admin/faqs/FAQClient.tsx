'use client';

import React, { useState } from 'react';
import { Trash2, Edit3, Plus, Save, X } from 'lucide-react';

export default function FAQClient({ initialData }: { initialData: any[] }) {
    const [faqs, setFaqs] = useState(initialData);
    const [editing, setEditing] = useState<any>(null); // null means no edit, 'new' meant new

    const [form, setForm] = useState({ keywords: '', answer: '', is_active: true });
    const [loading, setLoading] = useState(false);

    const handleEdit = (faq: any) => {
        setEditing(faq.id);
        setForm({ keywords: faq.keywords, answer: faq.answer, is_active: faq.is_active });
    };

    const handleNew = () => {
        setEditing('new');
        setForm({ keywords: '', answer: '', is_active: true });
    };

    const handleSave = async () => {
        if (!form.keywords || !form.answer) return alert("Fields required.");
        setLoading(true);
        try {
            const method = editing === 'new' ? 'POST' : 'PUT';
            const payload = editing === 'new' ? form : { ...form, id: editing };

            const res = await fetch('/api/admin/faqs', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error();
            const data = await res.json();

            if (editing === 'new') {
                setFaqs([{ id: data.id, ...form, created_at: new Date().toISOString() }, ...faqs]);
            } else {
                setFaqs(faqs.map(f => f.id === editing ? { ...f, ...form } : f));
            }
            setEditing(null);
        } catch {
            alert("Error saving.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/admin/faqs?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            setFaqs(faqs.filter(f => f.id !== id));
        } catch {
            alert("Error deleting.");
        }
    };

    return (
        <div className="space-y-6">
            {!editing && (
                <button onClick={handleNew} className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded text-sm font-bold uppercase tracking-widest hover:opacity-80 transition">
                    <Plus size={16} /> Add Intent Pattern
                </button>
            )}

            {editing && (
                <div className="bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-800 p-6 rounded-xl relative shadow-inner">
                    <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-black dark:text-white transition">
                        <X size={20} />
                    </button>

                    <h3 className="font-serif text-xl mb-6 dark:text-white">{editing === 'new' ? 'New Knowledge Base Entry' : 'Edit Knowledge Map'}</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Keywords (Comma separated string triggers)</label>
                            <input
                                value={form.keywords}
                                onChange={e => setForm({ ...form, keywords: e.target.value })}
                                placeholder="commission, price, custom, painting..."
                                className="w-full bg-white dark:bg-black border dark:border-neutral-800 p-3 rounded text-sm focus:border-black dark:focus:border-white outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">AI Formatted Answer</label>
                            <textarea
                                value={form.answer}
                                onChange={e => setForm({ ...form, answer: e.target.value })}
                                placeholder="Our commission pricing starts at..."
                                className="w-full h-32 bg-white dark:bg-black border dark:border-neutral-800 p-3 rounded text-sm focus:border-black dark:focus:border-white outline-none resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={e => setForm({ ...form, is_active: e.target.checked })}
                                className="w-4 h-4 accent-black dark:accent-white"
                            />
                            <span className="text-sm font-bold dark:text-white">Active Node</span>
                        </div>

                        <button onClick={handleSave} disabled={loading} className="w-full bg-black text-white dark:bg-white dark:text-black py-4 font-bold uppercase tracking-widest text-sm rounded mt-4 hover:opacity-80 disabled:opacity-50 transition">
                            {loading ? 'Saving to Brain...' : 'Compile Rules'}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {faqs.map(faq => (
                    <div key={faq.id} className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`w-2 h-2 rounded-full ${faq.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 truncate max-w-sm">Keys: {faq.keywords}</span>
                            </div>
                            <p className="text-sm dark:text-neutral-300 line-clamp-2 md:pr-10">{faq.answer}</p>
                        </div>
                        <div className="flex gap-4 shrink-0">
                            <button onClick={() => handleEdit(faq)} className="text-neutral-400 hover:text-black dark:hover:text-white transition">
                                <Edit3 size={18} />
                            </button>
                            <button onClick={() => handleDelete(faq.id)} className="text-neutral-400 hover:text-red-500 transition">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
