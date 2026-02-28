'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Basic Cart Context Structure
export interface CartItem {
    artworkId: string;
    qty: number;
    title: string;
    price: number;
    imageUrl: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (artworkId: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // On Mount, load from localStorage (Guest Session Simulator)
    useEffect(() => {
        const stored = localStorage.getItem('aditya_cart');
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch (e) { }
        }
    }, []);

    // Sync to LocalStorage
    useEffect(() => {
        localStorage.setItem('aditya_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (newItem: CartItem) => {
        setItems(prev => {
            const exists = prev.find(i => i.artworkId === newItem.artworkId);
            if (exists) {
                return prev.map(i => i.artworkId === newItem.artworkId ? { ...i, qty: i.qty + newItem.qty } : i);
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (id: string) => setItems(prev => prev.filter(i => i.artworkId !== id));
    const clearCart = () => setItems([]);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};
