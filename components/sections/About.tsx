"use client";

import { TextReveal } from "@/components/ui/TextReveal";

export function About() {
    return (
        <section id="about" className="py-24 md:py-32 bg-[var(--brand-dark)] relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center space-y-6 mb-16">
                    <TextReveal
                        text="Our Mission"
                        className="text-4xl md:text-6xl font-bold text-[var(--brand-light)] tracking-tight justify-center"
                        delay={0}
                        as="h2" // Changed to h2 since it's a section, assuming h1 is in Hero
                    />
                    <p className="text-lg md:text-xl text-[var(--brand-muted)] max-w-2xl mx-auto leading-relaxed">
                        Bridging the gap between student ambition and investor capital.
                    </p>
                </div>

                {/* Core Values / Story */}
                <div className="space-y-8 text-[var(--brand-light)]/90 leading-relaxed text-lg mb-16">
                    <p>
                        <span className="text-[var(--brand-accent)] font-semibold">Entrecultia</span> was founded on a simple belief: students have the energy and ideas, but lack capital. Investors have capital, but lack the time to execute.
                    </p>
                    <p>
                        We created a platform where students can launch seasonal businesses—during festivals, holidays, or breaks—backed by micro-investments from our community.
                    </p>
                    <p>
                        It's not just about profit. It's about culture. It's about learning. It's about building the next generation of entrepreneurs, one season at a time.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-[var(--brand-light)]/10">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-[var(--brand-accent)] mb-2">100+</div>
                        <div className="text-sm text-[var(--brand-muted)] uppercase tracking-wider">Student Ventures</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-[var(--brand-accent)] mb-2">₹50L+</div>
                        <div className="text-sm text-[var(--brand-muted)] uppercase tracking-wider">Capital Deployed</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-[var(--brand-accent)] mb-2">20+</div>
                        <div className="text-sm text-[var(--brand-muted)] uppercase tracking-wider">Campuses</div>
                    </div>
                </div>

            </div>
        </section>
    );
}
