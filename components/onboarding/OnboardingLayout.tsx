"use client";

import { ReactNode } from "react";
import { HeroShader } from "@/components/ui/HeroShader";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { motion } from "framer-motion";

interface OnboardingLayoutProps {
    children: ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[var(--brand-dark)] flex flex-col">
            {/* Background Shader - Dimmed for focus */}
            <div className="absolute inset-0 opacity-40">
                <HeroShader />
            </div>

            {/* Header - Minimal */}
            <header className="relative z-50 w-full p-6 flex justify-between items-center">
                <Link href="/" className="text-[var(--brand-light)] hover:opacity-80 transition-opacity">
                    <Logo />
                </Link>
                <Link
                    href="/"
                    className="text-sm text-[var(--brand-muted)] hover:text-[var(--brand-light)] transition-colors"
                >
                    Close
                </Link>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-5xl"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
