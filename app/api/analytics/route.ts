import { NextRequest, NextResponse } from 'next/server';

// Vercel Analytics API endpoint
const VERCEL_ANALYTICS_API = 'https://vercel.com/api/web/insights/query';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') || '30';
    
    // TEMPORARY: Hardcode for local testing
    const projectId = process.env.VERCEL_PROJECT_ID;
    const teamId = process.env.VERCEL_TEAM_ID;
    const token = process.env.VERCEL_TOKEN;

    // Check if we're in development
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Debug logging
    console.log('Analytics API Debug:', {
      projectId: projectId ? 'Set' : 'Not set',
      teamId: teamId ? 'Set' : 'Not set',
      token: token ? 'Set' : 'Not set',
      days,
      environment: isDevelopment ? 'Development' : 'Production'
    });

    if (!projectId) {
      return NextResponse.json(
        { error: 'VERCEL_PROJECT_ID not configured' },
        { status: 500 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: 'VERCEL_TOKEN not configured' },
        { status: 500 }
      );
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    console.log('Date range:', {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    });

    // Query for different event types
    const eventQueries = [
      'main_page_view',
      'availability_page_view',
      'calendar_search',
      'availability_result',
      'availability_available',
      'availability_not_available',
      'whatsapp_click',
      'reserve_button_click',
      'alternative_click',
      'language_switch'
    ];

    const analyticsData: any = {
      pageViews: 0,
      calendarSearches: 0,
      availabilityResults: {
        available: 0,
        notAvailable: 0,
      },
      ctaClicks: {
        whatsapp: 0,
        reserve: 0,
      },
      alternativeClicks: {
        sameDayPattern: 0,
        otherOptions: 0,
        extraNight: 0,
      },
      languageSwitches: 0,
      conversionRates: {
        searchToResult: 0,
        resultToCta: 0,
        ctaToWhatsApp: 0,
      },
      events: [],
      timeSeries: [],
      hasData: false
    };

    let eventsFound = 0;
    let apiErrors = 0;

    // Fetch data for each event type
    for (const eventName of eventQueries) {
      try {
        const requestBody = {
          projectId,
          teamId,
          query: {
            event: eventName,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            granularity: 'day'
          }
        };

        console.log(`Fetching ${eventName}:`, requestBody);

        const response = await fetch(VERCEL_ANALYTICS_API, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        console.log(`${eventName} response status:`, response.status);

        if (response.ok) {
          const data = await response.json();
          console.log(`${eventName} data:`, data);
          
          // Process the data based on event type
          if (data.data && data.data.length > 0) {
            const totalCount = data.data.reduce((sum: number, item: any) => sum + (item.count || 0), 0);
            eventsFound++;
            
            switch (eventName) {
              case 'main_page_view':
              case 'availability_page_view':
                analyticsData.pageViews += totalCount;
                break;
              case 'calendar_search':
                analyticsData.calendarSearches = totalCount;
                break;
              case 'availability_available':
                analyticsData.availabilityResults.available = totalCount;
                break;
              case 'availability_not_available':
                analyticsData.availabilityResults.notAvailable = totalCount;
                break;
              case 'whatsapp_click':
                analyticsData.ctaClicks.whatsapp = totalCount;
                break;
              case 'reserve_button_click':
                analyticsData.ctaClicks.reserve = totalCount;
                break;
              case 'language_switch':
                analyticsData.languageSwitches = totalCount;
                break;
              case 'alternative_click':
                // This will be processed separately to get breakdown
                break;
            }

            // Store time series data
            analyticsData.timeSeries.push({
              event: eventName,
              data: data.data
            });
          } else {
            console.log(`${eventName}: No data found`);
          }
        } else {
          const errorText = await response.text();
          console.error(`${eventName} error:`, response.status, errorText);
          apiErrors++;
        }
      } catch (error) {
        console.error(`Error fetching ${eventName}:`, error);
        apiErrors++;
      }
    }

    // Calculate conversion rates
    const totalResults = analyticsData.availabilityResults.available + analyticsData.availabilityResults.notAvailable;
    const totalCtaClicks = analyticsData.ctaClicks.whatsapp + analyticsData.ctaClicks.reserve;

    analyticsData.conversionRates = {
      searchToResult: analyticsData.calendarSearches > 0 ? (totalResults / analyticsData.calendarSearches) * 100 : 0,
      resultToCta: totalResults > 0 ? (totalCtaClicks / totalResults) * 100 : 0,
      ctaToWhatsApp: totalCtaClicks > 0 ? (analyticsData.ctaClicks.whatsapp / totalCtaClicks) * 100 : 0,
    };

    // Fetch alternative clicks breakdown
    try {
      const alternativeResponse = await fetch(VERCEL_ANALYTICS_API, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          teamId,
          query: {
            event: 'alternative_click',
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            granularity: 'day',
            groupBy: ['alternativeType']
          }
        })
      });

      if (alternativeResponse.ok) {
        const alternativeData = await alternativeResponse.json();
        if (alternativeData.data) {
          alternativeData.data.forEach((item: any) => {
            const alternativeType = item.alternativeType;
            const count = item.count || 0;
            
            switch (alternativeType) {
              case 'same_day_pattern':
                analyticsData.alternativeClicks.sameDayPattern = count;
                break;
              case 'other_options':
                analyticsData.alternativeClicks.otherOptions = count;
                break;
              case 'extra_night':
                analyticsData.alternativeClicks.extraNight = count;
                break;
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching alternative clicks:', error);
    }

    analyticsData.hasData = eventsFound > 0;

    console.log('Final analytics data:', analyticsData);
    console.log(`Summary: ${eventsFound} events found, ${apiErrors} API errors`);

    let message = '';
    if (eventsFound > 0) {
      message = `Found ${eventsFound} event types with data`;
    } else if (apiErrors > 0) {
      message = `No data found. ${apiErrors} API errors occurred. This is normal for local development.`;
    } else {
      message = 'No analytics events found yet. Visit /test-analytics to generate test data.';
    }

    if (isDevelopment) {
      message += ' (Development mode - analytics may be limited)';
    }

    return NextResponse.json({
      success: true,
      data: analyticsData,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days: parseInt(days)
      },
      message,
      debug: {
        environment: isDevelopment ? 'development' : 'production',
        eventsFound,
        apiErrors,
        projectId: projectId ? 'configured' : 'not_configured'
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
} 