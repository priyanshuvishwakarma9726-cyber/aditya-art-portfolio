import { getDb } from '@/lib/db';
import LegalFrame from '@/components/LegalFrame';

export const revalidate = 86400; // 24-hour cache

export const metadata = { title: 'Refund Policy' };

export default async function RefundPolicyPage() {
    const db = await getDb();
    const [rows]: any = await db.query('SELECT setting_value FROM settings WHERE setting_key = "legal_refund"');

    return <LegalFrame title="Refund Policy" content={rows[0]?.setting_value || '# Refund Policy'} />;
}
