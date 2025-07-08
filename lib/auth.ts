import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

export interface ManagerSession {
  id: string
  phoneNumber: string
  name: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: ManagerSession): string {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET!, { expiresIn: '7d' })
}

export function verifyToken(token: string): ManagerSession | null {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET!) as ManagerSession
  } catch {
    return null
  }
}

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Create OTP record in database
export async function createOTP(phoneNumber: string): Promise<string> {
  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  await prisma.oTP.create({
    data: {
      phoneNumber,
      code: otp,
      expiresAt,
    },
  })

  return otp
}

// Verify OTP
export async function verifyOTP(phoneNumber: string, code: string): Promise<boolean> {
  const otpRecord = await prisma.oTP.findFirst({
    where: {
      phoneNumber,
      code,
      isUsed: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  })

  if (!otpRecord) {
    return false
  }

  // Mark OTP as used
  await prisma.oTP.update({
    where: { id: otpRecord.id },
    data: { isUsed: true },
  })

  return true
}

// Find manager by phone number
export async function findManagerByPhone(phoneNumber: string) {
  return prisma.manager.findUnique({
    where: { phoneNumber }
  })
}

// Create new manager
export async function createManager(phoneNumber: string, name: string) {
  return prisma.manager.create({
    data: {
      phoneNumber,
      name,
    },
  })
}

// Legacy email/password authentication (kept for backward compatibility)
export async function authenticateManager(email: string, password: string): Promise<ManagerSession | null> {
  const manager = await prisma.manager.findFirst({
    where: { email }
  })

  if (!manager || !manager.password) {
    return null
  }

  const isValid = await verifyPassword(password, manager.password)
  if (!isValid) {
    return null
  }

  return {
    id: manager.id,
    phoneNumber: manager.phoneNumber,
    name: manager.name
  }
} 