require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

async function seed() {
    const connectionUrl = process.env.DATABASE_URL;
    if (!connectionUrl) {
        console.error('DATABASE_URL is not defined in .env');
        process.exit(1);
    }

    console.log('Connecting to TiDB...');
    const connection = await mysql.createConnection({
        uri: connectionUrl,
        multipleStatements: true,
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true
        }
    });

    console.log('Reading schema.sql...');
    const schema = fs.readFileSync('schema.sql', 'utf8');

    console.log('Executing schema...');
    try {
        await connection.query(schema);
        console.log('Schema executed successfully!');
    } catch (err) {
        console.error('Error executing schema:', err.message);
    } finally {
        await connection.end();
    }
}

seed();
