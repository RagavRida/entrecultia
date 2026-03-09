export function StructuredData() {
    const organizationLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "ENTRECULTIA",
        "url": "https://entrecultia.vercel.app",
        "logo": "https://entrecultia.vercel.app/logo.png",
        "sameAs": [
            "https://twitter.com/entrecultia",
            "https://linkedin.com/company/entrecultia",
            "https://instagram.com/entrecultia"
        ],
        "description": "A platform connecting students and backers to build short-term, season-driven startups across India.",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "email": "support@entrecultia.com"
        }
    };

    const softwareAppLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "ENTRECULTIA Platform",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "127"
        }
    };

    const faqLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is ENTRECULTIA?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ENTRECULTIA is a platform connecting students and backers to build short-term, season-driven startups across India. We focus on seasonal opportunities like festivals, Valentine's week, agriculture seasons, and weddings."
                }
            },
            {
                "@type": "Question",
                "name": "How do students get started?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Students can register, choose a seasonal startup opportunity, pitch their ideas, receive backer funding, execute the business, and share revenue with backers."
                }
            },
            {
                "@type": "Question",
                "name": "What kind of businesses can students start?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Students can start seasonal businesses tied to Indian festivals, Valentine's week, summer, winter, monsoon, agriculture harvests, and wedding seasons. These are short-term, capital-efficient startup ventures."
                }
            },
            {
                "@type": "Question",
                "name": "How do backers participate?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Backers can register, review verified business ideas from students, provide short-term capital, track business progress, and receive transparent revenue returns."
                }
            },
            {
                "@type": "Question",
                "name": "Is this platform only for India?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, ENTRECULTIA currently focuses on seasonal business opportunities across India, leveraging the country's diverse festivals and seasonal markets."
                }
            }
        ]
    };

    const websiteLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ENTRECULTIA",
        "url": "https://entrecultia.vercel.app",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://entrecultia.vercel.app/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://entrecultia.vercel.app"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "How It Works",
                "item": "https://entrecultia.vercel.app#how-it-works"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Seasons",
                "item": "https://entrecultia.vercel.app#seasons"
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": "Why ENTRECULTIA",
                "item": "https://entrecultia.vercel.app#why"
            }
        ]
    };

    const localBusinessLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "ENTRECULTIA",
        "description": "Seasonal business platform connecting students and investors in India",
        "url": "https://entrecultia.vercel.app",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN",
            "addressRegion": "India"
        },
        "areaServed": {
            "@type": "Country",
            "name": "India"
        }
    };

    const howToLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Start a Seasonal Business as a Student in India",
        "description": "Step-by-step guide for students to launch seasonal businesses with investor backing",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Register on ENTRECULTIA",
                "text": "Create your student or investor profile on the platform with verified identity",
                "position": 1
            },
            {
                "@type": "HowToStep",
                "name": "Choose Seasonal Opportunity",
                "text": "Select from Valentine's Week, Diwali, wedding season, or festival business opportunities",
                "position": 2
            },
            {
                "@type": "HowToStep",
                "name": "Pitch or Review Ideas",
                "text": "Students pitch business ideas, investors review and select profitable opportunities",
                "position": 3
            },
            {
                "@type": "HowToStep",
                "name": "Secure Investment",
                "text": "Get matched with investors who provide capital for your seasonal business",
                "position": 4
            },
            {
                "@type": "HowToStep",
                "name": "Execute Business",
                "text": "Run your seasonal business during the peak demand period with platform support",
                "position": 5
            },
            {
                "@type": "HowToStep",
                "name": "Share Profits",
                "text": "Complete the season and share transparent profits with your investors",
                "position": 6
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
            />
        </>
    );
}
