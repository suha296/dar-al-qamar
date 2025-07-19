'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';
import { ShareButton } from '@/components/ShareButton';
import { Calendar } from 'lucide-react';
import { ConversionTracker } from '@/lib/analytics';

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
  
  // Initialize analytics tracking for availability page
  useEffect(() => {
    if (mounted) {
      ConversionTracker.trackMainPageView();
    }
  }, [mounted]);
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
  const [isCalendarSelection, setIsCalendarSelection] = useState(false);
  // console.log('[AvailabilityPage] state', { loading, error, result });

  // Handle new date selection from calendar
  const handleCalendarDateSelect = (newCheckIn: string, newCheckOut: string, availabilityData?: any) => {
    console.log('Calendar selected dates:', { newCheckIn, newCheckOut, availabilityData });
    
    // Track calendar date selection
    ConversionTracker.trackCalendarDateSelect(newCheckIn, newCheckOut, 'availability_page');
    
    // Update the URL without triggering a full page reload
    const newUrl = `/villa/sunset/availability?checkIn=${newCheckIn}&checkOut=${newCheckOut}`;
    window.history.pushState({}, '', newUrl);
    
    // If we have availability data from calendar, use it directly
    if (availabilityData) {
      setResult(availabilityData);
      setLoading(false);
      setError('');
      
      // Track availability result from calendar
      ConversionTracker.trackAvailabilityResult(
        newCheckIn, 
        newCheckOut, 
        availabilityData.available, 
        availabilityData.total, 
        availabilityData.nights
      );
      
      // Scroll to results after a short delay
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 500);
    } else {
      // Fallback to API call if no calendar data
      checkAvailability(newCheckIn, newCheckOut);
    }
  };

  // Extract availability checking logic into a separate function
  const checkAvailability = (checkInDate: string, checkOutDate: string) => {
    if (!checkInDate || !checkOutDate) {
      return;
    }
    
    // Only show loading if it's not a calendar selection
    if (!isCalendarSelection) {
      setLoading(true);
      setResult(null);
    }
    setError('');
    
    // Always send normalized dates to API
    const normCheckIn = normalizeDate(checkInDate);
    const normCheckOut = normalizeDate(checkOutDate);
    console.log('[AvailabilityPage] Fetching /api/availability', { normCheckIn, normCheckOut });
    fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkIn: normCheckIn, checkOut: normCheckOut, suggestAlternatives: true }),
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log('[AvailabilityPage] API data', data);
        setResult(data);
        
        // Track availability result
        ConversionTracker.trackAvailabilityResult(
          normCheckIn, 
          normCheckOut, 
          data.available, 
          data.total, 
          data.nights
        );
      })
      .catch((err) => {
        console.error('[AvailabilityPage] Error checking availability', err);
        setError('Error checking availability.');
      })
      .finally(() => {
        setLoading(false);
        setIsCalendarSelection(false); // Reset the flag
      });
  };

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
    
    // For initial load, always show loading
    setLoading(true);
    setResult(null);
    setError('');
    
    // Use the extracted function for consistency
    checkAvailability(checkIn, checkOut);
  }, [checkInRaw, checkOutRaw]);

  // Fallback: if result is null, not loading, and both dates are present, show error
  const shouldShowError = !loading && !result && checkIn && checkOut;

  if (!mounted) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-16 px-4" dir={dir}>
      <h1 className="text-3xl font-bold text-accent mb-10">{t('availability.title')}</h1>
      
      {/* Calendar Section */}
      {result && (
        <div className="mb-8 w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-accent mb-4 text-center flex items-center justify-center gap-2">
            <Calendar className="h-6 w-6 text-accent" />
            <span>{dir === 'rtl' ? 'تحقق من تواريخ أخرى' : 'Check Other Dates'}</span>
          </h2>
          <div className="flex justify-center">
            <AvailabilityCalendar
              onDateSelect={handleCalendarDateSelect}
              selectedCheckIn={checkIn}
              selectedCheckOut={checkOut}
              isCollapsed={result?.available === true}
              isAvailable={result?.available}
            />
          </div>
        </div>
      )}

      {/* Results Section */}
      {loading && (<div className="text-lg text-text">{t('common.loading')}</div>)}
      {error && (<div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow">{t('availability.error')}</div>)}
      {shouldShowError && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow mt-4">{t('availability.error')}</div>
      )}
      {result && (
        <div id="results-section">
          {result.available ? (
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
                  onClick={() => ConversionTracker.trackCtaClick('whatsapp', checkIn, checkOut, result.total)}
                >
                  <div className="flex items-center justify-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <div className="text-left">
                      <div className="font-bold">{t('reservation.clickToReserve')}</div>
                      <div className="text-sm opacity-90">{t('reservation.opensWhatsApp')}</div>
                    </div>
                  </div>
                </a>
                
                {/* Share Button */}
                <ShareButton
                  checkIn={checkIn}
                  checkOut={checkOut}
                  result={result}
                  t={t}
                  dir={dir}
                  language={dir === 'rtl' ? 'ar' : 'en'}
                />
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
                    onClick={() => result.extraNightSuggestion && ConversionTracker.trackAlternativeClick('extra_night', result.extraNightSuggestion.start, result.extraNightSuggestion.end, result.extraNightSuggestion.total)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span>{t('reservation.reserveViaWhatsApp')}</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 px-10 py-10 rounded-2xl shadow-lg flex flex-col items-center max-w-md w-full mb-8">
              <div className="text-xl font-bold text-red-700 mb-4">{t('availability.notAvailable')}</div>
              <div className="mb-4 text-gray-800">{t('availability.selected')}: {onlyDate(checkIn)} ({getDayName(checkIn, t)}) {t('availability.to')} {onlyDate(checkOut)} ({getDayName(checkOut, t)}) ({result?.nights || 0} {t('availability.nightsLabel')})</div>
              
              {/* Share Button for unavailable results */}
              <ShareButton
                checkIn={checkIn}
                checkOut={checkOut}
                result={result}
                t={t}
                dir={dir}
                language={dir === 'rtl' ? 'ar' : 'en'}
              />
              
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
                            onClick={() => ConversionTracker.trackAlternativeClick('same_day_pattern', alt.start, alt.end, alt.total)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            <span>{t('reservation.reserveViaWhatsApp')}</span>
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
                            onClick={() => ConversionTracker.trackAlternativeClick('other_options', alt.start, alt.end, alt.total)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            <span>{t('reservation.reserveViaWhatsApp')}</span>
                          </a>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
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