export type FeedItemType = "startup" | "investor";

export interface FeedItem {
    id: string;
    type: FeedItemType;
    name: string;
    title: string;
    description: string;
    tags: string[];
    amount: string; // Budget or Investment Cap
    image?: string;
}

export const MOCK_STARTUPS: FeedItem[] = [
    {
        id: "s1",
        type: "startup",
        name: "Aarav Patel",
        title: "Eco-Friendly Diwali Lights",
        description: "Handcrafted clay diyas with embedded LED strips. Safe, reusable, and traditional.",
        tags: ["Weekends Only", "Mumbai"],
        amount: "₹5,000",
        image: "https://images.unsplash.com/photo-1542828693-b6730a919ea3?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "s2",
        type: "startup",
        name: "Sneha Gupta",
        title: "Custom Exam Kits",
        description: "Curated stationery kits for board exams. Includes stress-relief toys and study planners.",
        tags: ["Daily 2 Hours", "Delhi"],
        amount: "₹2,500",
        image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "s3",
        type: "startup",
        name: "Rohan & Team",
        title: "Campus Coffee Brew",
        description: "Pop-up coffee stall for exam weeks. sourcing beans from Coorg.",
        tags: ["Full Focus", "Bangalore"],
        amount: "₹10,000",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800"
    }
];

export const MOCK_INVESTORS: FeedItem[] = [
    {
        id: "i1",
        type: "investor",
        name: "Vikram Malhotra",
        title: "Seed Investor",
        description: "Looking for high-energy student teams in Mumbai. I have 5 years of retail experience to share.",
        tags: ["Mentorship + Capital", "Retail"],
        amount: "₹50,000",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "i2",
        type: "investor",
        name: "Sarah Fernandes",
        title: "Micro-Angel",
        description: "I want to support female founders starting their first venture.",
        tags: ["Passive Capital", "Social Impact"],
        amount: "₹10,000",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
    }
];
