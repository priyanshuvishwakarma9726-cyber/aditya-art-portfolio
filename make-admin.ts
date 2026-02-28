import { getDb } from './src/lib/db.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

async function makeAdmin() {
    const emailToPromote = process.argv[2];

    if (!emailToPromote) {
        console.error('❌ Please provide the email address of the user to promote.');
        console.error('Usage: node make-admin.js user@example.com');
        process.exit(1);
    }

    try {
        const db = await getDb();

        // Check if user exists
        const [rows]: any = await db.query('SELECT * FROM users WHERE email = ?', [emailToPromote]);

        if (rows.length === 0) {
            console.error(`❌ User with email ${emailToPromote} not found in TiDB.`);
            console.error(`💡 Tip: They must log in via the Supabase UI at least once first.`);
            process.exit(1);
        }

        // Update role
        await db.execute('UPDATE users SET role = "admin" WHERE email = ?', [emailToPromote]);

        console.log(`✅ Success! User ${emailToPromote} has been promoted to Admin.`);
        process.exit(0);

    } catch (error: any) {
        console.error('❌ Error promoting user:', error.message);
        process.exit(1);
    }
}

// Since we are running raw JS we need a quick shim if someone tries to run it without compiling ts.
// I'll make a JS vers too
makeAdmin();
