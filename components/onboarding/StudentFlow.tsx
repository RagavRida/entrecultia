"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, ChevronRight, UploadCloud, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// --- Types ---
type StudentStep = "identity" | "business" | "support" | "review" | "success";

interface StudentData {
    // Step 1: Identity
    name: string;
    age: string;
    college: string;
    city: string;
    email: string;
    phone: string;
    idFileUrl: string;
    otpVerified: boolean;

    // Step 2: Pitch/Idea
    businessCategory: 'seasonal' | 'campus' | 'online' | 'food' | 'service' | 'agriculture' | null;

    // Common Business Fields
    businessName: string;
    capitalRequired: number;
    expectedRevenue: string; // Stored as a string since it can vary from "₹10,000/month" to "₹20,000/season"
    description: string;

    // --- Category Specific Fields ---
    // Seasonal
    seasonTarget: string;
    durationDays: string; // 7, 14, 30, 60, Custom
    sellLocations: string[]; // Online, College Campus, Local Market, etc.
    supplierReady: "Yes" | "No" | ""; // Also used by Online

    // Campus
    stallType: string;
    collegePermission: "Yes" | "No" | "Will apply" | "";
    operatingDays: "Weekdays" | "Weekends" | "Both" | "During Events Only" | "";
    expectedFootfall: "<20" | "20–50" | "50–100" | "100+" | "";

    // Online / Reselling
    platforms: string[]; // Instagram, WhatsApp, etc.
    productCategory: string;
    existingPageLink: string;

    // Food & Tiffin
    foodType: string;
    targetCustomers: string;
    operatingFrom: "Home Kitchen" | "Hostel" | "Rented Space" | "Other" | "";
    fssai: "Yes" | "No" | "Will get" | "";
    mealsPerDay: string;

    // Service / Skill-Based
    primarySkill: string;
    priorExperienceText: string;
    clientAcquisition: string[];
    clientsPerMonth: string;
    pricingModel: "Per Hour" | "Per Project" | "Monthly Subscription" | "";

    // Agriculture / Nature
    agriBusinessType: string;
    landAvailable: "Yes — own" | "Yes — family" | "Renting" | "No" | "";
    agriSeasonTarget: string;
    sellThrough: string;

    // Step 3: Support Needed
    supportNeeded: string[]; // Capital, Mentorship, Marketing, etc.
    timeline: "This month" | "Next 1–3 months" | "After my exams" | "Not sure yet" | "";
    profitSharing: "Yes — definitely" | "Open to discussion" | "Prefer a loan structure" | "Not sure yet" | "";
    extraInfo: string;

    // Step 4: Review
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

export function StudentFlow() {
    const [step, setStep] = useState<StudentStep>("identity");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // OTP State
    const [otpSent, setOtpSent] = useState(false);
    const [otpInput, setOtpInput] = useState("");
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpError, setOtpError] = useState("");

    const [data, setData] = useState<StudentData>({
        // Step 1
        name: "", age: "", college: "", city: "", email: "", phone: "", idFileUrl: "", otpVerified: false,

        // Step 2 Common
        businessCategory: null,
        businessName: "", capitalRequired: 10000, expectedRevenue: "", description: "",

        // Step 2 Seasonal
        seasonTarget: "", durationDays: "", sellLocations: [], supplierReady: "",

        // Step 2 Campus
        stallType: "", collegePermission: "", operatingDays: "", expectedFootfall: "",

        // Step 2 Online
        platforms: [], productCategory: "", existingPageLink: "",

        // Step 2 Food
        foodType: "", targetCustomers: "", operatingFrom: "", fssai: "", mealsPerDay: "",

        // Step 2 Service
        primarySkill: "", priorExperienceText: "", clientAcquisition: [], clientsPerMonth: "", pricingModel: "",

        // Step 2 Agriculture
        agriBusinessType: "", landAvailable: "", agriSeasonTarget: "", sellThrough: "",

        // Step 3 Support
        supportNeeded: [], timeline: "", profitSharing: "", extraInfo: "",

        // Step 4 Review
        consentAccuracy: false, consentRisk: false,
    });

    const getStepNumber = () => {
        if (step === "identity") return 1;
        if (step === "business") return 2;
        if (step === "support") return 3;
        if (step === "review") return 4;
        return 4;
    };

    const goNext = (nextStep: StudentStep) => setStep(nextStep);
    const goBack = () => {
        if (step === "business") setStep("identity");
        if (step === "support") setStep("business");
        if (step === "review") setStep("support");
    };

    const handleInput = (key: keyof StudentData, value: any) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const toggleArrayItem = (key: keyof StudentData, item: string) => {
        setData(prev => {
            const arr = (prev[key] as string[]) || [];
            return {
                ...prev,
                [key]: arr.includes(item)
                    ? arr.filter(i => i !== item)
                    : [...arr, item]
            };
        });
    };

    const handleSendOtp = async () => {
        if (!data.email || !isEmailValid) return;
        setIsVerifyingOtp(true);
        setOtpError("");
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: data.email,
            });
            if (error) throw error;
            setOtpSent(true);
        } catch (error: any) {
            setOtpError(error.message || "Failed to send OTP");
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
            setOtpError(error.message || "Invalid OTP");
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

    const isAgeValid = data.age && parseInt(data.age) >= 18 && parseInt(data.age) <= 30;
    const isEmailValid = data.email && data.email.includes("@");

    const isStep1Valid = () => {
        return data.name && isAgeValid && data.college && data.city && isEmailValid && data.phone && data.phone.length === 10 && data.idFileUrl && data.otpVerified;
    };

    const wordCount = data.description.trim().split(/\s+/).filter(Boolean).length;

    // Dynamic Validation based on chosen category
    const isStep2Valid = () => {
        if (!data.businessCategory || !data.businessName || wordCount < 50 || wordCount > 200 || !data.expectedRevenue) return false;

        switch (data.businessCategory) {
            case 'seasonal':
                return !!(data.seasonTarget && data.durationDays && data.sellLocations.length > 0 && data.supplierReady);
            case 'campus':
                return !!(data.stallType && data.collegePermission && data.operatingDays && data.expectedFootfall);
            case 'online':
                return !!(data.platforms.length > 0 && data.productCategory && data.supplierReady && data.existingPageLink !== ""); // even "No" is allowed for existingPageLink depending on implementation, assume required if asked
            case 'food':
                return !!(data.foodType && data.targetCustomers && data.operatingFrom && data.fssai && data.mealsPerDay);
            case 'service':
                return !!(data.primarySkill && data.clientAcquisition.length > 0 && data.clientsPerMonth && data.pricingModel);
            case 'agriculture':
                return !!(data.agriBusinessType && data.landAvailable && data.agriSeasonTarget && data.sellThrough);
            default:
                return false;
        }
    };

    const isStep3Valid = () => {
        return data.supportNeeded.length > 0 && !!data.timeline && !!data.profitSharing;
    };

    const isStep4Valid = () => data.consentAccuracy && data.consentRisk;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/join/student', {
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
                            className="h-full bg-gradient-to-r from-[var(--brand-accent)] to-[#f05a68]"
                            initial={{ width: "33%" }}
                            animate={{ width: `${(getStepNumber() / 3) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === "identity" && (
                    <WizardStep key="identity" title="Who Are You?">
                        <div className="space-y-6">
                            <InputGroup label="Full Name" value={data.name} onChange={(v: string) => handleInput("name", v)} placeholder="e.g. Rahul Sharma" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Age</label>
                                    <input
                                        type="number"
                                        value={data.age}
                                        onChange={e => handleInput("age", e.target.value)}
                                        placeholder="18-30"
                                        className={cn(
                                            "w-full bg-[var(--glass-bg)] border rounded-lg px-4 py-3 text-[var(--brand-light)] focus:outline-none transition-colors",
                                            (data.age && !isAgeValid) ? "border-red-500/50" : "border-[var(--glass-border)] focus:border-[var(--brand-accent)]"
                                        )}
                                    />
                                    {data.age && !isAgeValid && <p className="text-xs text-red-400 mt-1">Must be 18-30</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">City</label>
                                    <select value={data.city} onChange={e => handleInput("city", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none appearance-none cursor-pointer">
                                        <option value="" disabled>Select City</option>
                                        {MAJOR_CITIES.map(c => <option key={c} value={c} className="bg-[var(--brand-dark)]">{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <InputGroup label="College/University Name" value={data.college} onChange={(v: string) => handleInput("college", v)} placeholder="Type to search your college..." />

                            <div>
                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">College/Personal Email</label>
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={e => handleInput("email", e.target.value)}
                                                placeholder="student@college.edu or personal email"
                                                disabled={data.otpVerified || otpSent}
                                                className={cn(
                                                    "w-full bg-[var(--glass-bg)] border rounded-lg px-4 py-3 text-[var(--brand-light)] focus:outline-none transition-colors",
                                                    (data.email && !isEmailValid) ? "border-red-500/50" : "border-[var(--glass-border)] focus:border-[var(--brand-accent)]",
                                                    (data.otpVerified || otpSent) && "opacity-60 cursor-not-allowed"
                                                )}
                                            />
                                            {data.email && !isEmailValid && <p className="text-xs text-red-400 mt-1 absolute -bottom-5 left-0">Please enter a valid email address</p>}
                                        </div>
                                        {!data.otpVerified && !otpSent && (
                                            <Button variant="secondary" onClick={handleSendOtp} disabled={!isEmailValid || isVerifyingOtp} className="h-[48px] whitespace-nowrap">
                                                {isVerifyingOtp ? "Sending..." : "Send OTP"}
                                            </Button>
                                        )}
                                        {data.otpVerified && (
                                            <Button variant="secondary" disabled className="bg-green-500/20 text-green-500 border-green-500/50 h-[48px] whitespace-nowrap">
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
                                                    className="flex-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none tracking-[0.2em] font-mono text-center"
                                                />
                                                <Button variant="primary" onClick={handleVerifyOtp} disabled={otpInput.length < 8 || isVerifyingOtp} className="h-[48px] whitespace-nowrap">
                                                    {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                                                </Button>
                                            </div>
                                            <p className="text-xs text-[var(--brand-muted)] text-right">
                                                <button onClick={() => { setOtpSent(false); setOtpError(""); setOtpInput(""); }} className="text-[var(--brand-accent)] hover:underline ml-1">Change Email</button>
                                            </p>
                                        </motion.div>
                                    )}
                                    {otpError && <p className="text-xs text-red-500 mt-1">{otpError}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brand-muted)]">+91</span>
                                    <input type="tel" value={data.phone} onChange={e => handleInput("phone", e.target.value)} placeholder="9876543210" className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg pl-12 pr-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none" maxLength={10} />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Upload Student ID</label>
                                <label className="cursor-pointer block relative">
                                    <div className={cn(
                                        "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors group relative",
                                        data.idFileUrl ? "border-green-500/50 bg-green-500/5" : "border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg)]/80",
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
                                            <div className="flex flex-col items-center text-[var(--brand-accent)]">
                                                <div className="w-8 h-8 border-4 border-t-transparent border-[var(--brand-accent)] rounded-full animate-spin mb-3"></div>
                                                <span className="text-sm font-medium">Uploading...</span>
                                            </div>
                                        ) : data.idFileUrl ? (
                                            <div className="text-green-500 flex flex-col items-center">
                                                <ShieldCheck className="w-8 h-8 mb-2" />
                                                <span className="text-sm font-medium">ID Uploaded Successfully</span>
                                            </div>
                                        ) : (
                                            <>
                                                <UploadCloud className="w-8 h-8 text-[var(--brand-muted)] group-hover:text-[var(--brand-accent)] transition-colors mb-3" />
                                                <span className="text-sm text-[var(--brand-light)] font-medium mb-1">Click to browse or drag and drop</span>
                                                <span className="text-xs text-[var(--brand-muted)]">Accepts JPG, PNG, PDF (Max 2MB)</span>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button variant="primary" onClick={() => goNext("business")} disabled={!isStep1Valid()}>
                                    Next <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </WizardStep>
                )}

                {step === "business" && (
                    <WizardStep key="business" title="Your Business Idea">
                        <div className="space-y-6">
                            {/* Category Selection */}
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">What kind of business?</h3>
                                <p className="text-[var(--brand-muted)] text-sm mb-4">Select the category that best fits your venture.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { id: 'seasonal', icon: '🗓️', label: 'Seasonal / Festival', desc: 'Tied to a festival, holiday, or season' },
                                        { id: 'campus', icon: '🏫', label: 'Campus-Based', desc: 'Stall, service, or product in college' },
                                        { id: 'online', icon: '🛒', label: 'Online / Reselling', desc: 'Sell via Instagram, WhatsApp, etc.' },
                                        { id: 'food', icon: '🍱', label: 'Food & Tiffin', desc: 'Home kitchen, hostel, or local area' },
                                        { id: 'service', icon: '📚', label: 'Service / Skill-Based', desc: 'Tutoring, photography, design, etc.' },
                                        { id: 'agriculture', icon: '🌾', label: 'Agriculture / Nature', desc: 'Farming, plants, or natural produce' },
                                    ].map(cat => (
                                        <div
                                            key={cat.id}
                                            onClick={() => handleInput("businessCategory", cat.id)}
                                            className={cn(
                                                "p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-start gap-2",
                                                data.businessCategory === cat.id
                                                    ? "bg-[var(--brand-accent)]/10 border-[var(--brand-accent)] shadow-[0_0_15px_rgba(230,57,70,0.15)]"
                                                    : "bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--brand-light)]/30"
                                            )}
                                        >
                                            <span className="text-2xl">{cat.icon}</span>
                                            <div>
                                                <h4 className="font-medium text-[var(--brand-light)]">{cat.label}</h4>
                                                <p className="text-xs text-[var(--brand-muted)] mt-1 leading-snug">{cat.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {data.businessCategory && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6 pt-6 border-t border-[var(--glass-border)]"
                                >
                                    <InputGroup label="Business Name" value={data.businessName} onChange={(v: string) => handleInput("businessName", v)} placeholder="What will you call your venture?" />

                                    {/* --- CATEGORY: SEASONAL --- */}
                                    {data.businessCategory === 'seasonal' && (
                                        <>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Which Season/Festival?</label>
                                                <select value={data.seasonTarget} onChange={e => handleInput("seasonTarget", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none appearance-none cursor-pointer">
                                                    <option value="" disabled>Select Season</option>
                                                    {["Valentine's Week", "Holi", "Eid", "Summer Break", "Raksha Bandhan", "Diwali", "Christmas", "Wedding Season", "Other"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Duration (Days)</label>
                                                    <select value={data.durationDays} onChange={e => handleInput("durationDays", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none">
                                                        <option value="" disabled>Select</option>
                                                        {["7", "14", "30", "60", "Custom"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Supplier Ready?</label>
                                                    <select value={data.supplierReady} onChange={e => handleInput("supplierReady", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] border-[var(--glass-border)] focus:outline-none">
                                                        <option value="" disabled>Select</option>
                                                        <option value="Yes" className="bg-[var(--brand-dark)]">Yes</option>
                                                        <option value="No" className="bg-[var(--brand-dark)]">No</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-3 block">Where will you sell?</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {["Online", "College Campus", "Local Market", "Home Delivery", "Residential Colony", "Other"].map(loc => {
                                                        const isSelected = data.sellLocations?.includes(loc);
                                                        return (
                                                            <button key={loc} onClick={() => toggleArrayItem("sellLocations", loc)} className={cn("px-3 py-1.5 rounded-full text-sm font-medium border transition-colors", isSelected ? "bg-[var(--brand-accent)]/20 text-[var(--brand-accent)] border-[var(--brand-accent)]" : "bg-transparent text-[var(--brand-muted)] border-[var(--glass-border)] hover:border-[var(--brand-light)]/30")}>{loc}</button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* --- CATEGORY: CAMPUS --- */}
                                    {data.businessCategory === 'campus' && (
                                        <>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Type of stall/service</label>
                                                <select value={data.stallType} onChange={e => handleInput("stallType", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none appearance-none cursor-pointer">
                                                    <option value="" disabled>Select Type</option>
                                                    {["Food Stall", "Accessories/Fashion", "Printing & Stationery", "Electronics/Accessories", "Books", "Beauty & Grooming", "Gaming/Entertainment", "Other"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Permission from College?</label>
                                                <select value={data.collegePermission} onChange={e => handleInput("collegePermission", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none appearance-none cursor-pointer">
                                                    <option value="" disabled>Select Status</option>
                                                    {["Yes", "No", "Will apply"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                </select>
                                                {["No", "Will apply"].includes(data.collegePermission) && <p className="text-xs text-[var(--brand-accent)] mt-2 italic">Note: We can help with this!</p>}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Operating Days</label>
                                                    <select value={data.operatingDays} onChange={e => handleInput("operatingDays", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none">
                                                        <option value="" disabled>Select</option>
                                                        {["Weekdays", "Weekends", "Both", "During Events Only"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Expected Footfall / Day</label>
                                                    <select value={data.expectedFootfall} onChange={e => handleInput("expectedFootfall", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none">
                                                        <option value="" disabled>Select</option>
                                                        {["<20", "20–50", "50–100", "100+"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* --- CATEGORY: ONLINE --- */}
                                    {data.businessCategory === 'online' && (
                                        <>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-3 block">Platform (Select all that apply)</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {["Instagram", "WhatsApp", "Meesho", "Amazon", "Flipkart", "Own Website", "Other"].map(loc => {
                                                        const isSelected = data.platforms?.includes(loc);
                                                        return (
                                                            <button key={loc} onClick={() => toggleArrayItem("platforms", loc)} className={cn("px-3 py-1.5 rounded-full text-sm font-medium border transition-colors", isSelected ? "bg-[var(--brand-accent)]/20 text-[var(--brand-accent)] border-[var(--brand-accent)]" : "bg-transparent text-[var(--brand-muted)] border-[var(--glass-border)] hover:border-[var(--brand-light)]/30")}>{loc}</button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Product Category</label>
                                                    <select value={data.productCategory} onChange={e => handleInput("productCategory", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none">
                                                        <option value="" disabled>Select</option>
                                                        {["Clothing & Fashion", "Electronics", "Handmade/Crafts", "Beauty & Skincare", "Books", "Toys", "Home Decor", "Other"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Got a Supplier?</label>
                                                    <select value={data.supplierReady} onChange={e => handleInput("supplierReady", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] border-[var(--glass-border)] focus:outline-none">
                                                        <option value="" disabled>Select</option>
                                                        {["Yes", "No", "Still finding"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <InputGroup label="Existing Page Link (Optional)" value={data.existingPageLink} onChange={(v: string) => handleInput("existingPageLink", v)} placeholder="instagram.com/yourpage or N/A" />
                                        </>
                                    )}

                                    {/* --- CATEGORY: FOOD --- */}
                                    {data.businessCategory === 'food' && (
                                        <>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-3 block">Type of Food Business</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {[
                                                        { id: "Tiffin/Meal Service", icon: "🍱" },
                                                        { id: "Baking & Sweets", icon: "🧁" },
                                                        { id: "Snacks & Street Food", icon: "🥡" },
                                                        { id: "Beverages", icon: "☕" },
                                                        { id: "Custom Cakes/Orders", icon: "🎂" }
                                                    ].map(opt => (
                                                        <label key={opt.id} className={cn("flex cursor-pointer items-center p-3 border rounded-lg transition-colors", data.foodType === opt.id ? "bg-[var(--brand-accent)]/10 border-[var(--brand-accent)]" : "border-[var(--glass-border)] hover:border-white/20")}>
                                                            <input type="radio" className="hidden" name="foodType" checked={data.foodType === opt.id} onChange={() => handleInput("foodType", opt.id)} />
                                                            <span className="mr-2">{opt.icon}</span> <span className="text-sm text-[var(--brand-light)]">{opt.id}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Target Customers</label>
                                                <select value={data.targetCustomers} onChange={e => handleInput("targetCustomers", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none">
                                                    <option value="" disabled>Select Target</option>
                                                    {["College Students", "Office Workers", "Hostel Students", "Local Families", "All"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Operating From</label>
                                                    <select value={data.operatingFrom} onChange={e => handleInput("operatingFrom", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none">
                                                        <option value="" disabled>Select Location</option>
                                                        {["Home Kitchen", "Hostel", "Rented Space", "Other"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Has FSSAI?</label>
                                                    <select value={data.fssai} onChange={e => handleInput("fssai", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] border-[var(--glass-border)] focus:outline-none">
                                                        <option value="" disabled>Select Status</option>
                                                        {["Yes", "No", "Will get"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <InputGroup label="Expected Meals/Orders per Day" value={data.mealsPerDay} onChange={(v: string) => handleInput("mealsPerDay", v)} placeholder="e.g. 20-30 meals" />
                                        </>
                                    )}

                                    {/* --- CATEGORY: SERVICE --- */}
                                    {data.businessCategory === 'service' && (
                                        <>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Primary Skill</label>
                                                <select value={data.primarySkill} onChange={e => handleInput("primarySkill", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none">
                                                    <option value="" disabled>Select Skill</option>
                                                    {["Tutoring/Teaching", "Photography/Videography", "Graphic Design", "Event Planning", "Music/Dance Coaching", "Fitness Training", "Web/App Development", "Content Writing", "Other"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-3 block">How will you find clients?</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {["College Campus", "Social Media", "WhatsApp Network", "Online Platforms (Fiverr, Internshala)", "Word of Mouth"].map(loc => {
                                                        const isSelected = data.clientAcquisition?.includes(loc);
                                                        return (
                                                            <button key={loc} onClick={() => toggleArrayItem("clientAcquisition", loc)} className={cn("px-3 py-1.5 rounded-full text-sm font-medium border transition-colors", isSelected ? "bg-[var(--brand-accent)]/20 text-[var(--brand-accent)] border-[var(--brand-accent)]" : "bg-transparent text-[var(--brand-muted)] border-[var(--glass-border)] hover:border-[var(--brand-light)]/30")}>{loc}</button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Clients per month (est)</label>
                                                    <select value={data.clientsPerMonth} onChange={e => handleInput("clientsPerMonth", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none">
                                                        <option value="" disabled>Select Range</option>
                                                        {["1-5", "5-20", "20-50", "50+"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Pricing Model</label>
                                                    <select value={data.pricingModel} onChange={e => handleInput("pricingModel", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] border-[var(--glass-border)] focus:outline-none">
                                                        <option value="" disabled>Select Model</option>
                                                        {["Per Hour", "Per Project", "Monthly Subscription"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="bg-[var(--glass-bg)] p-4 rounded-xl border border-[var(--glass-border)]">
                                                <label className="flex items-center gap-3 cursor-pointer mb-3 w-max">
                                                    <input type="checkbox" checked={data.priorExperienceText !== ""} onChange={e => handleInput("priorExperienceText", e.target.checked ? "Yes" : "")} className="w-5 h-5 rounded border-[var(--glass-border)] text-[var(--brand-accent)] focus:ring-[var(--brand-accent)] bg-transparent accent-[var(--brand-accent)] cursor-pointer" />
                                                    <span className="text-sm font-medium text-[var(--brand-light)]">Previous Experience</span>
                                                </label>
                                                {data.priorExperienceText !== "" && (
                                                    <motion.textarea
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        placeholder="Tell us briefly..."
                                                        value={data.priorExperienceText === "Yes" ? "" : data.priorExperienceText}
                                                        onChange={e => handleInput("priorExperienceText", e.target.value)}
                                                        className="w-full bg-black/20 border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none text-sm min-h-[80px]"
                                                    />
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* --- CATEGORY: AGRICULTURE --- */}
                                    {data.businessCategory === 'agriculture' && (
                                        <>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-3 block">Type of Agri Business</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {[
                                                        { id: "Flower Farming & Selling", icon: "🌸" },
                                                        { id: "Vegetable/Fruit Growing", icon: "🥦" },
                                                        { id: "Organic Produce", icon: "🌿" },
                                                        { id: "Nursery & Plants", icon: "🪴" },
                                                        { id: "Natural Products (honey, oils)", icon: "🍯" },
                                                        { id: "Other", icon: "🌾" }
                                                    ].map(opt => (
                                                        <label key={opt.id} className={cn("flex cursor-pointer items-center p-3 border rounded-lg transition-colors", data.agriBusinessType === opt.id ? "bg-[var(--brand-accent)]/10 border-[var(--brand-accent)]" : "border-[var(--glass-border)] hover:border-white/20")}>
                                                            <input type="radio" className="hidden" name="agriBusinessType" checked={data.agriBusinessType === opt.id} onChange={() => handleInput("agriBusinessType", opt.id)} />
                                                            <span className="mr-2">{opt.icon}</span> <span className="text-sm text-[var(--brand-light)]">{opt.id}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Land Available?</label>
                                                    <select value={data.landAvailable} onChange={e => handleInput("landAvailable", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none">
                                                        <option value="" disabled>Select Status</option>
                                                        {["Yes — own", "Yes — family", "Renting", "No"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Season of Harvest</label>
                                                    <select value={data.agriSeasonTarget} onChange={e => handleInput("agriSeasonTarget", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] border-[var(--glass-border)] focus:outline-none">
                                                        <option value="" disabled>Select Season</option>
                                                        {["Rabi (Win-Spr)", "Kharif (Mon-Aut)", "Zaid (Summer)", "All Year"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--brand-muted)] mb-2 block">Sell Through</label>
                                                <select value={data.sellThrough} onChange={e => handleInput("sellThrough", e.target.value)} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none">
                                                    <option value="" disabled>Select Channel</option>
                                                    {["Local Market", "Direct Orders", "Mandi", "Online", "Festivals"].map(s => <option key={s} value={s} className="bg-[var(--brand-dark)]">{s}</option>)}
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    {/* --- Common Money and Description --- */}
                                    <div className="pt-4 border-t border-[var(--glass-border)]">
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-medium text-[var(--brand-muted)]">Capital Required</label>
                                            <span className="text-[var(--brand-accent)] font-semibold text-lg">₹{data.capitalRequired.toLocaleString("en-IN")}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="200000" step="5000"
                                            value={data.capitalRequired}
                                            onChange={e => handleInput("capitalRequired", parseInt(e.target.value))}
                                            className="w-full h-2 bg-[var(--glass-border)] rounded-lg appearance-none cursor-pointer accent-[var(--brand-accent)] mt-2"
                                        />
                                        {data.businessCategory === "service" && <p className="text-xs text-[var(--brand-accent)] mt-2">Note: Service businesses often need very little capital.</p>}
                                    </div>

                                    <InputGroup label="Expected Revenue / Scale" value={data.expectedRevenue} onChange={(v: string) => handleInput("expectedRevenue", v)} placeholder="e.g. ₹20,000/month or ₹50k per season" />

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-medium text-[var(--brand-muted)] block">Business Description</label>
                                            <span className={cn(
                                                "text-xs font-mono font-medium",
                                                wordCount < 50 || wordCount > 200 ? "text-red-400" : "text-[var(--brand-accent)]"
                                            )}>
                                                {wordCount} / 50-200 words
                                            </span>
                                        </div>
                                        <textarea
                                            value={data.description}
                                            onChange={e => handleInput("description", e.target.value)}
                                            placeholder="Explain your product/service, target audience, and execution plan..."
                                            className={cn(
                                                "w-full bg-[var(--glass-bg)] border rounded-lg px-4 py-3 text-[var(--brand-light)] focus:outline-none min-h-[140px] resize-y transition-colors",
                                                (data.description && (wordCount < 50 || wordCount > 200)) ? "border-red-500/50" : "border-[var(--glass-border)] focus:border-[var(--brand-accent)]"
                                            )}
                                        ></textarea>
                                    </div>
                                    <div className="pt-4 flex justify-between">
                                        <Button variant="secondary" onClick={goBack}>
                                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                        </Button>
                                        <Button variant="primary" onClick={() => goNext("support")} disabled={!isStep2Valid()}>
                                            Next <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </WizardStep>
                )}

                {step === "support" && (
                    <WizardStep key="support" title="Support You Need">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">What do you need from ENTRECULTIA?</h3>
                                <p className="text-[var(--brand-muted)] text-sm mb-4">Select all that apply.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { id: 'Capital / Backer', icon: '💰', desc: 'I need someone to fund my idea' },
                                        { id: 'Mentorship', icon: '🧠', desc: 'I need guidance from experienced people' },
                                        { id: 'Marketing Help', icon: '📣', desc: 'I need help promoting my business' },
                                        { id: 'Co-founder/Partner', icon: '🤝', desc: 'I want a partner to run this with me' },
                                        { id: 'Supplier Connections', icon: '📦', desc: 'I need help finding suppliers' },
                                        { id: 'Legal/Paperwork', icon: '📄', desc: 'Licenses, FSSAI, GST etc.' },
                                        { id: 'College Permission', icon: '🏫', desc: 'Help getting approval from my college' },
                                    ].map(opt => (
                                        <label
                                            key={opt.id}
                                            className={cn(
                                                "p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all",
                                                data.supportNeeded.includes(opt.id)
                                                    ? "bg-[var(--brand-accent)]/10 border-[var(--brand-accent)]"
                                                    : "bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-white/20"
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={data.supportNeeded.includes(opt.id)}
                                                onChange={() => toggleArrayItem("supportNeeded", opt.id)}
                                            />
                                            <span className="text-xl">{opt.icon}</span>
                                            <div>
                                                <h4 className="font-medium text-[var(--brand-light)] text-sm">{opt.id}</h4>
                                                <p className="text-xs text-[var(--brand-muted)]">{opt.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-[var(--glass-border)]">
                                <div>
                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-3 block">Timeline: When do you want to start?</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {["This month", "Next 1–3 months", "After my exams", "Not sure yet"].map(t => (
                                            <label key={t} className={cn("flex cursor-pointer items-center p-3 border rounded-lg transition-colors", data.timeline === t ? "bg-[var(--brand-accent)]/10 border-[var(--brand-accent)] text-[var(--brand-accent)]" : "border-[var(--glass-border)] text-[var(--brand-light)] hover:border-white/20")}>
                                                <input type="radio" className="hidden" name="timeline" checked={data.timeline === t} onChange={() => handleInput("timeline", t)} />
                                                <span className="text-sm font-medium">{t}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-[var(--brand-muted)] mb-3 block">Are you willing to share profits with a backer?</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {["Yes — definitely", "Open to discussion", "Prefer a loan structure", "Not sure yet"].map(p => (
                                            <label key={p} className={cn("flex cursor-pointer items-center p-3 border rounded-lg transition-colors", data.profitSharing === p ? "bg-[var(--brand-accent)]/10 border-[var(--brand-accent)] text-[var(--brand-accent)]" : "border-[var(--glass-border)] text-[var(--brand-light)] hover:border-white/20")}>
                                                <input type="radio" className="hidden" name="profitSharing" checked={data.profitSharing === p} onChange={() => handleInput("profitSharing", p)} />
                                                <span className="text-sm font-medium">{p}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <InputGroup label="Anything else you want us to know? (Optional)" value={data.extraInfo} onChange={(v: string) => handleInput("extraInfo", v)} placeholder="Extra details..." />
                            </div>

                            <div className="pt-4 flex justify-between">
                                <Button variant="secondary" onClick={goBack}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                                <Button variant="primary" onClick={() => goNext("review")} disabled={!isStep3Valid()}>
                                    Next <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </WizardStep>
                )}

                {step === "review" && (
                    <WizardStep key="review" title="Review & Submit">
                        <div className="space-y-6">
                            {/* Pitch Card */}
                            <div className="bg-gradient-to-br from-[#1a1411] to-black border border-[var(--brand-accent)]/20 p-6 rounded-2xl relative overflow-hidden shadow-[0_0_30px_-10px_rgba(230,57,70,0.15)] group hover:border-[var(--brand-accent)]/40 transition-colors">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-accent)] opacity-10 blur-[50px] rounded-full"></div>

                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-semibold text-white tracking-tight">{data.businessName}</h3>
                                    <span className="bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] px-3 py-1 rounded-full text-xs font-semibold border border-[var(--brand-accent)]/20 whitespace-nowrap">
                                        {data.businessCategory?.toUpperCase() || ''}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {data.supportNeeded.map(support => (
                                        <span key={support} className="text-[11px] font-medium bg-white/5 text-[var(--brand-muted)] px-2.5 py-1 rounded-md border border-white/5">
                                            {support}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-[var(--brand-muted)] uppercase tracking-wider mb-1 font-semibold">Capital Required</p>
                                        <div className="bg-[#f05a68]/10 text-[#f05a68] inline-flex px-2 py-0.5 rounded text-sm font-bold border border-[#f05a68]/20">
                                            ₹{data.capitalRequired.toLocaleString("en-IN")}
                                        </div>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-[var(--brand-muted)] uppercase tracking-wider mb-1 font-semibold">Est. Revenue</p>
                                        <p className="text-sm font-bold text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.2)]">{data.expectedRevenue}</p>
                                    </div>
                                </div>

                                <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                    <p className="text-sm text-[var(--brand-muted)] line-clamp-3 leading-relaxed">
                                        "{data.description}"
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-[var(--glass-border)]">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={data.consentAccuracy} onChange={e => handleInput("consentAccuracy", e.target.checked)} className="mt-1 w-5 h-5 rounded border-[var(--glass-border)] accent-[var(--brand-accent)] shrink-0" />
                                    <span className="text-sm text-[var(--brand-muted)] group-hover:text-[var(--brand-light)] transition-colors">I confirm the information above is accurate.</span>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={data.consentRisk} onChange={e => handleInput("consentRisk", e.target.checked)} className="mt-1 w-5 h-5 rounded border-[var(--glass-border)] accent-[var(--brand-accent)] shrink-0" />
                                    <span className="text-sm text-[var(--brand-muted)] group-hover:text-[var(--brand-light)] transition-colors">I understand ENTRECULTIA does not guarantee profits.</span>
                                </label>
                            </div>

                            <div className="pt-6 flex flex-col items-center">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full text-lg py-6 bg-[#e63946] hover:bg-[#d62828] text-white border-transparent shadow-[0_0_20px_-5px_#e63946]"
                                    onClick={handleSubmit}
                                    disabled={!isStep3Valid() || isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit My Pitch 🚀"}
                                </Button>
                                <p className="text-sm text-[var(--brand-muted)] mt-4 font-medium">
                                    You'll hear from us within 48 hours
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
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                            className="w-24 h-24 rounded-full bg-gradient-to-br from-[#fca311] to-[#e63946] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(252,163,17,0.3)]"
                        >
                            <Check className="w-12 h-12 text-white stroke-[3]" />
                        </motion.div>
                        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">You're In the Queue! 🎉</h2>
                        <p className="text-[var(--brand-muted)] max-w-md mx-auto mb-10 leading-relaxed text-lg">
                            Our team reviews every pitch manually.<br />
                            Expect a WhatsApp/email update within <span className="text-white font-medium">48 hours</span>.
                        </p>

                        {/* Show tiny preview again */}
                        <div className="max-w-sm mx-auto mb-10 bg-black/40 border border-white/10 rounded-xl p-4 text-left">
                            <h4 className="font-semibold text-white mb-1">{data.businessName}</h4>
                            <p className="text-xs text-[var(--brand-muted)]">{data.businessCategory?.toUpperCase()} • ₹{data.capitalRequired.toLocaleString("en-IN")}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white border-transparent shadow-lg shadow-[#25D366]/20"
                                onClick={() => window.open(`https://wa.me/?text=I just pitched my seasonal business ${data.businessName} on ENTRECULTIA! Check it out!`, "_blank")}
                            >
                                Share on WhatsApp
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
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--brand-light)] focus:border-[var(--brand-accent)] focus:outline-none transition-colors"
            />
        </div>
    )
}
