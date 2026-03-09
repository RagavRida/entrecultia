"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToggleLinkProps {
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
}

export function ToggleLink({ options, value, onChange }: ToggleLinkProps) {
    return (
        <div className="relative flex p-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full backdrop-blur-md">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={cn(
                        "relative w-32 py-2 text-sm font-medium transition-colors z-10",
                        value === option.value ? "text-black" : "text-[var(--brand-muted)] hover:text-[var(--brand-light)]"
                    )}
                >
                    {option.label}
                    {value === option.value && (
                        <motion.div
                            layoutId="toggle-active"
                            className="absolute inset-0 bg-[var(--brand-accent)] rounded-full -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}
