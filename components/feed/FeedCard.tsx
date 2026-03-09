"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, DollarSign, MapPin, Clock } from "lucide-react";
import { FeedItem } from "./data";
import { Button } from "@/components/ui/Button";

export function FeedCard({ item, index }: { item: FeedItem; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--brand-light)]/20 transition-all duration-500"
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}
        >
            {/* Image Section (only for startups usually, but customizable) */}
            <div className="h-48 w-full overflow-hidden relative bg-neutral-900">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-xs font-medium text-[var(--brand-accent)] uppercase tracking-wider">
                    {item.type}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-[var(--brand-light)] group-hover:text-white transition-colors">
                        {item.title}
                    </h3>
                    <span className="text-lg font-bold text-[var(--brand-accent)] flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {item.amount.replace("₹", "")}
                    </span>
                </div>

                <p className="text-sm text-[var(--brand-muted)] mb-4 line-clamp-2">
                    {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map(tag => (
                        <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-[var(--glass-border)] text-[var(--brand-muted)] border border-transparent group-hover:border-[var(--brand-light)]/10 transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Footer / CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-[var(--brand-muted)]">
                            {item.name.charAt(0)}
                        </div>
                        <span className="text-sm text-[var(--brand-muted)] group-hover:text-[var(--brand-light)] transition-colors">
                            {item.name}
                        </span>
                    </div>

                    <Button variant="ghost" className="gap-1 group/btn text-sm px-3 py-1 h-auto">
                        Connect <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
