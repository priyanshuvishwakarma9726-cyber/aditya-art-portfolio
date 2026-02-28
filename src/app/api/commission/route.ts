import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { sendAdminNotification } from '@/lib/email';
interface CommissionPayload {
    name: string;
    email: string;
    phone: string;
    size: 'A4' | 'A3' | 'A2' | 'Custom';
    medium: 'Pencil' | 'Charcoal' | 'Digital';
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
    deadline: 'Normal' | 'Express';
    notes: string;
    referenceUrl: string;
    requiresPhysicalDelivery: boolean;
    shipping_full_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_pincode: string;
    shipping_country: string;
    shipping_landmark: string;
    shipping_phone: string;
}

export async function POST(req: Request) {
    try {
        const data: CommissionPayload = await req.json();
        const db = await getDb();

        // 1. Fetch live settings to compute accurate tampering-proof price
        const [settingsRows]: any = await db.query('SELECT setting_key, setting_value FROM settings');
        const settings = (settingsRows as any[]).reduce((acc, row) => {
            acc[row.setting_key] = row.setting_value;
            return acc;
        }, {});

        const basePrice = parseInt(settings.base_price_inr || '5000');

        const sizeMap: Record<string, string> = {
            'A4': 'mult_size_a4',
            'A3': 'mult_size_a3',
            'A2': 'mult_size_a2',
            'Custom': 'mult_size_custom'
        };
        const sizeMult = parseFloat(settings[sizeMap[data.size]] || '1.0');

        const mediumMap: Record<string, string> = {
            'Pencil': 'mult_medium_pencil',
            'Charcoal': 'mult_medium_charcoal',
            'Digital': 'mult_medium_digital'
        };
        const mediumMult = parseFloat(settings[mediumMap[data.medium]] || '1.0');

        const diffMap: Record<string, string> = {
            'Easy': 'mult_diff_easy',
            'Medium': 'mult_diff_medium',
            'Hard': 'mult_diff_hard',
            'Extreme': 'mult_diff_extreme'
        };
        const diffMult = parseFloat(settings[diffMap[data.difficulty]] || '1.3');

        const expressFee = data.deadline === 'Express'
            ? parseInt(settings.fee_express_inr || '2000')
            : 0;

        const calculatedPrice = Math.round((basePrice * sizeMult * mediumMult * diffMult) + expressFee);

        // 3. Generate Tracking ID
        const trackingId = `AW-${uuidv4().substring(0, 8).toUpperCase()}`;
        const internalId = uuidv4();

        // 4. Validate shipping if required
        let isPhysDelivery = data.requiresPhysicalDelivery ? 1 : 0;
        if (data.medium === 'Digital') {
            isPhysDelivery = 0; // Digital never needs physical delivery from form
        }

        if (isPhysDelivery) {
            if (!data.shipping_full_address || !data.shipping_city || !data.shipping_state || !data.shipping_pincode || !data.shipping_phone) {
                return NextResponse.json({ error: 'Missing required shipping fields' }, { status: 400 });
            }
        }

        // 5. Save to Database
        await db.execute(
            `INSERT INTO commissions 
      (id, customer_name, customer_email, customer_phone, size_selection, medium_selection, 
       difficulty_level, deadline_selection, reference_image_url, additional_notes, 
       calculated_price, tracking_number, status,
       requires_physical_delivery, shipping_full_address, shipping_city,
       shipping_state, shipping_pincode, shipping_country, shipping_landmark, shipping_phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                internalId, data.name, data.email, data.phone, data.size, data.medium, data.difficulty, data.deadline,
                data.referenceUrl, data.notes, calculatedPrice, trackingId, 'pending',
                isPhysDelivery,
                isPhysDelivery ? data.shipping_full_address : null,
                isPhysDelivery ? data.shipping_city : null,
                isPhysDelivery ? data.shipping_state : null,
                isPhysDelivery ? data.shipping_pincode : null,
                isPhysDelivery ? data.shipping_country || 'India' : 'India',
                isPhysDelivery ? data.shipping_landmark : null,
                isPhysDelivery ? data.shipping_phone : null
            ]
        );

        // 5. Fire Notification Asynchronously
        sendAdminNotification('New Commission Request (INR)', `ID: ${trackingId}\nDifficulty: ${data.difficulty}\nSize: ${data.size}\nMedium: ${data.medium}\nNotes: ${data.notes}`);

        // Return the tracking ID
        return NextResponse.json({
            trackingId,
            amount: calculatedPrice,
        });

    } catch (error: any) {
        console.error('Commission Error API', error);
        return NextResponse.json({ error: 'Commission generation failed' }, { status: 500 });
    }
}
