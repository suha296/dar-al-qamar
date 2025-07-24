import { NextRequest, NextResponse } from 'next/server';

// Hardcoded mapping for year to gid (full year tab)
const SHEET_GID_MAP: Record<string, string> = {
  '2025': '1279501681',
};

const SHEET_BASE_URL = 'https://docs.google.com/spreadsheets/d/1Mfzx0rbOe6lr9SVC_VxpS7ZVhudu_zIjKR384tYpU8U/export?format=csv&gid=';

function parseCSV(csv: string) {
  const [headerLine, ...lines] = csv.trim().split('\n');
  const headers = headerLine.split(',').map(h => h.trim());
  return { headers, rows: lines.map(line => {
    const values = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((h, i) => row[h] = (values[i] || '').trim());
    return row;
  }) };
}

function robustParseDate(dateStr: string): string | null {
  if (!dateStr) return null;
  const s = dateStr.trim().replace(/\s+/g, '');
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const dmY = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmY) {
    const [_, d, m, y] = dmY;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  const mdY = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdY) {
    const [_, m, d, y] = mdY;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}

function isWeekend(date: Date) {
  // Thursday (4) or Friday (5) - these are weekend nights
  return date.getDay() === 4 || date.getDay() === 5;
}

function getDefaultPrice(date: Date) {
  return isWeekend(date) ? 1600 : 990;
}

export async function POST(req: NextRequest) {
  try {
    const { year = '2025', month } = await req.json();
    
    // Get the sheet data for the specified year
    const gid = SHEET_GID_MAP[year];
    if (!gid) {
      return NextResponse.json({ error: 'Year not supported' }, { status: 400 });
    }

    const response = await fetch(`${SHEET_BASE_URL}${gid}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }

    const csv = await response.text();
    const { rows } = parseCSV(csv);

    // Filter rows for the specified month if provided
    let filteredRows = rows;
    if (month !== undefined) {
      filteredRows = rows.filter(row => {
        const dateStr = robustParseDate(row['Date']);
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return date.getMonth() === month;
      });
    }

    // Process the data to create availability map
    const availabilityMap: Record<string, {
      available: boolean;
      price?: number;
      guestName?: string;
      isWeekend: boolean;
    }> = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filteredRows.forEach(row => {
      const dateStr = robustParseDate(row['Date']);
      if (!dateStr) return;

      const date = new Date(dateStr);
      if (date < today) return; // Skip past dates

      const guestName = row['Name']?.trim() || '';
      const isBooked = guestName !== '';
      
      let price = 0;
      const parsedPrice = parseFloat((row['Price'] || '').replace(/[^\d.]/g, ''));
      if (!isNaN(parsedPrice) && parsedPrice >= 100) {
        price = parsedPrice;
      } else {
        price = getDefaultPrice(date);
      }

      availabilityMap[dateStr] = {
        available: !isBooked,
        price: isBooked ? undefined : price,
        guestName: isBooked ? guestName : undefined,
        isWeekend: isWeekend(date)
      };
    });

    // Get next 3 months of availability if no specific month requested
    let calendarData = availabilityMap;
    if (month === undefined) {
      const next3Months = new Map();
      const currentDate = new Date();
      
      for (let i = 0; i < 3; i++) {
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        const monthKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
        
        // Filter data for this month
        const monthData: Record<string, any> = {};
        Object.entries(availabilityMap).forEach(([date, data]) => {
          if (date.startsWith(monthKey)) {
            monthData[date] = data;
          }
        });
        
        next3Months.set(monthKey, monthData);
      }
      
      calendarData = Object.fromEntries(next3Months);
    }

    return NextResponse.json({
      success: true,
      data: calendarData,
      year,
      month
    });

  } catch (error) {
    console.error('Calendar availability error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar availability' },
      { status: 500 }
    );
  }
} 