"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { RoleSelection } from "@/components/onboarding/RoleSelection";
import { StudentFlow } from "@/components/onboarding/StudentFlow";
import { InvestorFlow } from "@/components/onboarding/InvestorFlow";
import { AnimatePresence, motion } from "framer-motion";

type OnboardingStep = "role-selection" | "student-flow" | "investor-flow";

function JoinContent() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState<OnboardingStep>("role-selection");

    useEffect(() => {
        const role = searchParams.get("role");
        if (role === "student") setStep("student-flow");
        if (role === "investor") setStep("investor-flow");
    }, [searchParams]);

    const handleRoleSelect = (role: "student" | "investor") => {
        setStep(role === "student" ? "student-flow" : "investor-flow");
    };

    return (
        <OnboardingLayout>
            <AnimatePresence mode="wait">
                {step === "role-selection" && (
                    <motion.div
                        key="role-selection"
                        exit={{ opacity: 0, width: 0, height: 0, overflow: "hidden" }} // Hard exit transition
                        transition={{ duration: 0.5 }}
                        className="w-full"
                    >
                        <RoleSelection onSelect={handleRoleSelect} />
                    </motion.div>
                )}

                {step === "student-flow" && (
                    <motion.div
                        key="student-flow"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full"
                    >
                        <StudentFlow />
                    </motion.div>
                )}

                {step === "investor-flow" && (
                    <motion.div
                        key="investor-flow"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full"
                    >
                        <InvestorFlow />
                    </motion.div>
                )}
            </AnimatePresence>
        </OnboardingLayout>
    );
}

export default function JoinPage() {
    return (
        <Suspense fallback={
            <OnboardingLayout>
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-[var(--brand-accent)] border-t-transparent animate-spin" />
                </div>
            </OnboardingLayout>
        }>
            <JoinContent />
        </Suspense>
    );
}
