'use client';
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ConversionTracker } from '@/lib/analytics';

interface ShareButtonProps {
  checkIn: string;
  checkOut: string;
  result: any;
  t: (key: string) => string;
  dir: string;
  language: string;
}

export function ShareButton({ checkIn, checkOut, result, t, dir, language }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Helper to get day name for a date string
  const getDayName = (dateString: string) => {
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

  // Generate share message
  const generateShareMessage = () => {
    const checkInDay = getDayName(checkIn);
    const checkOutDay = getDayName(checkOut);
    const nights = result?.nights || 0;
    const total = result?.total || 0;
    const available = result?.available;
    const extraNightSuggestion = result?.extraNightSuggestion;
    const alternatives = result?.alternatives;
    const sameDayPatternAlternatives = result?.sameDayPatternAlternatives;

    if (language === 'ar') {
      if (available) {
        let message = `🏠 دار القمر - فيلا فاخرة في أريحا\n\n🏡 4 غرف نوم | بوابة أريحا | مسبح خاص\n✨ إطلالة هادئة | خصوصية تامة | جلسات خارجية\n\n✅ متاح للحجز:\n📅 من ${onlyDate(checkIn)} (${checkInDay}) إلى ${onlyDate(checkOut)} (${checkOutDay})\n🌙 عدد الليالي: ${nights}\n💰 السعر: ₪${total}`;
        
        // Add extra night suggestion if available
        if (extraNightSuggestion) {
          const extraStartDay = getDayName(extraNightSuggestion.start);
          const extraEndDay = getDayName(extraNightSuggestion.end);
          const originalPrice = extraNightSuggestion.originalTotal || extraNightSuggestion.total;
          const discount = originalPrice - extraNightSuggestion.total;
          message += `\n\n🎉 احصل على ليلة إضافية بخصم ₪${discount}!\n📅 من ${onlyDate(extraNightSuggestion.start)} (${extraStartDay}) إلى ${onlyDate(extraNightSuggestion.end)} (${extraEndDay})\n🌙 عدد الليالي: ${extraNightSuggestion.nights}\n💰 السعر: ₪${extraNightSuggestion.total} (بدلاً من ₪${originalPrice})`;
        }
        
        message += `\n\n🔗 احجز الآن: ${window.location.href}`;
        return message;
      } else {
        let message = `🏠 دار القمر - فيلا فاخرة في أريحا\n\n🏡 4 غرف نوم | بوابة أريحا | مسبح خاص\n✨ إطلالة هادئة | خصوصية تامة | جلسات خارجية\n\n❌ غير متاح للحجز:\n📅 من ${onlyDate(checkIn)} (${checkInDay}) إلى ${onlyDate(checkOut)} (${checkOutDay})\n🌙 عدد الليالي: ${nights}`;
        
        // Add same day pattern alternatives if available
        if (sameDayPatternAlternatives && sameDayPatternAlternatives.length > 0) {
          message += `\n\n📅 نفس أيام الأسبوع متاحة:`;
          sameDayPatternAlternatives.slice(0, 2).forEach((alt: any, index: number) => {
            const startDay = getDayName(alt.start);
            const endDay = getDayName(alt.end);
            message += `\n${index + 1}. ${onlyDate(alt.start)} (${startDay}) - ${onlyDate(alt.end)} (${endDay}) | ${alt.nights} ليالي | ₪${alt.total}`;
          });
        }
        
        // Add closest available dates if available
        if (alternatives && alternatives.length > 0) {
          message += `\n\n💡 أقرب تواريخ متاحة:`;
          alternatives.slice(0, 2).forEach((alt: any, index: number) => {
            const startDay = getDayName(alt.start);
            const endDay = getDayName(alt.end);
            message += `\n${index + 1}. ${onlyDate(alt.start)} (${startDay}) - ${onlyDate(alt.end)} (${endDay}) | ${alt.nights} ليالي | ₪${alt.total}`;
          });
        }
        
        message += `\n\n🔗 تحقق من تواريخ أخرى: ${window.location.href}`;
        return message;
      }
    } else {
      if (available) {
        let message = `🏠 Dar Al Qamar - Luxury Villa in Jericho\n\n🏡 4 Bedrooms | Jericho Gate | Private Pool\n✨ Peaceful View | Full Privacy | Outdoor Seating\n\n✅ Available for booking:\n📅 From ${onlyDate(checkIn)} (${checkInDay}) to ${onlyDate(checkOut)} (${checkOutDay})\n🌙 Nights: ${nights}\n💰 Price: ₪${total}`;
        
        // Add extra night suggestion if available
        if (extraNightSuggestion) {
          const extraStartDay = getDayName(extraNightSuggestion.start);
          const extraEndDay = getDayName(extraNightSuggestion.end);
          const originalPrice = extraNightSuggestion.originalTotal || extraNightSuggestion.total;
          const discount = originalPrice - extraNightSuggestion.total;
          message += `\n\n🎉 Get an extra night with ₪${discount} discount!\n📅 From ${onlyDate(extraNightSuggestion.start)} (${extraStartDay}) to ${onlyDate(extraNightSuggestion.end)} (${extraEndDay})\n🌙 Nights: ${extraNightSuggestion.nights}\n💰 Price: ₪${extraNightSuggestion.total} (instead of ₪${originalPrice})`;
        }
        
        message += `\n\n🔗 Book now: ${window.location.href}`;
        return message;
      } else {
        let message = `🏠 Dar Al Qamar - Luxury Villa in Jericho\n\n🏡 4 Bedrooms | Jericho Gate | Private Pool\n✨ Peaceful View | Full Privacy | Outdoor Seating\n\n❌ Not available for booking:\n📅 From ${onlyDate(checkIn)} (${checkInDay}) to ${onlyDate(checkOut)} (${checkOutDay})\n🌙 Nights: ${nights}`;
        
        // Add same day pattern alternatives if available
        if (sameDayPatternAlternatives && sameDayPatternAlternatives.length > 0) {
          message += `\n\n📅 Same weekdays available:`;
          sameDayPatternAlternatives.slice(0, 2).forEach((alt: any, index: number) => {
            const startDay = getDayName(alt.start);
            const endDay = getDayName(alt.end);
            message += `\n${index + 1}. ${onlyDate(alt.start)} (${startDay}) - ${onlyDate(alt.end)} (${endDay}) | ${alt.nights} nights | ₪${alt.total}`;
          });
        }
        
        // Add closest available dates if available
        if (alternatives && alternatives.length > 0) {
          message += `\n\n💡 Closest available dates:`;
          alternatives.slice(0, 2).forEach((alt: any, index: number) => {
            const startDay = getDayName(alt.start);
            const endDay = getDayName(alt.end);
            message += `\n${index + 1}. ${onlyDate(alt.start)} (${startDay}) - ${onlyDate(alt.end)} (${endDay}) | ${alt.nights} nights | ₪${alt.total}`;
          });
        }
        
        message += `\n\n🔗 Check other dates: ${window.location.href}`;
        return message;
      }
    }
  };

  // Share via WhatsApp
  const shareViaWhatsApp = async () => {
    setIsSharing(true);
    try {
      const message = generateShareMessage();
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      // Track share event
      ConversionTracker.trackShareEvent('whatsapp', checkIn, checkOut, result?.available || false);
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      const url = window.location.href;
      
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        // Track copy link event
        ConversionTracker.trackShareEvent('copy_link', checkIn, checkOut, result?.available || false);
        return;
      }
      
      // Fallback for older browsers and iOS Safari
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          
          // Track copy link event
          ConversionTracker.trackShareEvent('copy_link', checkIn, checkOut, result?.available || false);
        } else {
          // If execCommand fails, show the URL for manual copy
          alert(language === 'ar' ? `الرابط: ${url}` : `Link: ${url}`);
        }
      } catch (err) {
        // If execCommand fails, show the URL for manual copy
        alert(language === 'ar' ? `الرابط: ${url}` : `Link: ${url}`);
      }
      
      document.body.removeChild(textArea);
    } catch (error) {
      console.error('Error copying link:', error);
      // Final fallback - show URL in alert
      const url = window.location.href;
      alert(language === 'ar' ? `الرابط: ${url}` : `Link: ${url}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      {/* WhatsApp Share Button */}
      <button
        onClick={shareViaWhatsApp}
        disabled={isSharing}
        className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
        <span>{t('share.whatsapp')}</span>
      </button>

      {/* Copy Link Button */}
      <button
        onClick={copyLink}
        className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5" />
            <span>{t('share.copied')}</span>
          </>
        ) : (
          <>
            <Copy className="w-5 h-5" />
            <span>{t('share.copyLink')}</span>
          </>
        )}
      </button>
    </div>
  );
} 