"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Container } from "@/components/ui/Container";

// Step data
const studentSteps = [
    { id: 1, title: "Register Interest", desc: "Share your seasonal business idea" },
    { id: 2, title: "Choose Season", desc: "Select your operational timeline" },
    { id: 3, title: "Get Backed", desc: "Receive investment & mentorship" },
    { id: 4, title: "Execute", desc: "Launch and run your seasonal business" },
    { id: 5, title: "Share Profits", desc: "Return gains to your investors" },
];

const investorSteps = [
    { id: 1, title: "Register", desc: "Join the platform with verification" },
    { id: 2, title: "Review Ideas", desc: "Explore vetted seasonal businesses" },
    { id: 3, title: "Invest", desc: "Back students with capital" },
    { id: 4, title: "Track", desc: "Monitor business performance" },
    { id: 5, title: "Receive Returns", desc: "Earn from successful ventures" },
];

export function HowItWorksTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Progressive line drawing (0 to 100%)
    const lineProgress = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);

    return (
        <section
            ref={containerRef}
            className="relative py-32 overflow-hidden"
            style={{
                perspective: "1400px", // 3D depth perspective
            }}
        >
            <Container>
                {/* Section Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-semibold text-[var(--brand-light)] mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-[var(--brand-muted)] max-w-2xl mx-auto">
                        A clear, synchronized journey
                    </p>
                </motion.div>

                {/* 3D Timeline Container */}
                <div
                    className="relative max-w-6xl mx-auto"
                    style={{
                        transformStyle: "preserve-3d", // Enable 3D transforms for children
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                        {/* Left Column - Students */}
                        <DepthTimeline
                            title="For Students"
                            steps={studentSteps}
                            align="right"
                            lineProgress={lineProgress}
                            scrollProgress={scrollYProgress}
                            direction="left" // Drift from left toward center
                        />

                        {/* Right Column - Investors */}
                        <DepthTimeline
                            title="For Investors"
                            steps={investorSteps}
                            align="left"
                            lineProgress={lineProgress}
                            scrollProgress={scrollYProgress}
                            direction="right" // Drift from right toward center
                        />
                    </div>

                    {/* End Message */}
                    <motion.div
                        className="text-center mt-24"
                        initial={{ opacity: 0 }}
                        style={{
                            opacity: useTransform(scrollYProgress, [0.75, 0.85], [0, 1]),
                        }}
                    >
                        <p className="text-xl md:text-2xl font-light text-[var(--brand-light)]">
                            Clear steps. Shared outcomes.
                        </p>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
}

// Depth Timeline Column
interface DepthTimelineProps {
    title: string;
    steps: typeof studentSteps;
    align: "left" | "right";
    lineProgress: MotionValue<number>;
    scrollProgress: MotionValue<number>;
    direction: "left" | "right";
}

function DepthTimeline({
    title,
    steps,
    align,
    lineProgress,
    scrollProgress,
    direction,
}: DepthTimelineProps) {
    return (
        <div
            className="relative"
            style={{
                transformStyle: "preserve-3d",
            }}
        >
            {/* Column Title */}
            <motion.h3
                className={`text-2xl font-semibold text-[var(--brand-light)] mb-12 ${align === "right" ? "text-right" : "text-left"
                    }`}
                initial={{ opacity: 0, x: align === "right" ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
            >
                {title}
            </motion.h3>

            {/* Vertical Guide Line */}
            <div
                className={`absolute top-16 ${align === "right" ? "right-0" : "left-0"
                    } w-px h-full`}
            >
                {/* Static background line */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--glass-border)] to-transparent opacity-20" />

                {/* Progressive drawing line */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-[var(--brand-accent)] to-[var(--brand-accent)]/30"
                    style={{
                        scaleY: lineProgress,
                        transformOrigin: "top",
                    }}
                />
            </div>

            {/* Timeline Steps with 3D depth */}
            <div className="space-y-20 relative">
                {steps.map((step, index) => (
                    <DepthStep
                        key={step.id}
                        step={step}
                        index={index}
                        total={steps.length}
                        align={align}
                        scrollProgress={scrollProgress}
                        direction={direction}
                    />
                ))}
            </div>
        </div>
    );
}

// Individual Step with Depth
interface DepthStepProps {
    step: (typeof studentSteps)[0];
    index: number;
    total: number;
    align: "left" | "right";
    scrollProgress: MotionValue<number>;
    direction: "left" | "right";
}

function DepthStep({
    step,
    index,
    total,
    align,
    scrollProgress,
    direction,
}: DepthStepProps) {
    // Calculate scroll range for this step
    const stepStart = 0.15 + (index / total) * 0.55;
    const stepActive = stepStart + 0.08;
    const stepEnd = stepStart + 0.15;

    // Depth motion: move upward and toward viewer as active
    const y = useTransform(
        scrollProgress,
        [stepStart, stepActive, stepEnd],
        [20, 0, -10] // Upward motion
    );

    // Active state: brought closer (positive Z), inactive: pushed back
    const z = useTransform(
        scrollProgress,
        [stepStart, stepActive, stepEnd],
        [-20, 35, -15] // Active step closer to viewer
    );

    // Opacity contrast between active and inactive
    const opacity = useTransform(
        scrollProgress,
        [stepStart, stepActive, stepEnd],
        [0.4, 1, 0.5]
    );

    // Scale slightly when active
    const scale = useTransform(
        scrollProgress,
        [stepStart, stepActive, stepEnd],
        [0.96, 1, 0.97]
    );

    // Convergence: drift toward center
    const convergenceX = useTransform(
        scrollProgress,
        [stepStart, stepEnd],
        [0, direction === "left" ? 15 : -15] // Subtle drift toward center
    );

    return (
        <motion.div
            className="relative group"
            style={{
                opacity,
                y,
                x: convergenceX,
                scale,
                rotateY: useTransform(z, (val: number) => val * 0.1), // Subtle rotation based on depth
                translateZ: z, // 3D depth
                transformStyle: "preserve-3d",
            }}
        >
            {/* Timeline Node */}
            <div
                className={`absolute ${align === "right" ? "-right-2" : "-left-2"
                    } top-2 w-3 h-3 rounded-full border-2 border-[var(--brand-accent)] bg-[var(--brand-dark)] z-10`}
            />

            {/* Step Card */}
            <motion.div
                className={`${align === "right" ? "pr-8 text-right" : "pl-8 text-left"
                    } relative`}
                whileHover={{
                    y: -4,
                    translateZ: 40, // Bring forward on hover
                    transition: { duration: 0.25 },
                }}
                style={{
                    transformStyle: "preserve-3d",
                }}
            >
                <div className="p-6 rounded-lg border border-[var(--glass-border)] bg-[var(--brand-charcoal)]/40 backdrop-blur-sm transition-colors duration-300 group-hover:border-[var(--brand-accent)]/40">
                    {/* Step Number */}
                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] text-xs font-semibold mb-2">
                        {step.id}
                    </div>

                    {/* Step Title */}
                    <h4 className="text-base font-semibold text-[var(--brand-light)] mb-1.5 group-hover:text-[var(--brand-accent)] transition-colors duration-200">
                        {step.title}
                    </h4>

                    {/* Step Description */}
                    <p className="text-sm text-[var(--brand-muted)] leading-relaxed">
                        {step.desc}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
