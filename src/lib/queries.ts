import { getDb } from './db';
import { Artwork, Category } from '@/types';

export async function getArtworks(categorySlug?: string | null): Promise<Artwork[]> {
    const db = await getDb();
    let query = `
    SELECT a.*, c.name AS category_name
    FROM artworks a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.is_active = TRUE
  `;
    const params: any[] = [];

    if (categorySlug) {
        query += ` AND c.slug = ?`;
        params.push(categorySlug);
    }

    query += ` ORDER BY a.created_at DESC`;

    const [rows] = await db.execute(query, params);
    return rows as Artwork[];
}

export async function getCategories(): Promise<Category[]> {
    const db = await getDb();
    const [rows] = await db.execute('SELECT * FROM categories ORDER BY name ASC');
    return rows as Category[];
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
    const db = await getDb();
    const [rows] = await db.execute(`
    SELECT a.*, c.name AS category_name
    FROM artworks a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.slug = ? AND a.is_active = TRUE LIMIT 1
  `, [slug]);
    const artworks = rows as Artwork[];
    return artworks.length > 0 ? artworks[0] : null;
}
