import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';

export default function MarkdownRenderer({ content }: { content: string }) {
    return (
        <article className="prose prose-neutral dark:prose-invert prose-lg max-w-none 
                            prose-headings:font-serif prose-headings:font-normal
                            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl 
                            prose-a:text-black dark:prose-a:text-white prose-a:transition-opacity hover:prose-a:opacity-80
                            prose-img:rounded-xl prose-img:w-full prose-img:shadow-md
                            prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-900 prose-pre:border dark:prose-pre:border-neutral-800 prose-pre:text-sm">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkToc]}
                rehypePlugins={[rehypeRaw, rehypeSlug] as any}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
