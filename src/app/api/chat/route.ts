import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

function extractWords(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(w => w.length > 2);
}

export async function POST(req: Request) {
    try {
        // Rate Limiting
        if (!rateLimit(req as any, 10, 60000)) {
            return NextResponse.json({ error: 'Too many messages. Please wait a minute.' }, { status: 429 });
        }

        const { message } = await req.json();
        if (!message || message.trim().length === 0) {
            return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
        }

        const db = await getDb();
        const [faqs]: any = await db.query('SELECT keywords, answer FROM faqs WHERE is_active = TRUE');

        const userWords = extractWords(message);
        let bestMatch = null;
        let maxScore = 0;

        for (const faq of faqs) {
            const faqWords = extractWords(faq.keywords);
            let score = 0;
            // Intersection match count
            for (const qw of userWords) {
                if (faqWords.includes(qw)) score++;
                else {
                    // Check partial matching for plurals/stems simply
                    if (faqWords.some((fw: string) => fw.includes(qw) || qw.includes(fw))) {
                        score += 0.5;
                    }
                }
            }

            if (score > maxScore) {
                maxScore = score;
                bestMatch = faq;
            }
        }

        // Extremely basic threshold
        if (maxScore >= 1 && bestMatch) {
            return NextResponse.json({ text: bestMatch.answer });
        }

        return NextResponse.json({
            text: "I'm sorry, I don't have an automated answer for that. You can email me directly at aditya@adityavishwakarma.com or message me on WhatsApp for a quick reply! 😊"
        });

    } catch (e) {
        return NextResponse.json({ error: 'Error connecting to brain.' }, { status: 500 });
    }
}
