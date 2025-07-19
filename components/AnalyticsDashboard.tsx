'use client';
import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';

interface AnalyticsData {
  pageViews: number;
  calendarSearches: number;
  availabilityResults: {
    available: number;
    notAvailable: number;
  };
  ctaClicks: {
    whatsapp: number;
    reserve: number;
  };
  alternativeClicks: {
    sameDayPattern: number;
    otherOptions: number;
    extraNight: number;
  };
  languageSwitches: number;
  conversionRates: {
    searchToResult: number;
    resultToCta: number;
    ctaToWhatsApp: number;
  };
  timeSeries?: any[];
  dateRange?: {
    start: string;
    end: string;
    days: number;
  };
  hasData?: boolean;
}

export function AnalyticsDashboard() {
  const { t, dir } = useLanguage();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [message, setMessage] = useState('');

  // Fetch real analytics data
  const fetchAnalyticsData = async (days: string) => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch(`/api/analytics?days=${days}`);
      const result = await response.json();
      
      if (result.success) {
        setAnalyticsData(result.data);
        setMessage(result.message || '');
      } else {
        setError(result.error || 'Failed to fetch analytics data');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to connect to analytics service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData(dateRange);
  }, [dateRange]);

  const handleDateRangeChange = (newRange: string) => {
    setDateRange(newRange);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">{t('common.loading')}</div>
          <div className="text-sm text-gray-500">Fetching real analytics data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">{error}</div>
          <div className="text-sm text-gray-600 mb-4">
            {dir === 'rtl' 
              ? 'تأكد من تكوين متغيرات البيئة المطلوبة: VERCEL_TOKEN, VERCEL_PROJECT_ID'
              : 'Make sure environment variables are configured: VERCEL_TOKEN, VERCEL_PROJECT_ID'
            }
          </div>
          <button 
            onClick={() => fetchAnalyticsData(dateRange)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {dir === 'rtl' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">No analytics data available</div>
      </div>
    );
  }

  // Show no data message if no events found
  if (!analyticsData.hasData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6" dir={dir}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {dir === 'rtl' ? 'لوحة تحليلات التحويل' : 'Conversion Analytics Dashboard'}
            </h1>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 mb-6">
              <div className="text-yellow-800">
                <h2 className="text-xl font-semibold mb-4">
                  {dir === 'rtl' ? 'لا توجد بيانات تحليلية بعد' : 'No Analytics Data Yet'}
                </h2>
                <p className="mb-4">
                  {dir === 'rtl' 
                    ? 'لم يتم العثور على أحداث تحليلية بعد. هذا يعني أن الموقع لم يتلق أي زيارات أو تفاعلات.'
                    : 'No analytics events found yet. This means the website hasn\'t received any visits or interactions.'
                  }
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>{dir === 'rtl' ? 'لاختبار النظام:' : 'To test the system:'}</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-left">
                    <li>
                      {dir === 'rtl' 
                        ? 'قم بزيارة صفحة الاختبار:'
                        : 'Visit the test page:'
                      } 
                      <a href="/test-analytics" className="text-blue-600 hover:underline ml-1">
                        /test-analytics
                      </a>
                    </li>
                    <li>
                      {dir === 'rtl' 
                        ? 'انتظر 2-3 دقائق لمعالجة البيانات'
                        : 'Wait 2-3 minutes for data processing'
                      }
                    </li>
                    <li>
                      {dir === 'rtl' 
                        ? 'عد إلى هذه الصفحة لرؤية البيانات'
                        : 'Return to this page to see the data'
                      }
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <button 
              onClick={() => fetchAnalyticsData(dateRange)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {dir === 'rtl' ? 'تحديث البيانات' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir={dir}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {dir === 'rtl' ? 'لوحة تحليلات التحويل' : 'Conversion Analytics Dashboard'}
          </h1>
          
          {/* Date Range Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              {dir === 'rtl' ? 'الفترة الزمنية:' : 'Time Range:'}
            </label>
            <select 
              value={dateRange} 
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="7">7 {dir === 'rtl' ? 'أيام' : 'days'}</option>
              <option value="30">30 {dir === 'rtl' ? 'يوم' : 'days'}</option>
              <option value="90">90 {dir === 'rtl' ? 'يوم' : 'days'}</option>
            </select>
          </div>
        </div>

        {/* Data Source Info */}
        {analyticsData.dateRange && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-blue-800">
              <strong>{dir === 'rtl' ? 'مصدر البيانات:' : 'Data Source:'}</strong> Vercel Analytics
              <br />
              <strong>{dir === 'rtl' ? 'الفترة:' : 'Period:'}</strong> {new Date(analyticsData.dateRange.start).toLocaleDateString()} - {new Date(analyticsData.dateRange.end).toLocaleDateString()}
              {message && (
                <>
                  <br />
                  <strong>{dir === 'rtl' ? 'الحالة:' : 'Status:'}</strong> {message}
                </>
              )}
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {dir === 'rtl' ? 'عرض الصفحة' : 'Page Views'}
            </h3>
            <p className="text-3xl font-bold text-blue-600">{analyticsData.pageViews.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {dir === 'rtl' ? 'البحث في التقويم' : 'Calendar Searches'}
            </h3>
            <p className="text-3xl font-bold text-green-600">{analyticsData.calendarSearches.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {dir === 'rtl' ? 'متاح' : 'Available'}
            </h3>
            <p className="text-3xl font-bold text-green-600">{analyticsData.availabilityResults.available.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {dir === 'rtl' ? 'غير متاح' : 'Not Available'}
            </h3>
            <p className="text-3xl font-bold text-red-600">{analyticsData.availabilityResults.notAvailable.toLocaleString()}</p>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {dir === 'rtl' ? 'قمع التحويل' : 'Conversion Funnel'}
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="font-medium">
                {dir === 'rtl' ? 'عرض الصفحة الرئيسية' : 'Main Page Views'}
              </span>
              <span className="text-2xl font-bold text-blue-600">{analyticsData.pageViews}</span>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">↓</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="font-medium">
                {dir === 'rtl' ? 'البحث في التقويم' : 'Calendar Searches'}
              </span>
              <span className="text-2xl font-bold text-green-600">{analyticsData.calendarSearches}</span>
              <span className="text-sm text-gray-500">
                {analyticsData.pageViews > 0 ? ((analyticsData.calendarSearches / analyticsData.pageViews) * 100).toFixed(1) : '0'}%
              </span>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">↓</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <span className="font-medium">
                {dir === 'rtl' ? 'نتائج التوفر' : 'Availability Results'}
              </span>
              <span className="text-2xl font-bold text-yellow-600">
                {analyticsData.availabilityResults.available + analyticsData.availabilityResults.notAvailable}
              </span>
              <span className="text-sm text-gray-500">
                {analyticsData.conversionRates.searchToResult.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">↓</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <span className="font-medium">
                {dir === 'rtl' ? 'النقر على زر الحجز' : 'CTA Button Clicks'}
              </span>
              <span className="text-2xl font-bold text-purple-600">
                {analyticsData.ctaClicks.whatsapp + analyticsData.ctaClicks.reserve}
              </span>
              <span className="text-sm text-gray-500">
                {analyticsData.conversionRates.resultToCta.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">↓</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="font-medium">
                {dir === 'rtl' ? 'النقر على واتساب' : 'WhatsApp Clicks'}
              </span>
              <span className="text-2xl font-bold text-green-600">{analyticsData.ctaClicks.whatsapp}</span>
              <span className="text-sm text-gray-500">
                {analyticsData.conversionRates.ctaToWhatsApp.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CTA Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {dir === 'rtl' ? 'أداء أزرار الحجز' : 'CTA Performance'}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>{dir === 'rtl' ? 'واتساب' : 'WhatsApp'}</span>
                <span className="font-bold text-green-600">{analyticsData.ctaClicks.whatsapp}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{dir === 'rtl' ? 'حجز' : 'Reserve'}</span>
                <span className="font-bold text-blue-600">{analyticsData.ctaClicks.reserve}</span>
              </div>
            </div>
          </div>

          {/* Alternative Suggestions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {dir === 'rtl' ? 'الاقتراحات البديلة' : 'Alternative Suggestions'}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>{dir === 'rtl' ? 'نفس نمط اليوم' : 'Same Day Pattern'}</span>
                <span className="font-bold text-purple-600">{analyticsData.alternativeClicks.sameDayPattern}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{dir === 'rtl' ? 'خيارات أخرى' : 'Other Options'}</span>
                <span className="font-bold text-orange-600">{analyticsData.alternativeClicks.otherOptions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{dir === 'rtl' ? 'ليلة إضافية' : 'Extra Night'}</span>
                <span className="font-bold text-yellow-600">{analyticsData.alternativeClicks.extraNight}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Language Usage */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {dir === 'rtl' ? 'استخدام اللغة' : 'Language Usage'}
          </h3>
          <div className="flex justify-between items-center">
            <span>{dir === 'rtl' ? 'تبديل اللغة' : 'Language Switches'}</span>
            <span className="font-bold text-blue-600">{analyticsData.languageSwitches}</span>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => fetchAnalyticsData(dateRange)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {dir === 'rtl' ? 'تحديث البيانات' : 'Refresh Data'}
          </button>
        </div>
      </div>
    </div>
  );
} 