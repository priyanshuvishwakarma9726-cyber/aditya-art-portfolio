import { NextRequest } from 'next/server';

// Simple in-memory rate limiter to avoid external dependencies like lru-cache
const memoryCache: Record<string, { count: number; expires: number }> = {};

export function rateLimit(request: NextRequest, limit: number = 30, windowMs: number = 60 * 1000) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const now = Date.now();

    // Cleanup expired entries occasionally
    if (Math.random() < 0.1) {
        Object.keys(memoryCache).forEach(key => {
            if (memoryCache[key].expires < now) delete memoryCache[key];
        });
    }

    const entry = memoryCache[ip];

    if (!entry || entry.expires < now) {
        memoryCache[ip] = { count: 1, expires: now + windowMs };
        return true;
    }

    if (entry.count >= limit) {
        return false; // Rate limit exceeded
    }

    entry.count += 1;
    return true;
}
