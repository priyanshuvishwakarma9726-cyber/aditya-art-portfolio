import { MapPin, Mail, Phone, Clock, Send, MessageCircle } from 'lucide-react';

export const metadata = {
    title: 'Contact | Aditya Vishwakarma',
    description: 'Get in touch with Aditya Vishwakarma for commissions, exhibition inquiries, or private viewings.'
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black pt-20">
            {/* Split Hero / Map Section */}
            <section className="relative h-[40vh] md:h-[50vh] bg-neutral-100 dark:bg-neutral-900 border-b dark:border-neutral-800 overflow-hidden">
                <div className="absolute inset-0 grayscale opacity-40 dark:opacity-20 pointer-events-none">
                    {/* Placeholder for actual Google Map or stylized artistic map */}
                    <img src="/contact-map.jpg" className="w-full h-full object-cover" alt="Map Location" />
                </div>
                <div className="relative h-full flex items-center justify-center text-center px-4 animate-fade-in">
                    <div className="space-y-4">
                        <span className="text-xs font-bold uppercase tracking-[0.4em] text-neutral-500">Reach Out</span>
                        <h1 className="text-5xl md:text-7xl font-serif dark:text-white">Contact</h1>
                    </div>
                </div>
            </section>

            <section className="py-24 md:py-32 px-4">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
                    {/* Left: Info Grid */}
                    <div className="space-y-16">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-serif italic dark:text-white">Studio Inquiries</h2>
                            <p className="text-neutral-500 max-w-md leading-relaxed">
                                For press releases, project collaborations, or high-end archival original purchase inquiries, please use the contact form or reach out directly.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-neutral-400 dark:text-neutral-600">
                                    <MapPin size={18} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Studio Address</span>
                                </div>
                                <p className="text-neutral-900 dark:text-neutral-300 font-medium">
                                    12/B Art Residency, <br />
                                    South Mumbai, MH, India <br />
                                    400001
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-neutral-400 dark:text-neutral-600">
                                    <Mail size={18} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Electronic Mail</span>
                                </div>
                                <p className="text-neutral-900 dark:text-neutral-300 font-medium">
                                    studio@aditya-art.com <br />
                                    commissions@aditya-art.com
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-neutral-400 dark:text-neutral-600">
                                    <Phone size={18} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Office Phone</span>
                                </div>
                                <p className="text-neutral-900 dark:text-neutral-300 font-medium">
                                    +91 91234 56789 <br />
                                    Mon — Fri, 10am — 6pm
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-neutral-400 dark:text-neutral-600">
                                    <Clock size={18} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Consultations</span>
                                </div>
                                <p className="text-neutral-900 dark:text-neutral-300 font-medium">
                                    Available by Appointment only. <br />
                                    Schedule via WhatsApp.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 bg-neutral-50 dark:bg-neutral-950 rounded-xl border dark:border-neutral-900 flex items-center justify-between group cursor-pointer hover:border-black dark:hover:border-white transition-all">
                            <div className="space-y-1">
                                <p className="text-neutral-900 dark:text-white font-bold flex items-center gap-2">
                                    <MessageCircle className="text-green-500" size={20} /> Quick Connect
                                </p>
                                <p className="text-neutral-500 text-sm">Send a message on WhatsApp for instant replies.</p>
                            </div>
                            <div className="p-3 bg-white dark:bg-neutral-900 dark:text-white rounded-full group-hover:scale-110 shadow-sm transition-transform">
                                <Send size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Right: Modern Form */}
                    <div className="bg-white dark:bg-black lg:p-12 border dark:border-neutral-900 rounded-2xl shadow-sm">
                        <form className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Addison Grant"
                                        className="w-full bg-neutral-50 dark:bg-neutral-950 px-6 py-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all dark:text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="grant@example.com"
                                        className="w-full bg-neutral-50 dark:bg-neutral-950 px-6 py-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Nature of Inquiry</label>
                                <select className="w-full bg-neutral-50 dark:bg-neutral-950 px-6 py-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all dark:text-white appearance-none cursor-pointer">
                                    <option>Custom Commission Quote</option>
                                    <option>Purchase Original Artwork</option>
                                    <option>Exhibition Opportunity</option>
                                    <option>Press & Legal</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Your Message</label>
                                <textarea
                                    rows={6}
                                    placeholder="Tell me about your project or inquiry..."
                                    className="w-full bg-neutral-50 dark:bg-neutral-950 px-6 py-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all dark:text-white"
                                ></textarea>
                            </div>

                            <button className="w-full bg-black text-white dark:bg-white dark:text-black py-5 font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity rounded-lg shadow-xl flex items-center justify-center gap-3">
                                Send Message <Send size={16} />
                            </button>

                            <p className="text-center text-neutral-400 text-xs tracking-wide">
                                I typically respond within 24-48 business hours.
                            </p>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
