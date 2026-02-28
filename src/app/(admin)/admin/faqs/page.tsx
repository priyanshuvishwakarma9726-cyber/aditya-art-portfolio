import { getDb } from '@/lib/db';
import FAQClient from './FAQClient';

export const dynamic = 'force-dynamic';

export default async function AdminFAQPage() {
    const db = await getDb();

    const [rows]: any = await db.query('SELECT * FROM faqs ORDER BY created_at DESC');

    return (
        <div className="w-full space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif dark:text-white">AI Assistant Knowledge Base</h1>
            </div>

            <p className="text-neutral-500 mb-8 max-w-3xl leading-relaxed">
                Configure the automated responses for your studio's AI Chatbot. The system uses these keyword maps to identify user intent and supply immediate automated replies reducing your manual support overhead natively.
            </p>

            <FAQClient initialData={rows} />
        </div>
    );
}
