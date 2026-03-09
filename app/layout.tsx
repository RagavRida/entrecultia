import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StructuredData } from "@/components/seo/StructuredData";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://entrecultia.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ENTRECULTIA | Seasonal Business Ideas for Students in India",
  description:
    "ENTRECULTIA helps students and small backers launch seasonal businesses across India — from Valentine's Week to Diwali — starting at just ₹5,000. Join free.",
  keywords: [
    "seasonal business ideas for students",
    "low capital business ideas india",
    "student entrepreneurship platform",
    "festival business India",
    "student startup ideas",
    "small business funding India",
    "seasonal businesses",
    "student startup funding",
    "Valentine's week business ideas",
    "Diwali business opportunities",
    "wedding season ventures",
    "micro entrepreneurship India",
    "agriculture business ideas India",
    "college side business",
    "part time business for students",
    "startup ideas for students India",
  ],
  authors: [{ name: "ENTRECULTIA" }],
  openGraph: {
    title: "ENTRECULTIA | Seasonal Business Ideas for Students in India",
    description:
      "ENTRECULTIA connects students with backers to launch seasonal businesses across India. Start with ₹5,000–₹20,000. Join free today.",
    type: "website",
    locale: "en_IN",
    siteName: "ENTRECULTIA",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ENTRECULTIA — Seasonal Business Ideas for Students in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ENTRECULTIA | Seasonal Business Platform for Students",
    description:
      "Launch seasonal businesses during Valentine's, Diwali, and wedding seasons. ENTRECULTIA connects students with small-scale backers across India.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
