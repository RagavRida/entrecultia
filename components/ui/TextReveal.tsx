"use client";

import { motion, Variants } from "framer-motion";

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    highlightWords?: string[]; // Words to apply distinct styling to
    gradientWords?: string[]; // Words to apply gradient styling to
    as?: string; // HTML tag to render as (e.g., "h1", "div")
}

export function TextReveal({
    text,
    className,
    delay = 0,
    highlightWords = [],
    gradientWords = [],
    as = "div"
}: TextRevealProps) {
    const words = text.split(" ");

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: delay * 0.1 },
        }),
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
        },
    };

    // Dynamically select the motion component
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Tag = (motion as any)[as] || motion.div;

    return (
        <Tag
            style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "center" }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={className}
        >
            {words.map((word, index) => {
                // Clean punctuation for matching logic but keep it for display
                const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
                const isGradient = gradientWords.some(w => word.includes(w));

                return (
                    <motion.span
                        variants={child}
                        key={index}
                        className="mr-[0.2em] last:mr-0 inline-block"
                    >
                        <span className={isGradient ? "gradient-accent" : ""}>
                            {word}
                        </span>
                    </motion.span>
                );
            })}
        </Tag>
    );
}
