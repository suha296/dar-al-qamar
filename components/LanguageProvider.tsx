'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.back': 'Back',
    'common.next': 'Next',
    'weekday.short.Sun': 'Sun',
    'weekday.short.Mon': 'Mon',
    'weekday.short.Tue': 'Tue',
    'weekday.short.Wed': 'Wed',
    'weekday.short.Thu': 'Thu',
    'weekday.short.Fri': 'Fri',
    'weekday.short.Sat': 'Sat',
    'weekday.long.Sunday': 'Sunday',
    'weekday.long.Monday': 'Monday',
    'weekday.long.Tuesday': 'Tuesday',
    'weekday.long.Wednesday': 'Wednesday',
    'weekday.long.Thursday': 'Thursday',
    'weekday.long.Friday': 'Friday',
    'weekday.long.Saturday': 'Saturday',
    // Home
    'home.title': 'Villa Manager',
    'home.subtitle': 'Professional multi-tenant villa rental management system. Manage your villas, handle bookings, and provide beautiful customer experiences.',
    'home.managerLogin': 'Manager Login',
    'home.viewSampleVilla': 'View Sample Villa',
    'home.feature1.title': 'Villa Management',
    'home.feature1.description': 'Easily manage multiple villas with photos, descriptions, and pricing.',
    'home.feature2.title': 'Booking Calendar',
    'home.feature2.description': 'Visual calendar interface to manage availability and bookings.',
    // Villa Page
    'villa.logoAlt': 'Dar Al Qamar Logo',
    'villa.name': 'Dar Al Qamar',
    'villa.arabicDescription': 'Dar Al Qamar - Jericho 🏡\nA luxury villa with a peaceful view ✨\nPrivate pool | Outdoor seating | Full privacy\nYour address for the best holiday ⛱️🍉',
    'villa.gallery': 'Gallery',
    'villa.facilities': 'Facilities',
    'villa.bedrooms': '4 Bedrooms',
    'villa.bathrooms': '4 Bathrooms',
    'villa.pool': 'Private Pool',
    'villa.privacy': '100% Privacy',
    'villa.capacity': '8-10 adults + 4-6 kids',
    'villa.soundSystem': 'Sound System (Pool Area)',
    'villa.kitchen': 'Kitchen',
    'villa.laundry': 'Laundry',
    'villa.ac': 'A/C everywhere',
    'villa.bbq': 'BBQ Area',
    'villa.seating': 'Indoor/Outdoor seating',
    'villa.services': 'Services',
    'villa.breakfast': 'Breakfast: 15 NIS/person',
    'villa.birthday': 'Birthday: +400 NIS',
    'villa.anniversary': 'Anniversary: +1000 NIS',
    'villa.whatsapp': 'WhatsApp',
    'villa.checkin': 'Check-in',
    'villa.checkout': 'Check-out',
    'villa.checkAvailability': 'Check Availability',
    'villa.checking': 'Checking...',
    'availability.title': 'Check Availability',
    'availability.available': 'Available',
    'availability.notAvailable': 'Sorry, Not Available in the selected dates',
    'availability.selected': 'Selected',
    'availability.to': 'to',
    'availability.nights': 'Nights',
    'availability.nightsLabel': 'nights',
    'availability.totalPrice': 'Total Price',
    'availability.reserveWhatsapp': 'Reserve via WhatsApp',
    'availability.reserve': 'Reserve',
    'availability.extraNightSuggestion': 'Extra Night Suggestion',
    'availability.nextAvailable': 'Next Available',
    'availability.otherOptions': 'Other Options',
    'availability.error': 'Error checking availability.',
    'villa.wifi': 'High-Speed Internet',
    'villa.internetSpeed': 'High-speed Internet',
    'villa.parking': 'Car Parking',
    'villa.morePictures': 'More Pictures',
    'villa.showAllGallery': 'Show All',
    // ... add more as needed
  },
  ar: {
    // Common
    'common.loading': 'جاري التحميل...',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'weekday.short.Sun': 'أحد',
    'weekday.short.Mon': 'إثنين',
    'weekday.short.Tue': 'ثلاثاء',
    'weekday.short.Wed': 'أربعاء',
    'weekday.short.Thu': 'خميس',
    'weekday.short.Fri': 'جمعة',
    'weekday.short.Sat': 'سبت',
    'weekday.long.Sunday': 'الأحد',
    'weekday.long.Monday': 'الإثنين',
    'weekday.long.Tuesday': 'الثلاثاء',
    'weekday.long.Wednesday': 'الأربعاء',
    'weekday.long.Thursday': 'الخميس',
    'weekday.long.Friday': 'الجمعة',
    'weekday.long.Saturday': 'السبت',
    // Home
    'home.title': 'مدير الفيلا',
    'home.subtitle': 'نظام إدارة إيجار الفيلات متعدد المستأجرين. إدارة فيلاتك، والتعامل مع الحجوزات، وتقديم تجارب عملاء جميلة.',
    'home.managerLogin': 'تسجيل دخول المدير',
    'home.viewSampleVilla': 'عرض فيلا تجريبية',
    'home.feature1.title': 'إدارة الفيلا',
    'home.feature1.description': 'إدارة سهلة لعدة فيلات مع الصور والوصف والأسعار.',
    'home.feature2.title': 'تقويم الحجوزات',
    'home.feature2.description': 'واجهة تقويم مرئية لإدارة التوفر والحجوزات.',
    // Villa Page
    'villa.logoAlt': 'شعار دار القمر',
    'villa.name': 'دار القمر',
    'villa.arabicDescription': 'دار القمر - أريحا 🏡\nڤيلا فاخرة بإطلالة هادئة ✨\nمسبح خاص | جلسات خارجية | خصوصية تامة\nعنوانك لأجمل عطلة ⛱️🍉',
    'villa.gallery': 'المعرض',
    'villa.facilities': 'المرافق',
    'villa.bedrooms': '٤ غرف نوم',
    'villa.bathrooms': '٤ حمامات',
    'villa.pool': 'مسبح خاص',
    'villa.privacy': 'خصوصية تامة',
    'villa.capacity': '٨-١٠ بالغين + ٤-٦ أطفال',
    'villa.soundSystem': 'نظام صوتي (منطقة المسبح)',
    'villa.kitchen': 'مطبخ',
    'villa.laundry': 'غسيل ملابس',
    'villa.ac': 'تكييف في كل مكان',
    'villa.bbq': 'منطقة شواء',
    'villa.seating': 'جلسات داخلية/خارجية',
    'villa.services': 'الخدمات',
    'villa.breakfast': 'فطور: ١٥ شيكل/شخص',
    'villa.birthday': 'عيد ميلاد: +٤٠٠ شيكل',
    'villa.anniversary': 'ذكرى زواج: +١٠٠٠ شيكل',
    'villa.whatsapp': 'واتساب',
    'villa.checkin': 'تاريخ الوصول',
    'villa.checkout': 'تاريخ المغادرة',
    'villa.checkAvailability': 'تحقق من التوفر',
    'villa.checking': 'جاري التحقق...',
    'availability.title': 'تحقق من التوفر',
    'availability.available': 'متوفر',
    'availability.notAvailable': 'عذراً، غير متوفر في التواريخ المحددة',
    'availability.selected': 'التواريخ المختارة',
    'availability.to': 'إلى',
    'availability.nights': 'عدد الليالي',
    'availability.nightsLabel': 'ليالي',
    'availability.totalPrice': 'السعر الكلي',
    'availability.reserveWhatsapp': 'احجز عبر واتساب',
    'availability.reserve': 'احجز',
    'availability.extraNightSuggestion': 'اقتراح ليلة إضافية',
    'availability.nextAvailable': 'أقرب تواريخ متاحة',
    'availability.otherOptions': 'خيارات أخرى',
    'availability.error': 'حدث خطأ أثناء التحقق من التوفر.',
    'villa.wifi': 'انترنت عالي السرعة',
    'villa.internetSpeed': 'انترنت سريع',
    'villa.parking': 'موقف سيارات',
    'villa.morePictures': 'المزيد من الصور',
    'villa.showAllGallery': 'عرض كل الصور',
    // ... add more as needed
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    } else {
      // Detect browser language
      let detected: Language = 'ar';
      if (typeof navigator !== 'undefined') {
        const navLang = navigator.language || (navigator.languages && navigator.languages[0]) || '';
        if (navLang.toLowerCase().startsWith('en')) detected = 'en';
        else if (navLang.toLowerCase().startsWith('ar')) detected = 'ar';
        else detected = 'ar';
      }
      setLanguageState(detected);
      localStorage.setItem('language', detected);
      document.documentElement.dir = detected === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = detected;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 