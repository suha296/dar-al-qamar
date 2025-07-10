// SMS utility for sending OTP codes
// In production, integrate with services like Twilio, AWS SNS, or local SMS gateways

export interface SMSConfig {
  provider: 'twilio' | 'aws' | 'mock'
  accountSid?: string
  authToken?: string
  fromNumber?: string
  awsAccessKeyId?: string
  awsSecretAccessKey?: string
  awsRegion?: string
}

// Mock SMS service for development
export async function sendMockSMS(to: string, message: string): Promise<boolean> {
  // console.log('📱 Mock SMS sent:')
  // console.log(`To: ${to}`)
  // console.log(`Message: ${message}`)
  // console.log('---')
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return true
}

// Twilio SMS service
export async function sendTwilioSMS(to: string, message: string, config: SMSConfig): Promise<boolean> {
  if (!config.accountSid || !config.authToken || !config.fromNumber) {
    throw new Error('Twilio configuration incomplete')
  }

  try {
    // In production, use the actual Twilio SDK
    // const client = require('twilio')(config.accountSid, config.authToken)
    // await client.messages.create({
    //   body: message,
    //   from: config.fromNumber,
    //   to: to
    // })
    
    // console.log('📱 Twilio SMS sent:', { to, message })
    return true
  } catch (error) {
    console.error('Twilio SMS error:', error)
    return false
  }
}

// AWS SNS SMS service
export async function sendAWSSMS(to: string, message: string, config: SMSConfig): Promise<boolean> {
  if (!config.awsAccessKeyId || !config.awsSecretAccessKey || !config.awsRegion) {
    throw new Error('AWS SNS configuration incomplete')
  }

  try {
    // In production, use the actual AWS SDK
    // const AWS = require('aws-sdk')
    // AWS.config.update({
    //   accessKeyId: config.awsAccessKeyId,
    //   secretAccessKey: config.awsSecretAccessKey,
    //   region: config.awsRegion
    // })
    // const sns = new AWS.SNS()
    // await sns.publish({
    //   Message: message,
    //   PhoneNumber: to
    // }).promise()
    
    // console.log('📱 AWS SNS SMS sent:', { to, message })
    return true
  } catch (error) {
    console.error('AWS SNS SMS error:', error)
    return false
  }
}

// Main SMS sending function
export async function sendSMS(to: string, message: string): Promise<boolean> {
  const config: SMSConfig = {
    provider: process.env.SMS_PROVIDER as 'twilio' | 'aws' | 'mock' || 'mock',
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_FROM_NUMBER,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
  }

  switch (config.provider) {
    case 'twilio':
      return sendTwilioSMS(to, message, config)
    case 'aws':
      return sendAWSSMS(to, message, config)
    case 'mock':
    default:
      return sendMockSMS(to, message)
  }
}

// Send OTP via SMS
export async function sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
  const message = `Your Villa Manager OTP is: ${otp}. Valid for 10 minutes.`
  return sendSMS(phoneNumber, message)
} 