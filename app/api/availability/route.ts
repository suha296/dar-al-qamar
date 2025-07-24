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

function dateRangeNights(start: string, end: string) {
  const result: Date[] = [];
  let current = new Date(start);
  const last = new Date(end);
  // The end date is the checkout date (day they leave), not a night they stay
  // So we include all nights from start up to (but not including) the end date
  while (current < last) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return result;
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

function getDayName(date: Date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

function getDefaultPrice(date: Date) {
  return isWeekend(date) ? 1600 : 990;
}

function calculateDiscountedTotal(prices: number[]): { original: number, discounted: number } {
  let original = 0;
  let discounted = 0;
  for (let i = 0; i < prices.length; i++) {
    original += prices[i];
    discounted += prices[i]; // No discount for extra nights
  }
  return { original, discounted };
}

function findNearbyAlternatives(rows: any[], checkIn: string, nightsRequested: number): { start: string, end: string, nights: number, total: number, originalTotal: number }[] {
  const alternatives: { start: string, end: string, nights: number, total: number, originalTotal: number, distance: number }[] = [];
  const checkInDate = new Date(checkIn);
  const today = new Date();
  today.setHours(0,0,0,0);
  for (let n = 1; n <= 2; n++) {
    for (let i = 0; i <= rows.length - n; i++) {
      let ok = true;
      let prices: number[] = [];
      const startISO = robustParseDate(rows[i]['Date']);
      if (!startISO) continue;
      const startDateObj = new Date(startISO);
      if (startDateObj < today) continue; // Only suggest from today and up
      for (let j = 0; j < n; j++) {
        const row = rows[i + j];
        if (!row || (row['Name'] && row['Name'].trim() !== '')) {
          ok = false;
          break;
        }
        const d = robustParseDate(row['Date']);
        const dateObj = d ? new Date(d) : null;
        let price = 0;
        const parsedPrice = parseFloat((row['Price'] || '').replace(/[^\d.]/g, ''));
        if (!isNaN(parsedPrice) && parsedPrice >= 100) {
          price = parsedPrice;
        } else if (dateObj) {
          price = getDefaultPrice(dateObj);
        } else {
          price = 1200;
        }
        prices.push(price);
      }
      if (ok) {
        let endISO = '';
        const endDate = new Date(startISO);
        endDate.setDate(endDate.getDate() + n);
        endISO = endDate.toISOString().slice(0, 10);
        const altDate = new Date(startISO);
        const distance = Math.abs(altDate.getTime() - checkInDate.getTime());
        const { original, discounted } = calculateDiscountedTotal(prices);
        alternatives.push({ start: startISO, end: endISO, nights: n, total: discounted, originalTotal: original, distance });
      }
    }
  }
  alternatives.sort((a, b) => a.distance - b.distance || b.nights - a.nights);
  const unique: { start: string, end: string, nights: number, total: number, originalTotal: number }[] = [];
  const seen = new Set();
  for (const alt of alternatives) {
    const key = alt.start + '-' + alt.end;
    if (!seen.has(key)) {
      unique.push({ start: alt.start, end: alt.end, nights: alt.nights, total: alt.total, originalTotal: alt.originalTotal });
      seen.add(key);
    }
    if (unique.length >= 3) break;
  }
  return unique;
}

function findSameDayPatternAlternatives(rows: any[], checkIn: string, checkOut: string): { start: string, end: string, nights: number, total: number, originalTotal: number }[] {
  const alternatives: { start: string, end: string, nights: number, total: number, originalTotal: number, distance: number }[] = [];
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nightsRequested = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const today = new Date();
  today.setHours(0,0,0,0);
  // Get the day of week for check-in (0 = Sunday, 1 = Monday, etc.)
  const targetDayOfWeek = checkInDate.getDay();
  for (let i = 0; i <= rows.length - nightsRequested; i++) {
    let ok = true;
    let prices: number[] = [];
    const potentialStartDate = robustParseDate(rows[i]['Date']);
    if (!potentialStartDate) continue;
    const potentialStartDateObj = new Date(potentialStartDate);
    if (potentialStartDateObj.getDay() !== targetDayOfWeek) continue;
    if (potentialStartDateObj < today) continue; // Only suggest from today and up
    for (let j = 0; j < nightsRequested; j++) {
      const row = rows[i + j];
      if (!row || (row['Name'] && row['Name'].trim() !== '')) {
        ok = false;
        break;
      }
      const d = robustParseDate(row['Date']);
      const dateObj = d ? new Date(d) : null;
      let price = 0;
      const parsedPrice = parseFloat((row['Price'] || '').replace(/[^\d.]/g, ''));
      if (!isNaN(parsedPrice) && parsedPrice >= 100) {
        price = parsedPrice;
      } else if (dateObj) {
        price = getDefaultPrice(dateObj);
      } else {
        price = 1200;
      }
      prices.push(price);
    }
    if (ok) {
      const startISO = robustParseDate(rows[i]['Date']);
      if (!startISO) continue;
      let endISO = '';
      const endDate = new Date(startISO);
      endDate.setDate(endDate.getDate() + nightsRequested);
      endISO = endDate.toISOString().slice(0, 10);
      const altDate = new Date(startISO);
      const distance = Math.abs(altDate.getTime() - checkInDate.getTime());
      const { original, discounted } = calculateDiscountedTotal(prices);
      alternatives.push({ 
        start: startISO, 
        end: endISO, 
        nights: nightsRequested, 
        total: discounted, 
        originalTotal: original, 
        distance 
      });
    }
  }
  alternatives.sort((a, b) => a.distance - b.distance);
  const unique: { start: string, end: string, nights: number, total: number, originalTotal: number }[] = [];
  const seen = new Set();
  for (const alt of alternatives) {
    const key = alt.start + '-' + alt.end;
    if (!seen.has(key)) {
      unique.push({ 
        start: alt.start, 
        end: alt.end, 
        nights: alt.nights, 
        total: alt.total, 
        originalTotal: alt.originalTotal 
      });
      seen.add(key);
    }
    if (unique.length >= 2) break;
  }
  return unique;
}

export async function POST(req: NextRequest) {
  const { checkIn, checkOut } = await req.json();
  // console.log('[API] Received:', { checkIn, checkOut });
  // Convention: check-in is the first night, check-out is the day the guest leaves (not a night spent)
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nightsCount = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  // console.log('[API] Calculated nights:', nightsCount, 'from', checkInDate.toISOString(), 'to', checkOutDate.toISOString());
  const year = checkInDate.getFullYear();
  const sheetName = `${year}`;
  const gid = SHEET_GID_MAP[sheetName];

  // Use dateRangeNights to get the actual nights to check (should be nightsCount nights, starting from checkIn)
  const nights = dateRangeNights(checkIn, checkOut);
  // console.log('[API] Nights array:', nights.map(d => d.toISOString().slice(0, 10)));

  let available = true;
  let prices: number[] = [];
  let alternatives: { start: string, end: string, nights: number, total: number, originalTotal: number }[] = [];
  let sameDayPatternAlternatives: { start: string, end: string, nights: number, total: number, originalTotal: number }[] = [];
  let extraNightSuggestion: null | {
    start: string,
    end: string,
    nights: number,
    total: number,
    originalTotal: number,
  } = null;

  // console.log(`Checking availability for ${nights.length} nights from ${checkIn} to ${checkOut}`);
  // console.log(`Sheet name: ${sheetName}, GID: ${gid || 'none'}`);

  if (gid) {
    try {
      const res = await fetch(SHEET_BASE_URL + gid, {
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (!res.ok) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
      }
      const csv = await res.text();
      if (csv.includes('<HTML>') || csv.includes('<html>')) {
        return NextResponse.json({ error: 'Invalid data format received' }, { status: 500 });
      }
      const { rows } = parseCSV(csv);
      for (const d of nights) {
        const normD = d.toISOString().slice(0, 10);
        const dayName = getDayName(d);
        const isWeekendNight = isWeekend(d);
        const row = rows.find(r => robustParseDate(r['Date']) === normD);
        let price = getDefaultPrice(d);
        if (!row) {
          prices.push(price);
          // console.log(`${normD} (${dayName}): No data found, using default price ${price} NIS`);
          continue;
        }
        if (row['Name'] && row['Name'].trim() !== '') {
          available = false;
          // console.log(`${normD} (${dayName}): Not available, Name: "${row['Name']}"`);
          break;
        }
        const parsedPrice = parseFloat((row['Price'] || '').replace(/[^\d.]/g, ''));
        if (!isNaN(parsedPrice) && parsedPrice >= 100) {
          price = parsedPrice;
          prices.push(price);
          // console.log(`${normD} (${dayName}): Using sheet price ${price} NIS`);
        } else {
          prices.push(price);
          // console.log(`${normD} (${dayName}): Invalid or missing sheet price, using default ${price} NIS`);
        }
      }
      // If not available, use the same full-year rows for alternatives
      if (!available) {
        alternatives = findNearbyAlternatives(rows, checkIn, nights.length);
        sameDayPatternAlternatives = findSameDayPatternAlternatives(rows, checkIn, checkOut);
      } else {
        // Suggest extra night before or after if available
        const today = new Date();
        today.setHours(0,0,0,0);
        // Check before
        const beforeDate = new Date(checkIn);
        beforeDate.setDate(beforeDate.getDate() - 1);
        const beforeISO = beforeDate.toISOString().slice(0, 10);
        if (beforeDate >= today) {
          const beforeRow = rows.find(r => robustParseDate(r['Date']) === beforeISO);
          if (beforeRow && (!beforeRow['Name'] || beforeRow['Name'].trim() === '')) {
            let extraNightOriginal = getDefaultPrice(beforeDate);
            const parsedPrice = parseFloat((beforeRow['Price'] || '').replace(/[^\d.]/g, ''));
            if (!isNaN(parsedPrice) && parsedPrice >= 100) {
              extraNightOriginal = parsedPrice;
            }
            const allNightsPrices = [...prices, extraNightOriginal];
            const { original: newOriginalTotal, discounted: newTotal } = calculateDiscountedTotal(allNightsPrices);
            // If all nights are midweek, set originalTotal to 1200 * nights and total to 990 * nights
            let finalOriginal = newOriginalTotal;
            let finalTotal = newTotal;
            if (allNightsPrices.length > 1 && allNightsPrices.every(p => p === 990)) {
              finalOriginal = 1200 * allNightsPrices.length;
              finalTotal = 990 * allNightsPrices.length;
            }
            extraNightSuggestion = {
              start: beforeISO,
              end: checkOut,
              nights: nights.length + 1,
              total: finalTotal,
              originalTotal: finalOriginal,
            };
          }
        }
        // Check after (only if not already suggested before)
        if (!extraNightSuggestion) {
          const afterDate = new Date(checkOut);
          const afterISO = afterDate.toISOString().slice(0, 10);
          const afterRow = rows.find(r => robustParseDate(r['Date']) === afterISO);
          if (afterRow && (!afterRow['Name'] || afterRow['Name'].trim() === '')) {
            let extraNightOriginal = getDefaultPrice(afterDate);
            const parsedPrice = parseFloat((afterRow['Price'] || '').replace(/[^\d.]/g, ''));
            if (!isNaN(parsedPrice) && parsedPrice >= 100) {
              extraNightOriginal = parsedPrice;
            }
            const allNightsPrices = [...prices, extraNightOriginal];
            const { original: newOriginalTotal, discounted: newTotal } = calculateDiscountedTotal(allNightsPrices);
            // If all nights are midweek, set originalTotal to 1200 * nights and total to 990 * nights
            let finalOriginal = newOriginalTotal;
            let finalTotal = newTotal;
            if (allNightsPrices.length > 1 && allNightsPrices.every(p => p === 990)) {
              finalOriginal = 1200 * allNightsPrices.length;
              finalTotal = 990 * allNightsPrices.length;
            }
            // The new end should be one day after the original checkOut
            const newEndDate = new Date(checkOut);
            newEndDate.setDate(newEndDate.getDate() + 1);
            const newEndISO = newEndDate.toISOString().slice(0, 10);
            extraNightSuggestion = {
              start: checkIn,
              end: newEndISO,
              nights: nights.length + 1,
              total: finalTotal,
              originalTotal: finalOriginal,
            };
          }
        }
      }
    } catch (error) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  } else {
    for (const d of nights) {
      prices.push(getDefaultPrice(d));
      // console.log(`${d.toISOString().slice(0, 10)} (${getDayName(d)}): No sheet, using default ${getDefaultPrice(d)} NIS`);
    }
  }

  const { original, discounted } = calculateDiscountedTotal(prices);

  // If it's a single midweek night, set originalTotal to 1200 and total to 990
  let finalOriginal = original;
  let finalDiscounted = discounted;
  if (nights.length === 1) {
    const d = nights[0];
    if (!isWeekend(d)) {
      finalOriginal = 1200;
      finalDiscounted = 990;
    }
  } else if (nights.length > 1 && prices.every(p => p === 990)) {
    // All nights are midweek
    finalOriginal = 1200 * nights.length;
    finalDiscounted = 990 * nights.length;
  }

  // console.log(`Final result: available=${available}, total=${discounted}, originalTotal=${original}, nights=${nights.length}`);

  // Normalize checkIn and checkOut to YYYY-MM-DD
  const normCheckIn = robustParseDate(checkIn) || checkIn;
  const normCheckOut = robustParseDate(checkOut) || checkOut;

  // Helper to normalize date to YYYY-MM-DD
  function toYMD(dateStr: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return '';
  }

  // Helper to calculate original and sale prices for a range
  function getOriginalAndSale(prices: number[]): { original: number, sale: number } {
    if (prices.length > 0 && prices.every(p => p === 990)) {
      return { original: 1200 * prices.length, sale: 990 * prices.length };
    } else if (prices.length > 0 && prices.every(p => p === 1600)) {
      return { original: 1600 * prices.length, sale: 1600 * prices.length };
    } else {
      // Mixed: original is 1200 for midweek, 1600 for weekend; sale is 990 for midweek, 1600 for weekend
      let original = 0;
      let sale = 0;
      for (const p of prices) {
        if (p === 990) {
          original += 1200;
          sale += 990;
        } else if (p === 1600) {
          original += 1600;
          sale += 1600;
        } else {
          original += p;
          sale += p;
        }
      }
      return { original, sale };
    }
  }

  // Patch alternatives and sameDayPatternAlternatives
  function patchAlternatives(alts: any[]): any[] {
    return alts.map(alt => {
      // Reconstruct the date range
      const start = new Date(alt.start);
      const end = new Date(alt.end);
      const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      let prices: number[] = [];
      for (let i = 0; i < nights; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        prices.push(getDefaultPrice(d));
      }
      let original, sale;
      if (nights === 1 && prices[0] === 990) {
        original = 1200;
        sale = 990;
      } else {
        const res = getOriginalAndSale(prices);
        original = res.original;
        sale = res.sale;
      }
      return { ...alt, originalTotal: original, total: sale };
    });
  }

  // Patch alternatives before returning
  const patchedAlternatives = patchAlternatives(alternatives);
  const patchedSameDayPatternAlternatives = patchAlternatives(sameDayPatternAlternatives);

  return NextResponse.json({
    available,
    total: finalDiscounted,
    originalTotal: finalOriginal,
    nights: nights.length,
    checkIn: toYMD(normCheckIn),
    checkOut: toYMD(normCheckOut),
    alternatives: patchedAlternatives.map(a => ({ ...a, start: toYMD(a.start), end: toYMD(a.end) })),
    sameDayPatternAlternatives: patchedSameDayPatternAlternatives.map(a => ({ ...a, start: toYMD(a.start), end: toYMD(a.end) })),
    extraNightSuggestion: extraNightSuggestion ? { ...extraNightSuggestion, start: toYMD(extraNightSuggestion.start), end: toYMD(extraNightSuggestion.end) } : null
  });
} 