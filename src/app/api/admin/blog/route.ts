import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdminAPI } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const db = await getDb();
        const [rows]: any = await db.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
        return NextResponse.json(rows);
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const authError = await requireAdminAPI(req);
        if (authError) return authError;

        const body = await req.json();
        const { title, slug, content, excerpt, cover_image, seo_title, seo_description, category_id, tags, is_published } = body;

        const db = await getDb();
        const [res]: any = await db.execute(
            `INSERT INTO blog_posts (title, slug, content, excerpt, cover_image, seo_title, seo_description, category_id, tags, is_published, published_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, slug, content, excerpt, cover_image, seo_title, seo_description, category_id || null, tags, is_published, is_published ? new Date() : null]
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

        const body = await req.json();
        const { id, title, slug, content, excerpt, cover_image, seo_title, seo_description, category_id, tags, is_published } = body;

        const db = await getDb();

        // Check if currently published to avoid overwriting published_at repeatedly
        const [existing]: any = await db.query('SELECT is_published FROM blog_posts WHERE id = ?', [id]);
        let pubDateObj = null;
        if (is_published && (!existing[0] || !existing[0].is_published)) {
            pubDateObj = new Date();
        }

        let query = `UPDATE blog_posts SET title=?, slug=?, content=?, excerpt=?, cover_image=?, seo_title=?, seo_description=?, category_id=?, tags=?, is_published=?`;
        let params: any[] = [title, slug, content, excerpt, cover_image, seo_title, seo_description, category_id || null, tags, is_published];

        if (pubDateObj) {
            query += `, published_at=?`;
            params.push(pubDateObj);
        }

        query += ` WHERE id=?`;
        params.push(id);

        await db.execute(query, params);

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
        await db.execute('DELETE FROM blog_posts WHERE id = ?', [id]);

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
