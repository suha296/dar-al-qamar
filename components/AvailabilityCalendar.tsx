'use client';
import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

interface AvailabilityData {
  available: boolean;
  price?: number;
  guestName?: string;
  isWeekend: boolean;
}

interface AvailabilityCalendarProps {
  onDateSelect?: (checkIn: string, checkOut: string, availabilityData?: any) => void;
  selectedCheckIn?: string;
  selectedCheckOut?: string;
  isCollapsed?: boolean;
  isAvailable?: boolean;
}

export function AvailabilityCalendar({ 
  onDateSelect, 
  selectedCheckIn, 
  selectedCheckOut,
  isCollapsed = false,
  isAvailable
}: AvailabilityCalendarProps) {
  const { t, dir } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState<Record<string, AvailabilityData>>({});
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState<[string | null, string | null]>([
    selectedCheckIn || null, 
    selectedCheckOut || null
  ]);
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Fetch availability data
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const requestData = { 
          year: currentDate.getFullYear().toString(),
          month: currentDate.getMonth()
        };
        
        const response = await fetch('/api/calendar-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setAvailabilityData(result.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch availability:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [currentDate]);

  // Update selected dates when props change
  useEffect(() => {
    setSelectedDates([selectedCheckIn || null, selectedCheckOut || null]);
  }, [selectedCheckIn, selectedCheckOut]);

  // Only set initial collapsed state once when component first mounts
  useEffect(() => {
    if (!hasInitialized) {
      // Use isAvailable prop if provided, otherwise fall back to isCollapsed prop
      const shouldCollapse = isAvailable !== undefined ? isAvailable : isCollapsed;
      setCollapsed(shouldCollapse);
      setHasInitialized(true);
    }
  }, [isCollapsed, isAvailable, hasInitialized]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateAvailable = (date: Date) => {
    const dateStr = formatDate(date);
    const data = availabilityData[dateStr];
    let available = false;
    
    if (data) {
      if (typeof data === 'object' && 'available' in data) {
        available = data.available;
      } else if (typeof data === 'boolean') {
        available = data;
      }
    }
    
    return available;
  };

  const getDatePrice = (date: Date) => {
    const dateStr = formatDate(date);
    const data = availabilityData[dateStr];
    if (data && typeof data === 'object' && 'price' in data) {
      return data.price;
    }
    return undefined;
  };

  const isDateWeekend = (date: Date) => {
    const dateStr = formatDate(date);
    const data = availabilityData[dateStr];
    if (data && typeof data === 'object' && 'isWeekend' in data) {
      return data.isWeekend;
    }
    return false;
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date: Date) => {
    const dateStr = formatDate(date);
    return selectedDates[0] === dateStr || selectedDates[1] === dateStr;
  };

  const isDateInRange = (date: Date) => {
    if (!selectedDates[0] || !selectedDates[1]) return false;
    const dateStr = formatDate(date);
    const start = selectedDates[0];
    const end = selectedDates[1];
    return dateStr >= start && dateStr <= end;
  };

  // Function to check if a date range is available using existing calendar data
  const checkDateRangeAvailability = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < diffDays; i++) {
      const checkDate = new Date(start);
      checkDate.setDate(checkDate.getDate() + i);
      const checkDateStr = formatDate(checkDate);
      if (!availabilityData[checkDateStr]?.available) {
        return false;
      }
    }
    return true;
  };

  // Same discount calculation logic as the API
  const calculateDiscountedTotal = (prices: number[]): { original: number, discounted: number } => {
    let original = 0;
    let discounted = 0;
    for (let i = 0; i < prices.length; i++) {
      original += prices[i];
      if (i === 0) {
        discounted += prices[i];
      } else {
        discounted += Math.max(prices[i] - 200, 0);
      }
    }
    return { original, discounted };
  };

  // Function to get all prices for a date range
  const getDateRangePrices = (startDate: string, endDate: string): number[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const prices: number[] = [];
    for (let i = 0; i < diffDays; i++) {
      const checkDate = new Date(start);
      checkDate.setDate(checkDate.getDate() + i);
      const checkDateStr = formatDate(checkDate);
      const price = availabilityData[checkDateStr]?.price;
      if (price) {
        prices.push(price);
      } else {
        // Fallback to default price if not in calendar data
        const isWeekend = checkDate.getDay() === 4 || checkDate.getDay() === 5;
        prices.push(isWeekend ? 1600 : 1200);
      }
    }
    return prices;
  };

  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);
    
    // Check if this date can be selected
    const available = isDateAvailable(date);
    const inPast = isDateInPast(date);
    const canSelect = available || (!inPast && !available && selectedDates[0] && !selectedDates[1] && (() => {
      // Check if this is a valid checkout date (immediately after available dates)
      const checkInDate = new Date(selectedDates[0]);
      const currentDate = new Date(dateStr);
      
      // Only allow checkout dates that come AFTER the check-in date
      if (currentDate <= checkInDate) {
        return false;
      }
      
      const diffDays = Math.round((currentDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Only allow checkout if all dates between check-in and this date are available
      for (let i = 1; i < diffDays; i++) {
        const checkDate = new Date(checkInDate);
        checkDate.setDate(checkDate.getDate() + i);
        const checkDateStr = formatDate(checkDate);
        if (!availabilityData[checkDateStr]?.available) {
          return false; // There's an unavailable date in between
        }
      }
      return true;
    })());
    
    if (inPast || !canSelect) return;
    
    if (!selectedDates[0] || (selectedDates[0] && selectedDates[1])) {
      // Start new selection - only allow available dates for check-in
      if (!available) return;
      setSelectedDates([dateStr, null]);
    } else if (selectedDates[0] && !selectedDates[1]) {
      // Complete selection - use the selected date as checkout
      const start = selectedDates[0];
      const end = dateStr;
      
      if (start === end) {
        // Same date selected, treat as single night
        setSelectedDates([start, end]);
        const isAvailable = checkDateRangeAvailability(start, end);
        const prices = getDateRangePrices(start, end);
        const { original, discounted } = calculateDiscountedTotal(prices);
        const nights = 1;
        onDateSelect?.(start, end, {
          available: isAvailable,
          total: discounted,
          originalTotal: original,
          nights: nights
        });
      } else if (start < end) {
        // Valid range - use the selected date as checkout
        setSelectedDates([start, end]);
        const isAvailable = checkDateRangeAvailability(start, end);
        const prices = getDateRangePrices(start, end);
        const { original, discounted } = calculateDiscountedTotal(prices);
        const nights = Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
        onDateSelect?.(start, end, {
          available: isAvailable,
          total: discounted,
          originalTotal: original,
          nights: nights
        });
      } else {
        // Invalid range, swap dates
        setSelectedDates([end, start]);
        const isAvailable = checkDateRangeAvailability(end, start);
        const prices = getDateRangePrices(end, start);
        const { original, discounted } = calculateDiscountedTotal(prices);
        const nights = Math.round((new Date(start).getTime() - new Date(end).getTime()) / (1000 * 60 * 60 * 24));
        onDateSelect?.(end, start, {
          available: isAvailable,
          total: discounted,
          originalTotal: original,
          nights: nights
        });
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString(dir === 'rtl' ? 'ar' : 'en', { 
    year: 'numeric', 
    month: 'long' 
  });

  // Check if we're on the current month
  const today = new Date();
  const isCurrentMonth = currentDate.getFullYear() === today.getFullYear() && 
                        currentDate.getMonth() === today.getMonth();

  // Check if selected dates are available
  const isSelectedRangeAvailable = isAvailable !== undefined ? isAvailable : (selectedDates[0] && selectedDates[1] && (() => {
    const start = new Date(selectedDates[0]);
    const end = new Date(selectedDates[1]);
    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < diffDays; i++) {
      const checkDate = new Date(start);
      checkDate.setDate(checkDate.getDate() + i);
      const checkDateStr = formatDate(checkDate);
      if (!availabilityData[checkDateStr]?.available) {
        return false;
      }
    }
    return true;
  })());

  const weekdays = dir === 'rtl' 
    ? ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-md w-full">
      {/* Summary Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {selectedDates[0] && selectedDates[1] ? (
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {t('availability.selected')}: {selectedDates[0]} - {selectedDates[1]}
                </div>
                <div className={`text-sm ${isSelectedRangeAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {isSelectedRangeAvailable ? t('availability.available') : t('availability.notAvailable')}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                {t('calendar.selectDates')}
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={collapsed ? t('calendar.expand') : t('calendar.collapse')}
          >
            {collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Calendar Content */}
      {!collapsed && (
        <div className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              disabled={isCurrentMonth}
              className={`p-2 rounded-full transition-colors ${
                isCurrentMonth 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label={t('calendar.previousMonth')}
            >
              {dir === 'rtl' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            <h3 className="text-lg font-semibold text-gray-800">{monthName}</h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
              aria-label={t('calendar.nextMonth')}
            >
              {dir === 'rtl' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: startingDayOfWeek }, (_, i) => (
              <div key={`empty-${i}`} className="h-12" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dateStr = formatDate(date);
              
              const available = isDateAvailable(date);
              const price = getDatePrice(date);
              const isWeekend = isDateWeekend(date);
              const inPast = isDateInPast(date);
              const selected = isDateSelected(date);
              const inRange = isDateInRange(date);

              // Check if this is a checkout-only day (unavailable but can be selected as checkout)
              const isCheckoutOnly = !available && !inPast && selectedDates[0] && !selectedDates[1] && (() => {
                const checkInDate = new Date(selectedDates[0]);
                const currentDate = new Date(dateStr);
                
                // Only allow checkout dates that come AFTER the check-in date
                if (currentDate <= checkInDate) {
                  return false;
                }
                
                const diffDays = Math.round((currentDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
                
                // Check if all dates between check-in and this date are available
                for (let i = 1; i < diffDays; i++) {
                  const checkDate = new Date(checkInDate);
                  checkDate.setDate(checkDate.getDate() + i);
                  const checkDateStr = formatDate(checkDate);
                  if (!availabilityData[checkDateStr]?.available) {
                    return false;
                  }
                }
                return true;
              })();

              // Check if this date can be selected
              const canSelect = available || isCheckoutOnly;

              let bgColor = 'bg-white';
              let textColor = 'text-gray-900';
              let borderColor = 'border-gray-200';

              if (inPast) {
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-400';
              } else if (isCheckoutOnly) {
                bgColor = 'bg-white';
                textColor = 'text-gray-900';
                borderColor = 'border-dashed border-blue-400'; // Special dashed border for checkout-only
              } else if (selected) {
                bgColor = 'bg-blue-500';
                textColor = 'text-white';
                borderColor = 'border-blue-500';
              } else if (!available) {
                bgColor = 'bg-red-100';
                textColor = 'text-red-600';
                borderColor = 'border-red-200';
              } else if (inRange) {
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-700';
                borderColor = 'border-blue-200';
              } else if (isWeekend) {
                bgColor = 'bg-yellow-50';
                textColor = 'text-yellow-800';
                borderColor = 'border-yellow-200';
              }

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(date)}
                  disabled={inPast || !canSelect}
                  className={`
                    h-12 w-full rounded-lg border transition-all duration-200
                    ${bgColor} ${textColor} ${borderColor}
                    ${!inPast && canSelect ? 'hover:bg-blue-50 hover:border-blue-300 cursor-pointer' : 'cursor-not-allowed'}
                    ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                    flex flex-col items-center justify-center text-xs
                  `}
                >
                  <span className="font-medium">{day}</span>
                  {available && price && !inPast && (() => {
                    // Hide price on checkout date if both check-in and check-out are available
                    if (selectedDates[0] && selectedDates[1] && available) {
                      const checkInDate = new Date(selectedDates[0]);
                      const checkOutDate = new Date(selectedDates[1]);
                      const currentDate = new Date(dateStr);
                      
                      // If this is the checkout date and both dates are available, don't show price
                      if (currentDate.getTime() === checkOutDate.getTime()) {
                        const checkInAvailable = availabilityData[selectedDates[0]]?.available;
                        const checkOutAvailable = availabilityData[selectedDates[1]]?.available;
                        if (checkInAvailable && checkOutAvailable) {
                          return null;
                        }
                      }
                    }
                    return <span className="text-xs opacity-75">₪{price}</span>;
                  })()}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded flex-shrink-0"></div>
                <span className="text-gray-600">{t('calendar.available')} ({t('calendar.weekday')})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-yellow-50 border-2 border-yellow-300 rounded flex-shrink-0"></div>
                <span className="text-gray-600">{t('calendar.available')} ({t('calendar.weekend')})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-100 border-2 border-red-300 rounded flex-shrink-0"></div>
                <span className="text-gray-600">{t('calendar.booked')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white border-2 border-dashed border-blue-500 rounded flex-shrink-0"></div>
                <span className="text-gray-600">{t('calendar.checkoutOnly')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded flex-shrink-0"></div>
                <span className="text-gray-600">{t('calendar.selected')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-100 border-2 border-blue-300 rounded flex-shrink-0"></div>
                <span className="text-gray-600">{t('calendar.selectedRange')}</span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-4 text-center text-sm text-gray-500">
              {t('common.loading')}...
            </div>
          )}
        </div>
      )}
    </div>
  );
} 