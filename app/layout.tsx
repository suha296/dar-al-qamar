import type { Metadata } from 'next'
import { Poppins, Cairo } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/components/LanguageProvider'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: {
    default: 'دار القمر - فلل فاخرة للإيجار في أريحا، فلسطين | Dar Al Qamar Villa Rentals',
    template: '%s | دار القمر - Dar Al Qamar Villa Rentals'
  },
  description: 'استأجر فيلا فاخرة في أريحا مع مسبح خاص و 4 غرف نوم. دار القمر - أفضل فلل للإيجار في فلسطين. Experience luxury villa rentals in Jericho, Palestine with private pool and stunning views.',
  keywords: [
    // English Keywords
    'villa rental jericho',
    'luxury villa palestine',
    'dar al qamar villa',
    'private pool villa jericho',
    'vacation rental jericho',
    'family villa palestine',
    'luxury accommodation jericho',
    'villa with pool jericho',
    'holiday villa palestine',
    'private villa rental jericho',
    '4 bedroom villa jericho',
    'luxury vacation rental palestine',
    'dar al qamar jericho',
    'villa booking jericho',
    'luxury stay palestine',
    'private accommodation jericho',
    'villa with view jericho',
    'family vacation villa palestine',
    'luxury villa rental jericho',
    'private pool accommodation palestine',
    'jericho villa rental',
    'palestine vacation rental',
    'luxury accommodation palestine',
    'villa rental west bank',
    'dar al qamar palestine',
    
    // Arabic Keywords
    'فلل اريحا',
    'فيلا اريحا',
    'إيجار فلل اريحا',
    'فلل فاخرة اريحا',
    'فيلا فاخرة اريحا',
    'فلل للإيجار اريحا',
    'فيلا للإيجار اريحا',
    'فلل عائلية اريحا',
    'فيلا عائلية اريحا',
    'فلل مع مسبح اريحا',
    'فيلا مع مسبح اريحا',
    'فلل خاصة اريحا',
    'فيلا خاصة اريحا',
    'فلل سياحية اريحا',
    'فيلا سياحية اريحا',
    'فلل عطلات اريحا',
    'فيلا عطلات اريحا',
    'فلل 4 غرف نوم اريحا',
    'فيلا 4 غرف نوم اريحا',
    'فلل فلسطين',
    'فيلا فلسطين',
    'فلل الضفة الغربية',
    'فيلا الضفة الغربية',
    'فلل فاخرة فلسطين',
    'فيلا فاخرة فلسطين',
    'فلل للإيجار فلسطين',
    'فيلا للإيجار فلسطين',
    'فلل عائلية فلسطين',
    'فيلا عائلية فلسطين',
    'فلل مع مسبح فلسطين',
    'فيلا مع مسبح فلسطين',
    'فلل خاصة فلسطين',
    'فيلا خاصة فلسطين',
    'فلل سياحية فلسطين',
    'فيلا سياحية فلسطين',
    'فلل عطلات فلسطين',
    'فيلا عطلات فلسطين',
    'فلل 4 غرف نوم فلسطين',
    'فيلا 4 غرف نوم فلسطين',
    'دار القمر اريحا',
    'دار القمر فلسطين',
    'دار القمر فلل',
    'دار القمر فيلا',
    'دار القمر إيجار',
    'دار القمر فاخرة',
    'دار القمر عائلية',
    'دار القمر مسبح',
    'دار القمر خاصة',
    'دار القمر سياحية',
    'دار القمر عطلات',
    'دار القمر 4 غرف نوم',
    'اريحا فلل',
    'اريحا فيلا',
    'اريحا إيجار',
    'اريحا فاخرة',
    'اريحا عائلية',
    'اريحا مسبح',
    'اريحا خاصة',
    'اريحا سياحية',
    'اريحا عطلات',
    'اريحا 4 غرف نوم',
    'فلل',
    'فيلا',
    'فلل فاخرة',
    'فيلا فاخرة',
    'فلل للإيجار',
    'فيلا للإيجار',
    'فلل عائلية',
    'فيلا عائلية',
    'فلل مع مسبح',
    'فيلا مع مسبح',
    'فلل خاصة',
    'فيلا خاصة',
    'فلل سياحية',
    'فيلا سياحية',
    'فلل عطلات',
    'فيلا عطلات',
    'فلل 4 غرف نوم',
    'فيلا 4 غرف نوم'
  ],
  authors: [{ name: 'دار القمر - Dar Al Qamar Villa Rentals' }],
  creator: 'دار القمر - Dar Al Qamar Villa Rentals',
  publisher: 'دار القمر - Dar Al Qamar Villa Rentals',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dar-alqamar.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'ar': '/ar',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://dar-alqamar.com',
    siteName: 'دار القمر - Dar Al Qamar Villa Rentals',
    title: 'دار القمر - فلل فاخرة للإيجار في أريحا، فلسطين | Dar Al Qamar Villa Rentals',
    description: 'استأجر فيلا فاخرة في أريحا مع مسبح خاص و 4 غرف نوم. دار القمر - أفضل فلل للإيجار في فلسطين.',
    images: [
      {
        url: '/villa1.jpg',
        width: 1200,
        height: 630,
        alt: 'دار القمر - فيلا فاخرة في أريحا | Dar Al Qamar Luxury Villa in Jericho',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'دار القمر - فلل فاخرة للإيجار في أريحا، فلسطين | Dar Al Qamar Villa Rentals',
    description: 'استأجر فيلا فاخرة في أريحا مع مسبح خاص و 4 غرف نوم. دار القمر - أفضل فلل للإيجار في فلسطين.',
    images: ['/villa1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'h6qK7zwoBL8J9OdDqoMFW9ZOockmnxGEfIzdc-bBIMI', // Your Google Search Console verification code
  },
  category: 'travel',
  classification: 'villa rental',
  other: {
    'geo.region': 'PS',
    'geo.placename': 'Jericho',
    'geo.position': '31.8563;35.4631',
    'ICBM': '31.8563, 35.4631',
    'DC.title': 'دار القمر - Dar Al Qamar Villa Rentals',
    'DC.creator': 'دار القمر - Dar Al Qamar Villa Rentals',
    'DC.subject': 'Luxury Villa Rental, Jericho, Palestine, فلل فاخرة, أريحا, فلسطين',
    'DC.description': 'Luxury villa rentals in Jericho, Palestine with private pool and stunning views. فلل فاخرة للإيجار في أريحا مع مسبح خاص',
    'DC.publisher': 'دار القمر - Dar Al Qamar Villa Rentals',
    'DC.contributor': 'دار القمر - Dar Al Qamar Villa Rentals',
    'DC.date': new Date().toISOString(),
    'DC.type': 'Text',
    'DC.format': 'text/html',
    'DC.identifier': 'https://dar-alqamar.com',
    'DC.language': 'ar,en',
    'DC.coverage': 'Jericho, Palestine, أريحا, فلسطين',
    'DC.rights': 'Copyright 2024 دار القمر - Dar Al Qamar Villa Rentals',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Additional SEO Meta Tags */}
        <meta name="application-name" content="دار القمر - Dar Al Qamar Villa Rentals" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="دار القمر" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3A372E" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Geographic Meta Tags */}
        <meta name="geo.region" content="PS" />
        <meta name="geo.placename" content="Jericho, أريحا" />
        <meta name="geo.position" content="31.8563;35.4631" />
        <meta name="ICBM" content="31.8563, 35.4631" />
        
        {/* Business Meta Tags */}
        <meta name="business:contact_data:street_address" content="Jericho, Palestine, أريحا, فلسطين" />
        <meta name="business:contact_data:locality" content="Jericho, أريحا" />
        <meta name="business:contact_data:region" content="West Bank, الضفة الغربية" />
        <meta name="business:contact_data:postal_code" content="" />
        <meta name="business:contact_data:country_name" content="Palestine, فلسطين" />
        <meta name="business:contact_data:phone_number" content="+972533920842" />
        
        {/* Arabic Language Meta Tags */}
        <meta name="language" content="Arabic, English" />
        <meta name="content-language" content="ar,en" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              "name": "دار القمر - Dar Al Qamar Villa Rentals",
              "alternateName": "Dar Al Qamar Villa Rentals",
              "description": "Luxury villa rental in Jericho, Palestine with private pool and stunning views. فيلا فاخرة للإيجار في أريحا مع مسبح خاص وإطلالة رائعة",
              "url": "https://dar-alqamar.com",
              "telephone": "+972533920842",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Jericho",
                "addressCountry": "PS",
                "addressRegion": "West Bank",
                "addressLocality_ar": "أريحا",
                "addressCountry_ar": "فلسطين",
                "addressRegion_ar": "الضفة الغربية"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "31.8563",
                "longitude": "35.4631"
              },
              "priceRange": "₪₪₪",
              "amenityFeature": [
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Private Pool",
                  "name_ar": "مسبح خاص",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification", 
                  "name": "4 Bedrooms",
                  "name_ar": "4 غرف نوم",
                  "value": "4"
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "4 Bathrooms", 
                  "name_ar": "4 حمامات",
                  "value": "4"
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Kitchen",
                  "name_ar": "مطبخ",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "BBQ Area",
                  "name_ar": "منطقة شواء",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "High-Speed Internet",
                  "name_ar": "انترنت عالي السرعة",
                  "value": true
                }
              ],
              "image": [
                "https://dar-alqamar.com/villa1.jpg",
                "https://dar-alqamar.com/villa2.jpg",
                "https://dar-alqamar.com/villa3.jpg"
              ],
              "sameAs": [
                "https://wa.me/972533920842"
              ],
              "potentialAction": {
                "@type": "ReserveAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://wa.me/972533920842?text=مرحبا، أود حجز فيلا دار القمر في أريحا",
                  "inLanguage": "ar",
                  "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                  ]
                },
                "result": {
                  "@type": "LodgingReservation",
                  "name": "دار القمر - Dar Al Qamar Villa Reservation"
                }
              }
            })
          }}
        />
      </head>
      <body className={cairo.variable}>
        <LanguageProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </LanguageProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
} 