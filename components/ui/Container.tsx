import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    className?: string;
    as?: "div" | "section" | "article" | "main";
}

export function Container({
    children,
    className,
    as: Component = "div",
}: ContainerProps) {
    return (
        <Component
            className={cn(
                "mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-12",
                className
            )}
        >
            {children}
        </Component>
    );
}
