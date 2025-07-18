import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dar Al Qamar Villa Rentals',
    short_name: 'Dar Al Qamar',
    description: 'Luxury villa rentals in Jericho, Palestine',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F4F2',
    theme_color: '#3A372E',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['travel', 'lifestyle', 'business'],
    lang: 'en',
    dir: 'ltr',
    orientation: 'portrait',
    scope: '/',
    prefer_related_applications: false,
  }
} 