import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
    const db = await mysql.createConnection({
        uri: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: true }
    });

    try {
        console.log('Testing DB Update...');
        // Find a pending commission
        const [rows]: any = await db.query("SELECT id FROM commissions WHERE status = 'pending' LIMIT 1");
        if (rows.length === 0) {
            console.log('No pending commissions to test with.');
            return;
        }

        const id = rows[0].id;
        const final_total = 10000;
        const advance = 3000;
        const remaining = 7000;

        await db.execute(
            `UPDATE commissions 
             SET final_total_price_inr = ?, 
                 advance_amount_inr = ?, 
                 remaining_amount_inr = ?, 
                 status = 'quoted' 
             WHERE id = ?`,
            [final_total, advance, remaining, id]
        );
        console.log('Update Successful for ID:', id);

    } catch (err: any) {
        console.error('Update FAILED:', err.message);
    } finally {
        await db.end();
    }
}

run();
