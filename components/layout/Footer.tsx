import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
    return (
        <footer className="py-12 border-t border-[var(--glass-border)]">
            <Container>
                <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <div className="mb-4 text-[var(--brand-light)]">
                            <Logo />
                        </div>
                        <p className="text-sm text-[var(--brand-muted)] max-w-sm leading-relaxed">
                            A premium platform connecting students and investors to build
                            short-term, season-driven businesses across India.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-medium text-[var(--brand-light)] mb-4">
                            Legal
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-[var(--brand-muted)] hover:text-[var(--brand-light)] transition-colors"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-[var(--brand-muted)] hover:text-[var(--brand-light)] transition-colors"
                                >
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-[var(--brand-muted)] hover:text-[var(--brand-light)] transition-colors"
                                >
                                    Risk Disclaimer
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-medium text-[var(--brand-light)] mb-4">
                            Contact
                        </h4>
                        <a
                            href="mailto:hello@entrecultia.com"
                            className="text-sm text-[var(--brand-muted)] hover:text-[var(--brand-light)] transition-colors"
                        >
                            hello@entrecultia.com
                        </a>
                    </div>
                </div>

                {/* Risk Disclaimer & Copyright */}
                <div className="mt-12 pt-8 border-t border-[var(--glass-border)]">
                    <p className="text-xs text-[var(--brand-muted)] leading-relaxed mb-4 max-w-3xl">
                        <strong className="text-[var(--brand-muted)]">Risk Disclaimer:</strong>{" "}
                        ENTRECULTIA does not guarantee profits. Investments are subject to
                        market and execution risk. Past performance is not indicative of
                        future results.
                    </p>
                    <p className="text-xs text-[var(--brand-muted)]">
                        © {new Date().getFullYear()} ENTRECULTIA. All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    );
}
