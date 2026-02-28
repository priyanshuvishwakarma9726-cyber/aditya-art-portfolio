import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export async function getDb(retryCount = 0): Promise<mysql.Pool> {
    if (!pool) {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is missing from environment variables');
        }
        const testPool = mysql.createPool({
            uri: process.env.DATABASE_URL,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10,
            idleTimeout: 60000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 10000,
            ssl: {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: true
            }
        });

        try {
            // Ping to ensure the pool connection actually works, waking up TiDB synchronously if asleep
            const connection = await testPool.getConnection();
            connection.release();
            pool = testPool; // Bind globally only after validation
        } catch (err: any) {
            console.error(`[DB] TiDB Connection Error Intercepted (Retry ${retryCount}):`, err.message);
            testPool.end().catch(() => { });

            if (retryCount >= 3) {
                console.error('[DB] TiDB failed to wake up after 3 retries.');
                throw new Error('TiDB Serverless Database is completely offline runtime.');
            }

            // Wait a second for serverless to physically cold start before hammering it again
            await new Promise(res => setTimeout(res, 1500));
            return getDb(retryCount + 1);
        }
    }

    return pool;
}
