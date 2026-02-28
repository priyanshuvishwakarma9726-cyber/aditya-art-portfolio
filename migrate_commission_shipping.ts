import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    console.log('Migrating Commission Shipping Fields...');
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
            "ALTER TABLE commissions ADD COLUMN requires_physical_delivery TINYINT(1) DEFAULT 0",
            "ALTER TABLE commissions ADD COLUMN shipping_full_address TEXT",
            "ALTER TABLE commissions ADD COLUMN shipping_city VARCHAR(255)",
            "ALTER TABLE commissions ADD COLUMN shipping_state VARCHAR(255)",
            "ALTER TABLE commissions ADD COLUMN shipping_pincode VARCHAR(50)",
            "ALTER TABLE commissions ADD COLUMN shipping_country VARCHAR(255) DEFAULT 'India'",
            "ALTER TABLE commissions ADD COLUMN shipping_landmark VARCHAR(255)",
            "ALTER TABLE commissions ADD COLUMN shipping_phone VARCHAR(50)"
        ];

        for (const query of queries) {
            try {
                await connection.execute(query);
                console.log('SUCCESS:', query);
            } catch (err: any) {
                if (err.code === 'ER_DUP_FIELDNAME') {
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
