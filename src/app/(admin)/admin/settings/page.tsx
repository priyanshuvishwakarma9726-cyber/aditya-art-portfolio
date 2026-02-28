import { getDb } from '@/lib/db';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
    const db = await getDb();

    const [rows]: any = await db.query('SELECT setting_key, setting_value FROM settings');

    // Map initial data into simple kv JSON block for the client form
    const initialConfig = (rows as any[]).reduce((acc, row) => {
        acc[row.setting_key] = row.setting_value;
        return acc;
    }, {});

    return (
        <div className="w-full space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-serif dark:text-white">Studio Engine Configuration</h1>
                <p className="text-neutral-500 mt-2 text-sm font-bold uppercase tracking-widest max-w-2xl">
                    Dynamically manage application parameters, calculation layers, multipliers, and legal boundaries.
                </p>
            </div>

            <SettingsClient initialConfig={initialConfig} />
        </div>
    );
}
