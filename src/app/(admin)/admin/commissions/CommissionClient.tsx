'use client';

import { useState } from 'react';
import { ExternalLink, CheckCircle, XCircle, X, Image as ImageIcon, Send } from 'lucide-react';

export default function CommissionClient({ initialCommissions }: { initialCommissions: any[] }) {
    const [commissions, setCommissions] = useState(initialCommissions);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [modalImage, setModalImage] = useState<string | null>(null);

    // States for quoting
    const [quoteData, setQuoteData] = useState<Record<string, { total: string, advance: string }>>({});

    const updateQuote = (id: string, field: 'total' | 'advance', value: string) => {
        setQuoteData(prev => ({
            ...prev,
            [id]: {
                ...(prev[id] || { total: '0', advance: '0' }),
                [field]: value
            }
        }));
    };

    const handleSendQuote = async (id: string) => {
        const comm = commissions.find(c => c.id === id);
        if (!comm) return;

        const data = quoteData[id] || {
            total: comm.final_total_price_inr?.toString() || comm.final_price_inr?.toString() || comm.calculated_price?.toString() || '0',
            advance: comm.advance_amount_inr?.toString() || '0'
        };

        if (!data.total || data.total === '0') return alert("Please enter a valid Final Total.");

        setLoadingId(id);
        try {
            const res = await fetch('/api/admin/commissions/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commission_id: id,
                    action: 'send_quote',
                    final_total: data.total,
                    advance_amount: data.advance
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to send quote');
            }

            // Move from pending to "quoted" or just update status in list
            // For now, let's keep it in list but mark as quoted
            setCommissions(prev => prev.map(c => c.id === id ? { ...c, status: 'quoted' } : c));
            alert("Quote sent to client!");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoadingId(null);
        }
    };

    const handleAction = async (id: string, action: 'accept' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this commission?`)) return;

        setLoadingId(id);
        try {
            const res = await fetch('/api/admin/commissions/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commission_id: id, action })
            });

            if (!res.ok) throw new Error('Failed to update commission');
            setCommissions(prev => prev.filter(c => c.id !== id));
        } catch (error: any) {
            alert(error.message);
            setLoadingId(null);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {commissions.length === 0 ? (
                    <div className="col-span-full p-10 text-center text-neutral-500 text-sm bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl">
                        No pending commission requests found.
                    </div>
                ) : (
                    commissions.map((comm: any) => {
                        const q = quoteData[comm.id] || {
                            total: comm.final_total_price_inr?.toString() || comm.final_price_inr?.toString() || comm.calculated_price?.toString() || '0',
                            advance: comm.advance_amount_inr?.toString() || '0'
                        };

                        return (
                            <div key={comm.id} className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex flex-col gap-5 relative overflow-hidden group">
                                {loadingId === comm.id && (
                                    <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-md z-20 flex items-center justify-center font-bold uppercase tracking-widest text-[10px]">
                                        Processing...
                                    </div>
                                )}

                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Tracker</h3>
                                        <p className="font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300">{comm.tracking_number}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${comm.status === 'quoted' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40' :
                                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40'
                                        }`}>
                                        {comm.status || 'PENDING'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Client</h3>
                                        <p className="text-sm font-semibold truncate dark:text-white">{comm.customer_name}</p>
                                        <p className="text-[9px] text-neutral-400 truncate tracking-tight">{comm.customer_email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Difficulty</h3>
                                        <p className="text-xs font-bold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded w-max">
                                            {comm.difficulty_level || 'Medium'}
                                        </p>
                                    </div>
                                </div>

                                {/* Shipping Details Section */}
                                {comm.requires_physical_delivery === 1 && (
                                    <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/40 relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Shipping Details</h3>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${comm.customer_name}\n${comm.shipping_full_address}\n${comm.shipping_city}, ${comm.shipping_state}\n${comm.shipping_country} - ${comm.shipping_pincode}\nLandmark: ${comm.shipping_landmark || 'N/A'}\nPhone: ${comm.shipping_phone}`);
                                                    alert('Address Copied!');
                                                }}
                                                className="text-[9px] uppercase font-bold text-blue-600 hover:text-blue-700 bg-blue-100 px-2 py-0.5 rounded transition"
                                            >
                                                Copy Address
                                            </button>
                                        </div>
                                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-mono">
                                            {comm.shipping_full_address}<br />
                                            {comm.shipping_city}, {comm.shipping_state}<br />
                                            {comm.shipping_country} - {comm.shipping_pincode}<br />
                                            <span className="text-neutral-500">Landmark: {comm.shipping_landmark || 'None'}</span><br />
                                            <span className="font-bold">Phone: {comm.shipping_phone}</span>
                                        </p>
                                    </div>
                                )}


                                {/* Status contextual actions */}
                                {comm.advance_payment_status === 'under_verification' ? (
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 space-y-3">
                                        <p className="text-xs font-bold text-yellow-800 dark:text-yellow-400">Payment Under Verification</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleAction(comm.id, 'accept')} className="flex-1 py-2 bg-emerald-100 text-emerald-800 font-bold uppercase tracking-widest text-[10px] rounded hover:bg-emerald-200 transition flex items-center justify-center gap-2">
                                                <CheckCircle size={14} /> Approve & Start
                                            </button>
                                            <button onClick={() => handleAction(comm.id, 'reject')} className="py-2 px-3 bg-red-100 text-red-800 rounded hover:bg-red-200 transition">
                                                <XCircle size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-xl border dark:border-neutral-800 space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-neutral-400 block mb-1">Final Total (₹)</label>
                                                <input
                                                    type="number"
                                                    value={q.total}
                                                    onChange={(e) => updateQuote(comm.id, 'total', e.target.value)}
                                                    className="w-full bg-white dark:bg-black border dark:border-neutral-800 rounded p-2 text-xs font-bold"
                                                    disabled={comm.status === 'quoted'}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-neutral-400 block mb-1">Advance (₹)</label>
                                                <input
                                                    type="number"
                                                    value={q.advance}
                                                    onChange={(e) => updateQuote(comm.id, 'advance', e.target.value)}
                                                    className="w-full bg-white dark:bg-black border dark:border-neutral-800 rounded p-2 text-xs font-bold underline decoration-blue-500"
                                                    disabled={comm.status === 'quoted'}
                                                />
                                            </div>
                                        </div>
                                        {comm.status !== 'quoted' ? (
                                            <button
                                                onClick={() => handleSendQuote(comm.id)}
                                                className="w-full py-2 bg-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-md"
                                            >
                                                <Send size={12} /> Send Quote to Client
                                            </button>
                                        ) : (
                                            <div className="text-center py-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-[10px] font-bold uppercase tracking-widest text-neutral-500 border border-transparent">
                                                Waiting for Client Payment
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Proof Preview if exists */}
                                {comm.advance_screenshot_path && (
                                    <div className="space-y-2">
                                        <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Advance Proof</h3>
                                        <button onClick={() => setModalImage(comm.advance_screenshot_path)} className="w-full h-20 rounded-lg overflow-hidden border dark:border-neutral-800 relative group">
                                            <img src={comm.advance_screenshot_path} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="Proof" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                <ImageIcon size={16} className="text-white" />
                                            </div>
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mt-auto pt-4 border-t dark:border-neutral-800">
                                    <a href={comm.reference_image_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 bg-neutral-100 dark:bg-neutral-800 rounded text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition">
                                        Reference <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal for Screenshot */}
            {modalImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setModalImage(null)}>
                    <div className="relative max-w-4xl w-full flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute -top-10 right-0 text-white hover:text-red-400 transition flex items-center gap-1 font-bold text-sm tracking-widest uppercase" onClick={() => setModalImage(null)}>
                            Close <X size={20} />
                        </button>
                        <img src={modalImage} alt="Payment Proof" className="max-h-[85vh] object-contain rounded-lg shadow-2xl" />
                    </div>
                </div>
            )}
        </>
    );
}
