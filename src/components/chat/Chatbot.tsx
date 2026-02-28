'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Brush } from 'lucide-react';

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [msgs, setMsgs] = useState<{ sender: 'bot' | 'user', text: string }[]>([
        { sender: 'bot', text: 'Hi! Ask me about commissions, pricing, shipping, or materials! 🎨' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [msgs, open]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text) return;

        setMsgs(prev => [...prev, { sender: 'user', text }]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await res.json();

            if (data.error) {
                setMsgs(prev => [...prev, { sender: 'bot', text: data.error }]);
            } else {
                setMsgs(prev => [...prev, { sender: 'bot', text: data.text }]);
            }
        } catch {
            setMsgs(prev => [...prev, { sender: 'bot', text: 'Connection failed. Please WhatsApp me instead.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">

            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white bg-black dark:bg-white dark:text-black shadow-2xl transition-transform hover:scale-105 ${open ? 'scale-0 opacity-0 absolute pointer-events-none' : 'scale-100 opacity-100'}`}
                aria-label="Open Studio Assistant"
            >
                <MessageCircle />
            </button>

            {/* Chat Box UI */}
            <div className={`w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[80vh] bg-white dark:bg-neutral-900 shadow-2xl rounded-2xl border dark:border-neutral-800 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${open ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none absolute bottom-0 right-0'}`}>

                {/* Header */}
                <div className="bg-neutral-50 dark:bg-neutral-950 p-4 border-b dark:border-neutral-800 flex justify-between items-center text-black dark:text-white">
                    <div className="flex items-center gap-3 font-serif">
                        <Brush size={18} /> Aditya Art Portfolio Assistant
                    </div>
                    <button onClick={() => setOpen(false)} className="text-neutral-500 hover:text-black dark:hover:text-white transition">
                        <X size={18} />
                    </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-sm font-sans bg-white dark:bg-neutral-900">
                    {msgs.map((m, i) => (
                        <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 px-4 rounded-2xl max-w-[85%] ${m.sender === 'user'
                                ? 'bg-black text-white dark:bg-white dark:text-black rounded-tr-none'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white rounded-tl-none border dark:border-neutral-700'
                                }`}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-neutral-100 dark:bg-neutral-800 p-3 px-4 rounded-2xl rounded-tl-none max-w-max text-neutral-500 text-xs flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse delay-75"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse delay-150"></span>
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 border-t dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex gap-2">
                    <input
                        required
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type a question..."
                        className="flex-1 bg-white dark:bg-black border dark:border-neutral-800 rounded-full px-4 text-sm focus:border-black dark:focus:border-white outline-none disabled:opacity-50"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0 disabled:opacity-50 hover:opacity-80 transition"
                    >
                        <Send size={16} className="-ml-1" />
                    </button>
                </form>

            </div>
        </div>
    );
}
