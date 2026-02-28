import React from 'react';
import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import UpiPaymentView from './UpiPaymentView';

export default async function PaymentPage(props: { params: Promise<{ orderId: string }> }) {
    const params = await props.params;
    const { orderId } = params;

    const db = await getDb();

    // Check commissions table with new multi-stage fields
    let [rows]: any = await db.query(
        `SELECT tracking_number, customer_name as name, payment_status, status,
         advance_amount_inr, remaining_amount_inr, advance_payment_status, final_payment_status,
         calculated_price as legacy_amount
         FROM commissions WHERE tracking_number = ?`,
        [orderId]
    );

    let isCommission = rows.length > 0;
    let orderType = 'commission';

    if (!isCommission) {
        let [orderRows]: any = await db.query(
            'SELECT tracking_number, total_amount as amount, id as name, payment_status, payment_phase, advance_amount_inr, remaining_amount_inr FROM orders WHERE tracking_number = ?',
            [orderId]
        );
        if (orderRows.length === 0) return notFound();
        rows = orderRows;
        orderType = 'order';
    }

    const orderData = rows[0];

    // Determine current payment stage/amount
    let amountToPay = 0;
    let paymentStage = 'full';
    let currentPaymentStatus = orderData.payment_status;

    if (isCommission) {
        // Multi-stage logic
        if (orderData.status === 'quoted' || orderData.advance_payment_status === 'pending') {
            amountToPay = Number(orderData.advance_amount_inr || 0);
            paymentStage = 'advance';
            currentPaymentStatus = orderData.advance_payment_status;
        } else if (orderData.status === 'completed' || orderData.final_payment_status === 'under_verification') {
            amountToPay = Number(orderData.remaining_amount_inr || 0);
            paymentStage = 'final';
            currentPaymentStatus = orderData.final_payment_status;
        } else {
            // Already paid or in-progress without pending payment
            amountToPay = 0;
        }
    } else {
        // Store Order Multi-stage logic
        if (orderData.payment_phase === 'advance_pending') {
            amountToPay = Number(orderData.advance_amount_inr || 0);
            paymentStage = 'advance';
        } else if (orderData.payment_phase === 'remaining_pending') {
            amountToPay = Number(orderData.remaining_amount_inr || 0);
            paymentStage = 'final';
        } else if (orderData.payment_status === 'pending') {
            amountToPay = Number(orderData.amount || 0);
        } else {
            amountToPay = 0;
        }
    }

    // Handle Already Paid or Processing Verification states
    if (currentPaymentStatus === 'paid' || currentPaymentStatus === 'under_verification' || currentPaymentStatus === 'pending_verification') {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/40 text-blue-500 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <h1 className="text-3xl font-serif mb-4 dark:text-white">Payment Status: {currentPaymentStatus.replace('_', ' ').toUpperCase()}</h1>
                <p className="text-neutral-500 mb-8 max-w-lg">
                    {currentPaymentStatus === 'paid'
                        ? "Great! This payment stage is confirmed and verified."
                        : "We have received your screenshot proof. Aditya is manually verifying the transaction. You'll receive an email shortly."}
                </p>
                <a href={`/track/${orderId}`} className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-80 transition shadow-lg">
                    Track Order Progress
                </a>
            </div>
        );
    }

    if (amountToPay <= 0 && isCommission) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-serif mb-4 dark:text-white">No Pending Payments</h1>
                <p className="text-neutral-500 mb-8">Your commission is currently being processed. We will notify you when the next payment stage is ready.</p>
                <a href={`/track/${orderId}`} className="px-6 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm font-bold uppercase">Back to Tracking</a>
            </div>
        );
    }

    // Fetch UPI ID from Settings
    const [settingsRows]: any = await db.query('SELECT setting_value FROM settings WHERE setting_key = "upi_id"');
    const upiId = settingsRows[0]?.setting_value || 'aditya@upi';

    return (
        <div className="max-w-4xl mx-auto px-4 py-20 relative">
            <div className="text-center mb-12">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-500 mb-2 block">Secure Gateway</span>
                <h1 className="text-4xl font-serif dark:text-white mb-4">
                    {paymentStage === 'advance' ? 'Pay Advance Amount' : paymentStage === 'final' ? 'Complete Final Payment' : 'Checkout Payment'}
                </h1>
                <p className="text-neutral-500 max-w-md mx-auto">Please use any UPI app to scan and pay. Proof upload is required to begin work.</p>
            </div>

            <UpiPaymentView
                orderId={orderId}
                amount={amountToPay.toFixed(2)}
                upiId={upiId}
                customerName={orderData.name}
                stage={paymentStage}
            />

            <div className="mt-16 text-center border-t dark:border-neutral-800 pt-8">
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest leading-relaxed">
                    By proceeding, you agree to Aditya Art Portfolio Terms of Service.<br />
                    All transactions are manual and monitored for security.
                </p>
            </div>
        </div>
    );
}
