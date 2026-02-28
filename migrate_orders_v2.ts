import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    console.log('Migrating Orders Table to V2 Order System...');
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL not set');
        process.exit(1);
    }

    try {
        const connection = await mysql.createConnection({
            uri: url,
            ssl: { rejectUnauthorized: true }
        });

        const queries = [
            "ALTER TABLE orders ADD COLUMN order_type ENUM('store', 'commission') DEFAULT 'store'",
            "ALTER TABLE orders ADD COLUMN advance_amount_inr DECIMAL(10, 2) DEFAULT 0",
            "ALTER TABLE orders ADD COLUMN remaining_amount_inr DECIMAL(10, 2) DEFAULT 0",
            "ALTER TABLE orders ADD COLUMN payment_phase ENUM('advance_pending', 'advance_paid', 'shipped', 'delivered', 'remaining_pending', 'completed') DEFAULT 'advance_pending'",
            "ALTER TABLE orders MODIFY status ENUM('pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending'",
            "ALTER TABLE orders ADD COLUMN courier_name VARCHAR(255)",
            "ALTER TABLE orders ADD COLUMN delivery_proof_image VARCHAR(512)",
            "ALTER TABLE orders ADD COLUMN final_screenshot_path VARCHAR(512) NULL"
        ];

        for (const query of queries) {
            try {
                await connection.execute(query);
                console.log('SUCCESS:', query);
            } catch (err: any) {
                if (err.code === 'ER_DUP_FIELDNAME' || err.code === 'ER_DUP_COLUMN') {
                    console.log('ALREADY EXISTS:', query);
                } else {
                    console.error('ERROR on query:', query, err.message);
                }
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
