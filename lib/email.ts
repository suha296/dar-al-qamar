import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export interface BookingEmailData {
  customerName: string
  customerEmail: string
  customerPhone: string
  villaName: string
  checkIn: string
  checkOut: string
  totalPrice: number
  managerEmail: string
}

export async function sendBookingNotification(data: BookingEmailData) {
  const { customerName, customerEmail, customerPhone, villaName, checkIn, checkOut, totalPrice, managerEmail } = data

  // Email to manager
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: managerEmail,
    subject: `New Booking for ${villaName}`,
    html: `
      <h2>New Booking Received</h2>
      <p><strong>Villa:</strong> ${villaName}</p>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Phone:</strong> ${customerPhone}</p>
      <p><strong>Check-in:</strong> ${checkIn}</p>
      <p><strong>Check-out:</strong> ${checkOut}</p>
      <p><strong>Total Price:</strong> $${totalPrice}</p>
      <p>Please review and confirm this booking.</p>
    `,
  })

  // Email to customer
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: `Booking Confirmation - ${villaName}`,
    html: `
      <h2>Thank you for your booking!</h2>
      <p>Dear ${customerName},</p>
      <p>We have received your booking request for <strong>${villaName}</strong>.</p>
      <p><strong>Check-in:</strong> ${checkIn}</p>
      <p><strong>Check-out:</strong> ${checkOut}</p>
      <p><strong>Total Price:</strong> $${totalPrice}</p>
      <p>We will contact you shortly to confirm your booking and provide further details.</p>
      <p>Best regards,<br>The ${villaName} Team</p>
    `,
  })
} 