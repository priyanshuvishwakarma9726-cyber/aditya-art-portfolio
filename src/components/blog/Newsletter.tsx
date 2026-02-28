'use client';

import React, { useState } from 'react';

export default function Newsletter() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'' | 'success' | 'error'>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (!res.ok) throw new Error();
            setStatus('success');
            setEmail('');
        } catch {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-100 dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-8 text-center my-16 shadow-inner">
            <h3 className="text-2xl font-serif mb-3 dark:text-white">Join the Studio Note</h3>
            <p className="text-sm text-neutral-500 mb-8 max-w-sm mx-auto">
                Get occasional updates on new artwork drops, commission openings, and techniques. No spam.
            </p>

            {status === 'success' ? (
                <div className="text-green-600 bg-green-50 dark:bg-green-900/20 p-4 rounded text-sm font-bold uppercase tracking-widest">
                    You're registered!
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address..."
                        className="flex-1 min-w-0 p-3 bg-white dark:bg-black border dark:border-neutral-800 text-sm focus:border-black outline-none rounded"
                        suppressHydrationWarning
                    />
                    <button
                        disabled={loading}
                        className="bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest text-xs px-6 py-3 rounded hover:opacity-80 transition disabled:opacity-50 whitespace-nowrap"
                    >
                        {loading ? '...' : 'Subscribe'}
                    </button>
                </form>
            )}

            {status === 'error' && <p className="text-red-500 text-xs mt-3 uppercase tracking-widest">Something went wrong. Try again.</p>}
        </div>
    );
}
