'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackSearch() {
    const [trackingId, setTrackingId] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingId.trim()) {
            router.push(`/track/${trackingId.trim()}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-md mx-auto relative group">
            <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Paste Tracking ID Here..."
                className="w-full bg-white dark:bg-neutral-900 border-2 border-neutral-100 dark:border-neutral-800 p-5 rounded-2xl outline-none focus:border-black dark:focus:border-white transition-all text-sm font-mono tracking-widest uppercase shadow-sm pr-16"
            />
            <button
                type="submit"
                className="absolute right-3 top-3 bottom-3 aspect-square bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center hover:opacity-80 transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </button>
        </form>
    );
}
