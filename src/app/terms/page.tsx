import { getDb } from '@/lib/db';
import LegalFrame from '@/components/LegalFrame';

export const revalidate = 86400; // 24-hour cache

export const metadata = { title: 'Terms of Service' };

export default async function TermsPage() {
    const db = await getDb();
    const [rows]: any = await db.query('SELECT setting_value FROM settings WHERE setting_key = "legal_terms"');

    return <LegalFrame title="Terms of Service" content={rows[0]?.setting_value || '# Terms of Service'} />;
}
