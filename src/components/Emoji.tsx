'use client';

import React from 'react';

interface EmojiProps {
    emoji: string;
    className?: string;
}

/**
 * Renders an emoji as an iOS-style image using emojicdn.elk.sh
 */
export const Emoji: React.FC<EmojiProps> = ({ emoji, className = "inline-block w-[1.2em] h-[1.2em] align-middle -mt-1 ml-1" }) => {
    // Extract hex code(s) for the emoji
    const codePoints = Array.from(emoji)
        .map((char) => char.codePointAt(0)?.toString(16))
        .filter(Boolean)
        .join('-');

    if (!codePoints) return <span>{emoji}</span>;

    // Use iOS style from emojicdn.elk.sh
    const url = `https://emojicdn.elk.sh/${emoji}?style=ios`;

    return (
        <img
            src={url}
            alt={emoji}
            className={className}
            loading="lazy"
            draggable={false}
            onError={(e) => {
                // Fallback to text if image fails
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const span = document.createElement('span');
                span.innerText = emoji;
                target.parentNode?.appendChild(span);
            }}
        />
    );
};
