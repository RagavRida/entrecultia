"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectionProps {
    onSelect: (role: "student" | "investor") => void;
}

// Variants for staggered animations
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

export function RoleSelection({ onSelect }: RoleSelectionProps) {
    return (
        <motion.div
            className="flex flex-col items-center w-full"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
        >
            <motion.h1
                className="text-3xl md:text-5xl font-semibold text-[var(--brand-light)] text-center mb-4 tracking-tight"
                variants={cardVariants}
            >
                Choose Your Path
            </motion.h1>
            <motion.p
                className="text-[var(--brand-muted)] text-center mb-12 max-w-md"
                variants={cardVariants}
            >
                Select your role to begin your tailored onboarding experience.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
                {/* Student Card */}
                <SelectionCard
                    role="student"
                    icon={GraduationCap}
                    title="I'm a Student"
                    subtitle="I want to start a seasonal business"
                    features={["Low capital requirement", "Short-term commitment", "Guided execution"]}
                    cta="Explore as Student"
                    onClick={() => onSelect("student")}
                />

                {/* Investor Card */}
                <SelectionCard
                    role="investor"
                    icon={Briefcase}
                    title="I'm an Investor"
                    subtitle="I want to support seasonal ideas"
                    features={["Short-term exposure", "Transparent risk", "Learning-first approach"]}
                    cta="Explore as Investor"
                    onClick={() => onSelect("investor")}
                />
            </div>
        </motion.div>
    );
}

// Internal reusable card component for this view
function SelectionCard({ role, icon: Icon, title, subtitle, features, cta, onClick }: any) {
    return (
        <motion.div
            variants={cardVariants}
            className="group relative overflow-hidden rounded-3xl bg-[var(--glass-bg)] border border-[var(--glass-border)] cursor-pointer transition-all duration-500 hover:border-[var(--brand-light)]/20"
            onClick={onClick}
            whileHover={{ y: -8, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)" }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Hover Gradient Overlay - Stronger effect */}
            <div
                className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
                    // Radial gradient for a spotlight feel
                    role === "student"
                        ? "bg-[radial-gradient(circle_at_center,_var(--brand-accent)_0%,_transparent_70%)] opacity-0 group-hover:opacity-10"
                        : "bg-[radial-gradient(circle_at_center,_var(--brand-accent)_0%,_transparent_70%)] opacity-0 group-hover:opacity-10"
                )}
            />
            {/* Simple solid color fallback for hover if gradient is too subtle or tricky */}
            <div
                className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500",
                    role === "student" ? "bg-blue-400" : "bg-[var(--brand-accent)]"
                )}
            />

            <div className="p-8 md:p-10 flex flex-col h-full relative z-10">
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110",
                    role === "student"
                        ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20"
                        : "bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] group-hover:bg-[var(--brand-accent)]/20"
                )}>
                    <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-semibold text-[var(--brand-light)] mb-2 group-hover:translate-x-1 transition-transform">
                    {title}
                </h3>
                <p className="text-[var(--brand-muted)] mb-8 group-hover:text-[var(--brand-light)]/80 transition-colors">
                    {subtitle}
                </p>

                <ul className="space-y-3 mb-8 flex-grow">
                    {features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-[var(--brand-muted)]">
                            <span className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 group-hover:scale-150",
                                role === "student" ? "bg-blue-400/50 group-hover:bg-blue-400" : "bg-[var(--brand-accent)]/50 group-hover:bg-[var(--brand-accent)]"
                            )} />
                            {feature}
                        </li>
                    ))}
                </ul>

                <div className="mt-auto flex items-center text-sm font-medium">
                    <span className={cn(
                        "transition-colors duration-300 mr-2",
                        role === "student" ? "text-blue-400 group-hover:text-blue-300" : "text-[var(--brand-accent)] group-hover:text-amber-200"
                    )}>
                        {cta}
                    </span>
                    <ArrowRight className={cn(
                        "w-4 h-4 transition-transform duration-300 group-hover:translate-x-2",
                        role === "student" ? "text-blue-400 group-hover:text-blue-300" : "text-[var(--brand-accent)] group-hover:text-amber-200"
                    )} />
                </div>
            </div>
        </motion.div>
    );
}
