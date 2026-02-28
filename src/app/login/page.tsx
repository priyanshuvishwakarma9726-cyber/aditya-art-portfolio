'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: email.split('@')[0],
                        }
                    }
                });
                if (error) throw error;
                alert('Success! Check your email to verify (or try logging in if auto-verify is enabled).');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                window.location.href = '/admin'; // Hard redirect to bypass App Router caching layer and securely transmit edge cookies
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950 px-4">
            <div className="bg-white dark:bg-black border dark:border-neutral-800 p-8 rounded-xl w-full max-w-sm">
                <h1 className="text-3xl font-serif mb-2 dark:text-white text-center">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className="text-neutral-500 text-sm text-center mb-8">
                    Sign in to access the studio.
                </p>

                {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleAuth} className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs uppercase font-bold tracking-widest text-neutral-500 mb-1 block">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-800 p-3 rounded text-sm focus:border-black outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase font-bold tracking-widest text-neutral-500 mb-1 block">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-800 p-3 rounded text-sm focus:border-black outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white dark:bg-white dark:text-black py-4 mt-2 font-bold uppercase tracking-widest hover:opacity-80 disabled:opacity-50 transition"
                    >
                        {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="w-full text-center text-sm text-neutral-500 mt-6 hover:text-black dark:hover:text-white"
                >
                    {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                </button>
            </div>
        </div>
    );
}
