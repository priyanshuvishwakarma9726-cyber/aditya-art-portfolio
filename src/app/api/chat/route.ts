import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

function extractWords(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(w => w.length > 2);
}

export async function POST(req: Request) {
    try {
        // Rate Limiting (15 per min)
        if (!rateLimit(req as any, 15, 60000)) {
            return NextResponse.json({ error: 'Too many messages. Please wait a minute.' }, { status: 429 });
        }

        const body = await req.json();
        const userInput = body.message || "";

        if (!userInput.trim()) {
            return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
        }

        // 1. Normalization
        const cleanInput = userInput.toLowerCase().trim().replace(/[^\w\s]/gi, '');

        // 2. Intent Detection Logic
        const matches = (keywords: string[]) => keywords.some(k => cleanInput.includes(k));

        // 3. Smart Keyword Matching
        let response = "";

        if (matches(['hello', 'hi', 'hey', 'ola', 'namaste', 'bro', 'sir'])) {
            response = "Hello! I'm Aditya's AI Assistant. How can I help you with your art today? 😊";
        }
        else if (matches(['price', 'cost', 'kitna', 'commission', 'custom', 'order', 'want to buy'])) {
            response = "I'd love to help with that! Original artworks start from ₹2,000, and custom commissions depend on size and complexity. \n\n• Browse the 'Shop' for originals.\n• Check 'Commission' for custom requests.\n• Advance (50%) is required to start any custom work!";
        }
        else if (matches(['track', 'status', 'where is my', 'aw-', 'tracking'])) {
            response = "You can track your order live! Just head over to the 'Track Order' page and enter your AW- tracking ID. If you just placed an order, please wait for admin verification. 🚚";
        }
        else if (matches(['upi', 'payment', 'advance', 'screenshot', 'how to pay', 'qr code'])) {
            response = "We accept all UPI payments. After placing an order, you'll see a QR code. Simply scan, pay the 50% advance, and upload the screenshot. Our team will verify it within 24 hours! 🛡️";
        }
        else if (matches(['delivery', 'courier', 'post', 'address', 'kab', 'when', 'receive'])) {
            response = "Shipping usually takes 7-10 working days after completion. We use high-quality packaging and ship via India Post/Speed Post to ensure your art arrives safely! 📦";
        }
        else if (matches(['about', 'who', 'artist', 'aditya'])) {
            response = "Aditya is a hyper-realistic pencil artist specializing in capturing deep emotions through graphite and charcoal. You can read more about his journey in the 'Journal' section! 🎨";
        }

        // 4. Default Smart Fallback
        if (!response) {
            response = "I'm not exactly sure about that yet, but I'm still learning! Here are some things I can help with:\n\n• Commission pricing & custom work\n• Order tracking (AW- IDs)\n• Payment & UPI help\n• Shipping & Delivery details\n\nOr you can email Aditya directly at art.aditya@gmail.com! ✉️";
        }

        return NextResponse.json({ text: response });

    } catch (e) {
        console.error("Chat API Error:", e);
        return NextResponse.json({ error: 'Error connecting to brain.' }, { status: 500 });
    }
}
