'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className="bg-black text-white flex min-h-screen items-center justify-center text-center font-sans">
                <div className="max-w-md p-6">
                    <h1 className="text-4xl font-serif mb-4">Critical System Error</h1>
                    <p className="text-neutral-400 text-sm mb-8 uppercase tracking-widest font-bold">
                        A core unrecoverable module failure occurred in the App Router framework.
                    </p>
                    <button onClick={() => reset()} className="bg-white text-black px-8 py-4 font-bold uppercase tracking-widest text-xs rounded hover:opacity-80 transition">
                        Attempt Reboot
                    </button>
                </div>
            </body>
        </html>
    );
}
