import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string; // For sizing or color overrides
    showText?: boolean; // Option to show/hide the wordmark
}

export function Logo({ className, showText = true }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2.5", className)}>
            {/* Symbol */}
            <svg
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 shrink-0 text-[var(--brand-accent)]"
                aria-label="Entrecultia Logo"
            >
                {/* Background shape - Hexagon/Circle hybrid for stability */}
                <path
                    d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 40 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z"
                    fill="currentColor"
                    fillOpacity="0.1"
                />

                {/* The 'E' + Growth Arrow Symbol */}
                <path
                    d="M12 11C12 10.4477 12.4477 10 13 10H27C27.5523 10 28 10.4477 28 11C28 11.5523 27.5523 12 27 12H14V19H24C24.5523 19 25 19.4477 25 20C25 20.5523 24.5523 21 24 21H14V28H23.5858L27.2929 24.2929C27.6834 23.9024 28.3166 23.9024 28.7071 24.2929C29.0976 24.6834 29.0976 25.3166 28.7071 25.7071L24.4142 30H13C12.4477 30 12 29.5523 12 29V11Z"
                    fill="currentColor"
                />
            </svg>

            {/* Wordmark */}
            {showText && (
                <span className="font-semibold tracking-tight text-lg leading-none mt-0.5">
                    ENTRECULTIA
                </span>
            )}
        </div>
    );
}
