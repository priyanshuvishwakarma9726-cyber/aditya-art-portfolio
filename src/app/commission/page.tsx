'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Info, Clock, CheckCircle2 } from 'lucide-react';

export default function CommissionPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        size: 'A4',
        medium: 'Pencil',
        difficulty: 'Medium',
        deadline: 'Normal',
        notes: '',
        requiresPhysicalDelivery: true,
        shipping_full_address: '',
        shipping_city: '',
        shipping_state: '',
        shipping_pincode: '',
        shipping_country: 'India',
        shipping_landmark: '',
        shipping_phone: ''
    });

    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [estimatedPrice, setEstimatedPrice] = useState(5000);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Frontend estimate logic (purely for UX, real price is quoted by Admin later)
    useEffect(() => {
        let base = 5000;
        const s = formData.size === 'A4' ? 1 : formData.size === 'A3' ? 1.5 : formData.size === 'A2' ? 2.5 : 3.0;
        const m = formData.medium === 'Pencil' ? 1 : formData.medium === 'Charcoal' ? 1.2 : 0.8;
        const diff = formData.difficulty === 'Easy' ? 1.0 : formData.difficulty === 'Medium' ? 1.3 : formData.difficulty === 'Hard' ? 1.8 : 2.5;
        const d = formData.deadline === 'Express' ? 2000 : 0;
        setEstimatedPrice(Math.round(base * s * m * diff + d));
    }, [formData]);

    const handleChange = (e: any) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        // If digital artwork selected, auto-disable physical delivery
        if (name === 'medium' && value === 'Digital') {
            setFormData(prev => ({ ...prev, medium: value, requiresPhysicalDelivery: false }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert('Please attach a reference photo.');

        if (formData.requiresPhysicalDelivery) {
            if (!formData.shipping_full_address || !formData.shipping_city || !formData.shipping_state || !formData.shipping_pincode || !formData.shipping_phone) {
                return alert('Please fill in all required shipping fields for physical delivery.');
            }
            if (!/^\d+$/.test(formData.shipping_pincode)) {
                return alert('Pincode must contain only numbers.');
            }
            if (formData.shipping_phone.length < 10) {
                return alert('Please provide a valid delivery phone number.');
            }
        }

        setIsSubmitting(true);
        let referenceUrl = '';

        try {
            const uploadData = new FormData();
            uploadData.append('image', file);
            uploadData.append('folder', 'commissions');

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData,
            });

            if (!uploadRes.ok) throw new Error('Reference upload failed');
            const uploadJson = await uploadRes.json();
            referenceUrl = uploadJson.url;

            const orderRes = await fetch('/api/commission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, referenceUrl }),
            });

            if (!orderRes.ok) throw new Error('Request submission failed');
            const orderData = await orderRes.json();

            // Redirect to a "Success/Track" page. Note: No payment yet until Admin quotes.
            router.push(`/track/${orderData.trackingId}`);

        } catch (err: any) {
            alert(err.message || 'Error executing request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20 animate-fade-in-up">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-serif dark:text-white mb-4">Request a Commission</h1>
                <p className="text-neutral-500 max-w-lg mx-auto">Commission a unique artwork. Secure your slot by filling out the details below. I manually review and quote every project.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 items-start">

                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl border dark:border-neutral-800 space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest pl-1">Full Name</label>
                                <input type="text" name="name" required placeholder="Aditya Vishwakarma" onChange={handleChange} className="w-full p-4 bg-neutral-50 dark:bg-black border dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white transition outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest pl-1">Email Address</label>
                                <input type="email" name="email" required placeholder="art@example.com" onChange={handleChange} className="w-full p-4 bg-neutral-50 dark:bg-black border dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white transition outline-none text-sm" suppressHydrationWarning />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest pl-1">Dimension Constraint</label>
                                <select name="size" value={formData.size} onChange={handleChange} className="w-full p-4 bg-neutral-50 dark:bg-black border dark:border-neutral-800 rounded-xl outline-none text-sm appearance-none cursor-pointer">
                                    <option value="A4">A4 (8" x 12")</option>
                                    <option value="A3">A3 (12" x 16")</option>
                                    <option value="A2">A2 (16" x 24")</option>
                                    <option value="Custom">Custom Size</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest pl-1">Preferred Medium</label>
                                <select name="medium" value={formData.medium} onChange={handleChange} className="w-full p-4 bg-neutral-50 dark:bg-black border dark:border-neutral-800 rounded-xl outline-none text-sm appearance-none cursor-pointer">
                                    <option value="Pencil">Graphite / Lead</option>
                                    <option value="Charcoal">Raw Charcoal</option>
                                    <option value="Digital">Digital Painting</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest pl-1">Reference Artwork Photo</label>
                            <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center hover:border-black dark:hover:border-white transition group relative cursor-pointer">
                                <input type="file" required accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <div className="flex flex-col items-center">
                                    <ShieldCheck className="text-neutral-300 group-hover:text-black dark:group-hover:text-white transition mb-2" size={32} />
                                    <p className="text-xs font-bold text-neutral-500">{file ? file.name : "Click to select a high-resolution photo"}</p>
                                    <p className="text-[10px] text-neutral-400 mt-1 uppercase">Max 15MB • JPG, PNG, WEBP</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest pl-1">Vision & Perspective</label>
                            <textarea name="notes" rows={4} placeholder="Describe any specific focus, emotional tone, or details to highlight..." onChange={handleChange} className="w-full p-4 bg-neutral-50 dark:bg-black border dark:border-neutral-800 rounded-xl outline-none text-sm"></textarea>
                        </div>

                        {/* Physical Delivery Toggle */}
                        {formData.medium !== 'Digital' && (
                            <div className="pt-4 border-t dark:border-neutral-800">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="requiresPhysicalDelivery"
                                            checked={formData.requiresPhysicalDelivery}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className={`w-10 h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full transition duration-300 ${formData.requiresPhysicalDelivery ? 'bg-black dark:bg-white' : ''}`}></div>
                                        <div className={`absolute left-1 top-1 w-4 h-4 bg-white dark:bg-black rounded-full transition-transform duration-300 shadow-sm ${formData.requiresPhysicalDelivery ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold dark:text-white uppercase tracking-widest block">Physical Delivery Required</span>
                                        <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Deliver original artwork via secure shipping</span>
                                    </div>
                                </label>
                            </div>
                        )}

                        {/* Shipping Fields Contextual */}
                        {formData.requiresPhysicalDelivery && formData.medium !== 'Digital' && (
                            <div className="space-y-4 pt-4 animate-fade-in">
                                <h3 className="text-xs uppercase font-bold tracking-widest text-neutral-500 mb-2">Shipping Details</h3>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest pl-1">Delivery Address *</label>
                                    <textarea name="shipping_full_address" required onChange={handleChange} value={formData.shipping_full_address} className="w-full p-3 bg-neutral-50 dark:bg-black border dark:border-neutral-800 rounded-xl outline-none text-sm" rows={2} placeholder="House/Flat No., Street, Area..."></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest pl-1">City *</label>
                                        <input type="text" name="shipping_city" required onChange={handleChange} value={formData.shipping_city} className="w-full p-3 bg-neutral-50 dark:bg-black border dark:border-neutral-800 rounded-xl outline-none text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest pl-1">State *</label>
                                        <input type="text" name="shipping_state" required onChange={handleChange} value={formData.shipping_state} className="w-full p-3 bg-neutral-50 dark:bg-black border dark:border-neutral-800 rounded-xl outline-none text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest pl-1">Pincode *</label>
                                        <input type="text" name="shipping_pincode" required onChange={handleChange} value={formData.shipping_pincode} className="w-full p-3 bg-neutral-50 dark:bg-black border dark:border-neutral-800 rounded-xl outline-none text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest pl-1">Country *</label>
                                        <input type="text" name="shipping_country" required onChange={handleChange} value={formData.shipping_country} className="w-full p-3 bg-neutral-50 dark:bg-black border dark:border-neutral-800 rounded-xl outline-none text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest pl-1">Delivery Phone *</label>
                                        <input type="tel" name="shipping_phone" required onChange={handleChange} value={formData.shipping_phone} className="w-full p-3 bg-neutral-50 dark:bg-black border dark:border-neutral-800 rounded-xl outline-none text-sm" placeholder="+91..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest pl-1">Landmark (Optional)</label>
                                        <input type="text" name="shipping_landmark" onChange={handleChange} value={formData.shipping_landmark} className="w-full p-3 bg-neutral-50 dark:bg-black border dark:border-neutral-800 rounded-xl outline-none text-sm" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-xs hover:scale-[0.98] transition-transform disabled:opacity-50 shadow-2xl flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? 'Processing Submission...' : 'Secure My Commission Slot'}
                        </button>
                    </div>
                </form>

                {/* Right Side: Workflow Info */}
                <div className="space-y-8 sticky top-24">
                    <div className="bg-neutral-50 dark:bg-neutral-900/50 p-8 rounded-2xl border dark:border-neutral-800">
                        <h3 className="font-serif text-2xl dark:text-white mb-6">Payment Workflow</h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                <div>
                                    <p className="text-sm font-bold dark:text-white mb-1 uppercase tracking-wider text-[10px]">Submission & Review</p>
                                    <p className="text-xs text-neutral-500 leading-relaxed">Aditya will review your reference photo and notes within 24 hours.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                <div>
                                    <p className="text-sm font-bold dark:text-white mb-1 uppercase tracking-wider text-[10px]">Quote & Advance</p>
                                    <p className="text-xs text-neutral-500 leading-relaxed">You receive a custom quote. Pay the advance amount to begin work.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                <div>
                                    <p className="text-sm font-bold dark:text-white mb-1 uppercase tracking-wider text-[10px]">Creation & Final</p>
                                    <p className="text-xs text-neutral-500 leading-relaxed">Once completed, pay the remaining balance and receive your original artwork.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex gap-4">
                        <Info className="text-blue-500 shrink-0" size={20} />
                        <div>
                            <p className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 mb-1">Estimated Range</p>
                            <p className="text-xl font-serif font-bold dark:text-white">₹{isMounted ? estimatedPrice.toLocaleString() : '---'}</p>
                            <p className="text-[9px] text-blue-500 uppercase mt-2 font-bold tracking-tight">* Official quote will be sent to your email after review.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
