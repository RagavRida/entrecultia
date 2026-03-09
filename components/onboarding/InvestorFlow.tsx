"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, ChevronRight, UploadCloud, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// --- Types ---
type InvestorStep = "identity" | "preferences" | "review" | "success";

interface InvestorData {
    // Step 1
    name: string;
    age: string;
    city: string;
    email: string;
    phone: string;
    occupation: string;
    source: string;
    idFileUrl: string;
    otpVerified: boolean;
    // Step 2
    budget: string;
    seasons: string[];
    categories: string[];
    goal: string;
    riskAcknowledged: boolean;
    // Step 3
    consentAccuracy: boolean;
    consentRisk: boolean;
}

const SEASONS = [
    "Valentine's Week (Feb)", "Holi (Mar)", "Summer Break (Apr–Jun)",
    "Raksha Bandhan (Aug)", "Diwali (Oct–Nov)", "Wedding Season",
    "Christmas/New Year", "Agriculture Season"
];

const CATEGORIES = [
    { id: "festival", label: "🎁 Festival Retail" },
    { id: "decoration", label: "🌸 Decoration" },
    { id: "food", label: "🥗 Food & Snacks" },
    { id: "fashion", label: "👗 Fashion & Accessories" },
    { id: "agriculture", label: "🌾 Agriculture" },
    { id: "seasonal", label: "❄️ Seasonal Products" },
    { id: "event", label: "🎉 Event Services" },
    { id: "gifting", label: "📦 Gifting" }
];

const MAJOR_CITIES = [
    "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Other"
];

const OCCUPATIONS = [
    "Student", "Salaried Professional", "Business Owner", "Homemaker", "Retired", "Other"
];

const BUDGET_OPTIONS = [
    { id: "starter", label: "₹5,000 – ₹10,000", badge: "Starter Backer" },
    { id: "active", label: "₹10,000 – ₹25,000", badge: "Active Backer" },
    { id: "power", label: "₹25,000 – ₹50,000", badge: "Power Backer" },
    { id: "strategic", label: "₹50,000+", badge: "Strategic Backer" }
];

const GOAL_OPTIONS = [
    { id: "learning", label: "Learning about entrepreneurship" },
    { id: "returns", label: "Earning returns (10–30% per season)" },
    { id: "supporting", label: "Supporting young entrepreneurs" },
    { id: "all", label: "All of the above" }
];

export function InvestorFlow() {
    const [step, setStep] = useState<InvestorStep>("identity");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // OTP State
    const [otpSent, setOtpSent] = useState(false);
    const [otpInput, setOtpInput] = useState("");
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [otpRateLimited, setOtpRateLimited] = useState(false);

    const [data, setData] = useState<InvestorData>({
        name: "", age: "", city: "", email: "", phone: "", occupation: "", source: "", idFileUrl: "", otpVerified: false,
        budget: "", seasons: [], categories: [], goal: "", riskAcknowledged: false,
        consentAccuracy: false, consentRisk: false,
    });

    const getStepNumber = () => {
        if (step === "identity") return 1;
        if (step === "preferences") return 2;
        if (step === "review") return 3;
        return 3;
    };

    const goNext = (nextStep: InvestorStep) => setStep(nextStep);
    const goBack = () => {
        if (step === "preferences") setStep("identity");
        if (step === "review") setStep("preferences");
    };

    const handleInput = (key: keyof InvestorData, value: any) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const toggleArrayItem = (key: "seasons" | "categories", item: string) => {
        setData(prev => ({
            ...prev,
            [key]: prev[key].includes(item)
                ? prev[key].filter(i => i !== item)
                : [...prev[key], item]
        }));
    };

    const handleSendOtp = async () => {
        if (!data.email || !data.email.includes("@")) return;
        setIsVerifyingOtp(true);
        setOtpError("");
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: data.email,
            });
            if (error) throw error;
            setOtpSent(true);
        } catch (error: any) {
            const msg = error.message || "Failed to send OTP";
            if (msg.toLowerCase().includes("rate") || msg.toLowerCase().includes("limit") || msg.toLowerCase().includes("exceeded") || msg.toLowerCase().includes("too many")) {
                setOtpRateLimited(true);
                setOtpError("");
            } else {
                setOtpError(msg);
            }
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpInput) return;
        setIsVerifyingOtp(true);
        setOtpError("");
        try {
            const { error } = await supabase.auth.verifyOtp({
                email: data.email,
                token: otpInput,
                type: 'email'
            });
            if (error) throw error;
            handleInput("otpVerified", true);
            setOtpSent(false); // hide OTP input
        } catch (error: any) {
            const msg = error.message || "Invalid OTP";
            if (msg.toLowerCase().includes("rate") || msg.toLowerCase().includes("limit") || msg.toLowerCase().includes("exceeded") || msg.toLowerCase().includes("too many")) {
                setOtpRateLimited(true);
                setOtpError("");
            } else {
                setOtpError(msg);
            }
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) return;
            const file = event.target.files[0];
            setIsUploading(true);

            // Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload the file to "id-documents" bucket
            const { error: uploadError } = await supabase.storage
                .from('id-documents')
                .upload(filePath, file);

            if (uploadError) {
                console.error("Upload error:", uploadError);
                throw uploadError;
            }

            // Get the public URL
            const { data: publicUrlData } = supabase.storage
                .from('id-documents')
                .getPublicUrl(filePath);

            handleInput("idFileUrl", publicUrlData.publicUrl);
        } catch (error: any) {
            console.error("Error uploading file:", error);
            alert(`Error uploading file: ${error?.message || JSON.stringify(error)}`);
        } finally {
            setIsUploading(false);
        }
    };

    const isAgeValid = data.age && parseInt(data.age) >= 18;
    const isEmailValid = data.email && data.email.includes("@");

    const isStep1Valid = () => {
        return data.name && isAgeValid && data.city && isEmailValid && data.phone && data.phone.length === 10 && data.occupation && data.source && data.idFileUrl && (data.otpVerified || otpRateLimited);
    };

    const isStep2Valid = () => {
        return data.budget && data.seasons.length > 0 && data.categories.length > 0 && data.goal && data.riskAcknowledged;
    };

    const isStep3Valid = () => data.consentAccuracy && data.consentRisk;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/join/backer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                setStep("success");
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Network error.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedBudgetBadge = BUDGET_OPTIONS.find(b => b.id === data.budget)?.badge || "Unknown Tier";

    return (
        <div className="w-full max-w-2xl mx-auto">
            {step !== "success" && (
                <div className="mb-8">
                    {/* Animated Progress Bar */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={step === "identity" ? () => window.location.reload() : goBack}
                            className="text-[var(--brand-muted)] hover:text-[var(--brand-light)] transition-colors flex items-center gap-2 text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        <div className="text-sm font-medium text-[var(--brand-muted)]">
                            Step {getStepNumber()} of 3
                        </div>
                    </div>

                    <div className="w-full bg-[var(--glass-border)] h-2 rounded-full overflow-hidden flex">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#84a98c] to-[#5a8062]"
                            initial={{ width: "33%" }}
                            animate={{ width: `${(getStepNumber() / 3) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === "identity" && (
                    <WizardStep key="identity" title="Your Identity">
                        <div className="space-y-6">
                            <InputGroup label="Full Name" value={data.name} onChange={(v: string) => handleInput("name", v)} placeholder="As per your ID proof" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Age</label>
                                    <input
                                        type="number"
                                        value={data.age}
                                        onChange={e => handleInput("age", e.target.value)}
                                        placeholder="18+"
                                        min="18"
                                        className={cn(
                                            "w-full bg-[var(--glass-bg)] border rounded-lg px-4 py-3 text-[var(--brand-light)] focus:outline-none transition-colors",
                                            (data.age && !isAgeValid) ? "border-red-500/50" : "border-[var(--glass-border)] focus:border-[#84a98c]"
                                        )}
                                    />
                                    {data.age && !isAgeValid && <p className="text-xs text-red-400 mt-1">Must be 18+</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">City</label>
                                    <select value={data.city} onChange={e => handleInput("city", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[#84a98c] focus:outline-none appearance-none cursor-pointer">
                                        <option value="" disabled>Select City</option>
                                        {MAJOR_CITIES.map(c => <option key={c} value={c} className="bg-[var(--brand-dark)]">{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Email Address</label>
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={e => handleInput("email", e.target.value)}
                                                placeholder="backer@email.com"
                                                disabled={data.otpVerified || otpSent}
                                                className={cn(
                                                    "w-full bg-[var(--glass-bg)] border rounded-lg px-4 py-3 text-[var(--brand-light)] focus:outline-none transition-colors",
                                                    (data.email && !data.email.includes("@")) ? "border-red-500/50" : "border-[var(--glass-border)] focus:border-[#84a98c]",
                                                    (data.otpVerified || otpSent) && "opacity-60 cursor-not-allowed"
                                                )}
                                            />
                                            {data.email && !data.email.includes("@") && <p className="text-xs text-red-400 mt-1 absolute -bottom-5 left-0">Please enter a valid email</p>}
                                        </div>
                                        {!data.otpVerified && !otpSent && (
                                            <Button variant="secondary" onClick={handleSendOtp} disabled={!data.email.includes("@") || isVerifyingOtp} className="h-[48px] whitespace-nowrap">
                                                {isVerifyingOtp ? "Sending..." : "Send OTP"}
                                            </Button>
                                        )}
                                        {data.otpVerified && (
                                            <Button variant="secondary" disabled className="bg-[#84a98c]/20 text-[#84a98c] border-[#84a98c]/50 h-[48px] whitespace-nowrap">
                                                <Check className="w-4 h-4 mr-2" /> Verified
                                            </Button>
                                        )}
                                    </div>

                                    {otpSent && !data.otpVerified && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={otpInput}
                                                    onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                                    placeholder="Enter 8-digit OTP"
                                                    className="flex-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[#84a98c] focus:outline-none tracking-[0.2em] font-mono text-center"
                                                />
                                                <Button variant="primary" onClick={handleVerifyOtp} disabled={otpInput.length < 8 || isVerifyingOtp} className="bg-[#84a98c] hover:bg-[#5a8062] h-[48px] whitespace-nowrap text-white">
                                                    {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                                                </Button>
                                            </div>
                                            <p className="text-xs text-[var(--brand-muted)] text-right">
                                                <button onClick={() => { setOtpSent(false); setOtpError(""); setOtpInput(""); }} className="text-[#84a98c] hover:underline ml-1">Change Email</button>
                                            </p>
                                        </motion.div>
                                    )}
                                    {otpError && <p className="text-xs text-red-500 mt-1">{otpError}</p>}
                                    {otpRateLimited && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex flex-col gap-2">
                                            <p className="text-sm text-yellow-400 font-medium">⚠️ OTP limit exceeded</p>
                                            <p className="text-xs text-[var(--brand-muted)]">Too many verification attempts. You can try verifying your email later — for now, continue filling the form.</p>
                                            <Button variant="secondary" onClick={() => { }} className="self-start mt-1 text-xs h-8 px-3 bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20" disabled>
                                                ✓ Continuing without OTP
                                            </Button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brand-muted)]">+91</span>
                                    <input type="tel" value={data.phone} onChange={e => handleInput("phone", e.target.value)} placeholder="9876543210" className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg pl-12 pr-4 py-3 text-[var(--brand-light)] focus:border-[#84a98c] focus:outline-none" maxLength={10} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Occupation</label>
                                    <select value={data.occupation} onChange={e => handleInput("occupation", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[#84a98c] focus:outline-none appearance-none cursor-pointer">
                                        <option value="" disabled>Select</option>
                                        {OCCUPATIONS.map(o => <option key={o} value={o} className="bg-[var(--brand-dark)]">{o}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">How did you hear about us?</label>
                                    <select value={data.source} onChange={e => handleInput("source", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[#84a98c] focus:outline-none appearance-none cursor-pointer">
                                        <option value="" disabled>Select Source</option>
                                        {["LinkedIn", "Instagram", "Friend", "News/PR", "Other"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Upload ID Proof (Aadhaar/PAN)</label>
                                <label className="cursor-pointer block relative">
                                    <div className={cn(
                                        "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors group relative",
                                        data.idFileUrl ? "border-[#84a98c]/50 bg-[#84a98c]/5" : "border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg)]/80",
                                        isUploading && "opacity-50 pointer-events-none"
                                    )}>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                            disabled={isUploading}
                                        />

                                        {isUploading ? (
                                            <div className="flex flex-col items-center text-[#84a98c]">
                                                <div className="w-8 h-8 border-4 border-t-transparent border-[#84a98c] rounded-full animate-spin mb-3"></div>
                                                <span className="text-sm font-medium">Uploading...</span>
                                            </div>
                                        ) : data.idFileUrl ? (
                                            <div className="text-[#84a98c] flex flex-col items-center">
                                                <ShieldCheck className="w-8 h-8 mb-2" />
                                                <span className="text-sm font-medium">ID Uploaded Successfully</span>
                                            </div>
                                        ) : (
                                            <>
                                                <UploadCloud className="w-8 h-8 text-[var(--brand-muted)] group-hover:text-[#84a98c] transition-colors mb-3" />
                                                <span className="text-sm text-[var(--brand-light)] font-medium mb-1">Click to browse or drag and drop</span>
                                                <span className="text-xs text-[var(--brand-muted)]">Accepts JPG, PNG, PDF (Max 2MB)</span>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button variant="primary" onClick={() => goNext("preferences")} disabled={!isStep1Valid()} className="!bg-[#84a98c] hover:!bg-[#6f9477] text-white">
                                    Next <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </WizardStep>
                )}

                {step === "preferences" && (
                    <WizardStep key="preferences" title="Investment Preferences">
                        <div className="space-y-6">

                            <div>
                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-3 block">How much are you willing to invest per season?</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {BUDGET_OPTIONS.map(opt => (
                                        <div
                                            key={opt.id}
                                            onClick={() => handleInput("budget", opt.id)}
                                            className={cn(
                                                "p-4 rounded-xl border cursor-pointer transition-all duration-300 relative overflow-hidden group flex items-start",
                                                data.budget === opt.id ? "bg-[#84a98c]/10 border-[#84a98c] shadow-[0_0_15px_-5px_transparent] bg-gradient-to-br from-[#84a98c]/20 to-transparent" : "bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-white/30"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border mt-0.5 mr-3 flex items-center justify-center shrink-0 transition-colors",
                                                data.budget === opt.id ? "border-[#84a98c]" : "border-[var(--brand-muted)]"
                                            )}>
                                                {data.budget === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#84a98c]" />}
                                            </div>
                                            <div>
                                                <p className={cn("font-semibold", data.budget === opt.id ? "text-[#84a98c]" : "text-[var(--brand-light)]")}>{opt.label}</p>
                                                <p className="text-xs text-[var(--brand-muted)] mt-1 tracking-wide">{opt.badge}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-3 block">Seasons of Interest (Select multiple)</label>
                                <div className="flex flex-wrap gap-2">
                                    {SEASONS.map(season => {
                                        const isSelected = data.seasons.includes(season);
                                        return (
                                            <button
                                                key={season}
                                                onClick={() => toggleArrayItem("seasons", season)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                                                    isSelected ? "bg-[#84a98c]/20 text-[#84a98c] border-[#84a98c]/50" : "bg-[var(--glass-bg)] text-[var(--brand-muted)] border-[var(--glass-border)] hover:border-[var(--brand-light)]/30"
                                                )}
                                            >
                                                {season}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-3 block">Categories of Interest (Select multiple)</label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map(cat => {
                                        const isSelected = data.categories.includes(cat.label);
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => toggleArrayItem("categories", cat.label)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                                                    isSelected ? "bg-[#84a98c]/20 text-[#84a98c] border-[#84a98c]/50" : "bg-[var(--glass-bg)] text-[var(--brand-muted)] border-[var(--glass-border)] hover:border-[var(--brand-light)]/30"
                                                )}
                                            >
                                                {cat.label}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-3 block">Investment Goal</label>
                                <div className="space-y-2">
                                    {GOAL_OPTIONS.map(opt => (
                                        <div
                                            key={opt.id}
                                            onClick={() => handleInput("goal", opt.id)}
                                            className={cn(
                                                "p-3 rounded-lg border cursor-pointer transition-all duration-300 flex items-center gap-3",
                                                data.goal === opt.id ? "bg-[#84a98c]/10 border-[#84a98c]/50 text-[#84a98c]" : "bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-white/30 text-[var(--brand-light)]"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                                                data.goal === opt.id ? "border-[#84a98c]" : "border-[var(--brand-muted)]"
                                            )}>
                                                {data.goal === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#84a98c]" />}
                                            </div>
                                            <span className="text-sm font-medium">{opt.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#84a98c]/5 border border-[#84a98c]/20 rounded-xl p-4 cursor-pointer" onClick={() => handleInput("riskAcknowledged", !data.riskAcknowledged)}>
                                <div className="flex items-start gap-3">
                                    <div className={cn(
                                        "w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 mt-0.5",
                                        data.riskAcknowledged ? "bg-[#84a98c] border-[#84a98c]" : "border-[var(--brand-muted)] bg-[var(--glass-bg)]"
                                    )}>
                                        {data.riskAcknowledged && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[var(--brand-light)]">I understand seasonal businesses carry risk and returns are not guaranteed.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-between">
                                <Button variant="secondary" onClick={goBack}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                                <Button variant="primary" onClick={() => goNext("review")} disabled={!isStep2Valid()} className="!bg-[#84a98c] hover:!bg-[#6f9477] text-white">
                                    Next <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </WizardStep>
                )}

                {step === "review" && (
                    <WizardStep key="review" title="Review & Submit">
                        <div className="space-y-6">
                            {/* Backer Profile Card */}
                            <div className="bg-gradient-to-br from-[#121c15] to-black border border-[#84a98c]/30 p-6 rounded-2xl relative overflow-hidden shadow-[0_0_30px_-10px_rgba(132,169,140,0.15)] group hover:border-[#84a98c]/50 transition-colors">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#84a98c] opacity-10 blur-[50px] rounded-full"></div>

                                <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{data.name}</h3>
                                        <p className="text-sm text-[#84a98c] flex items-center gap-1 font-medium">
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#84a98c]"></span> {data.city}
                                        </p>
                                    </div>
                                    <span className="bg-[#84a98c]/20 text-[#a3c9ab] px-3 py-1 rounded-full text-xs font-bold border border-[#84a98c]/30">
                                        {selectedBudgetBadge}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-[var(--brand-muted)] uppercase tracking-wider mb-2 font-semibold">Seasons</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {data.seasons.map(s => (
                                                <span key={s} className="text-xs font-medium bg-black/40 text-white/80 px-2.5 py-1.5 rounded-md border border-white/5">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[var(--brand-muted)] uppercase tracking-wider mb-2 font-semibold">Categories</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {data.categories.map(c => (
                                                <span key={c} className="text-[11px] font-medium bg-[#84a98c]/10 text-[#a3c9ab] px-2.5 py-1 rounded-md border border-[#84a98c]/20">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-black/30 p-3 rounded-lg border border-white/5 mt-4">
                                        <p className="text-[10px] text-[var(--brand-muted)] uppercase tracking-wider mb-1 font-semibold">Goal</p>
                                        <p className="text-sm font-bold text-white/90">{GOAL_OPTIONS.find(g => g.id === data.goal)?.label}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-[var(--glass-border)]">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={data.consentAccuracy} onChange={e => handleInput("consentAccuracy", e.target.checked)} className="mt-1 w-5 h-5 rounded border-[var(--glass-border)] accent-[#84a98c] shrink-0" />
                                    <span className="text-sm font-medium text-[var(--brand-muted)] group-hover:text-[var(--brand-light)] transition-colors">I confirm the information above is accurate.</span>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={data.consentRisk} onChange={e => handleInput("consentRisk", e.target.checked)} className="mt-1 w-5 h-5 rounded border-[var(--glass-border)] accent-[#84a98c] shrink-0" />
                                    <span className="text-sm font-medium text-[var(--brand-muted)] group-hover:text-[var(--brand-light)] transition-colors">I accept the risks involved and understand ENTRECULTIA does not guarantee profits.</span>
                                </label>
                            </div>

                            <div className="pt-6 flex flex-col items-center">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full text-lg py-6 bg-[#638b6f] hover:bg-[#52775f] text-white border-transparent shadow-[0_0_20px_-5px_#84a98c]"
                                    onClick={handleSubmit}
                                    disabled={!isStep3Valid() || isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Activate My Backer Profile 💼"}
                                </Button>
                                <p className="text-sm font-medium text-[var(--brand-muted)] mt-4 text-center">
                                    We'll match you with verified student pitches within 72 hours
                                </p>
                            </div>
                        </div>
                    </WizardStep>
                )}

                {step === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <motion.div
                            initial={{ scale: 0, y: -20 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                            className="w-24 h-24 rounded-full bg-gradient-to-br from-[#84a98c] to-[#4b6d54] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(132,169,140,0.3)]"
                        >
                            <Check className="w-12 h-12 text-white stroke-[3]" />
                        </motion.div>
                        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Welcome to the Community! 💼</h2>
                        <p className="text-[var(--brand-muted)] max-w-md mx-auto mb-6 leading-relaxed text-lg">
                            Our team will WhatsApp you a curated list of student pitches matching your preferences. Expect an update within <span className="text-white font-medium">72 hours</span>.
                        </p>

                        <div className="inline-flex items-center gap-2 bg-[#84a98c]/10 border border-[#84a98c]/30 px-5 py-2.5 rounded-full mb-10 shadow-inner">
                            <span className="text-sm font-medium text-[var(--brand-light)]">Tier Earned:</span>
                            <span className="text-sm font-bold text-[#84a98c]">{selectedBudgetBadge}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full sm:w-auto bg-[#84a98c] hover:bg-[#6f9477] text-white border-transparent shadow-lg shadow-[#84a98c]/20"
                                onClick={() => { }}
                            >
                                Browse Sample Pitches
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                className="w-full sm:w-auto hover:bg-white/5"
                                onClick={() => window.location.href = "/"}
                            >
                                Back to Home
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Helpers ---

function WizardStep({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-[var(--brand-light)] tracking-tight">{title}</h2>
            </div>
            {children}
        </motion.div>
    );
}

function InputGroup({ label, value, onChange, placeholder }: any) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--brand-muted)] block">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[#84a98c] focus:outline-none transition-colors"
            />
        </div>
    )
}
