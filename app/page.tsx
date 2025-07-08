'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'

export default function Home() {
  const { t, dir } = useLanguage()
  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-end">
            {/* LanguageSwitcher removed */}
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-accent mb-4">
            {t('home.title')}
          </h1>
          <p className="text-base text-text mb-6 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/admin/login" 
              className="btn-primary text-base px-6 py-2"
            >
              {t('home.managerLogin')}
            </Link>
            <Link 
              href="/villa/sunset" 
              className="btn-secondary text-base px-6 py-2"
            >
              {t('home.viewSampleVilla')}
            </Link>
          </div>
        </div>
        {/* Features Section */}
        <div className="flex flex-col items-center justify-center gap-8 mt-8 w-full">
          {/* Villa Management Card */}
          <div className="feature-card w-full max-w-xl mx-auto flex flex-col items-center text-center">
            <div className="text-3xl mb-4">🏠</div>
            <h3 className="text-lg font-semibold mb-2 text-accent">{t('home.feature1.title')}</h3>
            <p className="text-text">{t('home.feature1.description')}</p>
          </div>
          {/* Booking Calendar Card */}
          <div className="feature-card w-full max-w-xl mx-auto flex flex-col items-center text-center">
            <div className="text-3xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2 text-accent">{t('home.feature2.title')}</h3>
            <p className="text-text">{t('home.feature2.description')}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 