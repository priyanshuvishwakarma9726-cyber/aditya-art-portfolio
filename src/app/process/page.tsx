import { ArrowDown, Pencil, Layers, ShieldCheck, PenTool } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Process | Behind the Masterpieces',
    description: 'A deep dive into the artistic process of Aditya Vishwakarma, from the initial sketch to the hyper-realistic final portrait.'
};

export default function ProcessPage() {
    const steps = [
        {
            icon: <PenTool className="w-8 h-8" />,
            title: "Conceptualization & Reference",
            description: "Every masterpiece begins with a high-quality reference photograph. We analyze the light source, textures, and anatomical details to define the technical roadmap of the drawing.",
            duration: "Phase 01"
        },
        {
            icon: <Pencil className="w-8 h-8" />,
            title: "Structural Outlining",
            description: "Using the Loomis method or Grid method (depending on complexity), a faint and precise structural skeleton is laid down. This ensures perfect proportion before any shading begins.",
            duration: "Phase 02"
        },
        {
            icon: <Layers className="w-8 h-8" />,
            title: "Building the Tonal Value",
            description: "Shading starts from the light tones (2H-HB) and gradually moves towards the deep darks (6B-9B). This layering process creates a 3D illusion on a flat 2D surface.",
            duration: "Phase 03"
        },
        {
            icon: <ShieldCheck className="w-8 h-8" />,
            title: "Micro-Detailing & Archival Finish",
            description: "The finest details like skin pores, beard hair, and fabric textures are added using mechanical pencils and mono-zero erasers. Finally, a fixative is applied to protect against UV and smudging.",
            duration: "Phase 04"
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-20">
            {/* Header */}
            <section className="py-24 md:py-32 px-4 text-center border-b dark:border-neutral-900">
                <div className="max-w-4xl mx-auto space-y-6">
                    <span className="text-xs font-bold uppercase tracking-[0.4em] text-neutral-500">Methodology</span>
                    <h1 className="text-5xl md:text-7xl font-serif dark:text-white leading-tight">The Science of Soul</h1>
                    <p className="max-w-xl mx-auto text-neutral-500 dark:text-neutral-400 font-light text-lg">
                        Transparency in technique. Witness the journey from a blank canvas to a living portrait.
                    </p>
                    <div className="pt-10 flex flex-col items-center">
                        <ArrowDown className="animate-bounce text-neutral-300" size={32} />
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-20 px-4 md:py-32">
                <div className="max-w-6xl mx-auto space-y-32">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            <div className="w-full md:w-1/2">
                                <div className="aspect-video bg-neutral-100 dark:bg-neutral-900 rounded overflow-hidden shadow-xl border dark:border-neutral-800 flex items-center justify-center relative group">
                                    <div className="text-neutral-300 dark:text-neutral-800 font-serif text-[10rem] absolute -z-10 group-hover:scale-110 transition-transform duration-700">
                                        0{index + 1}
                                    </div>
                                    <img
                                        src={`/process-step-${index + 1}.jpg`}
                                        alt={step.title}
                                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 space-y-6">
                                <div className="p-4 bg-neutral-100 dark:bg-neutral-900 w-fit rounded-lg dark:text-white">
                                    {step.icon}
                                </div>
                                <span className="text-xs font-mono font-bold tracking-widest text-neutral-400">{step.duration}</span>
                                <h3 className="text-3xl md:text-4xl font-serif dark:text-white">{step.title}</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed md:text-lg">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Time Lapse Section / Visual Proof */}
            <section className="py-24 px-4 bg-black text-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto text-center space-y-12 z-10 relative">
                    <h2 className="text-4xl md:text-6xl font-serif italic">"80 Hours of Dedication"</h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto text-lg italic">
                        Realism isn't about duplicating reality; it's about honoring it with time.
                    </p>

                    <div className="aspect-video w-full max-w-5xl mx-auto bg-neutral-900 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] border border-neutral-800 flex items-center justify-center group cursor-pointer">
                        <div className="text-sm font-bold uppercase tracking-widest bg-white text-black px-6 py-3 rounded-full group-hover:scale-110 transition-transform">
                            Watch Process Video
                        </div>
                    </div>
                </div>

                {/* Background ambient light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] -z-0 rounded-full"></div>
            </section>

            {/* Final CTA */}
            <section className="py-24 md:py-32 px-4 text-center">
                <h2 className="text-3xl font-serif mb-8 dark:text-white">Experience the craft firsthand.</h2>
                <Link href="/gallery" className="text-sm font-bold uppercase tracking-widest border-b-2 border-black dark:border-white pb-2 hover:opacity-70 transition-opacity dark:text-white">
                    Explore the Final Results
                </Link>
            </section>
        </div>
    );
}
