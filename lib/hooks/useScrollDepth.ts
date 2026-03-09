"use client";

import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, RefObject } from "react";

export interface ScrollDepthOptions {
    /** Depth intensity: how far elements move in Z space (default: 100) */
    intensity?: number;
    /** Start of scroll range (0-1, default: 0) */
    scrollStart?: number;
    /** End of scroll range (0-1, default: 1) */
    scrollEnd?: number;
    /** Enable rotation effects (default: false) */
    enableRotation?: boolean;
}

export interface ScrollDepthValues {
    ref: RefObject<HTMLDivElement | null>;
    translateZ: MotionValue<number>;
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
    scale: MotionValue<number>;
    opacity: MotionValue<number>;
}

/**
 * Hook for creating scroll-based 3D depth animations
 * Respects prefers-reduced-motion for accessibility
 */
export function useScrollDepth(options: ScrollDepthOptions = {}): ScrollDepthValues {
    const {
        intensity = 100,
        scrollStart = 0,
        scrollEnd = 1,
        enableRotation = false,
    } = options;

    const ref = useRef<HTMLDivElement>(null);

    // Track scroll progress of the element
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    // Check for reduced motion preference
    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Create transform values based on scroll
    const translateZ = useTransform(
        scrollYProgress,
        [scrollStart, scrollEnd],
        prefersReducedMotion ? [0, 0] : [-intensity, 0]
    );

    const rotateX = useTransform(
        scrollYProgress,
        [scrollStart, scrollEnd],
        prefersReducedMotion || !enableRotation ? [0, 0] : [5, 0]
    );

    const rotateY = useTransform(
        scrollYProgress,
        [scrollStart, scrollEnd],
        prefersReducedMotion || !enableRotation ? [0, 0] : [-2, 0]
    );

    const scale = useTransform(
        scrollYProgress,
        [scrollStart, scrollEnd],
        prefersReducedMotion ? [1, 1] : [0.95, 1]
    );

    const opacity = useTransform(
        scrollYProgress,
        [scrollStart, scrollEnd],
        [0.6, 1]
    );

    return {
        ref,
        translateZ,
        rotateX,
        rotateY,
        scale,
        opacity,
    };
}
