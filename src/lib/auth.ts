import { createClient } from '@/lib/supabase/server';
import { getDb } from '@/lib/db';
import { redirect } from 'next/navigation';
import { NextResponse, NextRequest } from 'next/server';

/**
 * Ensures the currently authenticated Supabase user exists in TiDB and returns their role.
 */
export async function getUserRoleServer() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    console.log('[Auth] Supabase User Fetch:', user?.id || 'null');

    if (!user) {
        console.log('[Auth] User is null, redirecting back.');
        return null;
    }

    const db = await getDb();

    // Force Admin mapping for owner emails structurally to survive UUID resets
    const isOwner = user.email === 'priyanshuvishwakarma9726@gmail.com' || user.email === 'priyanshu@gmail.com' || user.email === 'ma9726@gmail.com';
    const targetRole = isOwner ? 'admin' : 'user';

    // 1. Try fetching by user.id directly
    const [rowsById]: any = await db.query('SELECT id, role FROM users WHERE id = ?', [user.id]);

    if (rowsById.length > 0) {
        // Exists by ID
        if (isOwner && rowsById[0].role !== 'admin') {
            await db.query('UPDATE users SET role = "admin" WHERE id = ?', [user.id]);
            return 'admin';
        }
        return rowsById[0].role as string;
    }

    // 2. Fetch by email to catch UUID desyncs if they wiped Supabase auth users
    const [rowsByEmail]: any = await db.query('SELECT id, role FROM users WHERE email = ?', [user.email]);

    if (rowsByEmail.length > 0) {
        // Exists by email, so we update the TiDB schema to map to the new Supabase UUID
        await db.query('UPDATE users SET id = ?, role = ? WHERE email = ?', [user.id, targetRole, user.email]);
        console.log(`[Auth] Resynced Auth ID for ${user.email} as ${targetRole}`);
        return targetRole;
    }

    // 3. Complete net-new user
    const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    await db.query(
        'INSERT IGNORE INTO users (id, email, full_name, role) VALUES (?, ?, ?, ?)',
        [user.id, user.email, fullName, targetRole]
    );

    console.log(`[Auth] New user generated as ${targetRole}`);
    return targetRole;
}

/**
 * Use in Server Components/Layouts to definitively block non-admins.
 */
export async function requireAdmin() {
    const role = await getUserRoleServer();
    if (role !== 'admin') {
        redirect('/'); // Send regular users & unauthenticated back to home
    }
}

/**
 * Use in Server API routes to definitely block non-admins and return clean errors.
 */
export async function requireAdminAPI(request?: NextRequest) {
    if (request) {
        // Enforce basic CSRF Origin validation
        const origin = request.headers.get('origin');
        const host = request.headers.get('host');
        if (origin && host && !origin.includes(host)) {
            return NextResponse.json({ error: 'Forbidden: Invalid Request Origin' }, { status: 403 });
        }
    }

    const role = await getUserRoleServer();
    if (role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden: Admin access only.' }, { status: 403 });
    }
    return null;
}
