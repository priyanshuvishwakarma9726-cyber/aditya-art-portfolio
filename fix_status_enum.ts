import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
    console.log('Fixing status columns...');
    const url = process.env.DATABASE_URL;
    if (!url) {
        process.exit(1);
    }

    try {
        const connection = await mysql.createConnection({
            uri: url,
            ssl: { rejectUnauthorized: true }
        });

        // Change ENUM to VARCHAR to allow flexible statuses
        const queries = [
            "ALTER TABLE commissions MODIFY COLUMN status VARCHAR(100) DEFAULT 'pending'",
            "ALTER TABLE commissions MODIFY COLUMN payment_status VARCHAR(100) DEFAULT 'pending'"
        ];

        for (const query of queries) {
            await connection.execute(query);
            console.log('SUCCESS:', query);
        }

        await connection.end();
        console.log('Fix completed.');
    } catch (err: any) {
        console.error('FAILED:', err.message);
        process.exit(1);
    }
}

run();
