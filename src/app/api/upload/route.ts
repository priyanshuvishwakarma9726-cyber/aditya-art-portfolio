import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Protect this globally to ensure only Admins OR logged-in users doing commissions can upload
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('image') as File;
        const targetFolder = (formData.get('folder') as string) || 'misc';

        if (!file) {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
        }

        // 10MB Limit
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Compress and Convert to WebP
        const compressedBuffer = await sharp(buffer)
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 80, effort: 6 })
            .toBuffer();

        // Safe Filename Generation: timestamp-randomstring.webp
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileName = `${timestamp}-${randomString}.webp`;

        // Create specific upload directories dynamically
        const allowedFolders = ['artworks', 'blog', 'testimonials', 'payments', 'misc', 'commissions'];
        const safeFolder = allowedFolders.includes(targetFolder) ? targetFolder : 'misc';

        const absoluteDir = path.join(process.cwd(), 'public', 'uploads', safeFolder);

        // Ensure folder exists
        await fs.mkdir(absoluteDir, { recursive: true });

        // Write file
        const filePath = path.join(absoluteDir, fileName);
        await fs.writeFile(filePath, compressedBuffer);

        // Return relative path to frontend
        const fileUrl = `/uploads/${safeFolder}/${fileName}`;

        return NextResponse.json({ url: fileUrl }, { status: 200 });
    } catch (error: any) {
        console.error('Secure Upload API Error:', error);
        return NextResponse.json({ error: 'File upload failed: ' + error.message }, { status: 500 });
    }
}
