require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

async function alter() {
    const connectionUrl = process.env.DATABASE_URL;
    const connection = await mysql.createConnection({
        uri: connectionUrl,
        multipleStatements: true,
        ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    });

    const schema = fs.readFileSync('alter_pricing_inr.sql', 'utf8');

    try {
        await connection.query(schema);
        console.log('Altered schema successfully!');
    } catch (err) {
        console.error('Error executing alter schema:', err.message);
    } finally {
        await connection.end();
    }
}
alter();
