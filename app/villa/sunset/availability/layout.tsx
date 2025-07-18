import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تحقق من التوفر - حجز فيلا دار القمر في أريحا | Check Availability - Dar Al Qamar Villa Booking in Jericho',
  description: 'تحقق من توفر فيلا دار القمر في أريحا واحجز إقامتك. توفر فوري، حجز سريع، وأسعار تنافسية. Check availability and book your stay at Dar Al Qamar Villa in Jericho, Palestine.',
  keywords: [
    // English Keywords
    'villa availability jericho',
    'book villa jericho',
    'dar al qamar booking',
    'villa reservation jericho',
    'check availability jericho',
    'villa rental booking palestine',
    'luxury villa availability jericho',
    'villa booking system jericho',
    'reserve villa jericho',
    'villa availability check jericho',
    'book luxury villa palestine',
    'villa rental availability jericho',
    'dar al qamar reservation',
    'villa booking jericho palestine',
    
    // Arabic Keywords
    'توفر فيلا اريحا',
    'حجز فيلا اريحا',
    'حجز دار القمر',
    'حجز فيلا اريحا',
    'تحقق من التوفر اريحا',
    'حجز فيلا فلسطين',
    'توفر فيلا فاخرة اريحا',
    'نظام حجز فيلا اريحا',
    'حجز فيلا خاصة اريحا',
    'فحص توفر فيلا اريحا',
    'حجز فيلا فاخرة فلسطين',
    'توفر إيجار فيلا اريحا',
    'حجز دار القمر اريحا',
    'حجز فيلا اريحا فلسطين',
    'توفر فيلا فلسطين',
    'حجز فيلا فلسطين',
    'حجز دار القمر فلسطين',
    'حجز فيلا فلسطين',
    'تحقق من التوفر فلسطين',
    'حجز فيلا فلسطين',
    'توفر فيلا فاخرة فلسطين',
    'نظام حجز فيلا فلسطين',
    'حجز فيلا خاصة فلسطين',
    'فحص توفر فيلا فلسطين',
    'حجز فيلا فاخرة فلسطين',
    'توفر إيجار فيلا فلسطين',
    'حجز دار القمر فلسطين',
    'حجز فيلا فلسطين فلسطين',
    'دار القمر توفر',
    'دار القمر حجز',
    'دار القمر حجز',
    'دار القمر تحقق',
    'دار القمر حجز',
    'دار القمر توفر فاخرة',
    'دار القمر نظام حجز',
    'دار القمر حجز خاصة',
    'دار القمر فحص توفر',
    'دار القمر حجز فاخرة',
    'دار القمر توفر إيجار',
    'دار القمر حجز',
    'دار القمر حجز فلسطين',
    'اريحا توفر',
    'اريحا حجز',
    'اريحا حجز',
    'اريحا تحقق',
    'اريحا حجز',
    'اريحا توفر فاخرة',
    'اريحا نظام حجز',
    'اريحا حجز خاصة',
    'اريحا فحص توفر',
    'اريحا حجز فاخرة',
    'اريحا توفر إيجار',
    'اريحا حجز',
    'اريحا حجز فلسطين',
    'توفر',
    'حجز',
    'حجز',
    'تحقق',
    'حجز',
    'توفر فاخرة',
    'نظام حجز',
    'حجز خاصة',
    'فحص توفر',
    'حجز فاخرة',
    'توفر إيجار',
    'حجز',
    'حجز فلسطين'
  ],
  openGraph: {
    title: 'تحقق من التوفر - حجز فيلا دار القمر في أريحا | Check Availability - Dar Al Qamar Villa Booking in Jericho',
    description: 'تحقق من توفر فيلا دار القمر في أريحا واحجز إقامتك. توفر فوري وحجز سريع. Check availability and book your stay at Dar Al Qamar Villa in Jericho, Palestine.',
    images: [
      {
        url: '/villa1.jpg',
        width: 1200,
        height: 630,
        alt: 'تحقق من توفر فيلا دار القمر | Dar Al Qamar Villa Availability Check',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تحقق من التوفر - حجز فيلا دار القمر في أريحا | Check Availability - Dar Al Qamar Villa Booking in Jericho',
    description: 'تحقق من توفر فيلا دار القمر في أريحا واحجز إقامتك. توفر فوري وحجز سريع. Check availability and book your stay at Dar Al Qamar Villa in Jericho, Palestine.',
    images: ['/villa1.jpg'],
  },
  alternates: {
    canonical: '/villa/sunset/availability',
  },
}

export default function AvailabilityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "تحقق من توفر فيلا دار القمر - Dar Al Qamar Villa Availability",
            "alternateName": "Dar Al Qamar Villa Availability",
            "description": "تحقق من توفر فيلا دار القمر في أريحا واحجز إقامتك. Check availability and book your stay at Dar Al Qamar Villa in Jericho, Palestine",
            "url": "https://dar-alqamar.com/villa/sunset/availability",
            "mainEntity": {
              "@type": "LodgingBusiness",
              "name": "دار القمر - Dar Al Qamar Villa",
              "alternateName": "Dar Al Qamar Villa",
              "description": "Luxury 4-bedroom villa with private pool in Jericho, Palestine. فيلا فاخرة مع 4 غرف نوم ومسبح خاص في أريحا، فلسطين",
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
              "numberOfRooms": "4"
            },
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
      {children}
    </>
  )
} 