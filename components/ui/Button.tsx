"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion, type HTMLMotionProps, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "lg";

interface ButtonProps
    extends Omit<HTMLMotionProps<"button">, "children">,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
        const x = useMotionValue(0);
        const y = useMotionValue(0);
        const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
        const xSpring = useSpring(x, springConfig);
        const ySpring = useSpring(y, springConfig);

        const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
            const { clientX, clientY, currentTarget } = e;
            const { left, top, width, height } = currentTarget.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            x.set((clientX - centerX) * 0.35);
            y.set((clientY - centerY) * 0.35);
        };

        const handleMouseLeave = () => {
            x.set(0);
            y.set(0);
        };

        const baseStyles =
            "relative inline-flex items-center justify-center font-medium transition-colors duration-300 ease-out rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-dark)] disabled:opacity-50 disabled:pointer-events-none overflow-hidden";

        const variants: Record<ButtonVariant, string> = {
            primary:
                "bg-[var(--brand-light)] text-[var(--brand-dark)] hover:bg-white hover:shadow-lg hover:shadow-white/10",
            secondary:
                "bg-transparent border border-[var(--glass-border)] text-[var(--brand-light)] hover:border-[var(--brand-light)]/30 hover:bg-white/5",
            ghost:
                "bg-transparent text-[var(--brand-muted)] hover:text-[var(--brand-light)]",
        };

        const sizes: Record<ButtonSize, string> = {
            default: "px-6 py-2.5 text-sm",
            lg: "px-8 py-3.5 text-base",
        };

        return (
            <motion.button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                style={{ x: xSpring, y: ySpring }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                {...props}
            >
                <span className="relative z-10">{children}</span>

                {/* Shine Effect for Primary Button */}
                {variant === "primary" && (
                    <motion.div
                        className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                )}
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export { Button };
