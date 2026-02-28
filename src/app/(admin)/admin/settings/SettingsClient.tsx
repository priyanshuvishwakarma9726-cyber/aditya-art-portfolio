'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';

export default function SettingsClient({ initialConfig }: { initialConfig: any }) {
    const [config, setConfig] = useState(initialConfig);
    const [loading, setLoading] = useState(false);

    const handleChange = (key: string, value: string) => {
        setConfig((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = async (sectionKeys: string[]) => {
        setLoading(true);
        // Extract only the keys that were in the particular section to save
        const payload: any = {};
        sectionKeys.forEach(k => {
            if (config[k] !== undefined) {
                payload[k] = config[k];
            }
        });

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error();
            alert('Settings Saved Successfully');
        } catch {
            alert('Failed to save settings.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">

            {/* Commission Pricing Engine */}
            <section className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-8 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b dark:border-neutral-800 pb-4">
                    <h3 className="text-lg font-serif dark:text-white">Commission Matrix (INR)</h3>
                    <button
                        onClick={() => handleSave(['base_price_inr', 'fee_express_inr', 'mult_diff_easy', 'mult_diff_medium', 'mult_diff_hard', 'mult_diff_extreme', 'mult_size_a4', 'mult_size_a3', 'mult_size_a2', 'mult_size_custom', 'mult_medium_pencil', 'mult_medium_charcoal', 'mult_medium_digital'])}
                        disabled={loading}
                        className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-widest px-4 py-2 hover:opacity-80 transition disabled:opacity-50"
                    >
                        <Save size={14} /> Update Matrices
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block border-b dark:border-neutral-800 pb-2">Base Costing Engine</label>
                        <div>
                            <div className="text-xs mb-1 font-mono">Base Price (INR)</div>
                            <input value={config.base_price_inr || ''} onChange={e => handleChange('base_price_inr', e.target.value)} className="w-full p-2 bg-neutral-50 dark:bg-black border dark:border-neutral-800 text-sm focus:border-black outline-none" />
                        </div>
                        <div>
                            <div className="text-xs mb-1 font-mono">Express Delivery Flat Fee (INR)</div>
                            <input value={config.fee_express_inr || ''} onChange={e => handleChange('fee_express_inr', e.target.value)} className="w-full p-2 bg-neutral-50 dark:bg-black border dark:border-neutral-800 text-sm focus:border-black outline-none" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block border-b dark:border-neutral-800 pb-2">Difficulty Curve Modifiers (e.g. 1.0, 1.5)</label>
                        <div>
                            <div className="text-xs mb-1 font-mono">Easy Multiplier</div>
                            <input value={config.mult_diff_easy || ''} onChange={e => handleChange('mult_diff_easy', e.target.value)} className="w-full p-2 bg-neutral-50 dark:bg-black border dark:border-neutral-800 text-sm focus:border-black outline-none" />
                        </div>
                        <div>
                            <div className="text-xs mb-1 font-mono">Medium Multiplier</div>
                            <input value={config.mult_diff_medium || ''} onChange={e => handleChange('mult_diff_medium', e.target.value)} className="w-full p-2 bg-neutral-50 dark:bg-black border dark:border-neutral-800 text-sm focus:border-black outline-none" />
                        </div>
                        <div>
                            <div className="text-xs mb-1 font-mono">Hard Multiplier</div>
                            <input value={config.mult_diff_hard || ''} onChange={e => handleChange('mult_diff_hard', e.target.value)} className="w-full p-2 bg-neutral-50 dark:bg-black border dark:border-neutral-800 text-sm focus:border-black outline-none" />
                        </div>
                        <div>
                            <div className="text-xs mb-1 font-mono">Extreme Multiplier</div>
                            <input value={config.mult_diff_extreme || ''} onChange={e => handleChange('mult_diff_extreme', e.target.value)} className="w-full p-2 bg-neutral-50 dark:bg-black border dark:border-neutral-800 text-sm focus:border-black outline-none" />
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
