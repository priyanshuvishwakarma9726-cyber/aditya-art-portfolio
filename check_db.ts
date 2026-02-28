import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function run() {
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

        const [rows]: any = await connection.execute("DESCRIBE commissions");
        const statusCol = rows.find((r: any) => r.Field === 'status');
        console.log('STATUS COL:', statusCol);

        await connection.end();
    } catch (err: any) {
        console.error('Check failed:', err.message);
        process.exit(1);
    }
}

run();
