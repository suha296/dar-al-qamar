import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  locale?: string
  structuredData?: object
}

export default function SEO({
  title = 'Dar Al Qamar Villa Rentals - Luxury Villa in Jericho, Palestine',
  description = 'Experience luxury villa rentals in Jericho, Palestine. Dar Al Qamar offers private pool, 4 bedrooms, 4 bathrooms, and stunning views. Perfect for families and groups.',
  keywords = [
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
    'private pool accommodation palestine'
  ],
  image = '/villa1.jpg',
  url = 'https://dar-alqamar.com',
  type = 'website',
  locale = 'en_US',
  structuredData
}: SEOProps) {
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "Dar Al Qamar Villa Rentals",
    "description": "Luxury villa rental in Jericho, Palestine with private pool and stunning views",
    "url": "https://dar-alqamar.com",
    "telephone": "+972533920842",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Jericho",
      "addressCountry": "PS",
      "addressRegion": "West Bank"
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
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification", 
        "name": "4 Bedrooms",
        "value": "4"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "4 Bathrooms", 
        "value": "4"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Kitchen",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "BBQ Area",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "High-Speed Internet",
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
    ]
  }

  const finalStructuredData = structuredData || defaultStructuredData

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Dar Al Qamar Villa Rentals" />
      <meta name="robots" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${url}${image}`} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Dar Al Qamar Villa Rentals" />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${url}${image}`} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#3A372E" />
      <meta name="msapplication-TileColor" content="#3A372E" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData)
        }}
      />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </Head>
  )
} 