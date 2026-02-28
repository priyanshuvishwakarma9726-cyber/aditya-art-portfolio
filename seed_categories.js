require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedCategories() {
    const db = await mysql.createConnection({
        uri: process.env.DATABASE_URL,
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true
        }
    });

    try {
        console.log('Seeding categories...');
        await db.query(`
            INSERT IGNORE INTO categories (id, name, slug) VALUES 
            (1, 'Portrait', 'portrait'),
            (2, 'Realistic', 'realistic'),
            (3, 'Digital', 'digital'),
            (4, 'Custom Commission', 'commission')
        `);
        console.log('Categories seeded successfully.');
    } catch (err) {
        console.error('Error seeding categories:', err.message);
    } finally {
        await db.end();
    }
}

seedCategories();
