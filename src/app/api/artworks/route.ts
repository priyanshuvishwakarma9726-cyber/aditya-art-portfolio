import { NextResponse } from 'next/server';
import { getArtworks } from '@/lib/queries';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    try {
        const artworks = await getArtworks(category);
        return NextResponse.json(artworks);
    } catch (error) {
        console.error('Failed to fetch artworks', error);
        return NextResponse.json({ error: 'Failed to fetch artworks' }, { status: 500 });
    }
}
