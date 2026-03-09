"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function SEOContent() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-[var(--brand-dark)] to-black">
            <div className="max-w-5xl mx-auto px-6">
                {/* Above the fold content — keyword-rich */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">
                        India's First Platform for <span className="text-[var(--brand-accent)]">Seasonal Business Ideas</span> for Students
                    </h2>
                    <p className="text-base md:text-lg text-[var(--brand-muted)] leading-relaxed max-w-4xl mx-auto">
                        ENTRECULTIA is India's first platform connecting <strong className="text-white">college students</strong> with
                        small-scale backers to launch <strong className="text-white">seasonal business ideas</strong> during Valentine's Week,
                        Diwali, wedding seasons, and major Indian festivals. Start a <strong className="text-white">low-capital startup</strong> with
                        as little as ₹5,000–₹20,000 and learn entrepreneurship through real, time-bound ventures.
                    </p>
                </motion.div>

                {/* Illustrative image for Google Image indexing */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-center mb-16"
                >
                    <Image
                        src="/og-image.png"
                        alt="ENTRECULTIA — Seasonal business ideas for students in India, connecting student entrepreneurs with backers"
                        width={800}
                        height={420}
                        className="rounded-2xl border border-white/10 shadow-2xl"
                        loading="lazy"
                    />
                </motion.div>

                {/* Benefits section — diversified keywords */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 gap-8 md:gap-12"
                >
                    <div className="glass-panel p-8">
                        <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
                            Perfect for Student Startups & Small Backers
                        </h3>
                        <p className="text-[var(--brand-muted)] leading-relaxed">
                            Ideal for <strong className="text-white">students looking for startup ideas</strong> or
                            middle-class families seeking <strong className="text-white">small-capital business opportunities in India</strong>.
                            Explore categories from festival retail to <strong className="text-white">agriculture-based seasonal ventures</strong>.
                            No prior experience needed — we guide you from idea validation to revenue sharing.
                        </p>
                    </div>

                    <div className="glass-panel p-8">
                        <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
                            Seasonal Opportunities Year-Round
                        </h3>
                        <p className="text-[var(--brand-muted)] leading-relaxed">
                            Launch <strong className="text-white">festival business ideas</strong> during Valentine's Week, Holi,
                            Diwali, Raksha Bandhan, and wedding seasons. Each seasonal business runs for 14–60 days,
                            generating <strong className="text-white">₹20,000–₹2,00,000 in revenue</strong> with minimal time commitment.
                        </p>
                    </div>
                </motion.div>

                {/* Popular seasonal businesses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-6">
                        Popular Seasonal Business Opportunities
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            "Valentine's Week Business",
                            "Diwali Gift Hampers",
                            "Wedding Decoration",
                            "Festival Supplies",
                            "Summer Cooling Products",
                            "Rakhi Market",
                            "Agriculture Startups",
                            "Monsoon Accessories"
                        ].map((biz, idx) => (
                            <span
                                key={idx}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-[var(--brand-light)] hover:bg-[var(--brand-accent)]/10 hover:border-[var(--brand-accent)]/20 transition-colors"
                            >
                                {biz}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
