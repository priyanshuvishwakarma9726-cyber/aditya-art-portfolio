'use client';

import { useState } from 'react';
import { CheckCircle2, CloudUpload, ExternalLink, Image as ImageIcon, X, Mail } from 'lucide-react';

export default function ActiveWorkClient({ initialWork }: { initialWork: any[] }) {
    const [workItems, setWorkItems] = useState(initialWork);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [modalImage, setModalImage] = useState<string | null>(null);

    const handleAction = async (id: string, action: 'complete' | 'accept_final') => {
        const confirmMsg = action === 'complete'
            ? 'Mark as completed? This will inform the client to pay the remaining balance.'
            : 'Verify final payment? This will close the project.';

        if (!confirm(confirmMsg)) return;

        setLoadingId(id);
        try {
            const res = await fetch('/api/admin/commissions/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commission_id: id, action })
            });

            if (!res.ok) throw new Error('Action failed');

            if (action === 'accept_final') {
                setWorkItems(prev => prev.filter(item => item.id !== id));
            } else {
                setWorkItems(prev => prev.map(item => item.id === id ? { ...item, status: 'completed' } : item));
            }
            alert('Success!');
        } catch (error) {
            alert('Operation failed.');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workItems.length === 0 ? (
                    <div className="col-span-full p-16 text-center bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl shadow-sm">
                        <div className="flex justify-center mb-4 text-neutral-300"><CheckCircle2 size={48} /></div>
                        <h3 className="text-xl font-serif dark:text-white mb-2">No Active Work</h3>
                        <p className="text-neutral-500 text-sm">Everything is currently up to date.</p>
                    </div>
                ) : (
                    workItems.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex flex-col gap-5 relative overflow-hidden group">
                            {loadingId === item.id && (
                                <div className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-md z-20 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest">Processing...</div>
                            )}

                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Tracker</h3>
                                    <p className="font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300">{item.tracking_number}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40' :
                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/40'
                                    }`}>
                                    {item.status || 'IN PROGRESS'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-[10px] uppercase font-bold text-neutral-400">Client</h3>
                                    <p className="text-sm font-semibold truncate dark:text-white">{item.customer_name}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <h3 className="text-[10px] uppercase font-bold text-neutral-400">Due (INR)</h3>
                                    <p className="text-sm font-bold text-black dark:text-white">₹{Number(item.remaining_amount_inr || 0).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1 space-y-2">
                                    <h3 className="text-[10px] uppercase font-bold text-neutral-400">Final Proof</h3>
                                    {item.final_screenshot_path ? (
                                        <button onClick={() => setModalImage(item.final_screenshot_path)} className="w-full h-20 rounded-lg overflow-hidden border dark:border-neutral-800 relative bg-neutral-100 dark:bg-black group">
                                            <img src={item.final_screenshot_path} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="Proof" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                <ImageIcon size={16} className="text-white" />
                                            </div>
                                        </button>
                                    ) : (
                                        <div className="w-full h-20 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 flex items-center justify-center text-[9px] text-neutral-400 uppercase italic">
                                            Awaiting Final Proof
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h3 className="text-[10px] uppercase font-bold text-neutral-400">Reference</h3>
                                    <a href={item.reference_image_url} target="_blank" rel="noreferrer" className="block w-full h-20 rounded-lg overflow-hidden border dark:border-neutral-800 relative bg-neutral-100 dark:bg-black group">
                                        <img src={item.reference_image_url || '/placeholder.png'} className="w-full h-full object-cover grayscale opacity-50 transition group-hover:opacity-100 group-hover:grayscale-0" alt="Ref" />
                                        <div className="absolute inset-0 flex items-center justify-center"><ExternalLink size={14} className="text-black dark:text-white" /></div>
                                    </a>
                                </div>
                            </div>

                            {/* Shipping Details Section */}
                            {item.requires_physical_delivery === 1 && (
                                <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/40 relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Shipping Details</h3>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${item.customer_name}\n${item.shipping_full_address}\n${item.shipping_city}, ${item.shipping_state}\n${item.shipping_country} - ${item.shipping_pincode}\nLandmark: ${item.shipping_landmark || 'N/A'}\nPhone: ${item.shipping_phone}`);
                                                alert('Address Copied!');
                                            }}
                                            className="text-[9px] uppercase font-bold text-blue-600 hover:text-blue-700 bg-blue-100 px-2 py-0.5 rounded transition"
                                        >
                                            Copy Address
                                        </button>
                                    </div>
                                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-mono">
                                        {item.shipping_full_address}<br />
                                        {item.shipping_city}, {item.shipping_state}<br />
                                        {item.shipping_country} - {item.shipping_pincode}<br />
                                        <span className="text-neutral-500">Landmark: {item.shipping_landmark || 'None'}</span><br />
                                        <span className="font-bold">Phone: {item.shipping_phone}</span>
                                    </p>
                                </div>
                            )}

                            <div className="pt-4 border-t dark:border-neutral-800 flex flex-col gap-3">
                                {item.status !== 'completed' ? (
                                    <button
                                        onClick={() => handleAction(item.id, 'complete')}
                                        className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-80 transition shadow-lg"
                                    >
                                        <CheckCircle2 size={16} /> Mark Artwork Ready
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAction(item.id, 'accept_final')}
                                        className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-lg"
                                    >
                                        <Mail size={16} /> Verify Final Payment
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                    ))}
            </div>

            {modalImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setModalImage(null)}>
                    <div className="relative max-w-4xl w-full flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute -top-10 right-0 text-white hover:text-red-400 transition" onClick={() => setModalImage(null)}><X size={24} /></button>
                        <img src={modalImage} alt="Payment Proof" className="max-h-[85vh] object-contain rounded-lg shadow-2xl" />
                    </div>
                </div>
            )}
        </>
    );
}
