"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        question: "What is the minimum capital needed to start a seasonal business?",
        answer: "You can start with as little as ₹5,000–₹10,000 for seasonal businesses like Valentine's gift hampers or Diwali diya selling. ENTRECULTIA connects you with backers who can provide initial capital for your business idea."
    },
    {
        question: "Which seasonal business is most profitable for students in India?",
        answer: "Valentine's Week and Diwali businesses typically generate the highest ROI (200–400%) due to concentrated demand. Wedding season businesses offer steady income for 6–8 months annually. The profitability depends on execution and timing."
    },
    {
        question: "How do students find backers for small business ideas?",
        answer: "ENTRECULTIA provides a verified platform where students pitch seasonal business ideas and backers browse approved opportunities. We handle identity verification, profit-sharing agreements, and provide a transparent system for both parties."
    },
    {
        question: "What kind of seasonal business opportunities are available?",
        answer: "We cover Indian festivals, agriculture seasons, and cultural events: Valentine's Week (Feb), Holi (Mar), Summer harvest & vacation businesses (Apr–Jun), Raksha Bandhan (Aug), Diwali (Oct–Nov), Christmas, wedding seasons, and more. Each season offers unique startup opportunities."
    },
    {
        question: "Is ENTRECULTIA only for college students?",
        answer: "While we primarily target college students (18–25), middle-class families and first-time small backers can also join. Students gain real startup experience, while backers earn transparent returns from short-term, seasonal ventures."
    },
    {
        question: "Can I start an agriculture-based seasonal business on ENTRECULTIA?",
        answer: "Yes! Agriculture-linked seasonal businesses — such as harvest-season produce sales, organic farming pop-ups, and festival flower cultivation — are some of the most popular categories. They align perfectly with India's agricultural calendar and offer strong seasonal demand."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 md:py-32 bg-[var(--brand-dark)] perspective-container" id="faq">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--brand-accent)] uppercase">
                        FAQ
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-[var(--brand-light)] tracking-tight mt-2">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-[var(--brand-muted)] mt-3 text-base md:text-lg max-w-2xl mx-auto">
                        Everything you need to know about seasonal startups and agriculture businesses in India
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-panel overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full text-left p-6 flex items-start justify-between gap-4 group"
                                >
                                    <div className="flex-1">
                                        <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-[var(--brand-accent)] transition-colors">
                                            {faq.question}
                                        </h3>
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                height: isOpen ? "auto" : 0,
                                                opacity: isOpen ? 1 : 0,
                                                marginTop: isOpen ? 12 : 0
                                            }}
                                            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-[var(--brand-muted)] leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    </div>
                                    <div className="flex-shrink-0 mt-1">
                                        <motion.div
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-6 h-6 rounded-full bg-[var(--brand-accent)]/10 flex items-center justify-center"
                                        >
                                            {isOpen ? (
                                                <Minus className="w-4 h-4 text-[var(--brand-accent)]" />
                                            ) : (
                                                <Plus className="w-4 h-4 text-[var(--brand-accent)]" />
                                            )}
                                        </motion.div>
                                    </div>
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <p className="text-[var(--brand-muted)] mb-4">
                        Still have questions?
                    </p>
                    <a
                        href="/join"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-[var(--brand-accent)] text-white font-semibold rounded-full hover:scale-105 transition-transform"
                    >
                        Get Started Today
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
