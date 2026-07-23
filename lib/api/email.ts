/**
 * Email Service Placeholder - Ready for Integration
 * 
 * This module provides placeholder functions for sending emails.
 * No actual email API calls are made yet.
 * Ready to integrate with Resend, SendGrid, or other email services.
 */

import { BookingData } from './paymentPlaceholder'

export interface EmailResponse {
  success: boolean
  message: string
  messageId?: string
}

/**
 * Sends booking confirmation email (placeholder)
 */
export async function sendBookingConfirmationEmail(
  bookingData: BookingData,
  bookingReference: string
): Promise<EmailResponse> {
  try {
    console.log('[Email] Sending booking confirmation to:', bookingData.personalInfo.email)

    const emailContent = generateBookingConfirmationEmail(bookingData, bookingReference)
    console.log('[Email] Email content:', emailContent)

    // TODO: Replace with actual email service
    // const response = await resend.emails.send({
    //   from: 'bookings@sculptlab.com',
    //   to: bookingData.personalInfo.email,
    //   subject: emailContent.subject,
    //   html: emailContent.html,
    // })

    // Placeholder: log email would be sent
    const messageId = `msg-${Date.now()}`
    console.log('[Email] Email queued with ID:', messageId)

    return {
      success: true,
      message: 'Booking confirmation email sent (placeholder)',
      messageId,
    }
  } catch (error) {
    console.error('[Email] Error sending email:', error)
    return {
      success: false,
      message: 'Failed to send confirmation email',
    }
  }
}

/**
 * Generates booking confirmation email HTML (placeholder)
 */
function generateBookingConfirmationEmail(
  bookingData: BookingData,
  bookingReference: string
): { subject: string; html: string } {
  const { personalInfo, classSession, membership, totalAmount, voucher } = bookingData

  const discountText = voucher ? `<p><strong>Voucher Discount:</strong> ₦${voucher.discount.toLocaleString()}</p>` : ''

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #6b21a8; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
          .detail { margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #6b21a8; }
          .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          strong { color: #6b21a8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmation</h1>
            <p>Reference: <strong>${bookingReference}</strong></p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${personalInfo.name}</strong>,</p>
            
            <p>Thank you for booking with Sculpt LAB! Your session has been confirmed.</p>
            
            <div class="detail">
              <strong>Session Details:</strong>
              <p><strong>Class:</strong> ${classSession.className}</p>
              <p><strong>Instructor:</strong> ${classSession.instructorName}</p>
              <p><strong>Date:</strong> ${new Date(classSession.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${classSession.time}</p>
              <p><strong>Duration:</strong> ${classSession.duration} minutes</p>
            </div>
            
            <div class="detail">
              <strong>Membership & Payment:</strong>
              <p><strong>Membership:</strong> ${membership.name}</p>
              <p><strong>Subtotal:</strong> ₦${bookingData.subtotal.toLocaleString()}</p>
              ${discountText}
              <p><strong>Total Amount:</strong> ₦${totalAmount.toLocaleString()}</p>
            </div>
            
            <p>If you have any questions, please contact us at <strong>info@sculptlab.com</strong> or call <strong>+234 XXX XXX XXXX</strong>.</p>
            
            <p>We look forward to seeing you!</p>
            
            <p>Best regards,<br/><strong>Sculpt LAB Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply directly.</p>
            <p>© 2024 Sculpt LAB. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return {
    subject: `Booking Confirmed - ${classSession.className} on ${new Date(classSession.date).toLocaleDateString()}`,
    html,
  }
}

/**
 * Sends payment receipt email (placeholder)
 */
export async function sendPaymentReceiptEmail(
  email: string,
  bookingReference: string,
  amount: number
): Promise<EmailResponse> {
  try {
    console.log('[Email] Sending payment receipt to:', email)

    // TODO: Replace with actual email service
    const messageId = `msg-${Date.now()}`
    console.log('[Email] Receipt email queued with ID:', messageId)

    return {
      success: true,
      message: 'Payment receipt sent (placeholder)',
      messageId,
    }
  } catch (error) {
    console.error('[Email] Error sending receipt:', error)
    return {
      success: false,
      message: 'Failed to send receipt email',
    }
  }
}

/**
 * Sends class reminder email (placeholder)
 */
export async function sendClassReminderEmail(email: string, className: string, classTime: string): Promise<EmailResponse> {
  try {
    console.log('[Email] Sending class reminder to:', email)

    const messageId = `msg-${Date.now()}`
    console.log('[Email] Reminder email queued with ID:', messageId)

    return {
      success: true,
      message: 'Class reminder sent (placeholder)',
      messageId,
    }
  } catch (error) {
    console.error('[Email] Error sending reminder:', error)
    return {
      success: false,
      message: 'Failed to send reminder email',
    }
  }
}
