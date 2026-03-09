"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ScrollDepth3D } from "@/components/ui/ScrollDepth3D";

/*
  Flowing SVG Path Animation — inspired by Flashback Labs
  
  Architecture:
  1. A large SVG S-curve path that winds through the section
  2. The path "draws" as the user scrolls (strokeDashoffset)
  3. A glowing dot follows the path via getPointAtLength()
  4. Glass cards alternate left/right, fade in with whileInView
  5. Each card shows both Student and Investor actions
*/

const STEPS = [
    { num: "01", title: "Register", desc: "The system activates", s: "Create Profile", i: "Verify Identity" },
    { num: "02", title: "Evaluate", desc: "Ideas are filtered", s: "Pitch Ideas", i: "Review Ideas" },
    { num: "03", title: "Commit", desc: "Capital meets execution", s: "Get Backed", i: "Invest Capital" },
    { num: "04", title: "Execute", desc: "Work produces momentum", s: "Run Business", i: "Track Progress" },
    { num: "05", title: "Return", desc: "The system completes", s: "Share Profits", i: "Receive Returns" },
];

// Flowing S-curve that weaves right-left-right-left through the section
// ViewBox: 0 0 800 2400
const FLOW_PATH =
    "M 400 0 C 700 150, 750 350, 550 480 " +
    "C 350 610, 50 650, 150 850 " +
    "C 250 1050, 700 1000, 650 1250 " +
    "C 600 1500, 100 1450, 200 1700 " +
    "C 300 1950, 650 1900, 500 2100 " +
    "C 420 2220, 400 2320, 400 2400";

export function HowItWorksStory() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(5000); // start hidden
    const [dotPos, setDotPos] = useState({ x: 400, y: 0 });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start 0.9", "end 0.1"],
    });

    // Measure actual path length after mount
    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    // Drive path drawing with scroll
    const dashOffset = useTransform(scrollYProgress, [0, 1], [pathLength, 0]);

    // Glowing dot follows path position
    useMotionValueEvent(scrollYProgress, "change", (v: number) => {
        if (pathRef.current && pathLength > 0) {
            const clamped = Math.min(Math.max(v, 0), 1);
            const point = pathRef.current.getPointAtLength(clamped * pathLength);
            setDotPos({ x: point.x, y: point.y });
        }
    });

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 bg-[var(--brand-dark)] overflow-hidden perspective-container">
            {/* Section Header */}
            <div className="text-center mb-16 md:mb-24 relative z-10">
                <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--brand-accent)] uppercase">
                    Process
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-[var(--brand-light)] tracking-tight mt-2">
                    How It Works
                </h2>
                <p className="text-[var(--brand-muted)] mt-3 text-base md:text-lg max-w-md mx-auto">
                    A connected system from registration to returns
                </p>
            </div>

            <div className="relative max-w-5xl mx-auto px-6">
                {/* ── SVG Flowing Path ── */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-0"
                    viewBox="0 0 800 2400"
                    preserveAspectRatio="none"
                    fill="none"
                >
                    <defs>
                        <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(96,165,250,0.6)" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0.25)" />
                            <stop offset="100%" stopColor="rgba(201,169,98,0.6)" />
                        </linearGradient>
                        <filter id="pathGlow">
                            <feGaussianBlur stdDeviation="6" />
                        </filter>
                    </defs>

                    {/* Glow under-layer (always visible, soft) */}
                    <path
                        d={FLOW_PATH}
                        stroke="rgba(96,165,250,0.08)"
                        strokeWidth={14}
                        strokeLinecap="round"
                        filter="url(#pathGlow)"
                    />

                    {/* Main stroke — draws itself via scroll */}
                    <motion.path
                        ref={pathRef}
                        d={FLOW_PATH}
                        stroke="url(#flowGrad)"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: pathLength,
                            strokeDashoffset: dashOffset,
                        }}
                    />

                    {/* Glowing follower dot (3 layers for depth) */}
                    <circle cx={dotPos.x} cy={dotPos.y} r={18} fill="rgba(96,165,250,0.06)" />
                    <circle cx={dotPos.x} cy={dotPos.y} r={8} fill="rgba(96,165,250,0.2)" />
                    <circle cx={dotPos.x} cy={dotPos.y} r={4} fill="rgba(96,165,250,0.9)" />
                </svg>

                {/* ── Step Cards (alternating left/right) ── */}
                <div className="relative z-10">
                    {STEPS.map((step, idx) => {
                        const isRight = idx % 2 === 0;
                        return (
                            <motion.div
                                key={idx}
                                className={`flex ${isRight ? "justify-end" : "justify-start"} ${idx < STEPS.length - 1 ? "mb-32 md:mb-52" : ""
                                    }`}
                                initial={{ opacity: 0, y: 50, x: isRight ? 40 : -40 }}
                                whileInView={{ opacity: 1, y: 0, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                            >
                                <div className="max-w-sm w-full p-6 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl">
                                    {/* Step badge */}
                                    <div className="text-[10px] font-bold tracking-[0.3em] text-[var(--brand-accent)] uppercase mb-3">
                                        Step {step.num}
                                    </div>
                                    <h3 className="text-2xl font-semibold text-white mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-[var(--brand-muted)] mb-5">
                                        {step.desc}
                                    </p>

                                    {/* Student / Investor split */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
                                            <div className="text-[9px] text-blue-400 uppercase tracking-wider font-bold mb-1">
                                                Student
                                            </div>
                                            <div className="text-sm text-white font-medium">
                                                {step.s}
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[var(--brand-accent)]/5 border border-[var(--brand-accent)]/15">
                                            <div className="text-[9px] text-[var(--brand-accent)] uppercase tracking-wider font-bold mb-1">
                                                Investor
                                            </div>
                                            <div className="text-sm text-white font-medium">
                                                {step.i}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Outcome text */}
                <motion.div
                    className="relative z-10 text-center mt-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-lg md:text-xl text-[var(--brand-muted)] tracking-[0.15em] font-light">
                        Effort → Value → Returns.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
