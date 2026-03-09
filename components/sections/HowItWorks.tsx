"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useState, useEffect, Fragment } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const studentSteps = [
    { step: "01", title: "Register Interest", description: "No commitment required" },
    { step: "02", title: "Choose Season", description: "Pick your opportunity" },
    { step: "03", title: "Get Backed", description: "Receive investor support" },
    { step: "04", title: "Execute", description: "Run your business" },
    { step: "05", title: "Share Profits", description: "Transparent returns" },
];

const investorSteps = [
    { step: "01", title: "Register", description: "Quick onboarding" },
    { step: "02", title: "Review Ideas", description: "Verified opportunities" },
    { step: "03", title: "Invest", description: "Short-term capital" },
    { step: "04", title: "Track", description: "Monitor performance" },
    { step: "05", title: "Receive Returns", description: "Profit sharing" },
];



export function HowItWorks() {
    const [activeRole, setActiveRole] = useState<"student" | "investor" | null>(null);

    useEffect(() => {
        const checkRole = () => {
            const params = new URLSearchParams(window.location.search);
            const role = params.get("role");
            if (role === "student" || role === "investor") {
                setActiveRole(role);
            }
        };

        checkRole();
        // Listen for internal navigation changes if needed, though pushState doesn't trigger popstate automatically for same-page
        // We can rely on the user interaction flow for now or add a poll/event listener if critical.
        window.addEventListener("popstate", checkRole);
        return () => window.removeEventListener("popstate", checkRole);
    }, []);

    return (
        <section id="how-it-works" className="py-24 md:py-32 scroll-mt-20">
            <Container>
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h2
                        className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--brand-light)] mb-4 tracking-tight"
                        whileInView={{ letterSpacing: "-0.02em" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        How It Works
                    </motion.h2>
                    <p className="text-[var(--brand-muted)] max-w-xl mx-auto">
                        A streamlined process for both students and investors.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-24 relative">
                    {/* Vertical Divider for Desktop */}
                    <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-[var(--glass-border)] to-transparent -translate-x-1/2" />

                    {/* Students Flow - Journey Feeling */}
                    <div className={cn(
                        "transition-opacity duration-500",
                        activeRole === "investor" ? "opacity-30 blur-[1px]" : "opacity-100"
                    )}>
                        <h3 className="text-xl font-medium text-[var(--brand-light)] mb-10 text-center md:text-left flex items-center justify-center md:justify-start gap-3">
                            <span className="text-2xl">🎓</span> For Students
                        </h3>

                        <div className="relative pl-8 border-l border-[var(--glass-border)] space-y-12">
                            {/* Animated Progress Line */}
                            <motion.div
                                className="absolute left-[-1px] top-0 w-[1px] bg-[var(--brand-accent)]"
                                initial={{ height: 0 }}
                                whileInView={{ height: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />

                            {studentSteps.map((item, index) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: index * 0.15, duration: 0.6 }}
                                    className="relative group"
                                >
                                    {/* Step Number */}
                                    <div className="absolute -left-[45px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--brand-dark)] border border-[var(--glass-border)] text-[var(--brand-accent)] font-mono text-sm shadow-[0_0_10px_rgba(201,169,98,0.1)] z-10">
                                        {item.step}
                                    </div>

                                    <motion.div
                                        className="p-5 rounded-xl border border-transparent hover:border-[var(--brand-light)]/10 hover:bg-[var(--glass-bg)] transition-all duration-300"
                                        whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}
                                    >
                                        <h4 className="text-lg font-medium text-[var(--brand-light)] mb-1">
                                            {item.title}
                                        </h4>
                                        <motion.p
                                            className="text-sm text-[var(--brand-muted)]"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: (index * 0.15) + 0.3 }}
                                        >
                                            {item.description}
                                        </motion.p>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Investors Flow - Executive Feel */}
                    <div className={cn(
                        "transition-opacity duration-500",
                        activeRole === "student" ? "opacity-30 blur-[1px]" : "opacity-100"
                    )}>
                        <h3 className="text-xl font-medium text-[var(--brand-light)] mb-10 text-center md:text-left flex items-center justify-center md:justify-start gap-3">
                            <span className="text-2xl">💼</span> For Investors
                        </h3>

                        <motion.div
                            className="bg-[var(--glass-bg)] rounded-2xl border border-[var(--glass-border)] overflow-hidden"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            {investorSteps.map((item, index) => (
                                <Fragment key={item.step}>
                                    <motion.div
                                        className="p-6 md:p-8 flex items-center gap-6 group hover:bg-[var(--brand-light)]/[0.02] transition-colors duration-300"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <span className="text-base font-mono text-[var(--brand-muted)] group-hover:text-[var(--brand-light)] transition-colors">
                                            {item.step}
                                        </span>
                                        <div>
                                            <h4 className="text-base font-medium text-[var(--brand-light)] mb-0.5">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs uppercase tracking-wider text-[var(--brand-muted)]">
                                                {item.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                    {index < investorSteps.length - 1 && (
                                        <motion.div
                                            className="h-px w-full bg-[var(--glass-border)]"
                                            initial={{ width: 0, opacity: 0 }}
                                            whileInView={{ width: "100%", opacity: 1 }}
                                            transition={{ delay: index * 0.1 + 0.2 }}
                                        />
                                    )}
                                </Fragment>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
