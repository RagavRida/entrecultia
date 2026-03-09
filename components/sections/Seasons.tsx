"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { ScrollDepth3D } from "@/components/ui/ScrollDepth3D";

const seasons = [
    { name: "Valentine's Week", emoji: "💝" },
    { name: "Festivals", emoji: "🪔" },
    { name: "Summer", emoji: "☀️" },
    { name: "Winter", emoji: "❄️" },
    { name: "Monsoon", emoji: "🌧️" },
    { name: "Wedding Season", emoji: "💍" },
];



export function Seasons() {
    return (
        <section id="seasons" className="py-24 md:py-32 perspective-container">
            <Container>
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--brand-light)] mb-4">
                        Seasons & Events
                    </h2>
                    <p className="text-[var(--brand-muted)] max-w-xl mx-auto">
                        Demand changes with seasons. Opportunity follows.
                    </p>
                </motion.div>

                <div className="relative w-full overflow-hidden mask-linear-fade">
                    <motion.div
                        className="flex gap-4 w-max"
                        animate={{
                            x: ["0%", "-50%"],
                        }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {[...seasons, ...seasons].map((season, index) => (
                            <ScrollDepth3D
                                key={`${season.name}-${index}`}
                                type="float"
                                intensity={80}
                            >
                                <motion.div
                                    className="glass-panel p-6 w-[200px] text-center group cursor-pointer transition-all duration-300 hover:border-[var(--brand-light)]/20 flex-shrink-0"
                                    whileHover={{ y: -4 }}
                                >
                                    <span className="text-4xl mb-3 block transform group-hover:scale-110 transition-transform duration-300">{season.emoji}</span>
                                    <p className="text-sm font-medium text-[var(--brand-light)] group-hover:text-[var(--brand-accent)] transition-colors">
                                        {season.name}
                                    </p>
                                </motion.div>
                            </ScrollDepth3D>
                        ))}
                    </motion.div>
                </div>
            </Container>
        </section>
    );
}
