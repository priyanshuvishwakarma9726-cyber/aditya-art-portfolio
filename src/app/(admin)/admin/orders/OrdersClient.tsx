'use client';

import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, ExternalLink, ShieldCheck, Mail, IndianRupee } from 'lucide-react';

export default function OrdersClient({ orders }: { orders: any[] }) {
    const [localOrders, setLocalOrders] = useState(orders);
    const [updating, setUpdating] = useState<string | null>(null);

    const handleStageUpdate = async (trackingId: string, action: string, extraData: any = {}) => {
        setUpdating(trackingId);
        try {
            const res = await fetch('/api/admin/orders/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingId, action, ...extraData })
            });

            if (!res.ok) {
                const text = await res.text();
                let errorMsg = `Error ${res.status}`;
                try {
                    const json = JSON.parse(text);
                    errorMsg = json.error || errorMsg;
                } catch {
                    errorMsg = `Server unreachable (${res.status}). Snippet: ${text.substring(0, 150)}...`;
                }
                throw new Error(errorMsg);
            }

            alert(`Order status updated to ${action === 'ship' ? 'Shipped' : 'Delivered'}`);
            window.location.reload();
        } catch (e: any) {
            alert(`ACTION FAILED: ${e.message}`);
        } finally {
            setUpdating(null);
        }
    };

    const handlePaymentAction = async (trackingId: string, action: 'approve' | 'reject') => {
        setUpdating(trackingId);
        try {
            const res = await fetch('/api/admin/payments/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingId, action, type: 'order' })
            });

            if (!res.ok) {
                const text = await res.text();
                let errorMsg = `Error ${res.status}`;
                try {
                    const json = JSON.parse(text);
                    errorMsg = json.error || errorMsg;
                } catch {
                    errorMsg = `Server unreachable (${res.status}). Snippet: ${text.substring(0, 150)}...`;
                }
                throw new Error(errorMsg);
            }

            alert(`Payment ${action}d successfully.`);
            window.location.reload();
        } catch (e: any) {
            alert(`ACTION FAILED: ${e.message}`);
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {localOrders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b dark:border-neutral-800 pb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Order ID:</span>
                                <span className="font-mono text-xs font-bold dark:text-white uppercase">{order.tracking_number}</span>
                            </div>
                            <h3 className="text-lg font-serif dark:text-white">{order.user_name || 'Guest User'}</h3>
                            <p className="text-[10px] text-neutral-500 max-w-sm">{order.shipping_address}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                    'bg-neutral-100 text-neutral-600'
                                }`}>
                                {order.status}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-neutral-400">
                                {new Date(order.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Financials */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 bg-neutral-50 dark:bg-black/20 rounded-xl border dark:border-neutral-800">
                            <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Total</span>
                            <span className="text-base font-bold dark:text-white">₹{Number(order.total_amount).toLocaleString()}</span>
                        </div>
                        <div className="p-3 bg-neutral-50 dark:bg-black/20 rounded-xl border dark:border-neutral-800">
                            <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Advance</span>
                            <span className={`text-sm font-bold ${['advance_paid', 'shipped', 'delivered', 'completed'].includes(order.payment_phase) ? 'text-emerald-500' : 'text-amber-500'}`}>
                                ₹{Number(order.advance_amount_inr).toLocaleString()}
                            </span>
                        </div>
                        <div className="p-3 bg-neutral-50 dark:bg-black/20 rounded-xl border dark:border-neutral-800">
                            <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Remaining</span>
                            <span className={`text-sm font-bold ${order.payment_phase === 'completed' ? 'text-emerald-500' : 'text-blue-500'}`}>
                                ₹{Number(order.remaining_amount_inr).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Lifecycle Actions */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 border-b dark:border-neutral-800 pb-2">Admin Control</h4>

                        <div className="flex flex-wrap gap-2">
                            {/* Payment Verification Phase */}
                            {order.payment_status === 'pending_verification' && (
                                <div className="w-full flex gap-2">
                                    <button
                                        onClick={() => handlePaymentAction(order.tracking_number, 'approve')}
                                        disabled={updating === order.tracking_number}
                                        className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold uppercase shadow-lg hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        Approve {order.payment_phase === 'remaining_pending' ? 'Final' : 'Advance'} Payment
                                    </button>
                                    <button
                                        onClick={() => handlePaymentAction(order.tracking_number, 'reject')}
                                        disabled={updating === order.tracking_number}
                                        className="px-4 border border-red-200 text-red-600 py-2 rounded-lg text-xs font-bold uppercase"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}

                            {/* Shipping Phase */}
                            {order.payment_phase === 'advance_paid' && (
                                <button
                                    onClick={() => {
                                        const courierName = prompt('Enter Courier Name (e.g. India Post):', 'India Post');
                                        const trackingNo = prompt('Enter Tracking ID:');
                                        if (courierName && trackingNo) {
                                            handleStageUpdate(order.tracking_number, 'ship', { courierName, courierTrackingId: trackingNo });
                                        }
                                    }}
                                    disabled={updating === order.tracking_number}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-bold uppercase shadow-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Mark as Shipped
                                </button>
                            )}

                            {/* Delivery Phase */}
                            {order.payment_phase === 'shipped' && (
                                <button
                                    onClick={() => handleStageUpdate(order.tracking_number, 'deliver')}
                                    disabled={updating === order.tracking_number}
                                    className="w-full bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold uppercase shadow-lg hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Mark as Delivered
                                </button>
                            )}

                            {/* Completed Status */}
                            {order.payment_phase === 'completed' && (
                                <div className="w-full p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[10px] font-bold uppercase tracking-widest text-center rounded">
                                    Full Order Completed ✅
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex justify-between items-center mt-auto pt-4 border-t dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                            {order.screenshot_path && (
                                <a href={order.screenshot_path} target="_blank" className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded hover:text-blue-500 transition-colors">
                                    <ShieldCheck size={16} />
                                </a>
                            )}
                            {order.final_screenshot_path && (
                                <a href={order.final_screenshot_path} target="_blank" className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded text-emerald-600">
                                    <ShieldCheck size={16} />
                                </a>
                            )}
                        </div>
                        <a href={`/track/${order.tracking_number}`} target="_blank" className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 hover:text-black dark:hover:text-white uppercase">
                            Live View <ExternalLink size={10} />
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}
