'use client';

import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { UploadCloud, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UpiPaymentViewProps {
    orderId: string;
    amount: string;
    upiId: string;
    customerName: string;
    stage?: string;
}

export default function UpiPaymentView({ orderId, amount, upiId, customerName, stage = 'full' }: UpiPaymentViewProps) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(customerName)}&tr=${orderId}&am=${amount}&cu=INR`;

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert("Please capture and upload the payment screenshot first.");
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('orderId', orderId);
            formData.append('stage', stage); // Send stage info to API

            const res = await fetch('/api/payment/verify', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed. Possible file size limit reached.');

            setSuccess(true);
            setTimeout(() => {
                router.push(`/track/${orderId}`);
            }, 2500);

        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsUploading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-12 text-center shadow-xl animate-fade-in-up">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-serif dark:text-white mb-2">Proof Uploaded!</h3>
                <p className="text-neutral-500">Aditya will verify your payment shortly. Redirecting you to track progress...</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-8 items-stretch animate-fade-in-up">
            {/* Payment Info & QR */}
            <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-8 flex flex-col items-center">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-8 w-full justify-center">
                    <ShieldCheck size={14} className="text-blue-500" /> Secure Encryption
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-2xl border-4 border-neutral-100 mb-8">
                    <QRCodeCanvas value={upiLink} size={220} level="H" />
                </div>

                <div className="text-center space-y-2 mb-8">
                    <h4 className="text-[10px] uppercase font-bold text-neutral-400">Total Payable</h4>
                    <p className="text-4xl font-serif font-bold dark:text-white">₹{Number(amount).toLocaleString()}</p>
                </div>

                <div className="w-full space-y-3">
                    <div className="flex justify-between items-center text-xs p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border dark:border-neutral-700">
                        <span className="text-neutral-400 font-bold uppercase">UPI ID</span>
                        <span className="font-mono font-bold dark:text-white select-all">{upiId}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 text-center italic">Supported by GPay, PhonePe, Paytm, and all banking apps.</p>
                </div>
            </div>

            {/* Verification Form */}
            <div className="bg-neutral-50 dark:bg-neutral-950 border dark:border-neutral-800 rounded-2xl p-8 flex flex-col">
                <div className="mb-8">
                    <h3 className="text-xl font-serif dark:text-white mb-3 text-center md:text-left">Submit Verification</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed text-center md:text-left">
                        Take a screenshot of your successful transaction from your banking app and upload it here. Ensure the <span className="font-bold text-black dark:text-white">UTR / Transaction ID</span> is visible.
                    </p>
                </div>

                <label className="flex-1 min-h-[200px] border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition group">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    <UploadCloud size={40} className="text-neutral-300 group-hover:text-blue-500 transition mb-4" />
                    <span className="text-xs font-bold text-neutral-500 text-center">{file ? file.name : "Select or Drop Screenshot"}</span>
                    <span className="text-[10px] text-neutral-400 mt-2 uppercase tracking-widest leading-none">JPEG / PNG High Res</span>
                </label>

                <button
                    onClick={handleUpload}
                    disabled={isUploading || !file}
                    className="w-full mt-8 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:opacity-80 transition disabled:opacity-50 shadow-lg"
                >
                    {isUploading ? "Uploading..." : "Submit Proof"}
                </button>
            </div>
        </div>
    );
}
