import { getUserRoleServer } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MembersPage() {
    const role = await getUserRoleServer();

    if (!role) {
        redirect('/login?next=/members');
    }

    const db = await getDb();
    const [exclusiveArt]: any = await db.query(
        "SELECT id, title, slug, image_url, description FROM artworks WHERE is_active = TRUE AND is_exclusive = TRUE ORDER BY created_at DESC"
    );

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-white selection:text-black">
            <header className="border-b border-neutral-800 py-12 px-6 text-center animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-serif mb-4 tracking-tight drop-shadow-lg">
                    Collector's Vault
                </h1>
                <p className="text-neutral-400 uppercase tracking-widest text-sm font-bold max-w-lg mx-auto leading-relaxed">
                    Exclusive artworks and studies reserved strictly for authenticated members of the studio.
                </p>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-20">
                {exclusiveArt.length === 0 ? (
                    <div className="text-center text-neutral-500 py-32 border border-neutral-800 border-dashed rounded-xl">
                        <p className="font-mono text-sm uppercase">The vault is currently empty.</p>
                        <p className="text-xs tracking-widest mt-2">Check back soon for new private drops.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {exclusiveArt.map((art: any) => (
                            <div key={art.id} className="group relative">
                                <Link href={`/shop/${art.slug}`} className="block overflow-hidden relative aspect-[4/5] bg-neutral-900 rounded shadow-2xl">
                                    <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1 font-bold tracking-widest uppercase text-[10px] border border-neutral-700 text-yellow-500 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span> Member Exclusive
                                    </div>
                                    {art.image_url && <img src={art.image_url} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out mix-blend-luminosity hover:mix-blend-normal" />}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                </Link>
                                <div className="mt-4 text-center">
                                    <h3 className="text-xl font-serif mb-1 group-hover:underline underline-offset-4 decoration-1">{art.title}</h3>
                                    <p className="text-neutral-400 text-xs line-clamp-2">{art.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
