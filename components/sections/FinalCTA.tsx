"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
    return (
        <section className="py-24 md:py-32">
            <Container>
                <motion.div
                    className="text-center max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--brand-light)] mb-6 leading-tight">
                        Take the First Step.
                        <br />
                        <span className="gradient-accent">Build With Confidence.</span>
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSdSdYMrsdAQ1RZmCCwmDp7Bp2PtC0Ou0XBLb80wqH7EeisHaA/viewform", "_blank")}
                        >
                            Register as Student
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSeulQf1Rk1JmFG7111GXG7xqoiTYXfNPl0LhuxB-mPD9dRBgQ/viewform", "_blank")}
                        >
                            Register as Investor
                        </Button>
                    </div>

                    <p className="text-sm text-[var(--brand-muted)]">
                        Registration is only an expression of interest. No obligation.
                    </p>
                </motion.div>
            </Container>
        </section>
    );
}
