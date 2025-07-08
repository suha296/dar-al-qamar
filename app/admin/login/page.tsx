'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Phone, Key, ArrowLeft, ArrowRight } from 'lucide-react'

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
})

const otpSchema = z.object({
  otp: z.string().length(6, 'Please enter a valid 6-digit OTP'),
})

type PhoneForm = z.infer<typeof phoneSchema>
type OTPForm = z.infer<typeof otpSchema>

export default function AdminLogin() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [canResend, setCanResend] = useState(true)
  const [resendCountdown, setResendCountdown] = useState(0)
  const router = useRouter()
  
  const phoneForm = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
  })

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
  })

  const handlePhoneSubmit = async (data: PhoneForm) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/login/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setPhoneNumber(data.phoneNumber)
        setStep('otp')
        setSuccess('OTP sent successfully')
        startResendCountdown()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'OTP sending failed')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async (data: OTPForm) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          otp: data.otp,
        }),
      })

      if (response.ok) {
        router.push('/admin/dashboard')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Invalid OTP')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      })

      if (response.ok) {
        setSuccess('OTP sent successfully')
        startResendCountdown()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'OTP sending failed')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const startResendCountdown = () => {
    setCanResend(false)
    setResendCountdown(60)
    
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const goBackToPhone = () => {
    setStep('phone')
    setError('')
    setSuccess('')
    setPhoneNumber('')
    otpForm.reset()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-accent">
            Manager Login
          </h2>
          <p className="mt-2 text-center text-sm text-text">
            Sign in to manage your villas
          </p>
        </div>
        
        {step === 'phone' ? (
          <form className="mt-8 space-y-6" onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-text mb-1">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  {...phoneForm.register('phoneNumber')}
                  type="tel"
                  className="input-field pl-10"
                  placeholder="Enter your phone number"
                />
              </div>
              {phoneForm.formState.errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{phoneForm.formState.errors.phoneNumber.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex justify-center py-2 px-4"
              >
                {isLoading ? 'Sending OTP' : 'Send OTP'}
              </button>
            </div>

            <div className="text-center">
              <Link href="/" className="text-accent hover:underline">
                Back to Home
              </Link>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={otpForm.handleSubmit(handleOTPSubmit)}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-text mb-1">
                OTP Code
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  {...otpForm.register('otp')}
                  type="text"
                  maxLength={6}
                  className="input-field pl-10 text-center text-lg tracking-widest"
                  placeholder="Enter OTP"
                />
              </div>
              {otpForm.formState.errors.otp && (
                <p className="mt-1 text-sm text-red-600">{otpForm.formState.errors.otp.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex justify-center py-2 px-4"
              >
                {isLoading ? 'Verifying' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend || isLoading}
                className="btn-secondary w-full flex justify-center py-2 px-4"
              >
                {!canResend 
                  ? `Resending (${resendCountdown}s)`
                  : 'Resend OTP'
                }
              </button>

              <button
                type="button"
                onClick={goBackToPhone}
                className="w-full flex justify-center items-center text-text hover:text-accent py-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 