import { track } from '@vercel/analytics';

// Analytics event types for conversion tracking
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

// Conversion funnel events
export const ANALYTICS_EVENTS = {
  // Page Views
  PAGE_VIEW: 'page_view',
  MAIN_PAGE_VIEW: 'main_page_view',
  AVAILABILITY_PAGE_VIEW: 'availability_page_view',
  
  // Calendar Interactions
  CALENDAR_OPEN: 'calendar_open',
  CALENDAR_DATE_SELECT: 'calendar_date_select',
  CALENDAR_SEARCH: 'calendar_search',
  
  // Availability Results
  AVAILABILITY_RESULT: 'availability_result',
  AVAILABILITY_AVAILABLE: 'availability_available',
  AVAILABILITY_NOT_AVAILABLE: 'availability_not_available',
  
  // CTA Interactions
  CTA_CLICK: 'cta_click',
  WHATSAPP_CLICK: 'whatsapp_click',
  RESERVE_BUTTON_CLICK: 'reserve_button_click',
  
  // Alternative Suggestions
  ALTERNATIVE_VIEW: 'alternative_view',
  ALTERNATIVE_CLICK: 'alternative_click',
  EXTRA_NIGHT_SUGGESTION_CLICK: 'extra_night_suggestion_click',
  
  // User Journey
  USER_JOURNEY_START: 'user_journey_start',
  USER_JOURNEY_COMPLETE: 'user_journey_complete',
  
  // Language & Device
  LANGUAGE_SWITCH: 'language_switch',
  DEVICE_TYPE: 'device_type',
  
  // Error Tracking
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
} as const;

// Analytics tracking function
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  try {
    // Add timestamp and session info
    const eventData = {
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      ...properties,
    };
    
    // Track with Vercel Analytics
    track(eventName, eventData);
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', eventName, eventData);
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

// Session management
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Conversion funnel tracking functions
export const ConversionTracker = {
  // Track main page view
  trackMainPageView: () => {
    trackEvent(ANALYTICS_EVENTS.MAIN_PAGE_VIEW, {
      page: 'main',
      language: document.documentElement.lang || 'ar',
      direction: document.documentElement.dir || 'rtl',
    });
  },

  // Track calendar interactions
  trackCalendarOpen: (source: 'main_page' | 'availability_page') => {
    trackEvent(ANALYTICS_EVENTS.CALENDAR_OPEN, {
      source,
      timestamp: new Date().toISOString(),
    });
  },

  trackCalendarDateSelect: (checkIn: string, checkOut: string, source: 'main_page' | 'availability_page') => {
    const nights = calculateNights(checkIn, checkOut);
    trackEvent(ANALYTICS_EVENTS.CALENDAR_DATE_SELECT, {
      checkIn,
      checkOut,
      nights,
      source,
      timestamp: new Date().toISOString(),
    });
  },

  trackCalendarSearch: (checkIn: string, checkOut: string, source: 'main_page' | 'availability_page') => {
    const nights = calculateNights(checkIn, checkOut);
    trackEvent(ANALYTICS_EVENTS.CALENDAR_SEARCH, {
      checkIn,
      checkOut,
      nights,
      source,
      timestamp: new Date().toISOString(),
    });
  },

  // Track availability results
  trackAvailabilityResult: (checkIn: string, checkOut: string, available: boolean, total?: number, nights?: number) => {
    trackEvent(ANALYTICS_EVENTS.AVAILABILITY_RESULT, {
      checkIn,
      checkOut,
      available,
      total,
      nights,
      timestamp: new Date().toISOString(),
    });

    // Track specific availability status
    if (available) {
      trackEvent(ANALYTICS_EVENTS.AVAILABILITY_AVAILABLE, {
        checkIn,
        checkOut,
        total,
        nights,
        timestamp: new Date().toISOString(),
      });
    } else {
      trackEvent(ANALYTICS_EVENTS.AVAILABILITY_NOT_AVAILABLE, {
        checkIn,
        checkOut,
        nights,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // Track CTA clicks
  trackCtaClick: (ctaType: 'whatsapp' | 'reserve', checkIn?: string, checkOut?: string, total?: number) => {
    trackEvent(ANALYTICS_EVENTS.CTA_CLICK, {
      ctaType,
      checkIn,
      checkOut,
      total,
      timestamp: new Date().toISOString(),
    });

    // Track specific CTA type
    if (ctaType === 'whatsapp') {
      trackEvent(ANALYTICS_EVENTS.WHATSAPP_CLICK, {
        checkIn,
        checkOut,
        total,
        timestamp: new Date().toISOString(),
      });
    } else if (ctaType === 'reserve') {
      trackEvent(ANALYTICS_EVENTS.RESERVE_BUTTON_CLICK, {
        checkIn,
        checkOut,
        total,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // Track alternative suggestions
  trackAlternativeView: (alternativeType: 'same_day_pattern' | 'other_options' | 'extra_night', count: number) => {
    trackEvent(ANALYTICS_EVENTS.ALTERNATIVE_VIEW, {
      alternativeType,
      count,
      timestamp: new Date().toISOString(),
    });
  },

  trackAlternativeClick: (alternativeType: 'same_day_pattern' | 'other_options' | 'extra_night', checkIn: string, checkOut: string, total: number) => {
    trackEvent(ANALYTICS_EVENTS.ALTERNATIVE_CLICK, {
      alternativeType,
      checkIn,
      checkOut,
      total,
      timestamp: new Date().toISOString(),
    });

    if (alternativeType === 'extra_night') {
      trackEvent(ANALYTICS_EVENTS.EXTRA_NIGHT_SUGGESTION_CLICK, {
        checkIn,
        checkOut,
        total,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // Track user journey
  trackUserJourneyStart: () => {
    trackEvent(ANALYTICS_EVENTS.USER_JOURNEY_START, {
      timestamp: new Date().toISOString(),
    });
  },

  trackUserJourneyComplete: (journeySteps: string[], totalTime: number) => {
    trackEvent(ANALYTICS_EVENTS.USER_JOURNEY_COMPLETE, {
      journeySteps,
      totalTime,
      timestamp: new Date().toISOString(),
    });
  },

  // Track language switches
  trackLanguageSwitch: (fromLanguage: string, toLanguage: string) => {
    trackEvent(ANALYTICS_EVENTS.LANGUAGE_SWITCH, {
      fromLanguage,
      toLanguage,
      timestamp: new Date().toISOString(),
    });
  },

  // Track errors
  trackError: (errorType: string, errorMessage: string, context?: Record<string, any>) => {
    trackEvent(ANALYTICS_EVENTS.ERROR_OCCURRED, {
      errorType,
      errorMessage,
      context,
      timestamp: new Date().toISOString(),
    });
  },

  trackApiError: (endpoint: string, errorMessage: string, statusCode?: number) => {
    trackEvent(ANALYTICS_EVENTS.API_ERROR, {
      endpoint,
      errorMessage,
      statusCode,
      timestamp: new Date().toISOString(),
    });
  },
};

// Helper function to calculate nights between dates
function calculateNights(checkIn: string, checkOut: string): number {
  try {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    return 0;
  }
}

// User journey tracking
export class UserJourneyTracker {
  private startTime: number;
  private steps: string[] = [];

  constructor() {
    this.startTime = Date.now();
    this.trackStep('journey_started');
  }

  trackStep(step: string) {
    this.steps.push(step);
    trackEvent('journey_step', {
      step,
      stepNumber: this.steps.length,
      timestamp: new Date().toISOString(),
    });
  }

  completeJourney() {
    const totalTime = Date.now() - this.startTime;
    ConversionTracker.trackUserJourneyComplete(this.steps, totalTime);
  }
}

// Initialize journey tracking
export function initializeJourneyTracking() {
  if (typeof window !== 'undefined') {
    const journeyTracker = new UserJourneyTracker();
    (window as any).journeyTracker = journeyTracker;
    
    // Track page view
    ConversionTracker.trackMainPageView();
    
    // Track device type
    trackEvent(ANALYTICS_EVENTS.DEVICE_TYPE, {
      deviceType: getDeviceType(),
      userAgent: navigator.userAgent,
    });
  }
}

// Helper function to get device type
function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return 'mobile';
  } else if (/iPad/i.test(userAgent)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

// Export default tracking function
export default trackEvent; 