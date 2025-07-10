'use client';
import React, { useState, useEffect, useRef, forwardRef, ForwardedRef, InputHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ar as arSA, enUS } from 'date-fns/locale';
import { format } from 'date-fns';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

export default function SampleVilla() {
  const { t, dir } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [carouselAnimating, setCarouselAnimating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel images (current folder only, correct extensions)
  const carouselImages = [
    '/villa1.jpg',
    '/villa2.jpg',
    '/villa3.jpg',
    '/villa4.jpg',
    '/villa5.jpg',
    '/villa6.png',
  ];

  // Full gallery images (carousel + all from /gallery, only jpg/jpeg/png)
  const galleryImages = [
    '/Gallery/1.jpg',
    '/Gallery/2.jpg',
    '/Gallery/3.jpg',
    '/Gallery/4.jpg',
    '/Gallery/5.jpg',
    '/Gallery/6.jpg',
    '/Gallery/7.jpg',
    '/Gallery/8.png',
    ...carouselImages,
  ];
  const fullGalleryImages = [...galleryImages];

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft' && typeof lightboxIndex === 'number' && lightboxIndex > 0) setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i));
      if (e.key === 'ArrowRight' && typeof lightboxIndex === 'number' && lightboxIndex < fullGalleryImages.length - 1) setLightboxIndex(i => (i !== null && i < fullGalleryImages.length - 1 ? i + 1 : i));
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, fullGalleryImages.length]);

  // Touch swipe support for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    let startX = 0;
    let endX = 0;
    function onTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX;
    }
    function onTouchMove(e: TouchEvent) {
      endX = e.touches[0].clientX;
    }
    function onTouchEnd() {
      const diff = endX - startX;
      if (typeof lightboxIndex === 'number') {
        if (diff > 50 && lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1); // swipe right
        if (diff < -50 && lightboxIndex < fullGalleryImages.length - 1) setLightboxIndex(lightboxIndex + 1); // swipe left
      }
    }
    const ref = lightboxRef.current;
    if (ref) {
      ref.addEventListener('touchstart', onTouchStart);
      ref.addEventListener('touchmove', onTouchMove);
      ref.addEventListener('touchend', onTouchEnd);
    }
    return () => {
      if (ref) {
        ref.removeEventListener('touchstart', onTouchStart);
        ref.removeEventListener('touchmove', onTouchMove);
        ref.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, [lightboxIndex, fullGalleryImages.length]);

  // Carousel state with keen-slider
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 0 }, // Only one image fully visible, no peeking
    mode: 'snap', // Faster, more responsive manual sliding
    drag: true,
    detailsChanged: (s) => {
      setCurrentSlide(s.track.details.rel);
    },
    dragEnded: () => setUserInteracted(true),
  });
  useEffect(() => {
    if (!slider || userInteracted) return;
    const interval = setInterval(() => {
      slider.current?.moveToIdx((currentSlide + 1) % carouselImages.length, true, { duration: 600 }); // Slower auto-scroll
    }, 4000);
    return () => clearInterval(interval);
  }, [slider, currentSlide, carouselImages.length, userInteracted]);

  // Carousel navigation
  const goToPrev = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    setUserInteracted(true);
  };
  const goToNext = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    setUserInteracted(true);
  };

  // Touch support for carousel
  useEffect(() => {
    let startX = 0;
    let endX = 0;
    function onTouchStart(e: TouchEvent) { startX = e.touches[0].clientX; }
    function onTouchMove(e: TouchEvent) { endX = e.touches[0].clientX; }
    function onTouchEnd() {
      const diff = endX - startX;
      if (diff > 50) goToPrev();
      if (diff < -50) goToNext();
    }
    const ref = carouselRef.current;
    if (ref) {
      ref.addEventListener('touchstart', onTouchStart);
      ref.addEventListener('touchmove', onTouchMove);
      ref.addEventListener('touchend', onTouchEnd);
    }
    return () => {
      if (ref) {
        ref.removeEventListener('touchstart', onTouchStart);
        ref.removeEventListener('touchmove', onTouchMove);
        ref.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, [carouselIndex, carouselImages.length]);

  // Replace the two DatePickers with a single range picker and custom input
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [checkIn, checkOut] = dateRange;
  console.log('[VillaPage] dateRange:', dateRange, 'checkIn:', checkIn, 'checkOut:', checkOut);

  // Always sort dateRange so checkIn is before checkOut
  const sortedDates = dateRange[0] && dateRange[1] && dateRange[0] > dateRange[1]
    ? [dateRange[1], dateRange[0]]
    : dateRange;
  const sortedCheckIn = sortedDates[0];
  const sortedCheckOut = sortedDates[1];

  // For debug panel
  const [lastCheckInISO, setLastCheckInISO] = useState('');
  const [lastCheckOutISO, setLastCheckOutISO] = useState('');

  // Use only the date part in YYYY-MM-DD format, regardless of timezone
  const toYMD = (date: Date | null) => date && !isNaN(date.getTime()) ? date.toLocaleDateString('en-CA') : '';

  const handleCheck = () => {
    console.log('[VillaPage] handleCheck called', { sortedCheckIn, sortedCheckOut });
    if (!sortedCheckIn) return;
    // If checkOut is null or same as checkIn, set checkOut to checkIn + 1 day (single-night stay)
    let actualCheckOut = sortedCheckOut;
    if (!sortedCheckOut || (sortedCheckIn && sortedCheckOut && sortedCheckIn.getTime() === sortedCheckOut.getTime())) {
      actualCheckOut = new Date(sortedCheckIn.getTime());
      actualCheckOut.setDate(actualCheckOut.getDate() + 1);
      console.log('[VillaPage] Adjusted checkOut for single-night stay:', actualCheckOut);
    }
    // Use only the date part in YYYY-MM-DD format, regardless of timezone
    const checkInISO = toYMD(sortedCheckIn);
    const checkOutISO = toYMD(actualCheckOut);
    setLastCheckInISO(checkInISO);
    setLastCheckOutISO(checkOutISO);
    console.log('[VillaPage] handleCheck ISO strings', { checkInISO, checkOutISO });
    setLoading(true);
    router.push(`/villa/sunset/availability?checkIn=${checkInISO}&checkOut=${checkOutISO}`);
  };

  // Custom column split for desktop
  const facilitiesCols = [
    // Right column
    [
      { icon: '🛏️', text: t('villa.bedrooms') },
      { icon: '🚿', text: t('villa.bathrooms') },
      { icon: '🏊‍♂️', text: t('villa.pool') },
      { icon: '🔒', text: <span className="font-bold">{t('villa.privacy')}</span> },
    ],
    // Middle column
    [
      { icon: '🔊', text: t('villa.soundSystem') },
      { icon: '🛋️', text: t('villa.seating') },
      { icon: '👥', text: t('villa.capacity') },
    ],
    // Left column
    [
      { icon: '📶', text: t('villa.wifi') },
      { icon: '🅿️', text: t('villa.parking') },
      { icon: '🍳', text: t('villa.kitchen') },
      { icon: '🧺', text: t('villa.laundry') },
      { icon: '🔥', text: t('villa.bbq') },
      { icon: '❄️', text: t('villa.ac') },
    ],
  ];

  // Language context for services
  const isArabic = dir === 'rtl';

  // In the component, determine the locale object
  const datePickerLocale = dir === 'rtl' ? arSA : enUS;

  // CustomRangeInput with correct typing
  interface CustomRangeInputProps extends InputHTMLAttributes<HTMLInputElement> {
    value?: string;
    onClick?: () => void;
  }
  const CustomRangeInput = forwardRef<HTMLInputElement, CustomRangeInputProps>(({ onClick }, ref) => {
    return (
      <div className="flex flex-row gap-2 w-full items-center justify-center">
        <input
          type="text"
          className={`input-field bg-white mt-1 w-full min-w-[100px]${dir === 'rtl' ? ' rtl' : ''}`}
          placeholder={t('villa.checkin')}
          value={checkIn ? format(checkIn, 'yyyy-MM-dd') : ''}
          onClick={onClick}
          readOnly
          ref={ref as ForwardedRef<HTMLInputElement>}
        />
        <span className="mx-2 text-xl font-bold text-white select-none">–</span>
        <input
          type="text"
          className={`input-field bg-white mt-1 w-full min-w-[100px]${dir === 'rtl' ? ' rtl' : ''}`}
          placeholder={t('villa.checkout')}
          value={checkOut ? format(checkOut, 'yyyy-MM-dd') : ''}
          onClick={onClick}
          readOnly
        />
      </div>
    );
  });

  // 1. Use t() for new texts
  const morePicturesText = t('villa.morePictures') || (dir === 'rtl' ? 'المزيد من الصور' : 'More Pictures');
  const galleryText = t('villa.gallery') || (dir === 'rtl' ? 'المعرض' : 'Gallery');
  const showAllText = t('villa.showAllGallery') || (dir === 'rtl' ? 'عرض الكل' : 'Show All');

  const handleCarouselChange = (newIndex: number) => {
    setCarouselAnimating(true);
    setTimeout(() => {
      setCarouselIndex(newIndex);
      setCarouselAnimating(false);
    }, 350); // Animation duration
    setUserInteracted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-0 px-2 sm:px-4 pb-80 w-full overflow-x-hidden" dir={dir}>
      {/* Sticky top navbar with logo and language picker */}
      <div className="w-full fixed top-0 left-0 right-0 z-50 bg-background bg-opacity-40 flex items-center justify-center h-20 md:h-24 shadow-sm">
        <div className="absolute left-4 flex items-center">
          <a
            href="https://wa.me/972533920842?text=Hi%2C%20I%20would%20like%20to%20reserve%20Dar%20Al%20Qamar%20villa."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full hover:bg-gray-100 transition shadow text-3xl"
            aria-label="WhatsApp"
          >
            {/* WhatsApp SVG Logo (original colors, no background) */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10" fill="none">
              <path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </a>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img
            src="/dar-al-qamar-logo.jpg"
            alt={t('villa.logoAlt')}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow border-2 border-white bg-white object-cover"
          />
        </div>
        <div className="absolute right-4">
          <LanguageSwitcher />
        </div>
      </div>
      {/* No spacer: carousel should touch the navbar */}
      <div ref={sliderRef} className="keen-slider fixed left-0 right-0 top-0 mb-8 overflow-hidden z-10" style={{height: '110vh', maxHeight: '700px', width: '100vw'}}>
        {carouselImages.map((img, i) => (
          <div className="keen-slider__slide flex items-center justify-center w-screen h-full" key={img + i} style={{height: '100%'}}>
            <img
              src={img}
              alt={`Villa ${i + 1}`}
              className="object-cover w-screen h-full"
              style={{height: '100%', width: '100vw', position: 'absolute', left: 0, top: 0}} 
              onClick={() => setLightboxIndex(i)}
            />
          </div>
        ))}
        {/* More Pictures Button (inside keen-slider container) */}
        <button
          className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-none hover:bg-accent hover:text-white transition z-20 bg-transparent border border-accent"
          onClick={() => document.getElementById('full-gallery')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
        >
          {morePicturesText}
        </button>
      </div>
      {/* Villa Name below carousel */}
      <h1 className="text-2xl font-bold text-accent mb-4 text-center">{t('villa.name')}</h1>
      {/* Arabic Description */}
      <p className="text-xl text-accent mb-8 text-center leading-relaxed" dir="rtl">
        {t('villa.arabicDescription').split('\n').map((line, i) => (
          <span key={i}>{line}<br/></span>
        ))}
      </p>
      {/* Social/Contact Icons */}
      <div className="flex justify-center gap-8 mb-4">
        <a href="https://wa.me/972533920842?text=Hi%2C%20I%20would%20like%20to%20reserve%20Dar%20Al%20Qamar%20villa." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-3xl hover:scale-110 transition-transform">
          {/* Original WhatsApp Logo */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12" fill="#25D366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/share/1G8B67nhgQ/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-3xl hover:scale-110 transition-transform">
          {/* Original Facebook Logo */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a href="https://www.instagram.com/dar.al.qamar.jericho?igsh=Y2ljcGhpdTcxZmFx&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-3xl hover:scale-110 transition-transform">
          {/* Original Instagram Logo */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12">
            <defs>
              <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#405DE6"/>
                <stop offset="12.5%" stopColor="#5851DB"/>
                <stop offset="25%" stopColor="#833AB4"/>
                <stop offset="37.5%" stopColor="#C13584"/>
                <stop offset="50%" stopColor="#E1306C"/>
                <stop offset="62.5%" stopColor="#FD1D1D"/>
                <stop offset="75%" stopColor="#F56040"/>
                <stop offset="87.5%" stopColor="#FCAF45"/>
                <stop offset="100%" stopColor="#FFDC80"/>
              </linearGradient>
            </defs>
            <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
      </div>
      {/* Contact Section */}
      <div className="mb-2 flex flex-col items-center w-full">
        <a href="tel:0525877935" className="text-xl mb-2 text-black hover:underline mt-4">052-587-7935 📞</a>
        <a href="tel:0533920842" className="text-xl mb-6 text-black hover:underline">053-392-0842 📞</a>
      </div>
      
      {/* Facilities Section */}
      <div className="w-full mb-6 px-0 sm:px-2 flex justify-center max-w-3xl mx-auto">
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-8 border border-gray-200 shadow-sm flex flex-col items-center gap-0 w-full">
          <h2 className="font-bold text-xl text-accent mb-6 text-center w-full">{t('villa.facilities')}</h2>
          <div className="flex flex-col md:flex-row w-full text-center md:text-right">
            {facilitiesCols.map((col, idx) => (
              <div key={idx} className="flex flex-col flex-1 mb-4 md:mb-0 px-0 md:px-6 text-center">
                {col.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2 text-center justify-center w-full">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-base text-gray-800">{item.text}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section (independent card) */}
      <div className="w-full mb-6 px-0 sm:px-2 flex justify-center max-w-3xl mx-auto">
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-8 border border-gray-200 shadow-sm flex flex-col items-center gap-0 w-full">
          <h3 className="font-bold text-xl mb-6 text-accent text-center w-full">{t('villa.services')}</h3>
          <div className="flex flex-col items-center w-full">
            {isArabic ? (
              <>
                <div className="flex items-center gap-2 mb-2"><span className="text-base">🍽️</span><span className="text-base text-gray-800">{t('villa.breakfast')}</span></div>
                <div className="flex items-center gap-2 mb-2"><span className="text-base">🎂</span><span className="text-base text-gray-800">عيد ميلاد: + ٢٠٠ شيكل</span></div>
                <div className="flex items-center gap-2 mb-2"><span className="text-base">💝</span><span className="text-base text-gray-800">ذكرى زواج: + ٤٠٠ شيكل</span></div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2"><span className="text-base">🍽️</span><span className="text-base text-gray-800">Breakfast: 15 NIS/person</span></div>
                <div className="flex items-center gap-2 mb-2"><span className="text-base">🎂</span><span className="text-base text-gray-800">Birthday: +200 NIS</span></div>
                <div className="flex items-center gap-2 mb-2"><span className="text-base">💝</span><span className="text-base text-gray-800">Anniversary: +400 NIS</span></div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Full Gallery Section */}
      <div id="full-gallery" className="w-full max-w-5xl mx-auto mt-16 mb-24 px-2">
        <h2 className="text-2xl font-bold text-accent mb-6 text-center">{galleryText}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(showAllGallery ? fullGalleryImages : fullGalleryImages.slice(0, 4)).map((img, i) => (
            <img
              key={img + i}
              src={img}
              alt={`Gallery image ${i + 1}`}
              className="rounded-xl object-cover w-full h-48 cursor-pointer hover:scale-105 transition-transform duration-200 shadow"
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>
        {fullGalleryImages.length > 4 && !showAllGallery && (
          <div className="flex justify-center mt-6">
            <button
              className="btn-secondary px-6 py-2 rounded-lg text-accent border border-accent hover:bg-accent hover:text-white transition font-semibold"
              onClick={() => setShowAllGallery(true)}
            >
              {showAllText}
            </button>
          </div>
        )}
      </div>
      {/* WhatsApp button at the very bottom */}
      <div className="flex justify-center mt-12 mb-4">
        <a
          href="https://wa.me/972533920842?text=Hi%2C%20I%20would%20like%20to%20reserve%20Dar%20Al%20Qamar%20villa."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow hover:bg-green-700 transition"
        >
          <span className="inline-block text-2xl" style={{lineHeight: 1}} role="img" aria-label="Phone">📞</span>
          {t('villa.whatsapp')}
        </a>
      </div>
      <div className="flex justify-center mt-8 mb-0 pb-0" style={{marginBottom: 0, paddingBottom: 0}}>
        <img
          src="/dar-al-qamar-logo.jpg"
          alt={t('villa.logoAlt')}
          className="w-28 h-28 rounded-full bg-white border-2 border-white"
        />
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div ref={lightboxRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80" onClick={() => setLightboxIndex(null)}>
          <div className="relative max-w-2xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img src={fullGalleryImages[lightboxIndex]} alt={`Villa ${lightboxIndex + 1}`} className="max-h-[80vh] rounded-lg mb-4" />
            {/* In the lightbox, replace the X button with a modern SVG close icon */}
            <button
              className="absolute top-4 left-4 p-2 z-40 text-white hover:text-red-500 transition bg-transparent border-none"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="7" y1="7" x2="21" y2="21" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <line x1="21" y1="7" x2="7" y2="21" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </button>
            {/* Left arrow (Previous) */}
            {lightboxIndex > 0 && (
              <button
                className="absolute top-1/2 left-3 -translate-y-1/2 text-5xl font-bold z-30 p-0 m-0 border-none bg-transparent hover:scale-125 transition-transform text-white opacity-80 active:opacity-100"
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                aria-label={t('common.back')}
                style={{lineHeight: 1}}
              >
                {dir === 'rtl' ? '›' : '‹'}
              </button>
            )}
            {/* Right arrow (Next) */}
            {lightboxIndex < fullGalleryImages.length - 1 && (
              <button
                className="absolute top-1/2 right-3 -translate-y-1/2 text-5xl font-bold z-30 p-0 m-0 border-none bg-transparent hover:scale-125 transition-transform text-white opacity-80 active:opacity-100"
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                aria-label={t('common.next')}
                style={{lineHeight: 1}}
              >
                {dir === 'rtl' ? '‹' : '›'}
              </button>
            )}
          </div>
        </div>
      )}
      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#6B3F32] py-3 sm:py-4 px-2 sm:px-8 flex flex-col w-full items-center justify-center gap-2" style={{boxShadow: '0 -2px 12px rgba(0,0,0,0.07)'}}>
        <div className="w-full flex justify-center items-center">
          <div className="max-w-md w-full flex justify-center">
            <DatePicker
              selectsRange
              startDate={checkIn}
              endDate={checkOut}
              onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              customInput={<CustomRangeInput />}
              calendarStartDay={0}
              isClearable={false}
              showPopperArrow={false}
              wrapperClassName={dir === 'rtl' ? 'rtl-datepicker' : ''}
              popperPlacement={dir === 'rtl' ? 'bottom-end' : 'bottom-start'}
              locale={datePickerLocale}
              calendarClassName={dir === 'rtl' ? 'rtl' : ''}
              renderCustomHeader={({ monthDate, decreaseMonth, increaseMonth }) => (
                <div className="flex items-center justify-between px-4 mb-2">
                  <button
                    type="button"
                    onClick={decreaseMonth}
                    className="text-2xl p-2 rounded-full hover:bg-[#f5f4f2] transition"
                    aria-label={'Previous Month'}
                  >
                    ‹
                  </button>
                  <span className="font-bold text-lg">
                    {monthDate.toLocaleString(dir === 'rtl' ? 'ar' : 'en', { year: 'numeric', month: 'long' })}
                  </span>
                  <button
                    type="button"
                    onClick={increaseMonth}
                    className="text-2xl p-2 rounded-full hover:bg-[#f5f4f2] transition"
                    aria-label={'Next Month'}
                  >
                    ›
                  </button>
                </div>
              )}
            />
          </div>
        </div>
        <button
          className="bg-black text-white rounded-lg px-6 py-2 text-base font-semibold min-w-[140px] mt-2 disabled:opacity-60 mx-auto"
          onClick={handleCheck}
          disabled={loading || !checkIn || !checkOut}
        >
          {loading ? t('villa.checking') : t('villa.checkAvailability')}
        </button>
      </div>
    </div>
  );
} 