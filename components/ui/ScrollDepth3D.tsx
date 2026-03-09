"use client";

import { motion } from "framer-motion";
import { useScrollDepth, ScrollDepthOptions } from "@/lib/hooks/useScrollDepth";
import { ReactNode } from "react";

export type AnimationType = "emerge" | "float" | "tilt" | "parallax";

interface ScrollDepth3DProps {
    children: ReactNode;
    type?: AnimationType;
    className?: string;
    intensity?: number;
}

/**
 * Reusable wrapper component for 3D scroll depth effects
 * Applies scroll-linked 3D transforms to children
 */
export function ScrollDepth3D({
    children,
    type = "emerge",
    className = "",
    intensity = 100,
}: ScrollDepth3DProps) {
    const config: Record<AnimationType, ScrollDepthOptions> = {
        emerge: {
            intensity,
            scrollStart: 0,
            scrollEnd: 0.8,
            enableRotation: true,
        },
        float: {
            intensity: intensity * 0.5,
            scrollStart: 0.2,
            scrollEnd: 1,
            enableRotation: false,
        },
        tilt: {
            intensity: intensity * 0.3,
            scrollStart: 0,
            scrollEnd: 1,
            enableRotation: true,
        },
        parallax: {
            intensity: intensity * 0.7,
            scrollStart: 0,
            scrollEnd: 1,
            enableRotation: false,
        },
    };

    const { ref, translateZ, rotateX, rotateY, scale, opacity } = useScrollDepth(
        config[type]
    );

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{
                translateZ,
                rotateX,
                rotateY,
                scale,
                opacity,
                transformStyle: "preserve-3d",
            }}
        >
            {children}
        </motion.div>
    );
}
