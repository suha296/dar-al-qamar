import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // MOCK MODE: Always succeed and set a mock auth cookie
  const response = NextResponse.json(
    { message: 'Login successful (mock)' },
    { status: 200 }
  )
  response.cookies.set('auth-token', 'mock-token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
  })
  return response
} 