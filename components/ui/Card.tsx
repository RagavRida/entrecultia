"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface CardProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export function Card({ children, className, hover = true, ...props }: CardProps) {
    return (
        <motion.div
            className={cn(
                "glass-panel p-6 md:p-8",
                hover && "transition-all duration-300 hover:border-[var(--brand-light)]/15",
                className
            )}
            whileHover={hover ? { y: -4 } : undefined}
            {...props}
        >
            {children}
        </motion.div>
    );
}
