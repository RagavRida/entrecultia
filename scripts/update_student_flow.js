const fs = require('fs');
const path = require('path');

const filePath = '/Users/raghavendramachikatla/entrecultia/components/onboarding/StudentFlow.tsx';
let fileContent = fs.readFileSync(filePath, 'utf8');

const startStr = '{step === "business" && (';
const endStr = '                )}';
// Let's find the exact block for `step === "business"`
const startIndex = fileContent.indexOf(startStr);

// We need to find the matching closing braces. 
// Instead of risky regex, let's just find the index of `{step === "review" && (`
const nextStepIndex = fileContent.indexOf('{step === "review" && (');

if (startIndex === -1 || nextStepIndex === -1) {
    console.error("Could not find bounds");
    process.exit(1);
}

const beforeBlock = fileContent.substring(0, startIndex);
const afterBlock = fileContent.substring(nextStepIndex);

// Generate the new JSX
const newJSX = `{step === "business" && (
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
`;

const updatedContent = beforeBlock + newJSX + '\n' + afterBlock;
fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log("Success! Updated Step 2 and added Step 3 components securely.");
