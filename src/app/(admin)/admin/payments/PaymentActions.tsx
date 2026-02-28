'use client';

import React, { useState } from 'react';

interface PaymentData {
    id: string;
    tracking_number: string;
    type: 'commission' | 'order';
    amount: string;
    customer_name: string;
    screenshot_path: string;
    created_at: string;
}

export default function PaymentActions({ payments }: { payments: PaymentData[] }) {
    const [list, setList] = useState(payments);

    const handleAction = async (trackingId: string, type: 'commission' | 'order', action: 'approve' | 'reject') => {
        const reason = action === 'reject' ? prompt('Enter reason for rejection (sent to user):') : '';
        if (action === 'reject' && !reason) return; // cancelled prompt

        if (!confirm(`Are you sure you want to ${action} this payment?`)) return;

        try {
            const res = await fetch('/api/admin/payments/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingId, type, action, reason })
            });

            if (!res.ok) throw new Error('Action failed');

            setList(list.filter(p => p.tracking_number !== trackingId));
            alert(`Payment successfully ${action}d!`);

        } catch (error) {
            alert('Failed to execute action. Check logs.');
        }
    };

    if (list.length === 0) {
        return <p className="text-neutral-500">No pending payments to verify.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map(p => (
                <div key={p.tracking_number} className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start border-b dark:border-neutral-800 pb-4">
                        <div>
                            <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Tracking ID</h3>
                            <p className="font-mono text-sm font-bold text-neutral-700 dark:text-neutral-300">{p.tracking_number}</p>
                        </div>
                        <span className="bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                            {p.type}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Customer</h3>
                            <p className="text-base font-semibold text-black dark:text-white">{p.customer_name}</p>
                        </div>
                        <div>
                            <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Amount</h3>
                            <p className="font-serif font-bold text-base text-green-600 dark:text-green-400">₹{p.amount}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t dark:border-neutral-800 mt-auto">
                        <a
                            href={p.screenshot_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center sm:flex-1 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:text-blue-600 font-bold text-xs uppercase tracking-widest rounded transition-colors"
                        >
                            View Proof
                        </a>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => handleAction(p.tracking_number, p.type, 'approve')}
                                className="flex-1 sm:flex-none px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 font-bold text-xs uppercase tracking-widest rounded transition-colors"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleAction(p.tracking_number, p.type, 'reject')}
                                className="flex-1 sm:flex-none px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 font-bold text-xs uppercase tracking-widest rounded transition-colors"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
