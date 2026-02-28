import { Artwork } from '@/types';

// Simple TF-IDF or category-based recommendation logic (no external API)
// If a user opens a Portrait artwork, this will suggest other artworks from the same category
// It also ranks by word similarity in title/description if categories match.
export function getRecommendations(currentArtwork: Artwork, allArtworks: Artwork[], limit = 3): Artwork[] {
    const others = allArtworks.filter(a => a.id !== currentArtwork.id);

    // Scoring function
    const scored = others.map(art => {
        let score = 0;

        // Exact category match gets high weight
        if (art.category_id === currentArtwork.category_id) score += 10;

        // Title similarity checks (basic keyword matching)
        const currentWords = currentArtwork.title.toLowerCase().split(/\s+/);
        const checkingWords = art.title.toLowerCase().split(/\s+/);

        currentWords.forEach(word => {
            // ignore very short stop words visually
            if (word.length > 3 && checkingWords.includes(word)) {
                score += 2;
            }
        });

        return { artwork: art, score };
    });

    // Sort by highest score first, slice top 3
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.artwork);
}
