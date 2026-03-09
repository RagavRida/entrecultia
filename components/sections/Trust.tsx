"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { ShieldCheck, Search, PieChart, Info, FileText } from "lucide-react";
import { ScrollDepth3D } from "@/components/ui/ScrollDepth3D";

const trustPoints = [
    {
        icon: ShieldCheck,
        label: "Student & identity verification",
        delay: 0
    },
    {
        icon: Search,
        label: "Manual business review",
        delay: 0.1
    },
    {
        icon: PieChart,
        label: "Transparent profit sharing",
        delay: 0.2
    },
    {
        icon: Info,
        label: "No guaranteed returns",
        delay: 0.3
    },
    {
        icon: FileText,
        label: "Clear risk disclosure",
        delay: 0.4
    },
];

export function Trust() {
    return (
        <section className="py-24 md:py-32 relative overflow-hidden perspective-container">
            {/* Background Glow Aura */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[800px] h-[400px] bg-[var(--brand-accent)]/5 blur-[120px] rounded-full opacity-50" />
            </div>

            <Container className="relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="text-center mb-16 relative"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--brand-light)] mb-4 tracking-tight">
                            Trust & Verification
                        </h2>
                        {/* Radial Glow behind Title */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-24 bg-[var(--brand-accent)]/20 blur-3xl -z-10" />
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {trustPoints.map((item, index) => (
                            <ScrollDepth3D
                                key={index}
                                type="emerge"
                                intensity={120}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6, delay: item.delay }}
                                    className="group h-full"
                                >
                                    <div className="h-full p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex flex-col items-center text-center gap-4 transition-all duration-500 hover:border-[var(--brand-light)]/20 hover:shadow-[0_0_30px_-10px_rgba(201,169,98,0.1)]">
                                        <motion.div
                                            className="p-3 rounded-full bg-[var(--brand-light)]/5 group-hover:bg-[var(--brand-light)]/10 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <item.icon className="w-6 h-6 text-[var(--brand-muted)] group-hover:text-[var(--brand-light)] transition-colors opacity-80" />
                                        </motion.div>
                                        <span className="text-[var(--brand-muted)] font-medium group-hover:text-[var(--brand-light)] transition-colors">
                                            {item.label}
                                        </span>
                                    </div>
                                </motion.div>
                            </ScrollDepth3D>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
