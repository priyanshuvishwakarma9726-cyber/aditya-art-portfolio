import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminAPI } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const db = await getDb();
        const [rows]: any = await db.query('SELECT * FROM faqs ORDER BY created_at DESC');
        return NextResponse.json(rows);
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const { keywords, answer, is_active } = await req.json();

        if (!keywords || !answer) return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });

        const db = await getDb();
        const [res]: any = await db.execute(
            'INSERT INTO faqs (keywords, answer, is_active) VALUES (?, ?, ?)',
            [keywords, answer, is_active ?? true]
        );

        return NextResponse.json({ success: true, id: res.insertId });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const { id, keywords, answer, is_active } = await req.json();

        const db = await getDb();
        await db.execute(
            'UPDATE faqs SET keywords = ?, answer = ?, is_active = ? WHERE id = ?',
            [keywords, answer, is_active, id]
        );

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        const db = await getDb();
        await db.execute('DELETE FROM faqs WHERE id = ?', [id]);

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
