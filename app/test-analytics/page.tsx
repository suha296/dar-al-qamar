'use client';
import { useEffect, useState } from 'react';
import { track } from '@vercel/analytics';

export default function TestAnalyticsPage() {
  const [eventsSent, setEventsSent] = useState(0);
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    // Check if we're on localhost
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    setIsLocalhost(isLocal);

    // Generate test events
    const generateTestEvents = async () => {
      console.log('Generating test analytics events...');
      console.log('Environment:', isLocal ? 'Localhost (may not work)' : 'Production');
      
      let eventCount = 0;
      
      try {
        // Test page view
        track('main_page_view', {
          page: '/test-analytics',
          timestamp: new Date().toISOString()
        });
        eventCount++;
        console.log('✅ main_page_view sent');

        // Test calendar search
        track('calendar_search', {
          checkIn: '2024-01-15',
          checkOut: '2024-01-20',
          source: 'test_page'
        });
        eventCount++;
        console.log('✅ calendar_search sent');

        // Test availability results
        track('availability_available', {
          checkIn: '2024-01-15',
          checkOut: '2024-01-20',
          available: true
        });
        eventCount++;
        console.log('✅ availability_available sent');

        // Test WhatsApp click
        track('whatsapp_click', {
          page: '/test-analytics',
          buttonType: 'reservation'
        });
        eventCount++;
        console.log('✅ whatsapp_click sent');

        // Test language switch
        track('language_switch', {
          from: 'en',
          to: 'ar'
        });
        eventCount++;
        console.log('✅ language_switch sent');

        setEventsSent(eventCount);
        console.log(`🎉 ${eventCount} test events generated!`);

        if (isLocal) {
          console.warn('⚠️  Note: Analytics may not work properly on localhost');
          console.warn('💡 Deploy to Vercel to test with real analytics');
        }

      } catch (error) {
        console.error('❌ Error generating events:', error);
      }
    };

    generateTestEvents();
  }, []);

  const triggerManualEvents = () => {
    let manualCount = 0;
    
    try {
      // Manual event triggers
      track('main_page_view', {
        page: '/test-analytics',
        timestamp: new Date().toISOString()
      });
      manualCount++;

      track('calendar_search', {
        checkIn: '2024-01-25',
        checkOut: '2024-01-30',
        source: 'manual_test'
      });
      manualCount++;

      track('whatsapp_click', {
        page: '/test-analytics',
        buttonType: 'manual_test'
      });
      manualCount++;

      setEventsSent(prev => prev + manualCount);
      console.log(`🎉 ${manualCount} manual events triggered!`);
    } catch (error) {
      console.error('❌ Error triggering manual events:', error);
    }
  };

  const testApiEndpoint = async () => {
    try {
      console.log('🔍 Testing analytics API endpoint...');
      const response = await fetch('/api/analytics?days=7');
      const data = await response.json();
      console.log('📊 API Response:', data);
      
      if (data.success) {
        console.log('✅ API endpoint working correctly');
        console.log('📈 Data found:', data.data.hasData ? 'Yes' : 'No');
        console.log('📝 Message:', data.message);
      } else {
        console.error('❌ API endpoint error:', data.error);
      }
    } catch (error) {
      console.error('❌ API endpoint failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Analytics Test Page
        </h1>

        {isLocalhost && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="text-yellow-800">
              <h3 className="font-semibold mb-2">⚠️ Local Development Notice</h3>
              <p className="text-sm">
                You're running on localhost. Vercel Analytics may not work properly in local development.
                For best results, deploy to Vercel and test there.
              </p>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Events Generated</h2>
          <p className="text-gray-600 mb-4">
            This page automatically generates test analytics events when loaded.
            Check the browser console for confirmation.
          </p>
          
          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <div>✅ main_page_view</div>
            <div>✅ calendar_search</div>
            <div>✅ availability_available</div>
            <div>✅ whatsapp_click</div>
            <div>✅ language_switch</div>
          </div>

          <div className="text-sm text-gray-600">
            <strong>Events sent:</strong> {eventsSent}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Manual Testing</h2>
          <div className="space-y-4">
            <button
              onClick={triggerManualEvents}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
            >
              Trigger More Events
            </button>
            
            <button
              onClick={testApiEndpoint}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test API Endpoint
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Check browser console for event confirmations</li>
            <li>Click "Test API Endpoint" to verify the analytics API</li>
            <li>Wait 2-3 minutes for events to be processed (if on production)</li>
            <li>Visit your analytics dashboard at: 
              <code className="bg-gray-100 px-2 py-1 rounded ml-2">
                /analytics_0526003409_010495_Sus_38_dar_bezu
              </code>
            </li>
            <li>If on localhost, deploy to Vercel for full testing</li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-blue-800 mb-2">🔍 Debugging Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Open browser console (F12) to see event confirmations</li>
            <li>• Check Network tab for analytics requests</li>
            <li>• Vercel Analytics works best on HTTPS (production)</li>
            <li>• Events may take 2-3 minutes to appear in dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 