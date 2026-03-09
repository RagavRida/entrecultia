"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ScrollDepth3D } from "@/components/ui/ScrollDepth3D";

const reasons = [
    {
        title: "Built for First-Time Founders",
        description: "No experience required. We guide you through every step.",
    },
    {
        title: "Seasonal, Short-Term Focus",
        description: "Quick cycles. Learn fast. Iterate faster.",
    },
    {
        title: "Capital-Efficient Approach",
        description: "Start small. Validate demand. Scale with confidence.",
    },
    {
        title: "Community-Driven Execution",
        description: "Learn from peers. Share insights. Grow together.",
    },
];

export function Why() {
    return (
        <section id="why" className="py-24 md:py-32 perspective-container">
            <Container>
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--brand-light)] mb-4">
                        Why ENTRECULTIA
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {reasons.map((reason, index) => (
                        <ScrollDepth3D
                            key={index}
                            type="emerge"
                            intensity={150}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <SpotlightCard className="p-8 h-full text-center md:text-left">
                                    <h3 className="text-xl font-medium text-[var(--brand-light)] mb-3">
                                        {reason.title}
                                    </h3>
                                    <p className="text-[var(--brand-muted)] text-base leading-relaxed">
                                        {reason.description}
                                    </p>
                                </SpotlightCard>
                            </motion.div>
                        </ScrollDepth3D>
                    ))}
                </div>
            </Container>
        </section>
    );
}
