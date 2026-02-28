import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function run() {
    console.log('Starting migration...');
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL not found');
        process.exit(1);
    }

    try {
        const connection = await mysql.createConnection({
            uri: url,
            ssl: {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: true
            }
        });

        const queries = [
            'ALTER TABLE commissions ADD COLUMN final_total_price_inr DECIMAL(10,2) DEFAULT 0',
            'ALTER TABLE commissions ADD COLUMN advance_amount_inr DECIMAL(10,2) DEFAULT 0',
            'ALTER TABLE commissions ADD COLUMN remaining_amount_inr DECIMAL(10,2) DEFAULT 0',
            'ALTER TABLE commissions ADD COLUMN advance_payment_status VARCHAR(50) DEFAULT \'pending\'',
            'ALTER TABLE commissions ADD COLUMN final_payment_status VARCHAR(50) DEFAULT \'pending\'',
            'ALTER TABLE commissions ADD COLUMN advance_screenshot_path VARCHAR(512)',
            'ALTER TABLE commissions ADD COLUMN final_screenshot_path VARCHAR(512)'
        ];

        for (const query of queries) {
            try {
                await connection.execute(query);
                console.log('SUCCESS:', query);
            } catch (e: any) {
                console.log('SKIPPED:', e.message);
            }
        }

        await connection.end();
        console.log('Migration completed.');
    } catch (err: any) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

run();
