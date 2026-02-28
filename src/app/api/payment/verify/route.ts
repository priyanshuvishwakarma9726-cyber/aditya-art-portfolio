import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { randomBytes } from 'crypto';
import { sendAdminNotification, sendPaymentVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const trackingId = formData.get('orderId') as string;
        const stage = formData.get('stage') as string || 'full'; // 'advance', 'final', or 'full'

        if (!file || !trackingId) {
            return NextResponse.json({ error: 'Screenshot and tracking ID are required.' }, { status: 400 });
        }

        // Validate MIME Type
        const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validMimeTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = 'webp';
        const fileName = `proof_${trackingId}_${stage}_${randomBytes(4).toString('hex')}.${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'payments');

        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, fileName);

        await sharp(buffer)
            .resize({ width: 1000, withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile(filePath);

        const screenshotDbPath = `/uploads/payments/${fileName}`;
        const db = await getDb();

        // Check tables
        const [commRows]: any = await db.query('SELECT customer_email, customer_name FROM commissions WHERE tracking_number = ?', [trackingId]);
        const isCommission = commRows.length > 0;
        const customerData = isCommission ? commRows[0] : null;

        if (isCommission) {
            if (stage === 'advance') {
                await db.execute(
                    `UPDATE commissions 
                     SET advance_payment_status = 'under_verification', advance_screenshot_path = ? 
                     WHERE tracking_number = ?`,
                    [screenshotDbPath, trackingId]
                );
            } else if (stage === 'final') {
                await db.execute(
                    `UPDATE commissions 
                     SET final_payment_status = 'under_verification', final_screenshot_path = ? 
                     WHERE tracking_number = ?`,
                    [screenshotDbPath, trackingId]
                );
            } else {
                // Compatibility for single payment
                await db.execute(
                    `UPDATE commissions SET payment_status = 'pending_verification', screenshot_path = ? WHERE tracking_number = ?`,
                    [screenshotDbPath, trackingId]
                );
            }
        } else {
            // General store orders
            if (stage === 'final') {
                await db.execute(
                    `UPDATE orders SET payment_status = 'pending_verification', final_screenshot_path = ? WHERE tracking_number = ?`,
                    [screenshotDbPath, trackingId]
                );
            } else {
                await db.execute(
                    `UPDATE orders SET payment_status = 'pending_verification', screenshot_path = ? WHERE tracking_number = ?`,
                    [screenshotDbPath, trackingId]
                );
            }
        }

        // Notifications
        if (customerData?.customer_email) {
            await sendPaymentVerificationEmail(customerData.customer_email, customerData.customer_name, trackingId, isCommission ? `Commission (${stage})` : 'Store Order');
        }

        sendAdminNotification(
            `New ${stage} proof received`,
            `Payment screenshot uploaded for ${trackingId}. Please verify in the admin dashboard.`
        ).catch(() => { });

        return NextResponse.json({ success: true, path: screenshotDbPath });

    } catch (error: any) {
        console.error('Verify error', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
