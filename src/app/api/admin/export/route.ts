import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminAPI } from '@/lib/auth';
const PDFDocument = require('pdfkit-table');

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow 60s for PDF gen

export async function GET(req: NextRequest) {
    try {
        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const db = await getDb();

        const [commissions]: any = await db.query('SELECT * FROM commissions ORDER BY created_at DESC');
        const [orders]: any = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
        const [users]: any = await db.query('SELECT * FROM users ORDER BY created_at DESC');
        const [newsletter]: any = await db.query('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC');

        // Generate PDF Buffer
        const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 30, size: 'A4' });
            const buffers: Buffer[] = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            (async () => {
                try {
                    // Title
                    doc.fontSize(24).font('Helvetica-Bold').text('Aditya Art Studio - Master Database Export', { align: 'center' });
                    doc.fontSize(10).font('Helvetica').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
                    doc.moveDown(2);

                    // 1. COMMISSIONS TABLE
                    if (commissions.length > 0) {
                        const commissionTable = {
                            title: `Commissions (${commissions.length} total)`,
                            headers: ["Tracker", "Client", "Difficulty", "Amount (INR)", "Payment", "Status"],
                            rows: commissions.map((c: any) => [
                                c.tracking_number,
                                c.customer_name,
                                c.difficulty_level || 'Medium',
                                (c.final_price_inr || c.calculated_price).toString(),
                                c.payment_status?.toUpperCase() || 'PENDING',
                                c.status?.toUpperCase() || 'PENDING'
                            ])
                        };
                        await doc.table(commissionTable, { prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8), prepareRow: () => doc.font("Helvetica").fontSize(8) });
                        doc.moveDown();
                    }

                    // 2. STORE ORDERS TABLE
                    if (orders.length > 0) {
                        const orderTable = {
                            title: `Store Orders (${orders.length} total)`,
                            headers: ["Tracker", "Customer", "Items", "Amount (INR)", "Payment", "Status"],
                            rows: orders.map((o: any) => {
                                let totalItems = 0;
                                try {
                                    const cart = typeof o.cart_data === 'string' ? JSON.parse(o.cart_data) : o.cart_data;
                                    totalItems = cart?.length || 0;
                                } catch (e) { }

                                return [
                                    o.tracking_number || o.id.substring(0, 8),
                                    o.customer_name,
                                    totalItems.toString(),
                                    o.total_amount?.toString() || '0',
                                    o.payment_status?.toUpperCase() || 'PENDING',
                                    o.status?.toUpperCase() || 'PENDING'
                                ];
                            })
                        };
                        await doc.table(orderTable, { prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8), prepareRow: () => doc.font("Helvetica").fontSize(8) });
                        doc.moveDown();
                    }

                    // 3. REGISTERED USERS TABLE
                    if (users.length > 0) {
                        const userTable = {
                            title: `Registered Accounts (${users.length} total)`,
                            headers: ["Name", "Email", "Role", "Registered Date"],
                            rows: users.map((u: any) => [
                                u.full_name || 'User',
                                u.email,
                                u.role?.toUpperCase() || 'USER',
                                new Date(u.created_at).toLocaleDateString()
                            ])
                        };
                        await doc.table(userTable, { prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8), prepareRow: () => doc.font("Helvetica").fontSize(8) });
                        doc.moveDown();
                    }

                    // 4. NEWSLETTER SUBSCRIBERS
                    if (newsletter.length > 0) {
                        const newsletterTable = {
                            title: `Newsletter Subscribers (${newsletter.length} total)`,
                            headers: ["Email", "Subscribed Date"],
                            rows: newsletter.map((n: any) => [
                                n.email,
                                new Date(n.created_at).toLocaleDateString()
                            ])
                        };
                        await doc.table(newsletterTable, { prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8), prepareRow: () => doc.font("Helvetica").fontSize(8) });
                    }

                    doc.end();
                } catch (err) {
                    reject(err);
                }
            })();
        });

        // Return PDF as exactly a byte array stream
        return new NextResponse(pdfBuffer as any, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="Aditya_Art_Database_Export.pdf"'
            }
        });

    } catch (e: any) {
        console.error('Export API Error:', e.message);
        return NextResponse.json({ error: 'Failed to generate PDF export' }, { status: 500 });
    }
}
