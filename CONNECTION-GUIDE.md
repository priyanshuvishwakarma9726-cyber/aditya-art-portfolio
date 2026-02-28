# TiDB and Supabase Connection Guide

This document outlines the strategy and specific steps for authenticating users via Supabase and storing your application data in TiDB (Serverless MySQL).

## The Core Concept
- **Supabase** handles authentication (Email/Password, Google OAuth). It issues JWTs and tracks the login sessions on the client and server.
- **TiDB Serverless** is our primary database. It stores users (custom data like roles), artworks, orders, etc.
- **The Bridge:** We must sync the Supabase `auth.users` with the TiDB `users` table.

---

## 1. Supabase Setup (Authentication)
1. Go to the [Supabase Dashboard](https://supabase.com).
2. Create a new "Project". Wait for the database to provision.
3. Once active, go to **Settings** -> **API** and copy your `URL` and `anon key` to your `.env.example` file.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Under **Authentication** -> **Providers**, enable **Email** and **Google**.
   - For Google, follow the Supabase docs to obtain Google API Client ID and Secret and insert them into Supabase UI.
5. In your Next.js application, use `@supabase/ssr` to configure Supabase for App Router, managing the cookies safely across Server Components, Client Components, and API Routes.

---

## 2. TiDB Serverless Setup (Database)
1. Go to the [TiDB Cloud Console](https://tidbcloud.com/).
2. Create a Free Serverless Cluster.
3. Once provisioned, click **Connect** and select **Node.js** as your environment.
4. Copy the MySQL connection string into `.env.example`:
   - `DATABASE_URL="mysql://root:pass@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/portfolio_db?ssl=accept"`
   *(Note: Ensure you include `?ssl={"rejectUnauthorized":true}` or `?ssl=accept` depending on the JS driver used).*
5. Run your schema.sql file:
   You can either run this via the TiDB Web Console (SQL Editor), or programmatically via a database administration tool (like DBeaver, DataGrip) connected to your TiDB credentials.

---

## 3. Connecting TiDB to Next.js
We recommend using **mysql2** or **Prisma** for interacting with TiDB Serverless. For edge network compatibility:

```typescript
// src/lib/db.ts (Using mysql2)
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true
  }
});

export default pool;
```
*Note: TiDB supports standard MySQL queries. Simply run `pool.execute(...)` from your Next.js API Routes or Server Actions.*

---

## 4. Bridging Supabase Auth and TiDB
When a user signs up using Supabase, you must ensure they also have a corresponding row in the TiDB `users` table.

### Strategy 1: Supabase Webhooks (PostgreSQL Trigger)
Supabase provides PostgreSQL databases under the hood. You can attach a trigger to the `auth.users` table:
1. In Supabase UI, go to **Database** -> **Webhooks**.
2. Create a webhook that fires on `INSERT` to the `auth.users` table.
3. Configure the webhook to POST to your Next.js API Route (e.g., `https://your-domain.com/api/auth/webhook`).
4. In your Next.js API Route, capture the `id` from Supabase and insert the new user into TiDB:
   ```typescript
   // src/app/api/auth/webhook/route.ts
   import pool from '@/lib/db';
   
   export async function POST(req) {
       const body = await req.json();
       const { id, email, user_metadata } = body.record;
       
       await pool.execute(
           'INSERT INTO users (id, email, full_name, role) VALUES (?, ?, ?, ?)',
           [id, email, user_metadata.full_name, 'user']
       );
       
       return new Response('User Synced to TiDB', { status: 200 });
   }
   ```

### Strategy 2: Client-side/Server-Action Sync (Easier)
Alternatively, when you verify a legitimate session login on Next.js, check if the user exists in TiDB. If not, insert them dynamically before proceeding to the app.

---

## 5. Security & Role Sync
- The primary "Role" (Admin vs. User) should be stored in the TiDB `users` table.
- When an API endpoint or Server Action is hit, decode the Supabase JWT. It only gives you the `uid` (User ID).
- Query TiDB for that `uid` to discover their Role (`SELECT role FROM users WHERE id = ?`).
- Ensure users who attempt Admin operations (File Upload, settings change) possess the "Admin" role in TiDB before allowing the TiDB execute query.
