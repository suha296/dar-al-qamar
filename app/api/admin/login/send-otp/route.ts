import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // MOCK MODE: Always succeed
  return NextResponse.json(
    { message: 'OTP sent successfully (mock)' },
    { status: 200 }
  )
} 