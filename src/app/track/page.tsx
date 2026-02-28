import TrackSearch from './TrackSearch';

export default function TrackPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-neutral-50 dark:bg-black overflow-hidden relative">

            {/* Background Aesthetic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neutral-200 dark:bg-neutral-800/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>

            <div className="max-w-2xl w-full text-center space-y-10 animate-fade-in-up">
                <div className="space-y-4">
                    <span className="px-4 py-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">
                        Live Studio Tracker
                    </span>
                    <h1 className="text-5xl md:text-6xl font-serif dark:text-white leading-tight">
                        Follow the journey of <br /> your masterpiece.
                    </h1>
                    <p className="text-neutral-500 max-w-md mx-auto leading-relaxed">
                        Enter your unique tracking identifier to view real-time updates, payment status, and creation milestones.
                    </p>
                </div>

                <TrackSearch />

                <div className="pt-10 grid grid-cols-3 gap-8 border-t dark:border-neutral-900">
                    <div className="text-center space-y-2">
                        <div className="text-xl font-bold dark:text-white font-serif italic">1.</div>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Request Sent</p>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="text-xl font-bold dark:text-white font-serif italic">2.</div>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Creation Phase</p>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="text-xl font-bold dark:text-white font-serif italic">3.</div>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Final Delivery</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
