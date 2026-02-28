import MarkdownRenderer from '@/components/blog/MarkdownRenderer';

export default function LegalFrame({ title, content }: { title: string, content: string }) {
    return (
        <main className="max-w-3xl mx-auto px-4 py-32 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-serif mb-12 border-b dark:border-neutral-800 pb-6 dark:text-white">{title}</h1>
            <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-8 md:p-12 rounded-xl shadow-sm">
                <MarkdownRenderer content={content} />
            </div>
        </main>
    );
}
