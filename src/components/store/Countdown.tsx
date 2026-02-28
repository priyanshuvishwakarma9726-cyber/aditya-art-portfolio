'use client';

import React, { useState, useEffect } from 'react';

export default function Countdown({ targetDate, onExpire }: { targetDate: string, onExpire?: () => void }) {
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

    useEffect(() => {
        const target = new Date(targetDate).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = target - now;

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
                if (onExpire) onExpire();
            } else {
                setTimeLeft({
                    d: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((difference % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate, onExpire]);

    if (!timeLeft) return <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 h-8 w-48 rounded"></div>;

    if (timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0) {
        return <div className="text-red-500 font-bold tracking-widest uppercase text-sm">Drop Ended</div>;
    }

    return (
        <div className="flex gap-4 items-center font-mono text-sm tracking-widest text-black dark:text-white mb-4">
            <span className="text-neutral-500 text-xs uppercase font-sans font-bold">Ends In</span>
            <div className="flex gap-2">
                <span className="bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded">{timeLeft.d}d</span>
                <span className="bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded">{timeLeft.h}h</span>
                <span className="bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded">{timeLeft.m}m</span>
                <span className="bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded">{timeLeft.s}s</span>
            </div>
        </div>
    );
}
