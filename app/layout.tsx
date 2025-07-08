import type { Metadata } from 'next'
import { Poppins, Cairo } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/components/LanguageProvider'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

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
  title: 'Villa Manager - Multi-tenant Villa Rental System',
  description: 'Professional villa rental management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={cairo.variable}>
        <LanguageProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
} 