import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'دار القمر - فيلا فاخرة مع مسبح خاص في أريحا | Dar Al Qamar Villa - Luxury 4 Bedroom Villa with Private Pool in Jericho',
  description: 'استأجر فيلا دار القمر الفاخرة في أريحا مع 4 غرف نوم، 4 حمامات، مسبح خاص، ومنطقة شواء. Experience luxury at Dar Al Qamar Villa in Jericho, Palestine. 4 bedrooms, 4 bathrooms, private pool, BBQ area, and stunning views.',
  keywords: [
    // English Keywords
    'dar al qamar villa jericho',
    'luxury villa jericho palestine',
    '4 bedroom villa jericho',
    'private pool villa jericho',
    'villa rental jericho',
    'luxury accommodation jericho',
    'family villa jericho',
    'vacation rental jericho',
    'holiday villa palestine',
    'villa with pool jericho',
    'bbq villa jericho',
    'luxury stay jericho',
    'private villa jericho',
    'villa booking jericho',
    'dar al qamar jericho palestine',
    
    // Arabic Keywords
    'دار القمر فيلا اريحا',
    'فيلا دار القمر اريحا',
    'فيلا فاخرة اريحا',
    'فيلا مع مسبح اريحا',
    'فيلا 4 غرف نوم اريحا',
    'فيلا خاصة اريحا',
    'فيلا عائلية اريحا',
    'فيلا سياحية اريحا',
    'فيلا عطلات اريحا',
    'فيلا مع شواء اريحا',
    'فيلا مع مطبخ اريحا',
    'فيلا مع انترنت اريحا',
    'فيلا مع تكييف اريحا',
    'فيلا مع موقف سيارات اريحا',
    'فيلا مع غسيل ملابس اريحا',
    'فيلا مع نظام صوتي اريحا',
    'فيلا مع جلسات خارجية اريحا',
    'فيلا مع خصوصية تامة اريحا',
    'فيلا دار القمر فلسطين',
    'فيلا فاخرة فلسطين',
    'فيلا مع مسبح فلسطين',
    'فيلا 4 غرف نوم فلسطين',
    'فيلا خاصة فلسطين',
    'فيلا عائلية فلسطين',
    'فيلا سياحية فلسطين',
    'فيلا عطلات فلسطين',
    'فيلا مع شواء فلسطين',
    'فيلا مع مطبخ فلسطين',
    'فيلا مع انترنت فلسطين',
    'فيلا مع تكييف فلسطين',
    'فيلا مع موقف سيارات فلسطين',
    'فيلا مع غسيل ملابس فلسطين',
    'فيلا مع نظام صوتي فلسطين',
    'فيلا مع جلسات خارجية فلسطين',
    'فيلا مع خصوصية تامة فلسطين',
    'دار القمر فيلا',
    'دار القمر فاخرة',
    'دار القمر مسبح',
    'دار القمر 4 غرف نوم',
    'دار القمر خاصة',
    'دار القمر عائلية',
    'دار القمر سياحية',
    'دار القمر عطلات',
    'دار القمر شواء',
    'دار القمر مطبخ',
    'دار القمر انترنت',
    'دار القمر تكييف',
    'دار القمر موقف سيارات',
    'دار القمر غسيل ملابس',
    'دار القمر نظام صوتي',
    'دار القمر جلسات خارجية',
    'دار القمر خصوصية تامة'
  ],
  openGraph: {
    title: 'دار القمر - فيلا فاخرة مع مسبح خاص في أريحا | Dar Al Qamar Villa - Luxury 4 Bedroom Villa with Private Pool in Jericho',
    description: 'استأجر فيلا دار القمر الفاخرة في أريحا مع 4 غرف نوم، 4 حمامات، مسبح خاص، ومنطقة شواء. Experience luxury at Dar Al Qamar Villa in Jericho, Palestine.',
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
    title: 'دار القمر - فيلا فاخرة مع مسبح خاص في أريحا | Dar Al Qamar Villa - Luxury 4 Bedroom Villa with Private Pool in Jericho',
    description: 'استأجر فيلا دار القمر الفاخرة في أريحا مع 4 غرف نوم، 4 حمامات، مسبح خاص، ومنطقة شواء. Experience luxury at Dar Al Qamar Villa in Jericho, Palestine.',
    images: ['/villa1.jpg'],
  },
  alternates: {
    canonical: '/villa/sunset',
  },
}

export default function VillaLayout({
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
            "@type": "LodgingBusiness",
            "name": "دار القمر - Dar Al Qamar Villa",
            "alternateName": "Dar Al Qamar Villa",
            "description": "Luxury 4-bedroom villa with private pool in Jericho, Palestine. فيلا فاخرة مع 4 غرف نوم ومسبح خاص في أريحا، فلسطين",
            "url": "https://dar-alqamar.com/villa/sunset",
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
            "numberOfRooms": "4",
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
              },
              {
                "@type": "LocationFeatureSpecification",
                "name": "Sound System",
                "name_ar": "نظام صوتي",
                "value": true
              },
              {
                "@type": "LocationFeatureSpecification",
                "name": "Air Conditioning",
                "name_ar": "تكييف",
                "value": true
              },
              {
                "@type": "LocationFeatureSpecification",
                "name": "Laundry",
                "name_ar": "غسيل ملابس",
                "value": true
              },
              {
                "@type": "LocationFeatureSpecification",
                "name": "Parking",
                "name_ar": "موقف سيارات",
                "value": true
              }
            ],
            "image": [
              "https://dar-alqamar.com/villa1.jpg",
              "https://dar-alqamar.com/villa2.jpg",
              "https://dar-alqamar.com/villa3.jpg",
              "https://dar-alqamar.com/villa4.jpg",
              "https://dar-alqamar.com/villa5.jpg"
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
      {children}
    </>
  )
} 