"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/ui/TextReveal";
import { HeroShader } from "@/components/ui/HeroShader";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Cinematic Shader Background */}
            <HeroShader />

            <Container className="relative z-10">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Tagline */}
                    <motion.p
                        className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[var(--brand-muted)] mb-8 font-medium"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6, duration: 1.0 }}
                    >
                        Seasonal Entrepreneurship
                    </motion.p>

                    {/* Main Headline with TextReveal */}
                    <div className="mb-8">
                        <TextReveal
                            text="Start Seasonal Businesses. Invest Smarter."
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight text-[var(--brand-light)] justify-center"
                            gradientWords={["Invest", "Smarter."]}
                            delay={15} // 1.5s start
                            as="h1"
                        />
                    </div>

                    {/* Subheadline */}
                    <motion.p
                        className="text-lg sm:text-xl text-[var(--brand-muted)] max-w-2xl mx-auto mb-10 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.0, duration: 1.0 }}
                    >
                        A premium platform connecting students and backers to build
                        short-term, season-driven startups across India.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.2, duration: 1.0 }}
                    >
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => {
                                window.location.href = "/join?role=student";
                            }}
                        >
                            Join as a Student
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => {
                                window.location.href = "/join?role=investor";
                            }}
                        >
                            Join as a Backer
                        </Button>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 1.0 }}
                >
                    <motion.div
                        className="w-5 h-9 rounded-full border border-[var(--glass-border)] flex items-start justify-center p-1.5"
                    >
                        <motion.div
                            className="w-0.5 h-1.5 bg-[var(--brand-muted)] rounded-full"
                            animate={{ y: [0, 12, 0], opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        />
                    </motion.div>
                </motion.div>
            </Container>
        </section>
    );
}
