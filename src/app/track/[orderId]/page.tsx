import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Package, Truck, CheckCircle, Clock, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';

async function getTrackingData(trackingId: string) {
    const id = trackingId.trim();
    const db = await getDb();

    // Check Commission Table with Multi-Stage fields
    const [commissions]: any = await db.query(
        'SELECT * FROM commissions WHERE tracking_number = ? LIMIT 1',
        [id]
    );

    if (commissions.length > 0) {
        return { type: 'commission', data: commissions[0] };
    }

    // Try Orders Table
    const [orders]: any = await db.query(
        'SELECT * FROM orders WHERE tracking_number = ? LIMIT 1',
        [id]
    );

    if (orders.length > 0) {
        return { type: 'store_order', data: orders[0] };
    }

    return null;
}

export default async function TrackingPage(props: { params: Promise<{ orderId: string }> }) {
    const params = await props.params;
    const result = await getTrackingData(params.orderId);

    if (!result) return notFound();

    const { data, type } = result;

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'delivered':
            case 'closed': return <CheckCircle className="text-emerald-500" size={32} />;
            case 'shipped': return <Truck className="text-blue-500" size={32} />;
            case 'in_progress':
            case 'processing': return <Package className="text-amber-500" size={32} />;
            default: return <Clock className="text-neutral-400" size={32} />;
        }
    };

    const isCommission = type === 'commission';

    // Status Logic
    const currentStatus = data.status || 'PENDING';

    // Multi-stage Payment UI logic
    let paymentMessage = "Awaiting Admin Review";
    let paymentButton = null;
    let paymentColor = "text-amber-600";

    if (isCommission) {
        if (currentStatus === 'quoted' || (currentStatus === 'pending' && data.advance_amount_inr > 0)) {
            paymentMessage = "Advance Payment Required";
            paymentButton = `/payment/${params.orderId}`;
        } else if (data.advance_payment_status === 'under_verification') {
            paymentMessage = "Advance Under Verification";
            paymentColor = "text-blue-500";
        } else if (data.advance_payment_status === 'paid' && (currentStatus === 'in_progress' || currentStatus === 'pending')) {
            paymentMessage = "Advance Paid ✅ - Work In Progress";
            paymentColor = "text-emerald-500";
        } else if (currentStatus === 'completed' && data.final_payment_status !== 'paid') {
            paymentMessage = "Artwork Ready! Final Payment Due";
            paymentColor = "text-indigo-600";
            paymentButton = `/payment/${params.orderId}`;
        } else if (data.final_payment_status === 'under_verification') {
            paymentMessage = "Final Payment Under Verification";
            paymentColor = "text-blue-500";
        } else if (data.final_payment_status === 'paid' || currentStatus === 'closed') {
            paymentMessage = "Project Fully Paid & Completed ✅";
            paymentColor = "text-emerald-500";
        }
    } else {
        // Upgrade Store Order lifecycle handling
        const phase = data.payment_phase;
        if (phase === 'advance_pending') {
            paymentMessage = "50% Advance Payment Required";
            paymentButton = `/payment/${params.orderId}`;
        } else if (data.payment_status === 'pending_verification') {
            paymentMessage = "Reviewing Payment Proof...";
            paymentColor = "text-blue-500";
        } else if (phase === 'advance_paid') {
            paymentMessage = "Advance Verified ✅ - Preparing Art";
            paymentColor = "text-emerald-500";
        } else if (phase === 'shipped') {
            paymentMessage = "Artwork Shipped! Check tracking below";
            paymentColor = "text-blue-500";
        } else if (phase === 'delivered' || phase === 'remaining_pending') {
            paymentMessage = "Delivered! Final 50% Payment Due";
            paymentColor = "text-indigo-600";
            paymentButton = `/payment/${params.orderId}`;
        } else if (phase === 'completed') {
            paymentMessage = "Order Fully Completed! ✅";
            paymentColor = "text-emerald-500";
        } else {
            if (data.payment_status === 'paid') {
                paymentMessage = "Payment Verified ✅";
                paymentColor = "text-emerald-500";
            }
        }
    }

    const dateStr = data.created_at ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(data.created_at)) : 'Unknown';

    // Timeline Configuration
    const storeTimeline = [
        { label: 'Order Placed', completed: true, date: dateStr },
        { label: 'Advance Paid', completed: ['advance_paid', 'shipped', 'delivered', 'remaining_pending', 'completed'].includes(data.payment_phase) },
        { label: 'Shipped', completed: ['shipped', 'delivered', 'remaining_pending', 'completed'].includes(data.payment_phase) },
        { label: 'Delivered', completed: ['delivered', 'remaining_pending', 'completed'].includes(data.payment_phase) },
        { label: 'Final Payment', completed: data.payment_phase === 'completed' },
    ];

    const commissionTimeline = [
        { label: 'Request Received', completed: true, date: dateStr },
        { label: 'Advance Payment', completed: data.advance_payment_status === 'paid' },
        { label: 'Creation Phase', completed: ['in_progress', 'completed', 'closed'].includes(currentStatus.toLowerCase()) },
        { label: 'Final Completion', completed: ['completed', 'closed'].includes(currentStatus.toLowerCase()) },
        { label: 'Project Closed', completed: currentStatus.toLowerCase() === 'closed' }
    ];

    const timeline = isCommission ? commissionTimeline : storeTimeline;

    return (
        <div className="min-h-screen py-24 px-4 max-w-5xl mx-auto flex flex-col items-center">

            <div className="w-full grid lg:grid-cols-5 gap-10 animate-fade-in-up" suppressHydrationWarning>

                {/* Status Sidebar */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-8 shadow-xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl" suppressHydrationWarning>
                                {getStatusIcon(data.status)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-serif dark:text-white">Live Tracking</h1>
                                <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">{params.orderId}</p>
                            </div>
                        </div>

                        <div className="space-y-8 relative">
                            {/* Visual Timeline Connectors */}
                            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-neutral-100 dark:bg-neutral-800 -z-0"></div>

                            {timeline.map((step, idx) => (
                                <div key={idx} className="flex gap-4 relative z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${step.completed
                                        ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                                        : 'bg-white dark:bg-neutral-900 dark:border-neutral-700 text-neutral-300'
                                        }`}>
                                        {step.completed ? <CheckCircle size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                                    </div>
                                    <div className="pt-1">
                                        <p className={`text-xs font-bold uppercase tracking-widest ${step.completed ? 'text-black dark:text-white' : 'text-neutral-400'}`}>
                                            {step.label}
                                        </p>
                                        {step.date && <p className="text-[10px] text-neutral-400 mt-0.5">{step.date}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {data.courier_name && (
                        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-3">Shipping Details</h3>
                            <div className="space-y-2">
                                <p className="text-sm font-bold dark:text-white">{data.courier_name}</p>
                                <p className="text-xs font-mono text-neutral-500">ID: {data.tracking_number}</p>
                                <a
                                    href={`https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackitem.aspx`}
                                    target="_blank"
                                    className="text-[10px] font-bold text-blue-600 uppercase hover:underline inline-block mt-2"
                                >
                                    Track on India Post →
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="p-6 bg-neutral-100 dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl flex items-center gap-4">
                        <ShieldCheck className="text-blue-500" size={24} />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Authenticity Guaranteed</p>
                            <p className="text-xs text-neutral-400">All artwork is hand-signed and certified by Aditya Vishwakarma.</p>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="lg:col-span-3 space-y-6">

                    <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                        {/* Status Header */}
                        <div className="flex justify-between items-start mb-10 border-b dark:border-neutral-800 pb-6">
                            <div className="space-y-1">
                                <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em]">Fulfillment Stage</h2>
                                <p className="text-2xl font-serif dark:text-white capitalize">{currentStatus.replace('_', ' ')}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em]">Est. Delivery</h2>
                                <p className="text-sm font-bold dark:text-white">{data.status === 'shipped' ? 'In Transit' : 'Standard 10-14 days'}</p>
                            </div>
                        </div>

                        {/* Payment Message Box */}
                        <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${paymentMessage.includes('✅') ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50' : 'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50'
                            }`}>
                            <div className="flex items-center gap-4">
                                <CreditCard className={paymentColor} size={24} />
                                <div>
                                    <p className={`text-base font-bold ${paymentColor}`}>{paymentMessage}</p>
                                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-tight">Status identification</p>
                                </div>
                            </div>
                            {paymentButton && (
                                <a href={paymentButton} className="w-full md:w-auto px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition flex items-center justify-center gap-2 shadow-lg">
                                    Proceed to Payment <ChevronRight size={14} />
                                </a>
                            )}
                        </div>

                        {/* Invoice Summary */}
                        {isCommission && (
                            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t dark:border-neutral-800">
                                <div>
                                    <h3 className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-2">Total Project</h3>
                                    <p className="text-xl font-bold dark:text-white">₹{Number(data.final_total_price_inr || data.calculated_price).toLocaleString()}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-2">Advance Paid</h3>
                                    <p className="text-lg font-bold text-emerald-500">₹{Number(data.advance_amount_inr || 0).toLocaleString()}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-2">Balance Remaining</h3>
                                    <p className="text-lg font-bold text-blue-500">₹{Number(data.remaining_amount_inr || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        {!isCommission && (
                            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t dark:border-neutral-800">
                                <div>
                                    <h3 className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-2">Order Value</h3>
                                    <p className="text-xl font-bold dark:text-white">₹{Number(data.total_amount).toLocaleString()}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-2">Advance (50%)</h3>
                                    <p className="text-lg font-bold text-emerald-500">₹{Number(data.advance_amount_inr).toLocaleString()}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-2">Remaining (50%)</h3>
                                    <p className="text-lg font-bold text-blue-500">₹{Number(data.remaining_amount_inr).toLocaleString()}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="text-center p-8">
                        <p className="text-[10px] text-neutral-400 uppercase tracking-[0.4em] leading-loose">
                            Aditya Art Studio • Manual Verification Protocol Active
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
