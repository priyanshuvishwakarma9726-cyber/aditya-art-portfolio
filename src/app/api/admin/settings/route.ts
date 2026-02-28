import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminAPI } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const db = await getDb();
        const [rows]: any = await db.query('SELECT setting_key, setting_value FROM settings');

        const settings = (rows as any[]).reduce((acc, row) => {
            acc[row.setting_key] = row.setting_value;
            return acc;
        }, {});

        return NextResponse.json(settings);
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const body = await req.json();
        const db = await getDb();

        const updates = Object.entries(body).map(async ([key, value]) => {
            await db.execute(
                'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
                [String(value), String(key)]
            );
        });

        await Promise.all(updates);

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
