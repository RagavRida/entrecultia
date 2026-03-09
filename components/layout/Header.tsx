"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { useRouter } from "next/navigation";

const MenuIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
);

const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
);

export function Header() {
    const router = useRouter();
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = ["How It Works", "Seasons", "Why Us", "About"];

    useMotionValueEvent(scrollY, "change", (latest) => {
        const threshold = 50;
        if (latest > threshold && !isScrolled) {
            setIsScrolled(true);
        } else if (latest <= threshold && isScrolled) {
            setIsScrolled(false);
        }
    });

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [mobileMenuOpen]);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        setMobileMenuOpen(false); // Close menu
        // Default anchor behavior handles scroll
    };

    return (
        <motion.header
            className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <motion.div
                className={cn(
                    "pointer-events-auto flex items-center justify-between rounded-full border transition-all duration-500 ease-out will-change-transform",
                    isScrolled
                        ? "bg-[var(--brand-dark)]/60 backdrop-blur-xl border-[var(--glass-border)] shadow-lg shadow-black/20 py-2.5 px-6 w-[90%] max-w-4xl"
                        : "bg-transparent backdrop-blur-none border-transparent py-4 px-10 w-[95%] max-w-7xl"
                )}
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="text-[var(--brand-light)] flex items-center gap-2 shrink-0 transition-opacity hover:opacity-90 z-50 relative"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <Logo className={isScrolled ? "scale-90" : ""} />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                    {navItems.map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-sm text-[var(--brand-muted)] hover:text-[var(--brand-light)] transition-colors relative group py-2"
                        >
                            {item}
                            <span className="absolute bottom-1 left-0 w-0 h-px bg-[var(--brand-accent)] transition-all duration-300 group-hover:w-full opacity-50" />
                        </a>
                    ))}
                </nav>

                {/* Desktop CTAs */}
                <div className="hidden md:flex items-center gap-2 shrinks-0">


                    <Button
                        variant="primary"
                        size="default"
                        className={cn(
                            "transition-all duration-300",
                            isScrolled ? "text-xs px-4 py-2 h-8" : ""
                        )}
                        onClick={() => router.push("/join")}
                    >
                        Join
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-[var(--brand-light)] z-50 relative p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
            </motion.div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-[var(--brand-dark)] pt-32 px-6 pointer-events-auto"
                    >
                        <nav className="flex flex-col gap-6 items-center">
                            {navItems.map((item, i) => (
                                <motion.a
                                    key={item}
                                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                                    onClick={(e) => scrollToSection(e, item)}
                                    className="text-2xl font-medium text-[var(--brand-light)] py-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    {item}
                                </motion.a>
                            ))}

                            <motion.div
                                className="flex flex-col gap-4 w-full max-w-xs mt-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full text-lg"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        router.push("/join");
                                    }}
                                >
                                    Join Now
                                </Button>

                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
