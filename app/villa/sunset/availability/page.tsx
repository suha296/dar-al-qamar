'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';

interface AltRange {
  start: string;
  end: string;
  nights: number;
  total: number;
  originalTotal?: number;
}

export default function AvailabilityPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const params = useSearchParams();
  const router = useRouter();
  const { t, dir } = useLanguage();
  // console.log('[AvailabilityPage] --- COMPONENT RENDER ---');
  // console.log('[AvailabilityPage] router:', router);
  // console.log('[AvailabilityPage] params:', params);
  // console.log('[AvailabilityPage] t/dir:', { t, dir });
  // Helper to normalize date to YYYY-MM-DD
  const normalizeDate = (date: string) => {
    if (!date) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const d = new Date(date);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return '';
  };
  const checkInRaw = params.get('checkIn') || '';
  const checkOutRaw = params.get('checkOut') || '';
  // console.log('[AvailabilityPage] params.get', { checkInRaw, checkOutRaw });
  const checkIn = normalizeDate(checkInRaw);
  const checkOut = normalizeDate(checkOutRaw);
  // console.log('[AvailabilityPage] normalized:', { checkIn, checkOut });
  const [result, setResult] = useState<null | { 
    available: boolean; 
    total?: number; 
    originalTotal?: number; 
    nights?: number; 
    alternatives?: AltRange[];
    sameDayPatternAlternatives?: AltRange[];
    extraNightSuggestion?: {
      start: string;
      end: string;
      nights: number;
      total: number;
      originalTotal?: number;
    };
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // console.log('[AvailabilityPage] state', { loading, error, result });

  // Helper function to get day pattern name
  const getDayPatternName = (startDate: string, endDate: string, t: (key: string) => string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startLong = start.toLocaleDateString('en-US', { weekday: 'long' });
    const endLong = end.toLocaleDateString('en-US', { weekday: 'long' });
    return `${t('weekday.long.' + startLong)} ${t('availability.to')} ${t('weekday.long.' + endLong)}`;
  };

  // Add a helper to get the day name for a date string
  const getDayName = (dateString: string, t: (key: string) => string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const short = date.toLocaleDateString('en-US', { weekday: 'short' });
    return t('weekday.short.' + short);
  };

  // Helper to extract only the date part (YYYY-MM-DD)
  const onlyDate = (dateString: string) => {
    if (!dateString) return '';
    const match = dateString.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return '';
  };

  // WhatsApp message helper
  const getWhatsappMessage = (checkIn: string, checkOut: string, t: (key: string) => string, language: string, nights?: number) => {
    const checkInDay = getDayName(checkIn, t);
    const checkOutDay = getDayName(checkOut, t);
    let nightsCount = nights;
    if (nightsCount === undefined) {
      // Calculate nights if not provided
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      nightsCount = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    }
    if (language === 'ar') {
      return `مرحباً، أود حجز فيلا دار القمر من ${onlyDate(checkIn)} (${checkInDay}) إلى ${onlyDate(checkOut)} (${checkOutDay}) (عدد الليالي: ${nightsCount})`;
    }
    return `Hi, I would like to reserve Dar Al Qamar villa for ${onlyDate(checkIn)} (${checkInDay}) to ${onlyDate(checkOut)} (${checkOutDay}) (${nightsCount} nights).`;
  };

  // Refactored effect: depend on raw params
  React.useEffect(() => {
    // console.log('[AvailabilityPage] useEffect triggered', { checkInRaw, checkOutRaw, checkIn, checkOut });
    if (!checkIn || !checkOut) {
      // console.log('[AvailabilityPage] useEffect: Missing checkIn or checkOut, skipping fetch');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    // Always send normalized dates to API
    const normCheckIn = normalizeDate(checkIn);
    const normCheckOut = normalizeDate(checkOut);
    // console.log('[AvailabilityPage] Fetching /api/availability', { normCheckIn, normCheckOut });
    fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkIn: normCheckIn, checkOut: normCheckOut, suggestAlternatives: true }),
    })
      .then(res => {
        // console.log('[AvailabilityPage] API response status', res.status);
        return res.json();
      })
      .then(data => {
        // console.log('[AvailabilityPage] API data', data);
        setResult(data);
      })
      .catch((err) => {
        console.error('[AvailabilityPage] Error checking availability', err);
        setError('Error checking availability.');
      })
      .finally(() => {
        // console.log('[AvailabilityPage] Fetch complete, setLoading(false)');
        setLoading(false);
      });
  }, [checkInRaw, checkOutRaw]);

  // Fallback: if result is null, not loading, and both dates are present, show error
  const shouldShowError = !loading && !result && checkIn && checkOut;

  if (!mounted) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-16 px-4" dir={dir}>
      <h1 className="text-3xl font-bold text-accent mb-10">{t('availability.title')}</h1>
      {loading && (<div className="text-lg text-text">{t('common.loading')}</div>)}
      {error && (<div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow">{t('availability.error')}</div>)}
      {shouldShowError && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow mt-4">{t('availability.error')}</div>
      )}
      {result && (
        result.available ? (
          <div className="flex flex-col items-center justify-center gap-8 w-full">
            <div className="bg-green-50 border border-green-200 px-10 py-10 rounded-2xl shadow-lg flex flex-col items-center max-w-md w-full">
              <div className="text-3xl font-extrabold text-green-700 mb-4">{t('availability.available')}</div>
              {/* Summary Section */}
              <div className="mb-4 w-full text-center text-base text-green-900">
                <div>
                  {onlyDate(checkIn)} ({getDayName(checkIn, t)}) {t('availability.to')} {onlyDate(checkOut)} ({getDayName(checkOut, t)})
                </div>
                <div>
                  {t('availability.nights')}: {result.nights}
                </div>
              </div>
              <div className="text-lg text-green-900 mb-2">{t('availability.totalPrice')}</div>
              <div className="flex flex-col items-center mb-6">
                {result.nights && result.nights > 1 && typeof result.originalTotal === 'number' && (
                  <span className="text-2xl text-gray-400 line-through mb-1">₪{result.originalTotal}</span>
                )}
                <span className="text-5xl font-extrabold text-green-800">₪{result.total}</span>
              </div>
              <a
                href={`https://wa.me/972533920842?text=${encodeURIComponent(getWhatsappMessage(checkIn, checkOut, t, dir === 'rtl' ? 'ar' : 'en', result.nights))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-4 rounded-xl text-xl font-bold shadow hover:bg-green-700 transition w-full max-w-md text-center block"
              >
                {t('availability.reserveWhatsapp')}
              </a>
            </div>
            {result.extraNightSuggestion && (
              <div className="bg-yellow-100 border border-yellow-200 px-10 py-10 rounded-2xl shadow-lg flex flex-col items-center max-w-md w-full">
                <div className="text-2xl font-bold text-yellow-700 mb-4">{t('availability.extraNightSuggestion')}</div>
                <div className="text-base text-yellow-900 font-semibold">
                  {result.extraNightSuggestion.start} ({getDayName(result.extraNightSuggestion.start, t)}) {t('availability.to')} {result.extraNightSuggestion.end} ({getDayName(result.extraNightSuggestion.end, t)}) ({result.extraNightSuggestion.nights} {t('availability.nightsLabel')})
                </div>
                <div className="text-lg text-yellow-900 mb-2">{t('availability.totalPrice')}</div>
                <div className="flex flex-col items-center mb-6">
                  {result.extraNightSuggestion.nights > 1 && typeof result.extraNightSuggestion.originalTotal === 'number' && (
                    <span className="text-gray-400 line-through text-lg">₪{result.extraNightSuggestion.originalTotal}</span>
                  )}
                  <span className="text-5xl font-extrabold text-yellow-800">₪{result.extraNightSuggestion.total}</span>
                </div>
                <a
                  href={`https://wa.me/972533920842?text=${encodeURIComponent(getWhatsappMessage(result.extraNightSuggestion.start, result.extraNightSuggestion.end, t, dir === 'rtl' ? 'ar' : 'en', result.extraNightSuggestion.nights))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-2 bg-yellow-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow hover:bg-yellow-700 transition w-fit"
                >
                  <span className="inline-block text-lg" style={{lineHeight: 1}} role="img" aria-label="Phone">📞</span>
                  {t('availability.reserve')}
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 px-10 py-10 rounded-2xl shadow-lg flex flex-col items-center max-w-md w-full mb-8">
            <div className="text-xl font-bold text-red-700 mb-4">{t('availability.notAvailable')}</div>
            <div className="mb-4 text-gray-800">{t('availability.selected')}: {onlyDate(checkIn)} ({getDayName(checkIn, t)}) {t('availability.to')} {onlyDate(checkOut)} ({getDayName(checkOut, t)}) ({result?.nights || 0} {t('availability.nightsLabel')})</div>
            
            {/* Same Day Pattern Alternatives */}
            {result.sameDayPatternAlternatives && result.sameDayPatternAlternatives.length > 0 && (
              <div className="mt-6 w-full">
                <div className="text-lg font-semibold mb-3 text-accent">
                  {t('availability.nextAvailable')} {getDayPatternName(checkIn, checkOut, t)}:
                </div>
                <ul className="space-y-3">
                  {result.sameDayPatternAlternatives.map((alt, i) => (
                    <li key={`same-pattern-${i}`} className="bg-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border border-border">
                      <span className="text-base text-text">
                        {onlyDate(alt.start)} ({getDayName(alt.start, t)}) {t('availability.to')} {onlyDate(alt.end)} ({getDayName(alt.end, t)}) ({alt.nights} {t('availability.nightsLabel')})
                      </span>
                      <span className="flex flex-col items-end">
                        {alt.nights > 1 && typeof alt.originalTotal === 'number' && (
                          <span className="text-gray-400 line-through text-lg">₪{alt.originalTotal}</span>
                        )}
                        <span className="font-bold text-green-700 text-lg">₪{alt.total}</span>
                        <a
                          href={`https://wa.me/972533920842?text=${encodeURIComponent(getWhatsappMessage(alt.start, alt.end, t, dir === 'rtl' ? 'ar' : 'en', alt.nights))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow hover:bg-green-700 transition w-fit"
                        >
                          <span className="inline-block text-lg" style={{lineHeight: 1}} role="img" aria-label="Phone">📞</span>
                          {t('availability.reserve')}
                        </a>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Other available options */}
            {result.alternatives && result.alternatives.length > 0 && (
              <div className="mt-6 w-full">
                <div className="text-lg font-semibold mb-3 text-accent">{t('availability.otherOptions')}</div>
                <ul className="space-y-3">
                  {result.alternatives.map((alt, i) => (
                    <li key={`other-${i}`} className="bg-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border border-border">
                      <span className="text-base text-text">
                        {onlyDate(alt.start)} ({getDayName(alt.start, t)}) {t('availability.to')} {onlyDate(alt.end)} ({getDayName(alt.end, t)}) ({alt.nights} {t('availability.nightsLabel')})
                      </span>
                      <span className="flex flex-col items-end">
                        {alt.nights > 1 && typeof alt.originalTotal === 'number' && (
                          <span className="text-gray-400 line-through text-lg">₪{alt.originalTotal}</span>
                        )}
                        <span className="font-bold text-green-700 text-lg">₪{alt.total}</span>
                        <a
                          href={`https://wa.me/972533920842?text=${encodeURIComponent(getWhatsappMessage(alt.start, alt.end, t, dir === 'rtl' ? 'ar' : 'en', alt.nights))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow hover:bg-green-700 transition w-fit"
                        >
                          <span className="inline-block text-lg" style={{lineHeight: 1}} role="img" aria-label="Phone">📞</span>
                          {t('availability.reserve')}
                        </a>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      )}
      {/* Back Button */}
      <button
        className="btn-secondary mt-8 px-8 py-3 rounded-xl font-semibold text-accent border border-accent hover:bg-accent hover:text-white transition text-lg shadow"
        onClick={() => router.push('/villa/sunset')}
      >
        ← {t('common.back')}
      </button>
    </div>
  );
} 